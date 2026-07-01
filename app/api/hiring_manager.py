from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_role
from app.db import crud, models
from app.db.session import get_db
from app.schemas import InterviewDecision, InterviewRead, QuestionRead

router = APIRouter()


@router.get("", response_model=list[InterviewRead], include_in_schema=False)
@router.get("/", response_model=list[InterviewRead])
def list_interviews(db: Session = Depends(get_db), current_user: models.User = Depends(require_role(models.UserRole.HIRING_MANAGER))):
    return crud.get_interviews_for_manager(db, current_user.id)


@router.get("/{interview_id}/questions", response_model=list[QuestionRead])
def list_interview_questions(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.HIRING_MANAGER)),
):
    interview = crud.get_interview(db, interview_id)
    if not interview or interview.hiring_manager_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    if not interview.application:
        raise HTTPException(status_code=404, detail="Application not found")
    return crud.get_questions_for_job(db, interview.application.job_id)


@router.post("/{interview_id}/decision", response_model=InterviewRead)
def submit_interview_decision(
    interview_id: int,
    decision: InterviewDecision,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.HIRING_MANAGER)),
):
    interview = crud.get_interview(db, interview_id)
    if not interview or interview.hiring_manager_id != current_user.id:
        raise HTTPException(status_code=404, detail="Interview not found")
    updated = crud.update_interview_verdict(db, interview, decision.manager_comment, decision.final_verdict)
    return updated
