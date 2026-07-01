from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_any_role
from app.db import crud, models
from app.db.session import get_db
from app.schemas import (
    ApplicationAnalysisRead,
    ApplicationRead,
    HrFinalDecision,
    InterviewCreate,
    InterviewRead,
    JobCreate,
    JobRead,
    JobUpdate,
    UserRead,
)
from app.services.ai_service import (
    analyze_resume_for_public_tool,
    comment_answers,
    generate_job_questions,
    score_answers,
    summarize_resume_match_analysis,
)
from app.services.resume_parser import extract_resume_text, resolve_resume_path

router = APIRouter()


def _format_schedule_time(value) -> str:
    return value.strftime("%b %-d, %Y at %-I:%M %p")


def _validate_office_hour_slot(schedule_time) -> None:
    if schedule_time is None:
        return
    is_half_hour_slot = (
        schedule_time.minute in {0, 30}
        and schedule_time.second == 0
        and schedule_time.microsecond == 0
    )
    is_office_hour = 10 <= schedule_time.hour <= 16
    if not is_half_hour_slot or not is_office_hour:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview start time must be between 10:00 AM and 4:00 PM in 30-minute intervals.",
        )


def _can_manage_job(current_user: models.User, job: models.Job) -> bool:
    if job.hr_id == current_user.id:
        return True
    return current_user.company_id is not None and job.company_id == current_user.company_id


def _can_manage_application(current_user: models.User, application: models.Application) -> bool:
    return application.job is not None and _can_manage_job(current_user, application.job)


def _score_application(db: Session, application: models.Application) -> models.Application:
    job = application.job
    questions = crud.get_questions_for_job(db, job.id)
    question_payload = [{"id": question.id, "text": question.text, "category": question.category} for question in questions]
    resume_text = ""
    resume_path = resolve_resume_path(application.resume_path)
    if resume_path.exists():
        resume_text = extract_resume_text(resume_path)
    elif application.candidate and application.candidate.resume_text:
        resume_text = application.candidate.resume_text
    answer_payload = [
        {
            "question_id": answer.question_id,
            "answer_text": answer.answer_text,
            "question_text": answer.question.text if answer.question else "",
        }
        for answer in application.answers
    ]
    resume_analysis = analyze_resume_for_public_tool(resume_text, job.description)
    matching_score = float(resume_analysis["match_score"])
    answer_score = score_answers(answer_payload, question_payload) if answer_payload else None
    resume_comment = summarize_resume_match_analysis(resume_analysis)
    return crud.update_application_scores(
        db,
        application,
        matching_score,
        answer_score,
        resume_comment,
        comment_answers(answer_payload, question_payload, answer_score or 0.0)
        if answer_payload
        else application.answer_comment,
    )


def _application_needs_score(application: models.Application) -> bool:
    if (application.matching_score or 0.0) <= 0 or not application.resume_comment:
        return True
    if not application.answers:
        return False
    return (application.answer_score or 0.0) <= 0 or not application.answer_comment


def _validate_job_org_rules(db: Session, job_in: JobCreate, current_user: models.User) -> None:
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not assigned to an organization")
    organization = crud.get_company(db, current_user.company_id)
    if not organization:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Organization not found")

    if organization.organization_type == models.OrganizationType.RECRUITING_AGENCY:
        if job_in.client_company_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Recruiting agency jobs require a client company")
        client_company = crud.get_client_company(db, current_user.company_id, job_in.client_company_id)
        if not client_company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client company not found")
        if job_in.assigned_recruiter_id is not None:
            recruiter = crud.get_company_user(db, current_user.company_id, job_in.assigned_recruiter_id)
            if not recruiter or recruiter.role != models.UserRole.RECRUITER:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned recruiter is not in your agency")
        return

    if job_in.client_company_id is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employer jobs cannot use a client company")
    if job_in.assigned_recruiter_id is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employer jobs cannot assign a recruiter")


@router.post("/jobs", response_model=JobRead)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    _validate_job_org_rules(db, job_in, current_user)
    job_url = f"{job_in.title.lower().replace(' ', '-')}-{current_user.id}-{int(__import__('time').time())}"
    questions_data = generate_job_questions(job_in.description)
    job = crud.create_job(db, job_in, job_url, hr_id=current_user.id)
    crud.create_questions(db, job, questions_data)
    return job


@router.get("/jobs", response_model=list[JobRead])
def list_my_jobs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_any_role(models.UserRole.COMPANY_ADMIN, models.UserRole.HR, models.UserRole.RECRUITER)
    ),
):
    if current_user.company_id is not None:
        return crud.search_jobs(db, company_id=current_user.company_id)
    return crud.get_jobs_for_hr(db, current_user.id)


@router.patch("/jobs/{job_id}", response_model=JobRead)
def update_job(
    job_id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    job = crud.get_job(db, job_id)
    if not job or not _can_manage_job(current_user, job):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    organization = crud.get_company(db, current_user.company_id) if current_user.company_id else None
    if organization and organization.organization_type == models.OrganizationType.RECRUITING_AGENCY:
        if job_in.client_company_id is not None:
            client_company = crud.get_client_company(db, current_user.company_id, job_in.client_company_id)
            if not client_company:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client company not found")
        if job_in.assigned_recruiter_id is not None:
            recruiter = crud.get_company_user(db, current_user.company_id, job_in.assigned_recruiter_id)
            if not recruiter or recruiter.role != models.UserRole.RECRUITER:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Assigned recruiter is not in your agency")
    else:
        if job_in.client_company_id is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employer jobs cannot use a client company")
        if job_in.assigned_recruiter_id is not None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Employer jobs cannot assign a recruiter")

    updated_job = crud.update_job(db, job, job_in)
    if current_user.company_id is not None:
        crud.create_workspace_activity_event(
            db,
            company_id=current_user.company_id,
            actor_user=current_user,
            event_type="job_updated",
            entity_type="job",
            entity_id=updated_job.id,
            entity_label=updated_job.title,
            summary=f"{current_user.name} updated job {updated_job.title}.",
            metadata_json={"job_url": updated_job.job_url, "status": updated_job.status.value},
        )
    return updated_job


@router.get("/hiring-managers", response_model=list[UserRead])
def list_hiring_managers(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    if current_user.company_id is None:
        return []
    return [
        user
        for user in crud.get_company_users(db, current_user.company_id)
        if crud.user_has_role(user, models.UserRole.HIRING_MANAGER)
    ]


@router.get("/jobs/{job_id}/applications", response_model=list[ApplicationRead])
def list_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    job = crud.get_job(db, job_id)
    if not job or not _can_manage_job(current_user, job):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    applications = crud.get_applications_for_job(db, job_id)
    for application in applications:
        if _application_needs_score(application):
            _score_application(db, application)
    return applications


@router.get("/applications", response_model=list[ApplicationRead])
def list_company_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    return (
        crud.get_applications_for_company(db, current_user.company_id)
        if current_user.company_id is not None
        else crud.get_applications_for_hr(db, current_user.id)
    )


@router.get("/application-analysis/{application_id}", response_model=ApplicationAnalysisRead)
def get_application_analysis(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    resume_text = ""
    resume_path = resolve_resume_path(application.resume_path)
    if resume_path.exists():
        resume_text = extract_resume_text(resume_path)
    elif application.candidate and application.candidate.resume_text:
        resume_text = application.candidate.resume_text
    if not resume_text.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No readable resume text found")

    analysis = analyze_resume_for_public_tool(resume_text, application.job.description)
    updated_application = crud.update_application_scores(
        db,
        application,
        float(analysis["match_score"]),
        application.answer_score,
        summarize_resume_match_analysis(analysis),
        application.answer_comment,
    )
    return {**analysis, "application": updated_application}


@router.post("/applications/{application_id}/rescore", response_model=ApplicationRead)
def rescore_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return _score_application(db, application)


@router.post("/applications/{application_id}/prequalify", response_model=ApplicationRead)
def prequalify_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return crud.update_application_status(db, application, models.ApplicationStatus.PRE_QUALIFIED)


@router.post("/applications/{application_id}/reject", response_model=ApplicationRead)
def reject_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return crud.update_application_status(db, application, models.ApplicationStatus.REJECTED)


@router.post("/applications/{application_id}/final-decision", response_model=ApplicationRead)
def set_hr_final_decision(
    application_id: int,
    decision: HrFinalDecision,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if not application.interview or application.interview.final_verdict is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hiring manager recommendation is required before HR final decision.",
        )
    return crud.update_hr_final_decision(
        db,
        application,
        models.ApplicationStatus(decision.status.value),
        decision.comment,
    )


@router.post("/applications/{application_id}/schedule", response_model=InterviewRead)
def schedule_interview(
    application_id: int,
    interview_in: InterviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_any_role(models.UserRole.HR, models.UserRole.RECRUITER)),
):
    application = crud.get_application(db, application_id)
    if not application or not _can_manage_application(current_user, application):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if interview_in.application_id != application_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Application ID mismatch")
    manager = crud.get_user(db, interview_in.hiring_manager_id)
    if not manager or manager.role != models.UserRole.HIRING_MANAGER:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hiring manager not found")
    if current_user.company_id is not None and manager.company_id != current_user.company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hiring manager is not in your company")
    _validate_office_hour_slot(interview_in.schedule_time)
    conflict = crud.get_manager_schedule_conflict(
        db,
        interview_in.hiring_manager_id,
        interview_in.schedule_time,
        application_id,
    )
    if conflict:
        conflict_start = _format_schedule_time(conflict.schedule_time)
        conflict_end = _format_schedule_time(conflict.schedule_time + timedelta(hours=1))
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{manager.name} already has an interview from {conflict_start} to {conflict_end}.",
        )
    return crud.create_interview(db, interview_in)
