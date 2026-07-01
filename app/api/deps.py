from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db import crud, models
from app.db.session import get_db
from app.services.auth_service import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    try:
        payload = decode_access_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    user = crud.get_user(db, payload.sub)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_optional_current_user(
    token: str | None = Depends(optional_oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User | None:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
    except Exception:
        return None
    return crud.get_user(db, payload.sub)


def require_role(role: models.UserRole):
    def dependency(current_user: models.User = Depends(get_current_user)) -> models.User:
        if not crud.user_has_role(current_user, role):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return current_user

    return dependency


def require_any_role(*roles: models.UserRole):
    allowed_roles = set(roles)

    def dependency(current_user: models.User = Depends(get_current_user)) -> models.User:
        if not crud.user_has_any_role(current_user, allowed_roles):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return current_user

    return dependency
