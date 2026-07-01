from datetime import datetime, timedelta
from email.message import EmailMessage
import hashlib
import logging
import secrets
import smtplib
from urllib.parse import urlencode

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings
from app.schemas import TokenPayload

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"exp": expire, "sub": str(subject)}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_password_reset_token() -> str:
    return secrets.token_urlsafe(32)


def hash_password_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def password_reset_url(token: str) -> str:
    base_url = settings.PASSWORD_RESET_URL_BASE.rstrip("/")
    return f"{base_url}/reset-password?{urlencode({'token': token})}"


def employer_invitation_url(token: str) -> str:
    base_url = settings.PASSWORD_RESET_URL_BASE.rstrip("/")
    return f"{base_url}/employer/invite?{urlencode({'token': token})}"


def send_password_reset_email(email: str, reset_url: str) -> None:
    subject = "Reset your CareerCoachAI password"
    body = (
        "We received a request to reset your CareerCoachAI password.\n\n"
        f"Open this link to choose a new password:\n{reset_url}\n\n"
        f"This link expires in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes. "
        "If you did not request a password reset, you can ignore this email."
    )

    if not settings.SMTP_HOST:
        logger.warning("Password reset email for %s: %s", email, reset_url)
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = email
    message.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
        if settings.SMTP_USE_TLS:
            server.starttls()
        if settings.SMTP_USERNAME:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(message)


def send_employer_invitation_email(
    email: str,
    *,
    invite_url: str,
    inviter_name: str,
    company_name: str,
    role_label: str,
) -> None:
    subject = f"You have been invited to {company_name} on CareerCoachAI"
    body = (
        f"{inviter_name} invited you to join the {company_name} workspace on CareerCoachAI.\n\n"
        f"Assigned role: {role_label}\n\n"
        "Use this enrollment link to create your account:\n"
        f"{invite_url}\n\n"
        "Quick tour after sign-in:\n"
        "1. Open Workspace to see the tools available for your role.\n"
        "2. Use Job Board / Job Links to publish or share active roles.\n"
        "3. Use the dashboard assigned to your role to review candidates, jobs, or interviews.\n\n"
        "If you were not expecting this invitation, you can ignore this email."
    )

    if not settings.SMTP_HOST:
        logger.warning("Employer invitation email for %s: %s", email, invite_url)
        return

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
    message["To"] = email
    message.set_content(body)

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
        if settings.SMTP_USE_TLS:
            server.starttls()
        if settings.SMTP_USERNAME:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(message)


def decode_access_token(token: str) -> TokenPayload:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise JWTError()
        return TokenPayload(sub=int(user_id))
    except JWTError as exc:
        raise exc
