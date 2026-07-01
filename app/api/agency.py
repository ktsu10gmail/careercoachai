import os
import re
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_any_role
from app.db import crud, models
from app.db.session import get_db
from app.schemas import (
    ApplicationRead,
    CandidateBatchMatchRead,
    ClientCompanyCreate,
    ClientCompanyRead,
    ClientCompanyUpdate,
    CandidateCreate,
    CandidateJobMatch,
    CandidatePotentialJobMatchRead,
    CandidateRead,
    CandidateResumeImportPreview,
    CandidateSubmissionCreate,
    CandidateSubmissionFeedback,
    CandidateSubmissionRead,
    CandidateUpdate,
    OrganizationRead,
    RecruiterPerformanceSummary,
    UserRead,
)
from app.services.ai_service import comment_resume_against_job, score_resume_against_job
from app.services.resume_parser import extract_resume_text, validate_resume_upload

router = APIRouter()

EMAIL_PATTERN = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)
PHONE_PATTERN = re.compile(r"(?:\+?\d[\d\s().-]{7,}\d)")


def _resume_upload_dir() -> Path:
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads/resumes"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def _store_resume_file(resume: UploadFile, prefix: str) -> tuple[str, str]:
    extension = validate_resume_upload(resume)
    resume_path = _resume_upload_dir() / f"{prefix}_{uuid4().hex}{extension}"
    with resume_path.open("wb") as buffer:
        buffer.write(resume.file.read())
    try:
        resume_text = extract_resume_text(resume_path)
    except RuntimeError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc))
    return str(resume_path), resume_text


def _infer_candidate_basics(resume_text: str, filename: str) -> dict:
    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    email_match = EMAIL_PATTERN.search(resume_text)
    phone_match = PHONE_PATTERN.search(resume_text)
    email = email_match.group(0).lower() if email_match else f"resume-{uuid4().hex[:12]}@unknown.example.com"
    name = ""
    for line in lines[:8]:
        if "@" in line or any(char.isdigit() for char in line):
            continue
        if len(line.split()) <= 6:
            name = line[:120]
            break
    if not name:
        name = Path(filename).stem.replace("_", " ").replace("-", " ").title()[:120] or "Unknown Candidate"
    location = None
    for line in lines[:12]:
        lower = line.lower()
        if "@" in line or "linkedin" in lower or "github" in lower:
            continue
        if "," in line and len(line) <= 160:
            location = line[:160]
            break
    return {
        "name": name,
        "email": email,
        "phone": phone_match.group(0).strip()[:80] if phone_match else None,
        "location": location,
    }


def _require_agency(current_user: models.User) -> None:
    if current_user.company_id is None or not current_user.company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not assigned to an organization")
    if current_user.company.organization_type != models.OrganizationType.RECRUITING_AGENCY:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only recruiting agencies can use this resource")


def _require_organization(current_user: models.User) -> None:
    if current_user.company_id is None or not current_user.company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not assigned to an organization")


def _can_manage_application(current_user: models.User, application: models.Application) -> bool:
    return (
        application.job is not None
        and current_user.company_id is not None
        and application.job.company_id == current_user.company_id
    )


@router.get("/organizations/me", response_model=OrganizationRead)
def read_my_organization(current_user: models.User = Depends(get_current_user)):
    if current_user.company is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return current_user.company


@router.get("/client-companies", response_model=list[ClientCompanyRead])
def list_client_companies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    return crud.get_client_companies(db, current_user.company_id)


@router.get("/candidates", response_model=list[CandidateRead])
def list_candidates(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    return crud.get_candidates_for_company(db, current_user.company_id)


@router.post("/candidates", response_model=CandidateRead, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate_in: CandidateCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    if candidate_in.imported_for_job_id is not None:
        job = crud.get_job(db, candidate_in.imported_for_job_id)
        if not job or job.company_id != current_user.company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Imported-for job not found")
    existing = crud.get_candidate_by_email(db, current_user.company_id, str(candidate_in.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Candidate email already exists in this organization")
    return crud.create_candidate(
        db,
        current_user.company_id,
        candidate_in,
        created_by_user_id=current_user.id,
    )


def _candidate_import_payload(resume_path: str, resume_text: str, filename: str, existing_id: int | None = None) -> dict:
    basics = _infer_candidate_basics(resume_text, filename)
    parsed_profile_json = {
        "name": basics["name"],
        "email": basics["email"],
        "phone": basics["phone"] or "",
        "address": basics["location"] or "",
        "skills": [],
        "experience": [],
        "education": [],
    }
    return {
        **basics,
        "resume_file_url": resume_path,
        "resume_text": resume_text,
        "parsed_profile_json": parsed_profile_json,
        "existing_candidate_id": existing_id,
    }


@router.post("/candidates/preview-resume", response_model=CandidateResumeImportPreview)
def preview_candidate_resume_import(
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)
    ),
):
    _require_agency(current_user)
    filename = resume.filename or "resume"
    resume_path, resume_text = _store_resume_file(resume, "candidate_import")
    preview = _candidate_import_payload(resume_path, resume_text, filename)
    existing = crud.get_candidate_by_email(db, current_user.company_id, preview["email"])
    preview["existing_candidate_id"] = existing.id if existing else None
    return preview


@router.post("/candidates/import-resume", response_model=CandidateRead, status_code=status.HTTP_201_CREATED)
def import_candidate_from_resume(
    resume: UploadFile = File(...),
    consent_talent_network: bool = Form(False),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)
    ),
):
    _require_agency(current_user)
    filename = resume.filename or "resume"
    resume_path, resume_text = _store_resume_file(resume, "candidate_import")
    preview = _candidate_import_payload(resume_path, resume_text, filename)
    existing = crud.get_candidate_by_email(db, current_user.company_id, preview["email"])
    if existing:
        return crud.update_candidate(
            db,
            existing,
            CandidateUpdate(
                name=preview["name"] or existing.name,
                email=preview["email"],
                phone=preview["phone"] or existing.phone,
                location=preview["location"] or existing.location,
                resume_file_url=resume_path,
                resume_text=resume_text,
                parsed_profile_json=preview["parsed_profile_json"],
                consent_talent_network=consent_talent_network or existing.consent_talent_network,
            ),
        )

    return crud.create_candidate(
        db,
        current_user.company_id,
        CandidateCreate(
            name=preview["name"],
            email=preview["email"],
            phone=preview["phone"],
            location=preview["location"],
            resume_file_url=resume_path,
            resume_text=resume_text,
            parsed_profile_json=preview["parsed_profile_json"],
            consent_talent_network=consent_talent_network,
        ),
        created_by_user_id=current_user.id,
    )


@router.get("/candidates/{candidate_id}", response_model=CandidateRead)
def read_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate


@router.get("/candidates/{candidate_id}/applications", response_model=list[ApplicationRead])
def list_candidate_applications(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return crud.get_applications_for_candidate(db, current_user.company_id, candidate.id)


@router.put("/candidates/{candidate_id}", response_model=CandidateRead)
def update_candidate(
    candidate_id: int,
    candidate_in: CandidateUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    if candidate_in.email is not None:
        existing = crud.get_candidate_by_email(db, current_user.company_id, str(candidate_in.email))
        if existing and existing.id != candidate.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Candidate email already exists in this organization")
    if candidate_in.imported_for_job_id is not None:
        job = crud.get_job(db, candidate_in.imported_for_job_id)
        if not job or job.company_id != current_user.company_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Imported-for job not found")
    return crud.update_candidate(db, candidate, candidate_in)


@router.post("/candidates/{candidate_id}/upload-resume", response_model=CandidateRead)
def upload_candidate_resume(
    candidate_id: int,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")

    resume_path, resume_text = _store_resume_file(resume, f"candidate_{candidate.id}")

    return crud.update_candidate_resume(db, candidate, resume_path, resume_text)


@router.get("/candidates/{candidate_id}/resume")
def download_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_organization(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate or not candidate.resume_file_url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    resume_path = Path(candidate.resume_file_url)
    if not resume_path.exists() or not resume_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume file not found")
    return FileResponse(
        resume_path,
        filename=resume_path.name,
        media_type="application/octet-stream",
    )


@router.get("/candidates/{candidate_id}/potential-matches", response_model=list[CandidatePotentialJobMatchRead])
def list_candidate_potential_matches(
    candidate_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    if not candidate.resume_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload or import a resume before scoring potential jobs")

    jobs = crud.search_jobs(db, company_id=current_user.company_id, status=models.JobStatus.ACTIVE)[:12]
    results = []
    for job in jobs:
        existing_application = crud.get_application_for_candidate_job(db, candidate.id, job.id)
        results.append(
            {
                "job_id": job.id,
                "job_title": job.title,
                "client_company_name": job.client_company.company_name if job.client_company else None,
                "match_score": score_resume_against_job(candidate.resume_text, job.description),
                "already_matched": existing_application is not None,
                "imported_for_job": candidate.imported_for_job_id == job.id,
            }
        )
    return sorted(
        results,
        key=lambda item: (not item["imported_for_job"], -(item["match_score"] or 0)),
    )


@router.post("/candidates/batch-match", response_model=list[CandidateBatchMatchRead])
def batch_match_resumes_to_job(
    job_id: int = Form(...),
    resumes: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    if not resumes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload at least one resume")
    if len(resumes) > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload up to 5 resumes at a time")

    job = crud.get_job(db, job_id)
    if not job or job.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.client_company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Agency batch matches require a client job")

    results: list[dict] = []
    for resume in resumes:
        filename = resume.filename or "resume"
        resume_path, resume_text = _store_resume_file(resume, "candidate_batch")
        basics = _infer_candidate_basics(resume_text, filename)
        existing = crud.get_candidate_by_email(db, current_user.company_id, basics["email"])
        if existing:
            candidate = crud.update_candidate(
                db,
                existing,
                CandidateUpdate(
                    name=basics["name"] or existing.name,
                    email=basics["email"],
                    phone=basics["phone"] or existing.phone,
                    location=basics["location"] or existing.location,
                    resume_file_url=resume_path,
                    resume_text=resume_text,
                    parsed_profile_json={
                        "name": basics["name"],
                        "email": basics["email"],
                        "phone": basics["phone"] or "",
                        "address": basics["location"] or "",
                        "skills": [],
                        "experience": [],
                        "education": [],
                    },
                ),
            )
            result_status = "updated"
        else:
            candidate = crud.create_candidate(
                db,
                current_user.company_id,
                CandidateCreate(
                    name=basics["name"],
                    email=basics["email"],
                    phone=basics["phone"],
                    location=basics["location"],
                    resume_file_url=resume_path,
                    resume_text=resume_text,
                    parsed_profile_json={
                        "name": basics["name"],
                        "email": basics["email"],
                        "phone": basics["phone"] or "",
                        "address": basics["location"] or "",
                        "skills": [],
                        "experience": [],
                        "education": [],
                    },
                ),
                created_by_user_id=current_user.id,
            )
            result_status = "created"

        existing_application = crud.get_application_for_candidate_job(db, candidate.id, job.id)
        if existing_application:
            application = existing_application
            message = "Candidate was already matched to this job."
        else:
            matching_score = score_resume_against_job(candidate.resume_text or "", job.description)
            resume_comment = comment_resume_against_job(
                candidate.resume_text or "",
                job.description,
                matching_score,
            )
            application = crud.create_candidate_application(
                db,
                candidate,
                job,
                candidate.resume_file_url or f"candidate:{candidate.id}",
                matching_score,
                resume_comment,
                matched_by_user_id=current_user.id,
            )
            message = "Candidate profile and scored match are ready."
        results.append(
            {
                "candidate": candidate,
                "application": application,
                "filename": filename,
                "status": result_status,
                "message": message,
            }
        )

    return sorted(
        results,
        key=lambda item: item["application"].matching_score if item.get("application") else -1,
        reverse=True,
    )


@router.post("/candidates/{candidate_id}/match-job", response_model=ApplicationRead)
def match_candidate_to_job(
    candidate_id: int,
    match_in: CandidateJobMatch,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    candidate = crud.get_candidate(db, current_user.company_id, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    job = crud.get_job(db, match_in.job_id)
    if not job or job.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    existing = crud.get_application_for_candidate_job(db, candidate.id, job.id)
    if existing:
        return existing

    resume_text = candidate.resume_text or ""
    matching_score = score_resume_against_job(resume_text, job.description)
    resume_comment = comment_resume_against_job(resume_text, job.description, matching_score)
    resume_path = candidate.resume_file_url or f"candidate:{candidate.id}"
    return crud.create_candidate_application(
        db,
        candidate,
        job,
        resume_path,
        matching_score,
        resume_comment,
        matched_by_user_id=current_user.id,
    )


@router.post("/applications/{application_id}/submit-to-client", response_model=CandidateSubmissionRead)
def submit_application_to_client(
    application_id: int,
    submission_in: CandidateSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if not application.job or application.job.client_company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only client-job applications can be submitted to clients")
    return crud.create_candidate_submission(db, application, current_user.id, submission_in)


@router.get("/submissions", response_model=list[CandidateSubmissionRead])
def list_submissions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    return crud.get_submissions_for_company(db, current_user.company_id)


@router.get("/recruiter-performance", response_model=RecruiterPerformanceSummary)
def recruiter_performance(
    period_days: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    if period_days is not None and period_days not in {7, 30, 90}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="period_days must be 7, 30, 90, or omitted")
    return crud.get_recruiter_performance(db, current_user.company_id, period_days)


@router.put("/submissions/{submission_id}/feedback", response_model=CandidateSubmissionRead)
def update_submission_feedback(
    submission_id: int,
    feedback_in: CandidateSubmissionFeedback,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    submission = crud.get_submission(db, submission_id)
    if not submission or not submission.application or not _can_manage_application(current_user, submission.application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    return crud.update_candidate_submission_feedback(db, submission, feedback_in)


@router.post("/client-companies", response_model=ClientCompanyRead, status_code=status.HTTP_201_CREATED)
def create_client_company(
    client_in: ClientCompanyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    return crud.create_client_company(db, current_user.company_id, client_in)


@router.get("/client-companies/{client_company_id}", response_model=ClientCompanyRead)
def read_client_company(
    client_company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    client = crud.get_client_company(db, current_user.company_id, client_company_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client company not found")
    return client


@router.put("/client-companies/{client_company_id}", response_model=ClientCompanyRead)
def update_client_company(
    client_company_id: int,
    client_in: ClientCompanyUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    client = crud.get_client_company(db, current_user.company_id, client_company_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client company not found")
    return crud.update_client_company(db, client, client_in)


@router.delete("/client-companies/{client_company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client_company(
    client_company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    client = crud.get_client_company(db, current_user.company_id, client_company_id)
    if not client:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client company not found")
    crud.delete_client_company(db, client)
    return None


@router.get("/recruiters", response_model=list[UserRead])
def list_recruiters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _require_agency(current_user)
    return [
        user
        for user in crud.get_company_users(db, current_user.company_id)
        if crud.user_has_role(user, models.UserRole.RECRUITER)
    ]
