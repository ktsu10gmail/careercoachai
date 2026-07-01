import os
import re
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from pydantic import ValidationError
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session, object_session

from app.api.deps import require_role
from app.db import crud, models
from app.db.session import get_db
from app.schemas import (
    ApplicantPracticeQuestionsCreate,
    ApplicantPracticeQuestionsRead,
    ApplicantPracticeRead,
    ApplicantPracticeSubmit,
    ApplicantResumeMatchCreate,
    ApplicantResumeMatchRead,
    ApplicantResumeProfileRead,
    ApplicantResumeReview,
    ApplicationRead,
    ApplicationSubmit,
    CandidateRead,
    CompanyRead,
    JobRead,
    QuestionRead,
    TalentProfileUpdate,
)
from app.services.ai_service import (
    INTENTIONAL_QUESTION_COUNT,
    analyze_resume_for_applicant,
    analyze_resume_for_public_tool,
    comment_answers,
    generate_intentional_assessment_questions,
    score_answer,
    score_answers,
    summarize_resume_match_analysis,
)
from app.services.resume_parser import extract_resume_text, validate_resume_upload

router = APIRouter()


def _talent_profile_status(
    consent_talent_network: bool,
    requested_status: models.CandidateProfileStatus,
) -> models.CandidateProfileStatus:
    if requested_status == models.CandidateProfileStatus.ARCHIVED:
        return models.CandidateProfileStatus.ARCHIVED
    if consent_talent_network:
        return models.CandidateProfileStatus.OPTED_IN
    return models.CandidateProfileStatus.REGISTERED


RESUME_REVIEW_CACHE_KEY = "_resume_review"


def _profile_with_cached_review(
    parsed_profile: dict,
    review_data: dict,
) -> dict:
    return {
        **parsed_profile,
        RESUME_REVIEW_CACHE_KEY: review_data,
    }


def _cached_resume_review(candidate: models.Candidate) -> dict | None:
    profile = candidate.parsed_profile_json
    if not isinstance(profile, dict):
        return None
    review = profile.get(RESUME_REVIEW_CACHE_KEY)
    if not isinstance(review, dict):
        return None
    try:
        ApplicantResumeReview(**review)
    except ValidationError:
        return None
    return review


def _build_applicant_resume_profile(candidate: models.Candidate | None) -> dict:
    if candidate:
        _sync_candidate_from_parsed_profile(candidate)

    if candidate and candidate.resume_text:
        cached_review = _cached_resume_review(candidate)
        if cached_review:
            review_data = cached_review
        else:
            review_data = analyze_resume_for_applicant(candidate.resume_text)
            parsed_profile = review_data.pop("extracted_profile", None)
            if isinstance(parsed_profile, dict):
                candidate.parsed_profile_json = _profile_with_cached_review(
                    parsed_profile,
                    review_data,
                )
                db = object_session(candidate)
                if db:
                    db.add(candidate)
                    db.commit()
                    db.refresh(candidate)
        review = ApplicantResumeReview(**review_data)
    else:
        review = ApplicantResumeReview(
            headline="Upload a resume to unlock your private coaching dashboard.",
            readiness_score=0,
            strengths=[],
            gaps=[
                "No resume has been uploaded for coaching yet.",
                "Your private resume review can work before any employers or recruiters join.",
            ],
            next_steps=[
                "Upload a PDF, DOCX, or TXT resume.",
                "Review extracted profile details.",
                "Use the suggested next steps to improve the resume.",
            ],
            keywords=[],
        )

    resume_file_name = None
    if candidate and candidate.resume_file_url:
        resume_file_name = Path(candidate.resume_file_url).name

    return {
        "candidate": candidate,
        "has_resume": bool(candidate and candidate.resume_text),
        "resume_file_name": resume_file_name,
        "resume_updated_at": candidate.updated_at if candidate and candidate.resume_text else None,
        "review": review,
    }


def _parsed_profile_value(candidate: models.Candidate, key: str) -> str | None:
    profile = candidate.parsed_profile_json
    if not isinstance(profile, dict):
        return None
    value = profile.get(key)
    if value is None:
        return None
    cleaned = str(value).strip()
    return cleaned or None


def _clean_target_title(value: str | None) -> str | None:
    if not value:
        return None
    cleaned = re.sub(r"\s+", " ", value).strip(" .,:;|-")
    return cleaned[:200] or None


def _infer_searchable_title_from_resume(
    resume_text: str,
    review_data: dict | None = None,
    parsed_profile: dict | None = None,
) -> str | None:
    for pattern in [
        r"(?im)^\s*target\s+role\s*:\s*(.+)$",
        r"(?im)^\s*target\s+title\s*:\s*(.+)$",
        r"(?im)^\s*desired\s+role\s*:\s*(.+)$",
    ]:
        match = re.search(pattern, resume_text)
        if match:
            first_choice = re.split(r",|\bor\b", match.group(1), maxsplit=1, flags=re.IGNORECASE)[0]
            title = _clean_target_title(first_choice)
            if title:
                return title

    headline = review_data.get("headline") if isinstance(review_data, dict) else None
    title = _clean_target_title(str(headline) if headline else None)
    if title:
        return title

    experience = parsed_profile.get("experience") if isinstance(parsed_profile, dict) else None
    if isinstance(experience, list):
        for item in experience:
            title = _clean_target_title(str(item))
            if title:
                return title
    return None


def _sync_candidate_from_parsed_profile(candidate: models.Candidate) -> bool:
    updated = False
    if not candidate.name:
        parsed_name = _parsed_profile_value(candidate, "name")
        if parsed_name:
            candidate.name = parsed_name
            updated = True
    if not candidate.phone:
        parsed_phone = _parsed_profile_value(candidate, "phone")
        if parsed_phone:
            candidate.phone = parsed_phone
            updated = True
    if not candidate.location:
        parsed_location = _parsed_profile_value(candidate, "address")
        if parsed_location:
            candidate.location = parsed_location
            updated = True
    if not candidate.searchable_title and candidate.resume_text:
        title = _infer_searchable_title_from_resume(
            candidate.resume_text,
            _cached_resume_review(candidate),
            candidate.parsed_profile_json if isinstance(candidate.parsed_profile_json, dict) else None,
        )
        if title:
            candidate.searchable_title = title
            updated = True
    return updated


def _commit_parsed_profile_sync(db: Session, candidate: models.Candidate) -> models.Candidate:
    if _sync_candidate_from_parsed_profile(candidate):
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
    return candidate


def _get_or_claim_talent_network_candidate(
    db: Session,
    current_user: models.User,
) -> models.Candidate | None:
    talent_network = crud.get_company_by_slug(db, "talent-network")
    if not talent_network:
        return None

    candidate = crud.get_candidate_for_applicant(db, talent_network.id, current_user.id)
    if candidate:
        latest_resume_candidate = crud.get_latest_resume_candidate_for_applicant(
            db,
            current_user.id,
            exclude_owner_company_id=talent_network.id,
        )
        if latest_resume_candidate and not candidate.resume_text:
            candidate.resume_file_url = latest_resume_candidate.resume_file_url
            candidate.resume_text = latest_resume_candidate.resume_text
            candidate.parsed_profile_json = latest_resume_candidate.parsed_profile_json
            candidate.searchable_title = latest_resume_candidate.searchable_title
            candidate.searchable_skills = latest_resume_candidate.searchable_skills or []
            candidate.last_ai_score = latest_resume_candidate.last_ai_score
            db.add(candidate)
            db.commit()
            db.refresh(candidate)
        return _commit_parsed_profile_sync(db, candidate)

    candidate = crud.get_candidate_by_email(db, talent_network.id, current_user.email)
    latest_resume_candidate = crud.get_latest_resume_candidate_for_applicant(
        db,
        current_user.id,
        exclude_owner_company_id=talent_network.id,
    )
    if not candidate and latest_resume_candidate:
        candidate = models.Candidate(
            owner_company_id=talent_network.id,
            applicant_user_id=current_user.id,
            created_by_user_id=current_user.id,
            name=latest_resume_candidate.name or current_user.name,
            email=current_user.email,
            phone=latest_resume_candidate.phone,
            location=latest_resume_candidate.location,
            resume_file_url=latest_resume_candidate.resume_file_url,
            resume_text=latest_resume_candidate.resume_text,
            parsed_profile_json=latest_resume_candidate.parsed_profile_json,
            profile_status=models.CandidateProfileStatus.REGISTERED,
            searchable_title=latest_resume_candidate.searchable_title,
            searchable_skills=latest_resume_candidate.searchable_skills or [],
            last_ai_score=latest_resume_candidate.last_ai_score,
        )
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        return _commit_parsed_profile_sync(db, candidate)

    if not candidate or candidate.applicant_user_id is not None:
        return None

    candidate.applicant_user_id = current_user.id
    candidate.created_by_user_id = current_user.id
    candidate.email = current_user.email
    if not candidate.name:
        candidate.name = current_user.name
    if latest_resume_candidate and not candidate.resume_text:
        candidate.resume_file_url = latest_resume_candidate.resume_file_url
        candidate.resume_text = latest_resume_candidate.resume_text
        candidate.parsed_profile_json = latest_resume_candidate.parsed_profile_json
        candidate.searchable_title = latest_resume_candidate.searchable_title
        candidate.searchable_skills = latest_resume_candidate.searchable_skills or []
        candidate.last_ai_score = latest_resume_candidate.last_ai_score
    if candidate.consent_talent_network:
        candidate.profile_status = models.CandidateProfileStatus.OPTED_IN
    elif candidate.profile_status != models.CandidateProfileStatus.ARCHIVED:
        candidate.profile_status = models.CandidateProfileStatus.REGISTERED
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return _commit_parsed_profile_sync(db, candidate)


def _infer_experience_level(job_title: str | None, job_description: str) -> str:
    text = f"{job_title or ''} {job_description}".lower()
    if any(term in text for term in ["principal", "staff", "lead", "head of"]):
        return "Lead"
    if any(term in text for term in ["senior", "sr.", "sr "]):
        return "Senior"
    if any(term in text for term in ["junior", "jr.", "entry level", "associate"]):
        return "Junior"
    return "Mid-level"


@router.get("/companies", response_model=list[CompanyRead])
def search_companies(q: str = "", db: Session = Depends(get_db)):
    return crud.search_companies(db, q.strip())


@router.get("/companies/{company_id}/jobs", response_model=list[JobRead])
def search_company_jobs(company_id: int, keyword: str = "", db: Session = Depends(get_db)):
    return crud.search_jobs(
        db,
        company_id=company_id,
        keyword=keyword.strip(),
        status=models.JobStatus.ACTIVE,
    )


@router.get("/companies/by-slug/{slug}", response_model=CompanyRead)
def get_company_by_slug(slug: str, db: Session = Depends(get_db)):
    company = crud.get_company_by_slug(db, slug.lower())
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company


@router.get("/companies/by-slug/{slug}/jobs", response_model=list[JobRead])
def get_company_jobs_by_slug(slug: str, keyword: str = "", db: Session = Depends(get_db)):
    company = crud.get_company_by_slug(db, slug.lower())
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return crud.search_jobs(
        db,
        company_id=company.id,
        keyword=keyword.strip(),
        status=models.JobStatus.ACTIVE,
    )


@router.get("/jobs/{job_url}", response_model=JobRead)
def get_job(job_url: str, db: Session = Depends(get_db)):
    job = crud.get_job_by_url(db, job_url)
    if not job or job.status != models.JobStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


@router.get("/jobs/{job_url}/questions", response_model=list[QuestionRead])
def get_questions(job_url: str, db: Session = Depends(get_db)):
    job = crud.get_job_by_url(db, job_url)
    if not job or job.status != models.JobStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return crud.get_questions_for_job(db, job.id)


@router.get("/talent-profile/me", response_model=CandidateRead | None)
def read_my_talent_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    return _get_or_claim_talent_network_candidate(db, current_user)


@router.put("/talent-profile/me", response_model=CandidateRead)
def update_my_talent_profile(
    profile_in: TalentProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    talent_network = crud.get_or_create_talent_network_company(db)
    candidate = _get_or_claim_talent_network_candidate(db, current_user)
    profile_status = _talent_profile_status(
        profile_in.consent_talent_network,
        models.CandidateProfileStatus(profile_in.profile_status.value),
    )
    consent_talent_network = (
        profile_in.consent_talent_network
        and profile_status != models.CandidateProfileStatus.ARCHIVED
    )

    parsed_profile_json = {
        "name": profile_in.name,
        "email": current_user.email,
        "phone": profile_in.phone or "",
        "address": profile_in.location or "",
        "experience": [],
        "skills": profile_in.searchable_skills,
        "education": [],
    }

    if candidate is None:
        candidate = models.Candidate(
            owner_company_id=talent_network.id,
            applicant_user_id=current_user.id,
            created_by_user_id=current_user.id,
            name=profile_in.name,
            email=current_user.email,
        )
    elif isinstance(candidate.parsed_profile_json, dict) and isinstance(
        candidate.parsed_profile_json.get(RESUME_REVIEW_CACHE_KEY),
        dict,
    ):
        parsed_profile_json[RESUME_REVIEW_CACHE_KEY] = candidate.parsed_profile_json[
            RESUME_REVIEW_CACHE_KEY
        ]

    candidate.name = profile_in.name
    candidate.email = current_user.email
    candidate.phone = profile_in.phone
    candidate.location = profile_in.location
    candidate.searchable_title = profile_in.searchable_title
    candidate.searchable_skills = profile_in.searchable_skills
    candidate.parsed_profile_json = parsed_profile_json
    candidate.consent_talent_network = consent_talent_network
    candidate.profile_status = profile_status
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/applicant/resume-profile", response_model=ApplicantResumeProfileRead)
def read_my_resume_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    candidate = _get_or_claim_talent_network_candidate(db, current_user)
    return _build_applicant_resume_profile(candidate)


@router.post("/applicant/resume-profile/upload", response_model=ApplicantResumeProfileRead)
def upload_my_resume_profile(
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    extension = validate_resume_upload(resume)
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads/resumes"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    resume_path = upload_dir / f"{current_user.id}_{uuid4().hex}{extension}"
    with resume_path.open("wb") as buffer:
        buffer.write(resume.file.read())

    try:
        text = extract_resume_text(resume_path)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

    talent_network = crud.get_or_create_talent_network_company(db)
    candidate = _get_or_claim_talent_network_candidate(db, current_user)
    review_data = analyze_resume_for_applicant(text)
    parsed_profile = review_data.pop("extracted_profile", None) or {}
    skills = parsed_profile.get("skills") if isinstance(parsed_profile, dict) else []
    if not isinstance(skills, list):
        skills = []

    if candidate is None:
        candidate = models.Candidate(
            owner_company_id=talent_network.id,
            applicant_user_id=current_user.id,
            created_by_user_id=current_user.id,
            name=str(parsed_profile.get("name") or current_user.name),
            email=current_user.email,
            profile_status=models.CandidateProfileStatus.REGISTERED,
        )

    candidate.name = str(parsed_profile.get("name") or candidate.name or current_user.name)
    candidate.email = current_user.email
    candidate.phone = str(parsed_profile.get("phone") or candidate.phone or "") or None
    candidate.location = str(parsed_profile.get("address") or candidate.location or "") or None
    candidate.searchable_skills = [str(skill).strip() for skill in skills if str(skill).strip()]
    if not candidate.searchable_title:
        candidate.searchable_title = _infer_searchable_title_from_resume(
            text,
            review_data,
            parsed_profile if isinstance(parsed_profile, dict) else None,
        )
    candidate.resume_file_url = str(resume_path)
    candidate.resume_text = text
    candidate.parsed_profile_json = _profile_with_cached_review(parsed_profile, review_data)
    candidate.last_ai_score = datetime.utcnow()
    if candidate.consent_talent_network:
        candidate.profile_status = models.CandidateProfileStatus.OPTED_IN
    elif candidate.profile_status != models.CandidateProfileStatus.ARCHIVED:
        candidate.profile_status = models.CandidateProfileStatus.REGISTERED
    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    review = ApplicantResumeReview(**review_data)
    return {
        "candidate": candidate,
        "has_resume": True,
        "resume_file_name": resume_path.name,
        "resume_updated_at": candidate.updated_at,
        "review": review,
    }


@router.post("/applicant/resume-match", response_model=ApplicantResumeMatchRead)
def match_my_resume_to_job_description(
    match_in: ApplicantResumeMatchCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    candidate = _get_or_claim_talent_network_candidate(db, current_user)
    if not candidate or not candidate.resume_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a resume in Resume Studio before running a job-description match.",
        )

    analysis = analyze_resume_for_public_tool(
        candidate.resume_text,
        match_in.job_description.strip(),
    )
    return {
        "job_title": match_in.job_title,
        "target_title": candidate.searchable_title,
        "match_score": analysis["match_score"],
        "strengths": analysis["strengths"],
        "weaknesses": analysis["weaknesses"],
        "extracted_profile": analysis["extracted_profile"],
        "score_breakdown": analysis.get("score_breakdown", []),
        "requirement_matches": analysis.get("requirement_matches", []),
        "missing_requirements": analysis.get("missing_requirements", []),
        "evidence_quotes": analysis.get("evidence_quotes", []),
        "confidence_level": analysis.get("confidence_level", "medium"),
        "confidence_reason": analysis.get("confidence_reason", ""),
    }


@router.post("/applicant/practice/questions", response_model=ApplicantPracticeQuestionsRead)
def generate_my_practice_questions(
    practice_in: ApplicantPracticeQuestionsCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    candidate = _get_or_claim_talent_network_candidate(db, current_user)
    if not candidate or not candidate.resume_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Upload a resume in Resume Studio before generating intentional practice questions.",
        )

    questions = generate_intentional_assessment_questions(
        candidate.parsed_profile_json,
        candidate.resume_text,
        practice_in.job_description.strip(),
        _infer_experience_level(practice_in.job_title, practice_in.job_description),
    )
    return {
        "job_title": practice_in.job_title,
        "questions": [
            {
                "id": question.get("id", index + 1),
                "text": question["text"],
                "category": question.get("category", "General"),
                "type": question.get("type", "JD-Based"),
                "skill_type": question.get("skill_type", "Hard"),
                "weight": question.get("weight", 0.7),
                "source": question.get("source", "jd_gap"),
                "rubric": question.get("rubric", {}),
            }
            for index, question in enumerate(questions[:INTENTIONAL_QUESTION_COUNT])
        ],
    }


@router.post("/applicant/practice/score", response_model=ApplicantPracticeRead)
def score_my_practice_answers(
    practice_in: ApplicantPracticeSubmit,
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    questions = [
        {
            "id": answer.question_id,
            "text": answer.question_text,
            "category": answer.category,
            "type": answer.type,
            "skill_type": answer.skill_type,
            "weight": answer.weight,
            "rubric": answer.rubric,
        }
        for answer in practice_in.answers
    ]
    answers = [
        {
            "question_id": answer.question_id,
            "question_text": answer.question_text,
            "answer_text": answer.answer_text,
            "skill_type": answer.skill_type,
            "weight": answer.weight,
        }
        for answer in practice_in.answers
        if answer.answer_text.strip()
    ]
    if not answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Answer at least one practice question before scoring.",
        )

    scored_answers = []
    for answer in answers:
        question = next(
            (
                q
                for q in questions
                if q["id"] == answer["question_id"]
                or q["text"] == answer.get("question_text")
            ),
            None,
        )
        if question is None:
            continue
        scored_answers.append(
            {
                **answer,
                "score": score_answer(answer["answer_text"], question["text"]),
                "skill_type": question.get("skill_type", answer.get("skill_type", "Hard")),
            }
        )

    hard_scores = [item["score"] for item in scored_answers if item["skill_type"] == "Hard"]
    soft_scores = [item["score"] for item in scored_answers if item["skill_type"] == "Soft"]
    hard_score = sum(hard_scores) / len(hard_scores) if hard_scores else None
    soft_score = sum(soft_scores) / len(soft_scores) if soft_scores else None
    if hard_score is not None and soft_score is not None:
        answer_score = (hard_score * 0.7) + (soft_score * 0.3)
    elif hard_score is not None:
        answer_score = hard_score
    elif soft_score is not None:
        answer_score = soft_score
    else:
        answer_score = 0.0
    coach_comment = comment_answers(answers, questions, answer_score)
    return {
        "job_title": practice_in.job_title,
        "answer_score": answer_score,
        "hard_score": hard_score,
        "soft_score": soft_score,
        "answered_count": len(answers),
        "total_questions": len(practice_in.answers),
        "coach_comment": coach_comment,
    }


@router.post("/applications", response_model=ApplicationRead)
def submit_application(
    application_in: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.APPLICANT)),
):
    try:
        application = ApplicationSubmit.model_validate_json(application_in)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=exc.errors())

    job = crud.get_job(db, application.job_id)
    if not job or job.status != models.JobStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not assigned to an organization")

    extension = validate_resume_upload(resume)
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads/resumes"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    resume_path = upload_dir / f"{current_user.id}_{uuid4().hex}{extension}"
    with resume_path.open("wb") as buffer:
        buffer.write(resume.file.read())

    try:
        text = extract_resume_text(resume_path)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
    resume_analysis = analyze_resume_for_public_tool(text, job.description)
    matching_score = float(resume_analysis["match_score"])
    candidate = crud.get_or_create_candidate_for_applicant(
        db,
        job.company_id,
        current_user,
        resume_path=str(resume_path),
        resume_text=text,
    )
    talent_network = crud.get_or_create_talent_network_company(db)
    profile_candidate = _get_or_claim_talent_network_candidate(db, current_user)
    if profile_candidate is None:
        profile_candidate = models.Candidate(
            owner_company_id=talent_network.id,
            applicant_user_id=current_user.id,
            created_by_user_id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            profile_status=models.CandidateProfileStatus.REGISTERED,
        )
    profile_candidate.name = candidate.name or profile_candidate.name or current_user.name
    profile_candidate.email = current_user.email
    profile_candidate.phone = candidate.phone or profile_candidate.phone
    profile_candidate.location = candidate.location or profile_candidate.location
    profile_candidate.resume_file_url = str(resume_path)
    profile_candidate.resume_text = text
    profile_candidate.parsed_profile_json = candidate.parsed_profile_json
    profile_candidate.searchable_title = candidate.searchable_title
    profile_candidate.searchable_skills = candidate.searchable_skills or []
    profile_candidate.last_ai_score = datetime.utcnow()
    if profile_candidate.consent_talent_network:
        profile_candidate.profile_status = models.CandidateProfileStatus.OPTED_IN
    elif profile_candidate.profile_status != models.CandidateProfileStatus.ARCHIVED:
        profile_candidate.profile_status = models.CandidateProfileStatus.REGISTERED
    db.add(profile_candidate)
    db.commit()
    db.refresh(profile_candidate)

    questions = crud.get_questions_for_job(db, job.id)
    answers_data = [
        {"question_id": answer.question_id, "answer_text": answer.answer_text, "question_text": next((q.text for q in questions if q.id == answer.question_id), "")}
        for answer in application.answers
    ]

    answer_score = score_answers(
        answers_data,
        [{"id": q.id, "text": q.text, "category": q.category} for q in questions],
    )
    question_payload = [{"id": q.id, "text": q.text, "category": q.category} for q in questions]
    application_record = crud.create_application(
        db,
        application,
        str(resume_path),
        matching_score,
        answer_score,
        summarize_resume_match_analysis(resume_analysis),
        comment_answers(answers_data, question_payload, answer_score),
        applicant_id=current_user.id,
        candidate_id=candidate.id,
    )
    crud.create_answers(db, application_record, application.answers)
    return application_record
