from collections import defaultdict
from datetime import datetime, timedelta
import ipaddress
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import models
from app.schemas import (
    ApplicationCreate,
    AnswerCreate,
    CandidateCreate,
    CandidateSubmissionCreate,
    CandidateSubmissionFeedback,
    CandidateUpdate,
    ClientCompanyCreate,
    ClientCompanyUpdate,
    CompanyCreate,
    InterviewCreate,
    JobCreate,
    JobUpdate,
    UserCreate,
)


def create_company(db: Session, company_in: CompanyCreate, slug: str) -> models.Company:
    company = models.Company(
        name=company_in.name,
        slug=slug,
        industry=company_in.industry,
        website=company_in.website,
        size=company_in.size,
        organization_type=models.OrganizationType(company_in.organization_type.value),
        access_model=company_in.access_model.value,
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def get_company_by_slug(db: Session, slug: str) -> models.Company | None:
    return db.execute(select(models.Company).where(models.Company.slug == slug)).scalar_one_or_none()


def get_company(db: Session, company_id: int) -> models.Company | None:
    return db.get(models.Company, company_id)


def get_or_create_talent_network_company(db: Session) -> models.Company:
    company = get_company_by_slug(db, "talent-network")
    if company:
        return company

    company = models.Company(
        name="Talent Network",
        slug="talent-network",
        industry="Recruiting",
        website=None,
        size=None,
        organization_type=models.OrganizationType.EMPLOYER,
        status="system",
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company


def search_companies(db: Session, query: str = "") -> List[models.Company]:
    statement = select(models.Company).where(models.Company.status != "system")
    if query:
        pattern = f"%{query}%"
        statement = statement.where(
            models.Company.name.ilike(pattern)
            | models.Company.industry.ilike(pattern)
            | models.Company.slug.ilike(pattern)
        )
    return db.execute(statement.order_by(models.Company.name)).scalars().all()


def search_talent_network_candidates(
    db: Session,
    query: str = "",
    status_filter: models.CandidateProfileStatus | None = models.CandidateProfileStatus.OPTED_IN,
) -> List[models.Candidate]:
    talent_network = get_company_by_slug(db, "talent-network")
    if not talent_network:
        return []

    statement = select(models.Candidate).where(models.Candidate.owner_company_id == talent_network.id)
    if status_filter is not None:
        statement = statement.where(models.Candidate.profile_status == status_filter)
    if query:
        pattern = f"%{query}%"
        statement = statement.where(
            models.Candidate.name.ilike(pattern)
            | models.Candidate.email.ilike(pattern)
            | models.Candidate.phone.ilike(pattern)
            | models.Candidate.location.ilike(pattern)
            | models.Candidate.searchable_title.ilike(pattern)
        )
    return db.execute(
        statement.order_by(models.Candidate.updated_at.desc(), models.Candidate.created_at.desc())
    ).scalars().all()


def create_user(db: Session, user_in: UserCreate, hashed_password: str, company_id: int | None = None) -> models.User:
    primary_role = models.UserRole(user_in.role.value)
    db_user = models.User(
        company_id=company_id,
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_password,
        role=primary_role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    assigned_roles = [models.UserRole(role.value) for role in user_in.roles] if user_in.roles else [primary_role]
    return set_user_roles(db, db_user, assigned_roles, primary_role=primary_role)


def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.execute(select(models.User).where(models.User.email == email)).scalar_one_or_none()


def get_user(db: Session, user_id: int) -> models.User | None:
    return db.get(models.User, user_id)


def create_password_reset_token(
    db: Session,
    user: models.User,
    token_hash: str,
    expires_at: datetime,
) -> models.PasswordResetToken:
    reset_token = models.PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def get_password_reset_token(db: Session, token_hash: str) -> models.PasswordResetToken | None:
    return db.execute(
        select(models.PasswordResetToken).where(models.PasswordResetToken.token_hash == token_hash)
    ).scalar_one_or_none()


def mark_password_reset_token_used(
    db: Session,
    reset_token: models.PasswordResetToken,
) -> models.PasswordResetToken:
    reset_token.used_at = datetime.utcnow()
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)
    return reset_token


def create_employer_invitation(
    db: Session,
    *,
    company_id: int,
    invited_by_user_id: int | None,
    email: str,
    role: models.UserRole,
    roles: list[models.UserRole] | None = None,
    token_hash: str,
    expires_at: datetime,
) -> models.EmployerInvitation:
    invitation = models.EmployerInvitation(
        company_id=company_id,
        invited_by_user_id=invited_by_user_id,
        email=email,
        role=role,
        roles=[assigned_role.value for assigned_role in roles] if roles else None,
        token_hash=token_hash,
        expires_at=expires_at,
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def get_employer_invitation_by_token_hash(
    db: Session,
    token_hash: str,
) -> models.EmployerInvitation | None:
    return db.execute(
        select(models.EmployerInvitation).where(models.EmployerInvitation.token_hash == token_hash)
    ).scalar_one_or_none()


def list_company_invitations(db: Session, company_id: int) -> list[models.EmployerInvitation]:
    return (
        db.execute(
            select(models.EmployerInvitation)
            .where(models.EmployerInvitation.company_id == company_id)
            .order_by(models.EmployerInvitation.created_at.desc())
        )
        .scalars()
        .all()
    )


def mark_employer_invitation_accepted(
    db: Session,
    invitation: models.EmployerInvitation,
) -> models.EmployerInvitation:
    invitation.accepted_at = datetime.utcnow()
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation


def create_workspace_activity_event(
    db: Session,
    *,
    company_id: int,
    actor_user: models.User | None = None,
    actor_user_id: int | None = None,
    actor_name_snapshot: str | None = None,
    actor_email_snapshot: str | None = None,
    event_type: str,
    entity_type: str | None = None,
    entity_id: int | None = None,
    entity_label: str | None = None,
    summary: str,
    metadata_json: dict | None = None,
) -> models.WorkspaceActivityEvent:
    event = models.WorkspaceActivityEvent(
        company_id=company_id,
        actor_user_id=actor_user.id if actor_user else actor_user_id,
        actor_name_snapshot=actor_user.name if actor_user else actor_name_snapshot,
        actor_email_snapshot=actor_user.email if actor_user else actor_email_snapshot,
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_label=entity_label,
        summary=summary,
        metadata_json=metadata_json or {},
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def list_workspace_activity_events(
    db: Session,
    company_id: int,
    *,
    limit: int = 5,
    offset: int = 0,
) -> list[models.WorkspaceActivityEvent]:
    return (
        db.execute(
            select(models.WorkspaceActivityEvent)
            .where(models.WorkspaceActivityEvent.company_id == company_id)
            .order_by(models.WorkspaceActivityEvent.created_at.desc(), models.WorkspaceActivityEvent.id.desc())
            .limit(limit)
            .offset(offset)
        )
        .scalars()
        .all()
    )


def update_user_password(db: Session, user: models.User, hashed_password: str) -> models.User:
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_roles(user: models.User) -> list[models.UserRole]:
    return list(user.roles)


def user_has_role(user: models.User, role: models.UserRole) -> bool:
    return role in get_user_roles(user)


def user_has_any_role(user: models.User, roles: set[models.UserRole]) -> bool:
    return bool(set(get_user_roles(user)) & roles)


def set_user_roles(
    db: Session,
    user: models.User,
    roles: list[models.UserRole],
    primary_role: models.UserRole | None = None,
) -> models.User:
    unique_roles = []
    for role in roles:
        if role not in unique_roles:
            unique_roles.append(role)
    if primary_role and primary_role not in unique_roles:
        unique_roles.insert(0, primary_role)
    if not unique_roles:
        unique_roles = [user.role]
    user.role = primary_role or unique_roles[0]
    db.query(models.UserRoleAssignment).filter(
        models.UserRoleAssignment.user_id == user.id,
    ).delete(synchronize_session=False)
    for role in unique_roles:
        db.add(models.UserRoleAssignment(user_id=user.id, role=role))
    db.add(user)
    db.commit()
    db.refresh(user)
    db.expire(user, ["role_assignments"])
    return user


def count_users_by_role(db: Session, role: models.UserRole) -> int:
    return len(db.execute(select(models.User).where(models.User.role == role)).scalars().all())


def create_usage_stat(
    db: Session,
    *,
    event_type: str,
    company_id: int | None = None,
    user_id: int | None = None,
    session_id: str | None = None,
    visitor_id: str | None = None,
    role: str | None = None,
    market: str | None = None,
    locale: str | None = None,
    host: str | None = None,
    ip_address: str | None = None,
    path: str | None = None,
    result_score: float | None = None,
    metadata_json: dict | None = None,
) -> models.UsageStat:
    event = models.UsageStat(
        company_id=company_id,
        user_id=user_id,
        session_id=session_id,
        visitor_id=visitor_id,
        role=role,
        market=market,
        locale=locale,
        host=host,
        ip_address=ip_address,
        event_type=event_type,
        path=path,
        result_score=result_score,
        metadata_json=metadata_json or {},
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


FREE_SERVICE_EVENT_TYPES = {
    "free_analysis_started",
    "free_analysis_completed",
    "hm_resume_analysis_completed",
    "hm_interview_guide_generated",
    "talent_network_opt_in",
}


FREE_SERVICE_LABELS = {
    "page_view": "Page visit",
    "free_analysis_started": "Free resume/JD analysis",
    "free_analysis_completed": "Free resume/JD analysis",
    "hm_resume_analysis_completed": "Hiring Manager free analysis",
    "hm_interview_guide_generated": "Hiring Manager question generator",
    "talent_network_opt_in": "Talent Network opt-in",
}


INTERNAL_EMAIL_DOMAIN = "@jetta.com"
INTERNAL_IP_ADDRESSES = {"173.72.11.225"}
INTERNAL_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("::1/128"),
]


def _is_internal_email(email: str | None) -> bool:
    return bool(email and email.lower().endswith(INTERNAL_EMAIL_DOMAIN))


def _is_internal_ip(ip_address: str | None) -> bool:
    if not ip_address:
        return False
    candidate = ip_address.split(",")[0].strip()
    if candidate in INTERNAL_IP_ADDRESSES:
        return True
    try:
        parsed_ip = ipaddress.ip_address(candidate)
    except ValueError:
        return False
    return parsed_ip.is_private or parsed_ip.is_loopback or any(
        parsed_ip in network for network in INTERNAL_IP_NETWORKS
    )


def _is_internal_usage(event: models.UsageStat, user: models.User | None = None) -> bool:
    return _is_internal_email(user.email if user else None) or _is_internal_ip(event.ip_address)


def _get_platform_usage_actors(
    db: Session,
    period_days: int | None = None,
    *,
    free_service_only: bool,
) -> dict:
    cutoff = datetime.utcnow() - timedelta(days=period_days) if period_days else None
    statement = select(models.UsageStat)
    if free_service_only:
        statement = statement.where(
            (models.UsageStat.event_type.in_(FREE_SERVICE_EVENT_TYPES))
            | (
                (models.UsageStat.event_type == "page_view")
                & (models.UsageStat.path.in_(["/free-analysis"]))
            )
        )
    if cutoff is not None:
        statement = statement.where(models.UsageStat.created_at >= cutoff)

    events = db.execute(statement.order_by(models.UsageStat.created_at.asc())).scalars().all()
    grouped: dict[str, dict] = {}

    def key_for(event: models.UsageStat) -> str:
        if event.user_id is not None:
            return f"user:{event.user_id}"
        if event.visitor_id:
            return f"visitor:{event.visitor_id}"
        if event.session_id:
            return f"session:{event.session_id}"
        return f"event:{event.id}"

    for event in events:
        actor_key = key_for(event)
        row = grouped.setdefault(
            actor_key,
            {
                "actor_key": actor_key,
                "user_id": event.user_id,
                "name": None,
                "email": None,
                "role": event.role,
                "company_name": None,
                "organization_type": None,
                "visitor_id": event.visitor_id,
                "session_id": event.session_id,
                "host": event.host,
                "ip_address": event.ip_address,
                "is_internal": _is_internal_usage(event),
                "traffic_source": "internal" if _is_internal_usage(event) else "external",
                "internal_reason": "Internal IP" if _is_internal_ip(event.ip_address) else None,
                "market": event.market,
                "locale": event.locale,
                "first_seen_at": event.created_at,
                "last_seen_at": event.created_at,
                "event_count": 0,
                "services": set(),
                "last_path": event.path,
            },
        )
        row["event_count"] += 1
        row["last_seen_at"] = max(row["last_seen_at"], event.created_at)
        row["last_path"] = event.path or row["last_path"]
        row["role"] = row["role"] or event.role
        row["host"] = event.host or row["host"]
        row["ip_address"] = event.ip_address or row["ip_address"]
        if _is_internal_ip(event.ip_address):
            row["is_internal"] = True
            row["traffic_source"] = "internal"
            row["internal_reason"] = "Internal IP"
        row["market"] = event.market or row["market"]
        row["locale"] = event.locale or row["locale"]
        if event.visitor_id:
            row["visitor_id"] = event.visitor_id
        if event.session_id:
            row["session_id"] = event.session_id
        activity = FREE_SERVICE_LABELS.get(event.event_type, event.event_type.replace("_", " ").title())
        if event.path and activity == "Page visit":
            activity = f"Page visit: {event.path}"
        row["services"].add(activity)

    user_ids = [row["user_id"] for row in grouped.values() if row["user_id"] is not None]
    users_by_id = {
        user.id: user
        for user in db.execute(select(models.User).where(models.User.id.in_(user_ids))).scalars().all()
    } if user_ids else {}

    serialized = []
    for row in grouped.values():
        user = users_by_id.get(row["user_id"])
        if user:
            row["name"] = user.name
            row["email"] = user.email
            row["role"] = user.role.value
            row["company_name"] = user.company_name
            row["organization_type"] = user.organization_type.value if user.organization_type else None
            if _is_internal_email(user.email):
                row["is_internal"] = True
                row["traffic_source"] = "internal"
                row["internal_reason"] = "Jetta email"
        if not row["is_internal"]:
            row["traffic_source"] = "external"
        row["services"] = sorted(row["services"])
        serialized.append(row)

    serialized.sort(key=lambda item: item["last_seen_at"], reverse=True)
    internal_users = sum(1 for row in serialized if row["is_internal"])
    external_users = len(serialized) - internal_users
    return {
        "period_days": period_days,
        "total_users": len(serialized),
        "registered_users": sum(1 for row in serialized if row["user_id"] is not None),
        "anonymous_visitors": sum(1 for row in serialized if row["user_id"] is None),
        "internal_users": internal_users,
        "external_users": external_users,
        "external_registered_users": sum(
            1 for row in serialized if not row["is_internal"] and row["user_id"] is not None
        ),
        "external_anonymous_visitors": sum(
            1 for row in serialized if not row["is_internal"] and row["user_id"] is None
        ),
        "users": serialized,
    }


def get_platform_free_service_users(db: Session, period_days: int | None = None) -> dict:
    return _get_platform_usage_actors(db, period_days, free_service_only=True)


def get_platform_site_visitors(db: Session, period_days: int | None = None) -> dict:
    return _get_platform_usage_actors(db, period_days, free_service_only=False)


def get_platform_performance(db: Session, period_days: int | None = None) -> dict:
    now = datetime.utcnow()
    cutoff = now - timedelta(days=period_days) if period_days else None
    today_label = now.strftime("%Y-%m-%d")
    month_label = now.strftime("%Y-%m")

    event_statement = select(models.UsageStat)
    if cutoff is not None:
        event_statement = event_statement.where(models.UsageStat.created_at >= cutoff)
    events = db.execute(event_statement).scalars().all()
    event_user_ids = sorted({event.user_id for event in events if event.user_id is not None})
    event_users_by_id = {
        user.id: user
        for user in db.execute(select(models.User).where(models.User.id.in_(event_user_ids))).scalars().all()
    } if event_user_ids else {}

    daily: dict[str, dict] = defaultdict(
        lambda: {
            "visitors": set(),
            "applicant_active": set(),
            "hiring_manager_active": set(),
            "free_analysis": 0,
            "hm_activity": 0,
        }
    )
    monthly: dict[str, dict] = defaultdict(
        lambda: {
            "visitors": set(),
            "applicant_active": set(),
            "hiring_manager_active": set(),
            "free_analysis": 0,
            "hm_activity": 0,
        }
    )
    visitors = set()
    applicant_active = set()
    hiring_manager_active = set()
    today_applicants = set()
    month_applicants = set()
    today_hiring_managers = set()
    month_hiring_managers = set()
    path_counts: dict[str, int] = defaultdict(int)
    market_visitors: dict[str, set] = defaultdict(set)
    locale_visitors: dict[str, set] = defaultdict(set)
    page_views = 0
    applicant_events = 0
    hiring_manager_events = 0
    free_analysis_volume = 0
    extraction_attempts = 0
    extraction_successes = 0
    match_scores: list[float] = []
    external_visitors = set()
    internal_visitors = set()
    today_external_visitors = set()
    today_external_registered_users = set()
    today_external_applicants = set()
    today_external_hiring_managers = set()
    today_internal_events = 0

    def actor_key(event: models.UsageStat) -> str | None:
        if event.user_id is not None:
            return f"user:{event.user_id}"
        if event.visitor_id:
            return f"visitor:{event.visitor_id}"
        if event.session_id:
            return f"session:{event.session_id}"
        return None

    def is_applicant_event(event: models.UsageStat) -> bool:
        role = str(event.role or "")
        path = event.path or ""
        event_type = event.event_type
        return (
            role == models.UserRole.APPLICANT.value
            or event_type.startswith("applicant_")
            or event_type in {"free_analysis_started", "free_analysis_completed", "talent_network_opt_in"}
            or path.startswith("/applicant")
            or path.startswith("/free-analysis")
        )

    def is_hiring_manager_event(event: models.UsageStat) -> bool:
        role = str(event.role or "")
        path = event.path or ""
        event_type = event.event_type
        return (
            role == models.UserRole.HIRING_MANAGER.value
            or event_type.startswith("hm_")
            or event_type.startswith("hiring_manager_")
            or path.startswith("/hiring_manager")
            or path.startswith("/interviews")
        )

    for event in events:
        day = event.created_at.strftime("%Y-%m-%d")
        month = event.created_at.strftime("%Y-%m")
        key = actor_key(event)
        user = event_users_by_id.get(event.user_id)
        is_internal = _is_internal_usage(event, user)
        if key:
            visitors.add(key)
            if is_internal:
                internal_visitors.add(key)
            else:
                external_visitors.add(key)
                if day == today_label:
                    today_external_visitors.add(key)
                    if event.user_id is not None:
                        today_external_registered_users.add(key)
            daily[day]["visitors"].add(key)
            monthly[month]["visitors"].add(key)
            market_visitors[event.market or "unknown"].add(key)
            locale_visitors[event.locale or "unknown"].add(key)
        if is_internal and day == today_label:
            today_internal_events += 1

        if event.path:
            path_counts[event.path] += 1
        if event.event_type == "page_view":
            page_views += 1
        if is_applicant_event(event):
            applicant_events += 1
            if key:
                applicant_active.add(key)
                daily[day]["applicant_active"].add(key)
                monthly[month]["applicant_active"].add(key)
                if day == today_label:
                    today_applicants.add(key)
                    if not is_internal:
                        today_external_applicants.add(key)
                if month == month_label:
                    month_applicants.add(key)
        if is_hiring_manager_event(event):
            hiring_manager_events += 1
            if key:
                hiring_manager_active.add(key)
                daily[day]["hiring_manager_active"].add(key)
                monthly[month]["hiring_manager_active"].add(key)
                if day == today_label:
                    today_hiring_managers.add(key)
                    if not is_internal:
                        today_external_hiring_managers.add(key)
                if month == month_label:
                    month_hiring_managers.add(key)
            daily[day]["hm_activity"] += 1
            monthly[month]["hm_activity"] += 1

        if event.event_type in {"free_analysis_started", "free_analysis_completed"}:
            free_analysis_volume += 1
            daily[day]["free_analysis"] += 1
            monthly[month]["free_analysis"] += 1
        if event.event_type in {"free_analysis_completed", "resume_parse_success", "resume_parse_failure"}:
            extraction_attempts += 1
        if event.event_type in {"free_analysis_completed", "resume_parse_success"}:
            extraction_successes += 1
        if event.result_score is not None:
            match_scores.append(float(event.result_score))

    user_statement = select(models.User)
    if cutoff is not None:
        user_statement = user_statement.where(models.User.created_at >= cutoff)
    users = db.execute(user_statement).scalars().all()
    new_applicant_accounts = sum(1 for user in users if user.role == models.UserRole.APPLICANT)

    all_hiring_manager_accounts = db.execute(
        select(models.User).where(models.User.role == models.UserRole.HIRING_MANAGER)
    ).scalars().all()

    candidates = db.execute(select(models.Candidate)).scalars().all()
    opted_in_candidates = [candidate for candidate in candidates if candidate.consent_talent_network]
    completed_dossiers = [
        candidate
        for candidate in opted_in_candidates
        if candidate.parsed_profile_json
        and (candidate.searchable_title or candidate.searchable_skills)
    ]

    final_applications = db.execute(
        select(models.Application)
        .join(models.Job)
        .where(
            models.Application.status.in_([models.ApplicationStatus.HIRED, models.ApplicationStatus.REJECTED]),
            models.Application.hr_final_decided_at.is_not(None),
        )
    ).scalars().all()
    if cutoff is not None:
        final_applications = [
            application
            for application in final_applications
            if application.hr_final_decided_at and application.hr_final_decided_at >= cutoff
        ]

    verdict_hours = [
        (application.hr_final_decided_at - application.job.created_at).total_seconds() / 3600
        for application in final_applications
        if application.hr_final_decided_at and application.job and application.job.created_at
    ]

    def serialize_series(series: dict[str, dict]) -> list[dict]:
        return [
            {
                "label": label,
                "visitors": len(row["visitors"]),
                "applicant_active": len(row["applicant_active"]),
                "hiring_manager_active": len(row["hiring_manager_active"]),
                "free_analysis": row["free_analysis"],
                "hm_activity": row["hm_activity"],
            }
            for label, row in sorted(series.items())
        ]

    top_paths = [
        {"path": path, "count": count}
        for path, count in sorted(path_counts.items(), key=lambda item: item[1], reverse=True)[:8]
    ]

    return {
        "period_days": period_days,
        "total_visitors": len(visitors),
        "external_visitors": len(external_visitors),
        "internal_visitors": len(internal_visitors),
        "total_page_views": page_views,
        "total_applicant_events": applicant_events,
        "total_hiring_manager_events": hiring_manager_events,
        "daily_active_applicants": len(today_applicants),
        "monthly_active_applicants": len(month_applicants),
        "daily_active_hiring_managers": len(today_hiring_managers),
        "monthly_active_hiring_managers": len(month_hiring_managers),
        "external_visitors_today": len(today_external_visitors),
        "external_registered_users_today": len(today_external_registered_users),
        "external_applicants_today": len(today_external_applicants),
        "external_hiring_managers_today": len(today_external_hiring_managers),
        "internal_events_today": today_internal_events,
        "new_applicant_accounts": new_applicant_accounts,
        "total_hiring_manager_accounts": len(all_hiring_manager_accounts),
        "free_analysis_volume": free_analysis_volume,
        "extraction_success_rate": round((extraction_successes / extraction_attempts) * 100, 1) if extraction_attempts else 0,
        "global_average_match_score": round(sum(match_scores) / len(match_scores), 1) if match_scores else None,
        "talent_network_opt_in_rate": round((len(opted_in_candidates) / len(candidates)) * 100, 1) if candidates else 0,
        "dossier_completion_rate": round((len(completed_dossiers) / len(opted_in_candidates)) * 100, 1) if opted_in_candidates else 0,
        "final_verdict_volume": len(final_applications),
        "average_final_verdict_hours": round(sum(verdict_hours) / len(verdict_hours), 1) if verdict_hours else None,
        "cold_start_events": free_analysis_volume + page_views,
        "warm_start_events": len(applicant_active) + len(hiring_manager_active) + len(opted_in_candidates),
        "visitors_by_market": [
            {"market": market, "visitors": len(keys)}
            for market, keys in sorted(market_visitors.items())
        ],
        "visitors_by_locale": [
            {"locale": locale, "visitors": len(keys)}
            for locale, keys in sorted(locale_visitors.items())
        ],
        "daily": serialize_series(daily),
        "monthly": serialize_series(monthly),
        "top_paths": top_paths,
    }


def create_candidate(
    db: Session,
    owner_company_id: int,
    candidate_in: CandidateCreate,
    applicant_user_id: int | None = None,
    created_by_user_id: int | None = None,
) -> models.Candidate:
    candidate = models.Candidate(
        owner_company_id=owner_company_id,
        applicant_user_id=applicant_user_id,
        created_by_user_id=created_by_user_id,
        imported_for_job_id=candidate_in.imported_for_job_id,
        name=candidate_in.name,
        email=str(candidate_in.email),
        phone=candidate_in.phone,
        location=candidate_in.location,
        notes=candidate_in.notes,
        resume_file_url=candidate_in.resume_file_url,
        resume_text=candidate_in.resume_text,
        parsed_profile_json=candidate_in.parsed_profile_json,
        consent_talent_network=candidate_in.consent_talent_network,
        profile_status=models.CandidateProfileStatus(candidate_in.profile_status.value),
        searchable_title=candidate_in.searchable_title,
        searchable_skills=candidate_in.searchable_skills,
        last_ai_score=candidate_in.last_ai_score,
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_candidate(db: Session, owner_company_id: int, candidate_id: int) -> models.Candidate | None:
    return db.execute(
        select(models.Candidate).where(
            models.Candidate.owner_company_id == owner_company_id,
            models.Candidate.id == candidate_id,
        )
    ).scalar_one_or_none()


def get_candidate_for_applicant(
    db: Session,
    owner_company_id: int,
    applicant_user_id: int,
) -> models.Candidate | None:
    return db.execute(
        select(models.Candidate).where(
            models.Candidate.owner_company_id == owner_company_id,
            models.Candidate.applicant_user_id == applicant_user_id,
        )
    ).scalar_one_or_none()


def get_candidate_by_email(
    db: Session,
    owner_company_id: int,
    email: str,
) -> models.Candidate | None:
    return db.execute(
        select(models.Candidate).where(
            models.Candidate.owner_company_id == owner_company_id,
            models.Candidate.email == email,
        )
    ).scalar_one_or_none()


def get_latest_resume_candidate_for_applicant(
    db: Session,
    applicant_user_id: int,
    exclude_owner_company_id: int | None = None,
) -> models.Candidate | None:
    statement = select(models.Candidate).where(
        models.Candidate.applicant_user_id == applicant_user_id,
        models.Candidate.resume_text.is_not(None),
        models.Candidate.resume_text != "",
    )
    if exclude_owner_company_id is not None:
        statement = statement.where(models.Candidate.owner_company_id != exclude_owner_company_id)
    return db.execute(
        statement.order_by(models.Candidate.updated_at.desc(), models.Candidate.created_at.desc())
    ).scalars().first()


def get_or_create_candidate_for_applicant(
    db: Session,
    owner_company_id: int,
    applicant: models.User,
    resume_path: str | None = None,
    resume_text: str | None = None,
) -> models.Candidate:
    candidate = get_candidate_for_applicant(db, owner_company_id, applicant.id)
    if candidate is None:
        candidate = models.Candidate(
            owner_company_id=owner_company_id,
            applicant_user_id=applicant.id,
            created_by_user_id=applicant.id,
            name=applicant.name,
            email=applicant.email,
            resume_file_url=resume_path,
            resume_text=resume_text,
        )
    else:
        candidate.name = applicant.name
        candidate.email = applicant.email
        if resume_path is not None:
            candidate.resume_file_url = resume_path
        if resume_text is not None:
            candidate.resume_text = resume_text
        if candidate.consent_talent_network:
            candidate.profile_status = models.CandidateProfileStatus.OPTED_IN
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_candidates_for_company(db: Session, owner_company_id: int) -> List[models.Candidate]:
    return db.execute(
        select(models.Candidate)
        .where(models.Candidate.owner_company_id == owner_company_id)
        .order_by(models.Candidate.updated_at.desc(), models.Candidate.created_at.desc())
    ).scalars().all()


def update_candidate(
    db: Session,
    candidate: models.Candidate,
    candidate_in: CandidateUpdate,
) -> models.Candidate:
    payload = candidate_in.model_dump(exclude_unset=True)
    if "email" in payload and payload["email"] is not None:
        payload["email"] = str(payload["email"])
    if "profile_status" in payload and payload["profile_status"] is not None:
        payload["profile_status"] = models.CandidateProfileStatus(payload["profile_status"])
    if payload.get("consent_talent_network") is True and "profile_status" not in payload:
        payload["profile_status"] = models.CandidateProfileStatus.OPTED_IN
    for field, value in payload.items():
        setattr(candidate, field, value)
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def update_candidate_resume(
    db: Session,
    candidate: models.Candidate,
    resume_file_url: str,
    resume_text: str,
) -> models.Candidate:
    candidate.resume_file_url = resume_file_url
    candidate.resume_text = resume_text
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_company_users(db: Session, company_id: int) -> List[models.User]:
    return db.execute(
        select(models.User)
        .where(models.User.company_id == company_id)
        .order_by(models.User.role, models.User.name)
    ).scalars().all()


def get_company_user(db: Session, company_id: int, user_id: int) -> models.User | None:
    return db.execute(
        select(models.User).where(models.User.company_id == company_id, models.User.id == user_id)
    ).scalar_one_or_none()


def update_user(
    db: Session,
    user: models.User,
    name: str | None = None,
    email: str | None = None,
    hashed_password: str | None = None,
    role: models.UserRole | None = None,
    roles: list[models.UserRole] | None = None,
) -> models.User:
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email
    if hashed_password is not None:
        user.hashed_password = hashed_password
    if role is not None:
        user.role = role
    db.add(user)
    db.commit()
    db.refresh(user)
    if roles is not None:
        return set_user_roles(db, user, roles, primary_role=role or user.role)
    return user


def create_job(db: Session, job_in: JobCreate, job_url: str, hr_id: int) -> models.Job:
    hr = get_user(db, hr_id)
    job = models.Job(
        company_id=hr.company_id if hr else None,
        client_company_id=job_in.client_company_id,
        hr_id=hr_id,
        assigned_recruiter_id=job_in.assigned_recruiter_id,
        hiring_manager_id=job_in.hiring_manager_id,
        title=job_in.title,
        position=job_in.position,
        description=job_in.description,
        salary_range=job_in.salary_range,
        department=job_in.department,
        employment_type=job_in.employment_type,
        work_mode=job_in.work_mode,
        location=job_in.location,
        job_level=job_in.job_level,
        number_openings=job_in.number_openings,
        required_skills=job_in.required_skills,
        target_start_date=job_in.target_start_date,
        application_deadline=job_in.application_deadline,
        job_url=job_url,
        status=models.JobStatus(job_in.status.value),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def update_job(db: Session, job: models.Job, job_in: JobUpdate) -> models.Job:
    update_data = job_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "status" and value is not None:
            setattr(job, field, models.JobStatus(value.value))
        else:
            setattr(job, field, value)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


def create_client_company(
    db: Session,
    agency_company_id: int,
    client_in: ClientCompanyCreate,
) -> models.ClientCompany:
    client = models.ClientCompany(
        agency_company_id=agency_company_id,
        company_name=client_in.company_name,
        industry=client_in.industry,
        website=client_in.website,
        contact_name=client_in.contact_name,
        contact_email=str(client_in.contact_email) if client_in.contact_email else None,
        contact_phone=client_in.contact_phone,
        notes=client_in.notes,
        status=client_in.status,
    )
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def get_client_company(db: Session, agency_company_id: int, client_company_id: int) -> models.ClientCompany | None:
    return db.execute(
        select(models.ClientCompany).where(
            models.ClientCompany.agency_company_id == agency_company_id,
            models.ClientCompany.id == client_company_id,
        )
    ).scalar_one_or_none()


def get_client_companies(db: Session, agency_company_id: int) -> List[models.ClientCompany]:
    return db.execute(
        select(models.ClientCompany)
        .where(models.ClientCompany.agency_company_id == agency_company_id)
        .order_by(models.ClientCompany.company_name)
    ).scalars().all()


def update_client_company(
    db: Session,
    client: models.ClientCompany,
    client_in: ClientCompanyUpdate,
) -> models.ClientCompany:
    payload = client_in.model_dump(exclude_unset=True)
    if "contact_email" in payload and payload["contact_email"] is not None:
        payload["contact_email"] = str(payload["contact_email"])
    for field, value in payload.items():
        setattr(client, field, value)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client


def delete_client_company(db: Session, client: models.ClientCompany) -> None:
    db.delete(client)
    db.commit()


def create_questions(db: Session, job: models.Job, questions: List[dict]) -> List[models.Question]:
    items = []
    for question in questions:
        item = models.Question(job_id=job.id, text=question["text"], category=question["category"])
        db.add(item)
        items.append(item)
    db.commit()
    for item in items:
        db.refresh(item)
    return items


def get_job_by_url(db: Session, job_url: str) -> models.Job | None:
    return db.execute(select(models.Job).where(models.Job.job_url == job_url)).scalar_one_or_none()


def get_job(db: Session, job_id: int) -> models.Job | None:
    return db.get(models.Job, job_id)


def get_jobs_for_hr(db: Session, hr_id: int) -> List[models.Job]:
    return db.execute(
        select(models.Job)
        .where(models.Job.hr_id == hr_id)
        .order_by(models.Job.created_at.desc())
    ).scalars().all()


def search_jobs(
    db: Session,
    company_id: int | None = None,
    keyword: str = "",
    status: models.JobStatus | None = None,
) -> List[models.Job]:
    statement = select(models.Job)
    if company_id is not None:
        statement = statement.where(models.Job.company_id == company_id)
    if status is not None:
        statement = statement.where(models.Job.status == status)
    if keyword:
        pattern = f"%{keyword}%"
        statement = statement.where(
            models.Job.title.ilike(pattern)
            | models.Job.position.ilike(pattern)
            | models.Job.description.ilike(pattern)
        )
    return db.execute(statement.order_by(models.Job.created_at.desc())).scalars().all()


def get_questions_for_job(db: Session, job_id: int) -> List[models.Question]:
    return db.execute(select(models.Question).where(models.Question.job_id == job_id)).scalars().all()


def create_application(
    db: Session,
    application_in: ApplicationCreate,
    resume_path: str,
    matching_score: float | None,
    answer_score: float | None,
    resume_comment: str | None,
    answer_comment: str | None,
    applicant_id: int | None,
    candidate_id: int | None = None,
) -> models.Application:
    application = models.Application(
        job_id=application_in.job_id,
        applicant_id=applicant_id,
        candidate_id=candidate_id or application_in.candidate_id,
        source=models.ApplicationSource.DIRECT_APPLY,
        resume_path=resume_path,
        matching_score=matching_score,
        answer_score=answer_score,
        resume_comment=resume_comment,
        answer_comment=answer_comment,
        status=models.ApplicationStatus.SUBMITTED,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application_for_candidate_job(
    db: Session,
    candidate_id: int,
    job_id: int,
) -> models.Application | None:
    return db.execute(
        select(models.Application).where(
            models.Application.candidate_id == candidate_id,
            models.Application.job_id == job_id,
        )
    ).scalar_one_or_none()


def create_candidate_application(
    db: Session,
    candidate: models.Candidate,
    job: models.Job,
    resume_path: str,
    matching_score: float | None,
    resume_comment: str | None,
    matched_by_user_id: int | None = None,
) -> models.Application:
    is_talent_network_candidate = (
        candidate.consent_talent_network
        and candidate.owner_company is not None
        and candidate.owner_company.slug == "talent-network"
    )
    application = models.Application(
        job_id=job.id,
        candidate_id=candidate.id,
        applicant_id=candidate.applicant_user_id,
        matched_by_user_id=matched_by_user_id,
        source=(
            models.ApplicationSource.TALENT_NETWORK
            if is_talent_network_candidate
            else models.ApplicationSource.RECRUITER_SUBMIT
        ),
        resume_path=resume_path,
        matching_score=matching_score,
        answer_score=None,
        resume_comment=resume_comment,
        answer_comment=(
            "No standardized answer assessment has been submitted for this Talent Network match."
            if is_talent_network_candidate
            else "No standardized answer assessment has been submitted for this recruiter-created match."
        ),
        status=models.ApplicationStatus.SUBMITTED,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def create_answers(db: Session, application: models.Application, answer_list: List[AnswerCreate]) -> List[models.Answer]:
    answers = []
    for item in answer_list:
        answer = models.Answer(
            application_id=application.id,
            question_id=item.question_id,
            answer_text=item.answer_text,
            score=item.score,
        )
        db.add(answer)
        answers.append(answer)
    db.commit()
    for answer in answers:
        db.refresh(answer)
    return answers


def get_applications_for_job(db: Session, job_id: int) -> List[models.Application]:
    return db.execute(
        select(models.Application)
        .where(models.Application.job_id == job_id)
        .order_by(models.Application.created_at.desc(), models.Application.id.desc())
    ).scalars().all()


def get_applications_for_company(db: Session, company_id: int) -> List[models.Application]:
    return db.execute(
        select(models.Application)
        .join(models.Job)
        .where(models.Job.company_id == company_id)
        .order_by(models.Application.created_at.desc(), models.Application.id.desc())
    ).scalars().all()


def get_applications_for_candidate(
    db: Session,
    company_id: int,
    candidate_id: int,
) -> List[models.Application]:
    return db.execute(
        select(models.Application)
        .join(models.Job)
        .where(
            models.Job.company_id == company_id,
            models.Application.candidate_id == candidate_id,
        )
        .order_by(models.Application.created_at.desc(), models.Application.id.desc())
    ).scalars().all()


def get_applications_for_hr(db: Session, hr_id: int) -> List[models.Application]:
    return db.execute(
        select(models.Application)
        .join(models.Job)
        .where(models.Job.hr_id == hr_id)
        .order_by(models.Application.created_at.desc(), models.Application.id.desc())
    ).scalars().all()


def update_application_scores(
    db: Session,
    application: models.Application,
    matching_score: float | None,
    answer_score: float | None,
    resume_comment: str | None = None,
    answer_comment: str | None = None,
) -> models.Application:
    application.matching_score = matching_score
    application.answer_score = answer_score
    if resume_comment is not None:
        application.resume_comment = resume_comment
    if answer_comment is not None:
        application.answer_comment = answer_comment
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def get_application(db: Session, application_id: int) -> models.Application | None:
    return db.get(models.Application, application_id)


def create_candidate_submission(
    db: Session,
    application: models.Application,
    submitted_by_user_id: int | None,
    submission_in: CandidateSubmissionCreate,
) -> models.CandidateSubmission:
    submission = models.CandidateSubmission(
        application_id=application.id,
        submitted_by_user_id=submitted_by_user_id,
        submitted_to_name=submission_in.submitted_to_name,
        submitted_to_email=str(submission_in.submitted_to_email),
        submission_status=submission_in.submission_status,
        client_feedback=submission_in.client_feedback,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def get_submission(db: Session, submission_id: int) -> models.CandidateSubmission | None:
    return db.get(models.CandidateSubmission, submission_id)


def get_submissions_for_company(db: Session, company_id: int) -> List[models.CandidateSubmission]:
    return db.execute(
        select(models.CandidateSubmission)
        .join(models.Application)
        .join(models.Job)
        .where(models.Job.company_id == company_id)
        .order_by(models.CandidateSubmission.submitted_at.desc(), models.CandidateSubmission.id.desc())
    ).scalars().all()


def get_recruiter_performance(
    db: Session,
    company_id: int,
    period_days: int | None = None,
) -> dict:
    cutoff = datetime.utcnow() - timedelta(days=period_days) if period_days else None
    tracked_roles = [
        models.UserRole.COMPANY_ADMIN,
        models.UserRole.HR,
        models.UserRole.RECRUITER,
    ]
    users = db.execute(
        select(models.User)
        .where(models.User.company_id == company_id, models.User.role.in_(tracked_roles))
        .order_by(models.User.role, models.User.name)
    ).scalars().all()

    stats: dict[int, dict] = {
        user.id: {
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "candidates_added": 0,
            "matches_created": 0,
            "submissions_sent": 0,
            "pending_submissions": 0,
            "reviewed_submissions": 0,
            "accepted_submissions": 0,
            "rejected_submissions": 0,
            "last_candidate_created_at": None,
            "last_match_created_at": None,
            "last_submission_at": None,
        }
        for user in users
    }

    def ensure_user(user: models.User | None, fallback_id: int | None = None) -> dict | None:
        if user is None and fallback_id is None:
            return None
        user_id = user.id if user else fallback_id
        if user_id is None:
            return None
        if user_id not in stats:
            stats[user_id] = {
                "user_id": user_id,
                "name": user.name if user else "Former user",
                "email": user.email if user else "former.user@example.com",
                "role": user.role if user else models.UserRole.RECRUITER,
                "candidates_added": 0,
                "matches_created": 0,
                "submissions_sent": 0,
                "pending_submissions": 0,
                "reviewed_submissions": 0,
                "accepted_submissions": 0,
                "rejected_submissions": 0,
                "last_candidate_created_at": None,
                "last_match_created_at": None,
                "last_submission_at": None,
            }
        return stats[user_id]

    candidates_statement = select(models.Candidate).where(
        models.Candidate.owner_company_id == company_id,
        models.Candidate.created_by_user_id.is_not(None),
    )
    if cutoff is not None:
        candidates_statement = candidates_statement.where(models.Candidate.created_at >= cutoff)
    for candidate in db.execute(candidates_statement).scalars().all():
        row = ensure_user(candidate.created_by_user, candidate.created_by_user_id)
        if not row:
            continue
        row["candidates_added"] += 1
        if not row["last_candidate_created_at"] or candidate.created_at > row["last_candidate_created_at"]:
            row["last_candidate_created_at"] = candidate.created_at

    applications_statement = (
        select(models.Application)
        .join(models.Job)
        .where(
            models.Job.company_id == company_id,
            models.Application.matched_by_user_id.is_not(None),
        )
    )
    if cutoff is not None:
        applications_statement = applications_statement.where(models.Application.created_at >= cutoff)
    for application in db.execute(applications_statement).scalars().all():
        row = ensure_user(application.matched_by_user, application.matched_by_user_id)
        if not row:
            continue
        row["matches_created"] += 1
        if not row["last_match_created_at"] or application.created_at > row["last_match_created_at"]:
            row["last_match_created_at"] = application.created_at

    submissions_statement = (
        select(models.CandidateSubmission)
        .join(models.Application)
        .join(models.Job)
        .where(
            models.Job.company_id == company_id,
            models.CandidateSubmission.submitted_by_user_id.is_not(None),
        )
    )
    if cutoff is not None:
        submissions_statement = submissions_statement.where(models.CandidateSubmission.submitted_at >= cutoff)
    for submission in db.execute(submissions_statement).scalars().all():
        row = ensure_user(submission.submitted_by, submission.submitted_by_user_id)
        if not row:
            continue
        row["submissions_sent"] += 1
        status_key = f"{submission.submission_status}_submissions"
        if status_key in row:
            row[status_key] += 1
        if not row["last_submission_at"] or submission.submitted_at > row["last_submission_at"]:
            row["last_submission_at"] = submission.submitted_at

    recruiters = sorted(
        stats.values(),
        key=lambda row: (
            row["submissions_sent"],
            row["matches_created"],
            row["candidates_added"],
            row["name"].lower(),
        ),
        reverse=True,
    )
    return {
        "period_days": period_days,
        "total_candidates_added": sum(row["candidates_added"] for row in recruiters),
        "total_matches_created": sum(row["matches_created"] for row in recruiters),
        "total_submissions_sent": sum(row["submissions_sent"] for row in recruiters),
        "total_accepted_submissions": sum(row["accepted_submissions"] for row in recruiters),
        "recruiters": recruiters,
    }


def update_candidate_submission_feedback(
    db: Session,
    submission: models.CandidateSubmission,
    feedback_in: CandidateSubmissionFeedback,
) -> models.CandidateSubmission:
    submission.submission_status = feedback_in.submission_status
    submission.client_feedback = feedback_in.client_feedback
    submission.reviewed_at = datetime.utcnow()
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def update_application_status(db: Session, application: models.Application, status: models.ApplicationStatus) -> models.Application:
    application.status = status
    application.created_at = datetime.utcnow()
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def create_interview(db: Session, interview_in: InterviewCreate) -> models.Interview:
    existing = db.execute(
        select(models.Interview).where(models.Interview.application_id == interview_in.application_id)
    ).scalar_one_or_none()
    if existing:
        existing.hiring_manager_id = interview_in.hiring_manager_id
        existing.schedule_time = interview_in.schedule_time
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    interview = models.Interview(
        application_id=interview_in.application_id,
        hiring_manager_id=interview_in.hiring_manager_id,
        schedule_time=interview_in.schedule_time,
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


def get_manager_schedule_conflict(
    db: Session,
    manager_id: int,
    schedule_time: datetime | None,
    application_id: int,
) -> models.Interview | None:
    if schedule_time is None:
        return None

    interview_end = schedule_time + timedelta(hours=1)
    conflict_after = schedule_time - timedelta(hours=1)

    return db.execute(
        select(models.Interview).where(
            models.Interview.hiring_manager_id == manager_id,
            models.Interview.schedule_time.is_not(None),
            models.Interview.schedule_time < interview_end,
            models.Interview.schedule_time > conflict_after,
            models.Interview.application_id != application_id,
        )
    ).scalars().first()


def get_interview(db: Session, interview_id: int) -> models.Interview | None:
    return db.get(models.Interview, interview_id)


def get_interviews_for_manager(db: Session, manager_id: int) -> List[models.Interview]:
    return db.execute(
        select(models.Interview)
        .where(models.Interview.hiring_manager_id == manager_id)
        .order_by(models.Interview.schedule_time.asc().nulls_last(), models.Interview.id.asc())
    ).scalars().all()


def update_interview_verdict(
    db: Session,
    interview: models.Interview,
    comment: str,
    verdict: models.InterviewVerdict | None,
) -> models.Interview:
    interview.manager_comment = comment
    if verdict is None:
        interview.final_verdict = None
    else:
        model_verdict = models.InterviewVerdict(verdict.value)
        interview.final_verdict = model_verdict

    if interview.application.status not in {
        models.ApplicationStatus.OFFER_PENDING,
        models.ApplicationStatus.ON_HOLD,
        models.ApplicationStatus.HIRED,
        models.ApplicationStatus.REJECTED,
    }:
        interview.application.status = models.ApplicationStatus.PRE_QUALIFIED
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


def update_hr_final_decision(
    db: Session,
    application: models.Application,
    status: models.ApplicationStatus,
    comment: str | None,
) -> models.Application:
    application.status = status
    application.hr_final_comment = comment.strip() if comment else None
    application.hr_final_decided_at = datetime.utcnow()
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
