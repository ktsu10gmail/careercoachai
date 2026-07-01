from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import require_role
from app.db import crud, models
from app.db.session import get_db
from app.schemas import (
    CandidateProfileStatus,
    CandidateRead,
    PlatformFreeServiceUserSummary,
    PlatformPerformanceSummary,
    PlatformSiteVisitorSummary,
    ScoringSandboxIgnoreRequest,
    ScoringSandboxIgnoreResult,
    ScoringSandboxPromoteRequest,
    ScoringSandboxPromoteResult,
    ScoringSandboxPromotionReport,
    ScoringSandboxRealJdRequest,
    ScoringSandboxRealJdResult,
    ScoringSandboxRunRequest,
    ScoringSandboxRunResult,
    ScoringSandboxStatus,
    ScoringSandboxTitlesUpdate,
)
from app.scoring.sandbox_runner import (
    ignore_regression_candidates,
    import_real_jd_case,
    pre_promotion_report,
    promote_regression_candidates,
    run_sandbox_stage,
    sandbox_status,
    write_job_titles,
)

router = APIRouter()


@router.get("/talent-candidates", response_model=list[CandidateRead])
def list_talent_candidates(
    q: str = "",
    profile_status: CandidateProfileStatus = CandidateProfileStatus.OPTED_IN,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return crud.search_talent_network_candidates(
        db,
        query=q.strip(),
        status_filter=models.CandidateProfileStatus(profile_status.value),
    )


@router.get("/performance", response_model=PlatformPerformanceSummary)
def read_platform_performance(
    period_days: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if period_days is not None and period_days not in {7, 30, 90}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="period_days must be 7, 30, 90, or omitted")
    return crud.get_platform_performance(db, period_days)


@router.get("/free-service-users", response_model=PlatformFreeServiceUserSummary)
def read_platform_free_service_users(
    period_days: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if period_days is not None and period_days not in {7, 30, 90}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="period_days must be 7, 30, 90, or omitted")
    return crud.get_platform_free_service_users(db, period_days)


@router.get("/site-visitors", response_model=PlatformSiteVisitorSummary)
def read_platform_site_visitors(
    period_days: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if period_days is not None and period_days not in {7, 30, 90}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="period_days must be 7, 30, 90, or omitted")
    return crud.get_platform_site_visitors(db, period_days)


@router.get("/scoring-sandbox/status", response_model=ScoringSandboxStatus)
def read_scoring_sandbox_status(
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return sandbox_status()


@router.put("/scoring-sandbox/job-titles", response_model=ScoringSandboxStatus)
def update_scoring_sandbox_job_titles(
    payload: ScoringSandboxTitlesUpdate,
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    write_job_titles(payload.titles)
    return sandbox_status()


@router.post("/scoring-sandbox/run", response_model=ScoringSandboxRunResult)
def run_scoring_sandbox(
    payload: ScoringSandboxRunRequest,
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return run_sandbox_stage(payload.stage)


@router.post("/scoring-sandbox/real-jd", response_model=ScoringSandboxRealJdResult)
def import_scoring_sandbox_real_jd(
    payload: ScoringSandboxRealJdRequest,
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    try:
        return import_real_jd_case(payload.job_title, payload.job_description)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/scoring-sandbox/pre-promote", response_model=ScoringSandboxPromotionReport)
def read_scoring_sandbox_pre_promote(
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return pre_promotion_report()


@router.post("/scoring-sandbox/promote", response_model=ScoringSandboxPromoteResult)
def promote_scoring_sandbox_candidates(
    payload: ScoringSandboxPromoteRequest,
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return promote_regression_candidates(
        payload.candidate_ids,
        [lesson.model_dump() for lesson in payload.lessons],
    )


@router.post("/scoring-sandbox/ignore", response_model=ScoringSandboxIgnoreResult)
def ignore_scoring_sandbox_candidates(
    payload: ScoringSandboxIgnoreRequest,
    current_user: models.User = Depends(require_role(models.UserRole.PLATFORM_ADMIN)),
):
    if not crud.user_has_role(current_user, models.UserRole.PLATFORM_ADMIN):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Platform admin required")
    return ignore_regression_candidates(payload.candidate_ids)
