import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    PLATFORM_ADMIN = "Platform_Admin"
    COMPANY_ADMIN = "Company_Admin"
    HR = "HR"
    RECRUITER = "Recruiter"
    APPLICANT = "Applicant"
    HIRING_MANAGER = "Hiring_Manager"


class OrganizationType(str, enum.Enum):
    EMPLOYER = "Employer"
    RECRUITING_AGENCY = "Recruiting_Agency"


class AccessModel(str, enum.Enum):
    COLLABORATIVE = "Collaborative"
    ROLE_BASED = "Role_Based"


class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "Submitted"
    PRE_QUALIFIED = "Pre-qualified"
    OFFER_PENDING = "Offer pending"
    ON_HOLD = "On hold"
    HIRED = "Hired"
    REJECTED = "Rejected"


class InterviewVerdict(str, enum.Enum):
    ACCEPTABLE = "Acceptable"
    STRONGLY_RECOMMEND = "Strongly recommend"
    REJECT = "Reject"


class JobStatus(str, enum.Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    CLOSED = "Closed"


class CandidateProfileStatus(str, enum.Enum):
    ANONYMOUS = "ANONYMOUS"
    REGISTERED = "REGISTERED"
    OPTED_IN = "OPTED_IN"
    HIRED = "HIRED"
    ARCHIVED = "ARCHIVED"


class ApplicationSource(str, enum.Enum):
    DIRECT_APPLY = "direct_apply"
    RECRUITER_SUBMIT = "recruiter_submit"
    TALENT_NETWORK = "talent_network"


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(length=200), nullable=False)
    slug = Column(String(length=128), unique=True, nullable=False, index=True)
    industry = Column(String(length=120), nullable=True)
    website = Column(String(length=255), nullable=True)
    size = Column(String(length=80), nullable=True)
    organization_type = Column(Enum(OrganizationType), nullable=False, default=OrganizationType.EMPLOYER)
    access_model = Column(String(length=40), nullable=False, default=AccessModel.ROLE_BASED.value)
    status = Column(String(length=40), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="company")
    jobs = relationship("Job", back_populates="company")
    client_companies = relationship("ClientCompany", back_populates="agency", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="owner_company")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
    name = Column(String(length=120), nullable=False)
    email = Column(String(length=255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(length=255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="users")
    jobs = relationship("Job", back_populates="hr", foreign_keys="Job.hr_id")
    applications = relationship("Application", back_populates="applicant", foreign_keys="Application.applicant_id")
    interviews = relationship("Interview", back_populates="hiring_manager")
    role_assignments = relationship("UserRoleAssignment", back_populates="user", cascade="all, delete-orphan")

    @property
    def company_name(self):
        return self.company.name if self.company else None

    @property
    def company_slug(self):
        return self.company.slug if self.company else None

    @property
    def organization_type(self):
        return self.company.organization_type if self.company else None

    @property
    def access_model(self):
        return self.company.access_model if self.company else None

    @property
    def roles(self):
        assigned = [assignment.role for assignment in self.role_assignments]
        if self.role not in assigned:
            assigned.insert(0, self.role)
        if (
            self.company
            and self.company.access_model == AccessModel.COLLABORATIVE.value
            and self.role
            not in {
                UserRole.APPLICANT,
                UserRole.PLATFORM_ADMIN,
            }
        ):
            shared_roles = [
                UserRole.COMPANY_ADMIN,
                UserRole.HR,
                UserRole.HIRING_MANAGER,
            ]
            if self.company.organization_type == OrganizationType.RECRUITING_AGENCY:
                shared_roles.append(UserRole.RECRUITER)
            for role in shared_roles:
                if role not in assigned:
                    assigned.append(role)
        return assigned


class UserRoleAssignment(Base):
    __tablename__ = "user_role_assignments"
    __table_args__ = (UniqueConstraint("user_id", "role", name="uq_user_role_assignments_user_role"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="role_assignments")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(length=128), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")


class EmployerInvitation(Base):
    __tablename__ = "employer_invitations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    invited_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    email = Column(String(length=255), nullable=False, index=True)
    role = Column(Enum(UserRole), nullable=False, index=True)
    roles = Column(JSON, nullable=True)
    token_hash = Column(String(length=128), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    accepted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company")
    invited_by = relationship("User")


class WorkspaceActivityEvent(Base):
    __tablename__ = "workspace_activity_events"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    actor_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    actor_name_snapshot = Column(String(length=120), nullable=True)
    actor_email_snapshot = Column(String(length=255), nullable=True)
    event_type = Column(String(length=80), nullable=False, index=True)
    entity_type = Column(String(length=80), nullable=True, index=True)
    entity_id = Column(Integer, nullable=True, index=True)
    entity_label = Column(String(length=255), nullable=True)
    summary = Column(String(length=500), nullable=False)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    company = relationship("Company")
    actor = relationship("User")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=True, index=True)
    client_company_id = Column(Integer, ForeignKey("client_companies.id", ondelete="SET NULL"), nullable=True, index=True)
    hr_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_recruiter_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    hiring_manager_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(length=200), nullable=False)
    position = Column(String(length=200), nullable=False)
    description = Column(Text, nullable=False)
    salary_range = Column(String(length=120), nullable=True)
    department = Column(String(length=120), nullable=True)
    employment_type = Column(String(length=40), nullable=True)
    work_mode = Column(String(length=40), nullable=True)
    location = Column(String(length=160), nullable=True)
    job_level = Column(String(length=80), nullable=True)
    number_openings = Column(Integer, nullable=False, default=1)
    required_skills = Column(Text, nullable=True)
    target_start_date = Column(Date, nullable=True)
    application_deadline = Column(Date, nullable=True)
    job_url = Column(String(length=128), unique=True, nullable=False, index=True)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.ACTIVE)
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    hr = relationship("User", back_populates="jobs", foreign_keys=[hr_id])
    client_company = relationship("ClientCompany", back_populates="jobs")
    assigned_recruiter = relationship("User", foreign_keys=[assigned_recruiter_id])
    hiring_manager = relationship("User", foreign_keys=[hiring_manager_id])
    questions = relationship("Question", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job")

    @property
    def company_slug(self):
        return self.company.slug if self.company else None

    @property
    def client_company_name(self):
        return self.client_company.company_name if self.client_company else None

    @property
    def assigned_recruiter_name(self):
        return self.assigned_recruiter.name if self.assigned_recruiter else None


class ClientCompany(Base):
    __tablename__ = "client_companies"

    id = Column(Integer, primary_key=True, index=True)
    agency_company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name = Column(String(length=200), nullable=False)
    industry = Column(String(length=120), nullable=True)
    website = Column(String(length=255), nullable=True)
    contact_name = Column(String(length=120), nullable=True)
    contact_email = Column(String(length=255), nullable=True)
    contact_phone = Column(String(length=80), nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(length=40), nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    agency = relationship("Company", back_populates="client_companies")
    jobs = relationship("Job", back_populates="client_company")


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    owner_company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    applicant_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    imported_for_job_id = Column(Integer, ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True, index=True)
    name = Column(String(length=120), nullable=False)
    email = Column(String(length=255), nullable=False, index=True)
    phone = Column(String(length=80), nullable=True)
    location = Column(String(length=160), nullable=True)
    notes = Column(Text, nullable=True)
    resume_file_url = Column(String(length=255), nullable=True)
    resume_text = Column(Text, nullable=True)
    parsed_profile_json = Column(JSON, nullable=True)
    consent_talent_network = Column(Boolean, nullable=False, default=False)
    profile_status = Column(Enum(CandidateProfileStatus), nullable=False, default=CandidateProfileStatus.REGISTERED)
    searchable_title = Column(Text, nullable=True)
    searchable_skills = Column(JSON, nullable=True, default=list)
    last_ai_score = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner_company = relationship("Company", back_populates="candidates")
    applicant_user = relationship("User", foreign_keys=[applicant_user_id])
    imported_for_job = relationship("Job", foreign_keys=[imported_for_job_id])
    created_by_user = relationship("User", foreign_keys=[created_by_user_id])
    applications = relationship("Application", back_populates="candidate")

    @property
    def created_by_name(self):
        return self.created_by_user.name if self.created_by_user else None

    @property
    def created_by_email(self):
        return self.created_by_user.email if self.created_by_user else None


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String(length=50), nullable=False)

    job = relationship("Job", back_populates="questions")
    answers = relationship("Answer", back_populates="question")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="SET NULL"), nullable=True, index=True)
    applicant_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    matched_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    source = Column(Enum(ApplicationSource), nullable=False, default=ApplicationSource.DIRECT_APPLY)
    resume_path = Column(String(length=255), nullable=False)
    matching_score = Column(Float, nullable=True)
    answer_score = Column(Float, nullable=True)
    resume_comment = Column(Text, nullable=True)
    answer_comment = Column(Text, nullable=True)
    hr_final_comment = Column(Text, nullable=True)
    hr_final_decided_at = Column(DateTime, nullable=True)
    status = Column(Enum(ApplicationStatus), nullable=False, default=ApplicationStatus.SUBMITTED)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", back_populates="applications", foreign_keys=[applicant_id])
    matched_by_user = relationship("User", foreign_keys=[matched_by_user_id])
    candidate = relationship("Candidate", back_populates="applications")
    answers = relationship("Answer", back_populates="application", cascade="all, delete-orphan")
    interview = relationship("Interview", back_populates="application", uselist=False)
    submissions = relationship("CandidateSubmission", back_populates="application", cascade="all, delete-orphan")

    @property
    def applicant_email(self):
        if self.candidate:
            return self.candidate.email
        return self.applicant.email if self.applicant else None

    @property
    def applicant_name(self):
        if self.candidate:
            return self.candidate.name
        return self.applicant.name if self.applicant else None

    @property
    def candidate_name(self):
        return self.candidate.name if self.candidate else self.applicant_name

    @property
    def candidate_email(self):
        return self.candidate.email if self.candidate else self.applicant_email

    @property
    def matched_by_name(self):
        return self.matched_by_user.name if self.matched_by_user else None

    @property
    def matched_by_email(self):
        return self.matched_by_user.email if self.matched_by_user else None

    @property
    def job_title(self):
        return self.job.title if self.job else None

    @property
    def job_position(self):
        return self.job.position if self.job else None

    @property
    def client_company_name(self):
        return self.job.client_company_name if self.job else None

    @property
    def interview_id(self):
        return self.interview.id if self.interview else None

    @property
    def scheduled_hiring_manager_id(self):
        return self.interview.hiring_manager_id if self.interview else None

    @property
    def scheduled_hiring_manager_name(self):
        if not self.interview or not self.interview.hiring_manager:
            return None
        return self.interview.hiring_manager.name

    @property
    def scheduled_time(self):
        return self.interview.schedule_time if self.interview else None

    @property
    def hiring_manager_recommendation(self):
        return self.interview.final_verdict if self.interview else None


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    answer_text = Column(Text, nullable=False)
    score = Column(Float, nullable=True)

    application = relationship("Application", back_populates="answers")
    question = relationship("Question", back_populates="answers")


class CandidateSubmission(Base):
    __tablename__ = "candidate_submissions"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    submitted_to_name = Column(String(length=120), nullable=False)
    submitted_to_email = Column(String(length=255), nullable=False)
    submission_status = Column(String(length=40), nullable=False, default="pending")
    client_feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    application = relationship("Application", back_populates="submissions")
    submitted_by = relationship("User", foreign_keys=[submitted_by_user_id])

    @property
    def candidate_name(self):
        return self.application.candidate_name if self.application else None

    @property
    def candidate_email(self):
        return self.application.candidate_email if self.application else None

    @property
    def job_title(self):
        return self.application.job_title if self.application else None

    @property
    def client_company_name(self):
        if not self.application or not self.application.job:
            return None
        return self.application.job.client_company_name


class TalentMatch(Base):
    __tablename__ = "talent_matches"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    match_score = Column(Float, nullable=True)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    status = Column(String(length=40), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    candidate = relationship("Candidate")
    job = relationship("Job")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    hiring_manager_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    schedule_time = Column(DateTime, nullable=True)
    manager_comment = Column(Text, nullable=True)
    final_verdict = Column(Enum(InterviewVerdict), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="interview")
    hiring_manager = relationship("User", back_populates="interviews")


class UsageStat(Base):
    __tablename__ = "usage_stats"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    session_id = Column(String(length=128), nullable=True, index=True)
    visitor_id = Column(String(length=128), nullable=True, index=True)
    role = Column(String(length=40), nullable=True, index=True)
    market = Column(String(length=40), nullable=True, index=True)
    locale = Column(String(length=20), nullable=True, index=True)
    host = Column(String(length=255), nullable=True, index=True)
    ip_address = Column(String(length=64), nullable=True, index=True)
    event_type = Column(String(length=80), nullable=False, index=True)
    path = Column(String(length=255), nullable=True, index=True)
    result_score = Column(Float, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    company = relationship("Company")
    user = relationship("User")
