import re
from datetime import datetime, timedelta
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import require_any_role, require_role
from app.db import crud
from app.db import models
from app.db.session import get_db
from app.schemas import (
    AccessModel,
    EmployerSetup,
    EmployerSetupRead,
    EmployerInvitationAccept,
    EmployerInvitationCreate,
    EmployerInvitationPublicRead,
    EmployerInvitationRead,
    EmployerUserCreate,
    EmployerUserUpdate,
    OrganizationType,
    UserCreate,
    UserRead,
    UserRole,
    WorkspaceActivityEventRead,
)
from app.services.auth_service import (
    create_password_reset_token,
    employer_invitation_url,
    get_password_hash,
    hash_password_reset_token,
    send_employer_invitation_email,
)

router = APIRouter()
logger = logging.getLogger(__name__)

INVITATION_EXPIRE_HOURS = 72

EMPLOYER_MANAGED_ROLES = {
    models.UserRole.COMPANY_ADMIN,
    models.UserRole.HR,
    models.UserRole.RECRUITER,
    models.UserRole.HIRING_MANAGER,
}


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "company"


def _unique_company_slug(db: Session, name: str) -> str:
    base_slug = _slugify(name)
    slug = base_slug
    suffix = 2
    while crud.get_company_by_slug(db, slug):
        slug = f"{base_slug}-{suffix}"
        suffix += 1
    return slug


def _validate_managed_roles(
    company: models.Company | None,
    roles: list[models.UserRole],
) -> None:
    if not roles:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Select at least one role")
    if any(role not in EMPLOYER_MANAGED_ROLES for role in roles):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Users must be admin, HR, recruiter, or hiring manager")
    if (
        models.UserRole.RECRUITER in roles
        and company
        and company.organization_type != models.OrganizationType.RECRUITING_AGENCY
    ):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Recruiter users are only available for recruiting agencies")


def _role_label(role: models.UserRole) -> str:
    return role.value.replace("_", " ")


def _role_list_label(roles: list[models.UserRole]) -> str:
    return ", ".join(_role_label(role) for role in roles)


def _record_activity(
    db: Session,
    *,
    company_id: int,
    actor: models.User | None = None,
    event_type: str,
    entity_type: str | None = None,
    entity_id: int | None = None,
    entity_label: str | None = None,
    summary: str,
    metadata_json: dict | None = None,
):
    crud.create_workspace_activity_event(
        db,
        company_id=company_id,
        actor_user=actor,
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_label=entity_label,
        summary=summary,
        metadata_json=metadata_json,
    )


def _shared_company_roles(company: models.Company | None) -> list[models.UserRole]:
    roles = [
        models.UserRole.COMPANY_ADMIN,
        models.UserRole.HR,
        models.UserRole.HIRING_MANAGER,
    ]
    if company and company.organization_type == models.OrganizationType.RECRUITING_AGENCY:
        roles.append(models.UserRole.RECRUITER)
    return roles


def _effective_roles_for_company(
    company: models.Company | None,
    primary_role: models.UserRole,
    assigned_roles: list[models.UserRole] | None = None,
) -> list[models.UserRole]:
    if company and company.access_model == models.AccessModel.COLLABORATIVE.value:
        return _shared_company_roles(company)
    roles = list(assigned_roles or [primary_role])
    if primary_role not in roles:
        roles.insert(0, primary_role)
    return roles


def _invitation_assigned_roles(invitation: models.EmployerInvitation) -> list[models.UserRole]:
    roles = [
        models.UserRole(role)
        for role in (invitation.roles or [])
        if role in {managed_role.value for managed_role in EMPLOYER_MANAGED_ROLES}
    ]
    if not roles:
        roles = [invitation.role]
    if invitation.role not in roles:
        roles.insert(0, invitation.role)
    return roles


def _get_valid_invitation(db: Session, token: str) -> models.EmployerInvitation:
    invitation = crud.get_employer_invitation_by_token_hash(db, hash_password_reset_token(token))
    if not invitation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invitation not found")
    if invitation.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation has expired")
    return invitation


@router.post("/setup", response_model=EmployerSetupRead, status_code=status.HTTP_201_CREATED)
def setup_employer(setup_in: EmployerSetup, db: Session = Depends(get_db)):
    all_emails = [
        setup_in.admin.email,
        *[member.email for member in setup_in.hr_members],
        *[member.email for member in setup_in.recruiters],
        *[member.email for member in setup_in.hiring_managers],
    ]
    if len(set(all_emails)) != len(all_emails):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Each team member must use a unique email")
    for email in all_emails:
        if crud.get_user_by_email(db, email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Email already registered: {email}")

    for member in setup_in.hr_members:
        if member.role != UserRole.HR:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="HR members must use the HR role")
    for member in setup_in.recruiters:
        if member.role != UserRole.RECRUITER:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Recruiters must use the Recruiter role")
    if setup_in.recruiters and setup_in.company.organization_type != OrganizationType.RECRUITING_AGENCY:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Recruiters can only be added to recruiting agencies")
    for member in setup_in.hiring_managers:
        if member.role != UserRole.HIRING_MANAGER:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Hiring managers must use the Hiring_Manager role")

    company = crud.create_company(db, setup_in.company, _unique_company_slug(db, setup_in.company.name))
    admin_roles = [UserRole(role.value) for role in _shared_company_roles(company)]
    admin = crud.create_user(
        db,
        UserCreate(
            name=setup_in.admin.name,
            email=setup_in.admin.email,
            password=setup_in.admin.password,
            role=UserRole.COMPANY_ADMIN,
            roles=admin_roles,
        ),
        get_password_hash(setup_in.admin.password),
        company_id=company.id,
    )

    hr_members = [
        crud.create_user(
            db,
            UserCreate(
                name=member.name,
                email=member.email,
                password=member.password,
                role=UserRole.HR,
                roles=[
                    UserRole(role.value)
                    for role in _effective_roles_for_company(company, models.UserRole.HR)
                ],
            ),
            get_password_hash(member.password),
            company_id=company.id,
        )
        for member in setup_in.hr_members
    ]
    recruiters = [
        crud.create_user(
            db,
            UserCreate(
                name=member.name,
                email=member.email,
                password=member.password,
                role=UserRole.RECRUITER,
                roles=[
                    UserRole(role.value)
                    for role in _effective_roles_for_company(company, models.UserRole.RECRUITER)
                ],
            ),
            get_password_hash(member.password),
            company_id=company.id,
        )
        for member in setup_in.recruiters
    ]
    hiring_managers = [
        crud.create_user(
            db,
            UserCreate(
                name=member.name,
                email=member.email,
                password=member.password,
                role=UserRole.HIRING_MANAGER,
                roles=[
                    UserRole(role.value)
                    for role in _effective_roles_for_company(company, models.UserRole.HIRING_MANAGER)
                ],
            ),
            get_password_hash(member.password),
            company_id=company.id,
        )
        for member in setup_in.hiring_managers
    ]

    _record_activity(
        db,
        company_id=company.id,
        actor=admin,
        event_type="workspace_created",
        entity_type="company",
        entity_id=company.id,
        entity_label=company.name,
        summary=f"{admin.name} created the {company.name} workspace.",
        metadata_json={
            "organization_type": company.organization_type.value,
            "access_model": company.access_model,
        },
    )

    return {
        "company": company,
        "admin": admin,
        "hr_members": hr_members,
        "recruiters": recruiters,
        "hiring_managers": hiring_managers,
    }


@router.get("/users", response_model=list[UserRead])
def list_employer_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.COMPANY_ADMIN)),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company admin is not assigned to a company")
    return crud.get_company_users(db, current_user.company_id)


@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_employer_user(
    user_in: EmployerUserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.COMPANY_ADMIN)),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company admin is not assigned to a company")
    company = crud.get_company(db, current_user.company_id)
    model_role = models.UserRole(user_in.role.value)
    assigned_roles = [models.UserRole(role.value) for role in user_in.roles] if user_in.roles else [model_role]
    assigned_roles = _effective_roles_for_company(company, model_role, assigned_roles)
    _validate_managed_roles(company, assigned_roles)
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    created_user = crud.create_user(
        db,
        UserCreate(
            name=user_in.name,
            email=user_in.email,
            password=user_in.password,
            role=user_in.role,
            roles=[UserRole(role.value) for role in assigned_roles],
        ),
        get_password_hash(user_in.password),
        company_id=current_user.company_id,
    )
    _record_activity(
        db,
        company_id=current_user.company_id,
        actor=current_user,
        event_type="team_member_created",
        entity_type="user",
        entity_id=created_user.id,
        entity_label=created_user.name,
        summary=f"{current_user.name} created team member {created_user.name}.",
        metadata_json={"roles": [role.value for role in assigned_roles]},
    )
    return created_user


@router.patch("/users/{user_id}", response_model=UserRead)
def update_employer_user(
    user_id: int,
    user_in: EmployerUserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.COMPANY_ADMIN)),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company admin is not assigned to a company")
    user = crud.get_company_user(db, current_user.company_id, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user_in.email is not None:
        existing = crud.get_user_by_email(db, user_in.email)
        if existing and existing.id != user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    company = crud.get_company(db, current_user.company_id)
    model_role = models.UserRole(user_in.role.value) if user_in.role is not None else None
    assigned_roles = [models.UserRole(role.value) for role in user_in.roles] if user_in.roles is not None else None
    roles_to_validate = assigned_roles or ([model_role] if model_role is not None else crud.get_user_roles(user))
    if model_role is not None and model_role not in roles_to_validate:
        roles_to_validate.insert(0, model_role)
    roles_to_validate = _effective_roles_for_company(company, model_role or user.role, roles_to_validate)
    _validate_managed_roles(company, roles_to_validate)
    hashed_password = get_password_hash(user_in.password) if user_in.password else None
    updated_user = crud.update_user(
        db,
        user,
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        role=model_role,
        roles=roles_to_validate if user_in.roles is not None or model_role is not None else None,
    )
    _record_activity(
        db,
        company_id=current_user.company_id,
        actor=current_user,
        event_type="team_member_updated",
        entity_type="user",
        entity_id=updated_user.id,
        entity_label=updated_user.name,
        summary=f"{current_user.name} updated team member {updated_user.name}.",
        metadata_json={"roles": [role.value for role in crud.get_user_roles(updated_user)]},
    )
    return updated_user


@router.get("/invitations", response_model=list[EmployerInvitationRead])
def list_employer_invitations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.COMPANY_ADMIN)),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company admin is not assigned to a company")
    return crud.list_company_invitations(db, current_user.company_id)


@router.post("/invitations", response_model=EmployerInvitationRead, status_code=status.HTTP_201_CREATED)
def create_employer_invitation(
    invitation_in: EmployerInvitationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role(models.UserRole.COMPANY_ADMIN)),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company admin is not assigned to a company")
    company = crud.get_company(db, current_user.company_id)
    if not company:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found")
    role = models.UserRole(invitation_in.role.value)
    requested_roles = (
        [models.UserRole(role.value) for role in invitation_in.roles]
        if invitation_in.roles
        else [role]
    )
    if role not in requested_roles:
        requested_roles.insert(0, role)
    assigned_roles = _effective_roles_for_company(company, role, requested_roles)
    _validate_managed_roles(company, assigned_roles)
    if crud.get_user_by_email(db, invitation_in.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    token = create_password_reset_token()
    invitation = crud.create_employer_invitation(
        db,
        company_id=company.id,
        invited_by_user_id=current_user.id,
        email=invitation_in.email,
        role=role,
        roles=assigned_roles,
        token_hash=hash_password_reset_token(token),
        expires_at=datetime.utcnow() + timedelta(hours=INVITATION_EXPIRE_HOURS),
    )
    try:
        send_employer_invitation_email(
            invitation.email,
            invite_url=employer_invitation_url(token),
            inviter_name=current_user.name,
            company_name=company.name,
            role_label=(
                "Shared access"
                if company.access_model == models.AccessModel.COLLABORATIVE.value
                else _role_list_label(assigned_roles)
            ),
        )
    except Exception as exc:
        db.delete(invitation)
        db.commit()
        logger.exception("Unable to send employer invitation email to %s: %s", invitation_in.email, exc)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Unable to send invitation email")
    _record_activity(
        db,
        company_id=company.id,
        actor=current_user,
        event_type="team_member_invited",
        entity_type="invitation",
        entity_id=invitation.id,
        entity_label=invitation.email,
        summary=f"{current_user.name} invited {invitation.email} to join the workspace.",
        metadata_json={"roles": [role.value for role in assigned_roles]},
    )
    return invitation


@router.get("/invitations/preview", response_model=EmployerInvitationPublicRead)
def preview_employer_invitation(token: str, db: Session = Depends(get_db)):
    invitation = _get_valid_invitation(db, token)
    company_name = invitation.company.name if invitation.company else "CareerCoachAI"
    invited_by_name = invitation.invited_by.name if invitation.invited_by else None
    return EmployerInvitationPublicRead(
        company_name=company_name,
        invited_by_name=invited_by_name,
        email=invitation.email,
        role=UserRole(invitation.role.value),
        roles=[UserRole(role.value) for role in _invitation_assigned_roles(invitation)],
        access_model=(
            AccessModel(invitation.company.access_model)
            if invitation.company
            else AccessModel.ROLE_BASED
        ),
        expires_at=invitation.expires_at,
        accepted=invitation.accepted_at is not None,
    )


@router.post("/invitations/accept", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def accept_employer_invitation(
    invitation_in: EmployerInvitationAccept,
    db: Session = Depends(get_db),
):
    invitation = _get_valid_invitation(db, invitation_in.token)
    if invitation.accepted_at is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This invitation has already been accepted")
    if crud.get_user_by_email(db, invitation.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    role = UserRole(invitation.role.value)
    company = crud.get_company(db, invitation.company_id)
    assigned_roles = [
        UserRole(model_role.value)
        for model_role in _effective_roles_for_company(
            company,
            models.UserRole(invitation.role.value),
            _invitation_assigned_roles(invitation),
        )
    ]
    user = crud.create_user(
        db,
        UserCreate(
            name=invitation_in.name,
            email=invitation.email,
            password=invitation_in.password,
            role=role,
            roles=assigned_roles,
        ),
        get_password_hash(invitation_in.password),
        company_id=invitation.company_id,
    )
    crud.mark_employer_invitation_accepted(db, invitation)
    crud.create_workspace_activity_event(
        db,
        company_id=invitation.company_id,
        actor_user=user,
        event_type="team_member_joined",
        entity_type="user",
        entity_id=user.id,
        entity_label=user.name,
        summary=f"{user.name} joined the workspace.",
        metadata_json={"roles": [role.value for role in assigned_roles]},
    )
    return user


@router.get("/activity", response_model=list[WorkspaceActivityEventRead])
def list_workspace_activity(
    limit: int = Query(5, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_any_role(
            models.UserRole.COMPANY_ADMIN,
            models.UserRole.HR,
            models.UserRole.RECRUITER,
            models.UserRole.HIRING_MANAGER,
        )
    ),
):
    if current_user.company_id is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not assigned to a company")
    return crud.list_workspace_activity_events(
        db,
        current_user.company_id,
        limit=limit,
        offset=offset,
    )
