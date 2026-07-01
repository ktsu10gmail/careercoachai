from datetime import datetime, timedelta
import logging

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db import crud
from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db import models
from app.db.session import get_db
from app.schemas import (
    CandidateProfileStatus,
    CandidateUpdate,
    MessageRead,
    PasswordResetConfirm,
    PasswordResetRequest,
    Token,
    UserCreate,
    UserRead,
)
from app.services.auth_service import (
    create_access_token,
    create_password_reset_token,
    get_password_hash,
    hash_password_reset_token,
    password_reset_url,
    send_password_reset_email,
    verify_password,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/signup", response_model=UserRead)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    if user_in.role.value == models.UserRole.PLATFORM_ADMIN.value and crud.count_users_by_role(
        db,
        models.UserRole.PLATFORM_ADMIN,
    ) > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Platform admin self-registration is disabled after the first site admin exists",
        )
    hashed = get_password_hash(user_in.password)
    user = crud.create_user(db, user_in, hashed)
    if user.role == models.UserRole.APPLICANT:
        talent_network = crud.get_or_create_talent_network_company(db)
        candidate = crud.get_candidate_by_email(db, talent_network.id, user.email)
        if candidate and candidate.applicant_user_id is None:
            crud.update_candidate(
                db,
                candidate,
                CandidateUpdate(
                    name=candidate.name or user.name,
                    email=user.email,
                    profile_status=(
                        CandidateProfileStatus.OPTED_IN
                        if candidate.consent_talent_network
                        else CandidateProfileStatus.REGISTERED
                    ),
                ),
            )
            candidate.applicant_user_id = user.id
            candidate.created_by_user_id = user.id
            db.add(candidate)
            db.commit()
    return user


@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    settings = get_settings()
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=str(user.id), expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/password-reset/request", response_model=MessageRead)
def request_password_reset(
    reset_in: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    user = crud.get_user_by_email(db, str(reset_in.email))
    if user:
        settings = get_settings()
        token = create_password_reset_token()
        expires_at = datetime.utcnow() + timedelta(
            minutes=settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
        )
        crud.create_password_reset_token(
            db,
            user,
            hash_password_reset_token(token),
            expires_at,
        )
        try:
            send_password_reset_email(user.email, password_reset_url(token))
        except Exception as exc:
            logger.exception("Unable to send password reset email to %s: %s", user.email, exc)

    return {"message": "If an account exists for that email, a password reset link has been sent."}


@router.post("/password-reset/confirm", response_model=MessageRead)
def confirm_password_reset(
    reset_in: PasswordResetConfirm,
    db: Session = Depends(get_db),
):
    reset_token = crud.get_password_reset_token(
        db,
        hash_password_reset_token(reset_in.token),
    )
    if (
        not reset_token
        or reset_token.used_at is not None
        or reset_token.expires_at < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password reset link is invalid or expired.",
        )

    user = crud.get_user(db, reset_token.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password reset link is invalid or expired.",
        )

    crud.update_user_password(db, user, get_password_hash(reset_in.password))
    crud.mark_password_reset_token_used(db, reset_token)
    return {"message": "Password reset complete. You can now sign in with your new password."}


@router.get("/me", response_model=UserRead)
def read_me(current_user: models.User = Depends(get_current_user)):
    return current_user
