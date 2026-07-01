import os
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.api.deps import get_db, get_optional_current_user
from app.db import crud, models
from app.schemas import (
    CandidateCreate,
    CandidateProfileStatus,
    CandidateUpdate,
    PublicAnalysisRead,
    PublicHiringManagerQuestionSetRead,
    PublicHiringManagerQuestionsRead,
    PublicOptInCreate,
    PublicOptInRead,
    UsageEventCreate,
    UsageEventRead,
    UserCreate,
    UserRole,
)
from app.services.ai_service import (
    analyze_resume_for_public_tool,
    generate_fast_intentional_assessment_questions,
)
from app.services.auth_service import get_password_hash
from app.services.resume_parser import extract_resume_text, validate_resume_upload

router = APIRouter()


def _client_ip(request: Request) -> str | None:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()[:64] or None
    real_ip = request.headers.get("x-real-ip") or request.headers.get("cf-connecting-ip")
    if real_ip:
        return real_ip.strip()[:64] or None
    return request.client.host[:64] if request.client and request.client.host else None


def _public_target_position(target_position: str, job_description: str) -> str | None:
    explicit = target_position.strip()
    if explicit:
        return explicit[:200]
    first_line = next((line.strip() for line in job_description.splitlines() if line.strip()), "")
    if first_line and len(first_line) <= 120:
        return first_line[:200]
    return None


def _persist_public_analysis_candidate(
    db: Session,
    analysis: dict,
    resume_text: str,
    target_position: str | None,
) -> int | None:
    profile = analysis.get("extracted_profile")
    if not isinstance(profile, dict):
        return None

    email = str(profile.get("email") or "").strip()
    name = str(profile.get("name") or "").strip()
    if not email or len(name) < 2:
        return None

    phone = str(profile.get("phone") or "").strip() or None
    location = str(profile.get("address") or "").strip() or None
    skills = profile.get("skills")
    searchable_skills = [
        str(skill).strip()
        for skill in (skills if isinstance(skills, list) else [])
        if str(skill).strip()
    ]

    talent_network = crud.get_or_create_talent_network_company(db)
    existing = crud.get_candidate_by_email(db, talent_network.id, email)
    payload = {
        **profile,
        "target_position": target_position,
        "public_analysis_match_score": analysis.get("match_score"),
    }

    if existing:
        existing.name = name
        existing.phone = phone
        existing.location = location
        existing.searchable_title = target_position or existing.searchable_title
        existing.searchable_skills = searchable_skills
        existing.resume_text = resume_text
        existing.parsed_profile_json = payload
        existing.last_ai_score = datetime.utcnow()
        if (
            not existing.consent_talent_network
            and existing.profile_status != models.CandidateProfileStatus.ARCHIVED
        ):
            existing.profile_status = models.CandidateProfileStatus.ANONYMOUS
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing.id

    candidate = crud.create_candidate(
        db,
        talent_network.id,
        CandidateCreate(
            name=name,
            email=email,
            phone=phone,
            location=location,
            resume_text=resume_text,
            parsed_profile_json=payload,
            consent_talent_network=False,
            profile_status=CandidateProfileStatus.ANONYMOUS,
            searchable_title=target_position,
            searchable_skills=searchable_skills,
            last_ai_score=datetime.utcnow(),
        ),
    )
    return candidate.id


def _infer_experience_level(job_title: str | None, job_description: str) -> str:
    text = f"{job_title or ''} {job_description}".lower()
    if any(term in text for term in ["principal", "staff", "lead", "head of"]):
        return "Lead"
    if any(term in text for term in ["senior", "sr.", "sr "]):
        return "Senior"
    if any(term in text for term in ["junior", "jr.", "entry level", "associate"]):
        return "Junior"
    return "Mid-level"


def _read_temporary_resume(resume: UploadFile, folder_name: str) -> str:
    extension = validate_resume_upload(resume)
    settings = get_settings()
    upload_dir = Path(settings.UPLOAD_DIR).parent / folder_name
    upload_dir.mkdir(parents=True, exist_ok=True)
    resume_path = upload_dir / f"anonymous_{uuid4().hex}{extension}"

    try:
        with resume_path.open("wb") as buffer:
            buffer.write(resume.file.read())

        try:
            resume_text = extract_resume_text(resume_path)
        except RuntimeError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

        if len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The resume text could not be read. Try a DOCX, TXT, or text-based PDF file.",
            )
        return resume_text
    finally:
        try:
            os.remove(resume_path)
        except FileNotFoundError:
            pass


@router.post("/usage-events", response_model=UsageEventRead, status_code=status.HTTP_201_CREATED)
def create_usage_event(
    request: Request,
    event_in: UsageEventCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_optional_current_user),
):
    metadata_json = {
        key: value
        for key, value in event_in.metadata_json.items()
        if key in {"source", "viewport", "page_title", "tool", "host"}
    }
    return crud.create_usage_stat(
        db,
        event_type=event_in.event_type,
        company_id=current_user.company_id if current_user else None,
        user_id=current_user.id if current_user else None,
        session_id=event_in.session_id,
        visitor_id=event_in.visitor_id,
        role=current_user.role.value if current_user else event_in.role.value if event_in.role else None,
        market=event_in.market,
        locale=event_in.locale,
        host=event_in.host,
        ip_address=_client_ip(request),
        path=event_in.path,
        result_score=event_in.result_score,
        metadata_json=metadata_json,
    )


@router.post("/analyze", response_model=PublicAnalysisRead)
def analyze_resume(
    request: Request,
    job_description: str = Form(...),
    target_position: str = Form(""),
    market: str = Form(""),
    locale: str = Form(""),
    host: str = Form(""),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_optional_current_user),
):
    description = job_description.strip()
    if len(description) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paste a job description with at least 20 characters.",
        )

    extension = validate_resume_upload(resume)
    if extension not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Free analysis supports PDF and DOCX resumes.",
        )

    settings = get_settings()
    upload_dir = Path(settings.UPLOAD_DIR).parent / "public-analysis"
    upload_dir.mkdir(parents=True, exist_ok=True)
    resume_path = upload_dir / f"anonymous_{uuid4().hex}{extension}"

    try:
        with resume_path.open("wb") as buffer:
            buffer.write(resume.file.read())

        try:
            resume_text = extract_resume_text(resume_path)
        except RuntimeError as exc:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))

        if len(resume_text.strip()) < 20:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The resume text could not be read. Try a DOCX or text-based PDF file.",
            )

        crud.create_usage_stat(
            db,
            event_type="free_analysis_started",
            company_id=current_user.company_id if current_user else None,
            user_id=current_user.id if current_user else None,
            path="/free-analysis",
            role=current_user.role.value if current_user else None,
            market=market.strip()[:40] or None,
            locale=locale.strip()[:20] or None,
            host=host.strip()[:255] or None,
            ip_address=_client_ip(request),
        )
        analysis = analyze_resume_for_public_tool(resume_text, description)
        anonymous_candidate_id = _persist_public_analysis_candidate(
            db,
            analysis,
            resume_text,
            _public_target_position(target_position, description),
        )
        crud.create_usage_stat(
            db,
            event_type="free_analysis_completed",
            company_id=current_user.company_id if current_user else None,
            user_id=current_user.id if current_user else None,
            path="/free-analysis",
            role=current_user.role.value if current_user else None,
            market=market.strip()[:40] or None,
            locale=locale.strip()[:20] or None,
            host=host.strip()[:255] or None,
            ip_address=_client_ip(request),
            result_score=float(analysis.get("match_score") or 0),
        )
        return {**analysis, "anonymous_candidate_id": anonymous_candidate_id}
    finally:
        try:
            os.remove(resume_path)
        except FileNotFoundError:
            pass


@router.post("/hiring-manager/analyze", response_model=PublicAnalysisRead)
def hiring_manager_analyze_resume(
    request: Request,
    job_description: str = Form(...),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_optional_current_user),
):
    description = job_description.strip()
    if len(description) < 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paste a job description with at least 40 characters.",
        )
    resume_text = _read_temporary_resume(resume, "public-hiring-manager")
    analysis = analyze_resume_for_public_tool(resume_text, description)
    crud.create_usage_stat(
        db,
        event_type="hm_resume_analysis_completed",
        company_id=current_user.company_id if current_user else None,
        user_id=current_user.id if current_user else None,
        path="/",
        role=current_user.role.value if current_user else models.UserRole.HIRING_MANAGER.value,
        ip_address=_client_ip(request),
        result_score=float(analysis.get("match_score") or 0),
    )
    return analysis


@router.post("/hiring-manager/questions", response_model=PublicHiringManagerQuestionsRead)
def hiring_manager_generate_questions(
    request: Request,
    job_description: str = Form(...),
    job_title: str = Form(""),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_optional_current_user),
):
    description = job_description.strip()
    if len(description) < 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paste a job description with at least 40 characters.",
        )

    resume_text = _read_temporary_resume(resume, "public-hiring-manager")
    analysis = analyze_resume_for_public_tool(resume_text, description)
    extracted_profile = analysis["extracted_profile"]
    questions = generate_fast_intentional_assessment_questions(
        extracted_profile if isinstance(extracted_profile, dict) else {},
        resume_text,
        description,
        _infer_experience_level(job_title, description),
    )
    crud.create_usage_stat(
        db,
        event_type="hm_interview_guide_generated",
        company_id=current_user.company_id if current_user else None,
        user_id=current_user.id if current_user else None,
        path="/",
        role=current_user.role.value if current_user else models.UserRole.HIRING_MANAGER.value,
        ip_address=_client_ip(request),
        result_score=float(analysis.get("match_score") or 0),
    )
    return {
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
        "questions": questions,
    }


@router.post("/hiring-manager/questions-only", response_model=PublicHiringManagerQuestionSetRead)
def hiring_manager_generate_questions_only(
    request: Request,
    job_description: str = Form(...),
    job_title: str = Form(""),
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_optional_current_user),
):
    description = job_description.strip()
    if len(description) < 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Paste a job description with at least 40 characters.",
        )

    resume_text = _read_temporary_resume(resume, "public-hiring-manager")
    questions = generate_fast_intentional_assessment_questions(
        {},
        resume_text,
        description,
        _infer_experience_level(job_title, description),
    )
    crud.create_usage_stat(
        db,
        event_type="hm_interview_guide_generated",
        company_id=current_user.company_id if current_user else None,
        user_id=current_user.id if current_user else None,
        path="/",
        role=current_user.role.value if current_user else models.UserRole.HIRING_MANAGER.value,
        ip_address=_client_ip(request),
    )
    return {"questions": questions}


@router.post("/opt-in", response_model=PublicOptInRead, status_code=status.HTTP_201_CREATED)
def opt_into_talent_network(
    request: Request,
    opt_in: PublicOptInCreate,
    db: Session = Depends(get_db),
):
    candidate_data = opt_in.candidate_data
    existing_user = crud.get_user_by_email(db, str(candidate_data.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account already exists for this email. Sign in instead.",
        )

    talent_network = crud.get_or_create_talent_network_company(db)
    existing_candidate = crud.get_candidate_by_email(db, talent_network.id, str(candidate_data.email))
    if existing_candidate and existing_candidate.consent_talent_network:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already enrolled in the Talent Network.",
        )

    user = crud.create_user(
        db,
        UserCreate(
            name=candidate_data.name,
            email=candidate_data.email,
            password=opt_in.password,
            role=UserRole.APPLICANT,
        ),
        get_password_hash(opt_in.password),
    )
    if existing_candidate:
        candidate = crud.update_candidate(
            db,
            existing_candidate,
            CandidateUpdate(
                name=candidate_data.name,
                email=candidate_data.email,
                phone=candidate_data.phone,
                location=candidate_data.address,
                parsed_profile_json=candidate_data.model_dump(mode="json"),
                consent_talent_network=True,
                profile_status=CandidateProfileStatus.OPTED_IN,
                searchable_title=candidate_data.searchable_title,
                searchable_skills=candidate_data.skills,
            ),
        )
        candidate.applicant_user_id = user.id
        candidate.created_by_user_id = user.id
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
    else:
        candidate = crud.create_candidate(
            db,
            talent_network.id,
            CandidateCreate(
                name=candidate_data.name,
                email=candidate_data.email,
                phone=candidate_data.phone,
                location=candidate_data.address,
                parsed_profile_json=candidate_data.model_dump(mode="json"),
                consent_talent_network=True,
                profile_status=CandidateProfileStatus.OPTED_IN,
                searchable_title=candidate_data.searchable_title,
                searchable_skills=candidate_data.skills,
            ),
            applicant_user_id=user.id,
            created_by_user_id=user.id,
        )

    crud.create_usage_stat(
        db,
        event_type="talent_network_opt_in",
        user_id=user.id,
        visitor_id=None,
        role=models.UserRole.APPLICANT.value,
        path="/free-analysis",
        ip_address=_client_ip(request),
    )
    return {"candidate_id": candidate.id, "account_created": True}
