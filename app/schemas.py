from datetime import date, datetime
from enum import Enum
from typing import Any, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


class UserRole(str, Enum):
    PLATFORM_ADMIN = "Platform_Admin"
    COMPANY_ADMIN = "Company_Admin"
    HR = "HR"
    RECRUITER = "Recruiter"
    APPLICANT = "Applicant"
    HIRING_MANAGER = "Hiring_Manager"


class OrganizationType(str, Enum):
    EMPLOYER = "Employer"
    RECRUITING_AGENCY = "Recruiting_Agency"


class AccessModel(str, Enum):
    COLLABORATIVE = "Collaborative"
    ROLE_BASED = "Role_Based"


class InterviewVerdict(str, Enum):
    ACCEPTABLE = "Acceptable"
    STRONGLY_RECOMMEND = "Strongly recommend"
    REJECT = "Reject"


class ApplicationStatus(str, Enum):
    SUBMITTED = "Submitted"
    PRE_QUALIFIED = "Pre-qualified"
    OFFER_PENDING = "Offer pending"
    ON_HOLD = "On hold"
    HIRED = "Hired"
    REJECTED = "Rejected"


class JobStatus(str, Enum):
    DRAFT = "Draft"
    ACTIVE = "Active"
    CLOSED = "Closed"


class CandidateProfileStatus(str, Enum):
    ANONYMOUS = "ANONYMOUS"
    REGISTERED = "REGISTERED"
    OPTED_IN = "OPTED_IN"
    HIRED = "HIRED"
    ARCHIVED = "ARCHIVED"


class ApplicationSource(str, Enum):
    DIRECT_APPLY = "direct_apply"
    RECRUITER_SUBMIT = "recruiter_submit"
    TALENT_NETWORK = "talent_network"


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: Optional[int] = None
    email: Optional[EmailStr] = None


class MessageRead(BaseModel):
    message: str


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str = Field(..., min_length=20, max_length=300)
    password: str = Field(..., min_length=8)


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)


class CompanyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    industry: Optional[str]
    website: Optional[str]
    size: Optional[str]
    organization_type: OrganizationType = OrganizationType.EMPLOYER
    access_model: AccessModel = AccessModel.ROLE_BASED
    status: str = "active"
    created_at: datetime


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: Optional[int]
    company_name: Optional[str] = None
    company_slug: Optional[str] = None
    organization_type: Optional[OrganizationType] = None
    access_model: Optional[AccessModel] = None
    name: str
    email: EmailStr
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)
    created_at: datetime


class CompanyCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    industry: Optional[str] = Field(None, max_length=120)
    website: Optional[str] = Field(None, max_length=255)
    size: Optional[str] = Field(None, max_length=80)
    organization_type: OrganizationType = OrganizationType.EMPLOYER
    access_model: AccessModel = AccessModel.ROLE_BASED


class EmployerAdminCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)


class EmployerTeamMemberCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    role: UserRole
    password: str = Field("changeme123", min_length=8)


class EmployerSetup(BaseModel):
    company: CompanyCreate
    admin: EmployerAdminCreate
    hr_members: List[EmployerTeamMemberCreate] = []
    recruiters: List[EmployerTeamMemberCreate] = []
    hiring_managers: List[EmployerTeamMemberCreate] = []


class EmployerSetupRead(BaseModel):
    company: CompanyRead
    admin: UserRead
    hr_members: List[UserRead]
    recruiters: List[UserRead] = []
    hiring_managers: List[UserRead]


class EmployerUserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)


class EmployerUserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None
    roles: Optional[List[UserRole]] = None


class EmployerInvitationCreate(BaseModel):
    email: EmailStr
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)


class EmployerInvitationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    email: EmailStr
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)
    expires_at: datetime
    accepted_at: Optional[datetime] = None
    created_at: datetime

    @field_validator("roles", mode="before")
    @classmethod
    def default_roles(cls, value):
        return value or []


class EmployerInvitationPublicRead(BaseModel):
    company_name: str
    invited_by_name: Optional[str] = None
    email: EmailStr
    role: UserRole
    roles: List[UserRole] = Field(default_factory=list)
    access_model: AccessModel = AccessModel.ROLE_BASED
    expires_at: datetime
    accepted: bool = False

    @field_validator("roles", mode="before")
    @classmethod
    def default_roles(cls, value):
        return value or []


class EmployerInvitationAccept(BaseModel):
    token: str = Field(..., min_length=20, max_length=300)
    name: str = Field(..., min_length=2, max_length=120)
    password: str = Field(..., min_length=8)


class WorkspaceActivityEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    actor_user_id: Optional[int] = None
    actor_name_snapshot: Optional[str] = None
    actor_email_snapshot: Optional[str] = None
    event_type: str
    entity_type: Optional[str] = None
    entity_id: Optional[int] = None
    entity_label: Optional[str] = None
    summary: str
    metadata_json: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime

    @field_validator("metadata_json", mode="before")
    @classmethod
    def default_metadata_json(cls, value):
        return value or {}


class JobCreate(BaseModel):
    title: str
    position: str
    description: str
    salary_range: Optional[str] = None
    client_company_id: Optional[int] = None
    assigned_recruiter_id: Optional[int] = None
    hiring_manager_id: Optional[int] = None
    department: Optional[str] = Field(None, max_length=120)
    employment_type: Optional[str] = Field(None, max_length=40)
    work_mode: Optional[str] = Field(None, max_length=40)
    location: Optional[str] = Field(None, max_length=160)
    job_level: Optional[str] = Field(None, max_length=80)
    number_openings: int = Field(1, ge=1)
    required_skills: Optional[str] = None
    target_start_date: Optional[date] = None
    application_deadline: Optional[date] = None
    status: JobStatus = JobStatus.ACTIVE


class JobUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[str] = None
    description: Optional[str] = None
    salary_range: Optional[str] = None
    client_company_id: Optional[int] = None
    assigned_recruiter_id: Optional[int] = None
    hiring_manager_id: Optional[int] = None
    department: Optional[str] = Field(None, max_length=120)
    employment_type: Optional[str] = Field(None, max_length=40)
    work_mode: Optional[str] = Field(None, max_length=40)
    location: Optional[str] = Field(None, max_length=160)
    job_level: Optional[str] = Field(None, max_length=80)
    number_openings: Optional[int] = Field(None, ge=1)
    required_skills: Optional[str] = None
    target_start_date: Optional[date] = None
    application_deadline: Optional[date] = None
    status: Optional[JobStatus] = None


class JobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: Optional[int]
    company_slug: Optional[str] = None
    client_company_id: Optional[int] = None
    client_company_name: Optional[str] = None
    hr_id: int
    assigned_recruiter_id: Optional[int] = None
    assigned_recruiter_name: Optional[str] = None
    hiring_manager_id: Optional[int] = None
    title: str
    position: str
    description: str
    salary_range: Optional[str]
    department: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    job_level: Optional[str] = None
    number_openings: int = 1
    required_skills: Optional[str] = None
    target_start_date: Optional[date] = None
    application_deadline: Optional[date] = None
    job_url: str
    status: JobStatus
    created_at: datetime


class OrganizationRead(CompanyRead):
    pass


class ClientCompanyBase(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=200)
    industry: Optional[str] = Field(None, max_length=120)
    website: Optional[str] = Field(None, max_length=255)
    contact_name: Optional[str] = Field(None, max_length=120)
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = Field(None, max_length=80)
    notes: Optional[str] = Field(None, max_length=4000)
    status: str = Field("active", max_length=40)


class ClientCompanyCreate(ClientCompanyBase):
    pass


class ClientCompanyUpdate(BaseModel):
    company_name: Optional[str] = Field(None, min_length=2, max_length=200)
    industry: Optional[str] = Field(None, max_length=120)
    website: Optional[str] = Field(None, max_length=255)
    contact_name: Optional[str] = Field(None, max_length=120)
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = Field(None, max_length=80)
    notes: Optional[str] = Field(None, max_length=4000)
    status: Optional[str] = Field(None, max_length=40)


class ClientCompanyRead(ClientCompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    agency_company_id: int
    created_at: datetime
    updated_at: datetime


class CandidateBase(BaseModel):
    imported_for_job_id: Optional[int] = None
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=80)
    location: Optional[str] = Field(None, max_length=160)
    notes: Optional[str] = Field(None, max_length=4000)
    resume_file_url: Optional[str] = Field(None, max_length=255)
    resume_text: Optional[str] = None
    parsed_profile_json: Optional[dict[str, Any]] = None
    consent_talent_network: bool = False
    profile_status: CandidateProfileStatus = CandidateProfileStatus.REGISTERED
    searchable_title: Optional[str] = None
    searchable_skills: list[str] = Field(default_factory=list)
    last_ai_score: Optional[datetime] = None

    @field_validator("searchable_skills", mode="before")
    @classmethod
    def default_searchable_skills(cls, value):
        return [] if value is None else value


class CandidateCreate(CandidateBase):
    @model_validator(mode="after")
    def align_profile_status_with_consent(self):
        if self.consent_talent_network and self.profile_status == CandidateProfileStatus.REGISTERED:
            self.profile_status = CandidateProfileStatus.OPTED_IN
        return self


class CandidateUpdate(BaseModel):
    imported_for_job_id: Optional[int] = None
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=80)
    location: Optional[str] = Field(None, max_length=160)
    notes: Optional[str] = Field(None, max_length=4000)
    resume_file_url: Optional[str] = Field(None, max_length=255)
    resume_text: Optional[str] = None
    parsed_profile_json: Optional[dict[str, Any]] = None
    consent_talent_network: Optional[bool] = None
    profile_status: Optional[CandidateProfileStatus] = None
    searchable_title: Optional[str] = None
    searchable_skills: Optional[list[str]] = None
    last_ai_score: Optional[datetime] = None


class CandidateRead(CandidateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_company_id: int
    applicant_user_id: Optional[int] = None
    created_by_user_id: Optional[int] = None
    created_by_name: Optional[str] = None
    created_by_email: Optional[EmailStr] = None
    created_at: datetime
    updated_at: datetime


class CandidateResumeImportPreview(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    resume_file_url: str
    resume_text: str
    parsed_profile_json: dict[str, Any]
    existing_candidate_id: Optional[int] = None


class QuestionCreate(BaseModel):
    question_id: int
    answer_text: str
    score: Optional[float] = None


class QuestionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_id: int
    text: str
    category: str


class ApplicationCreate(BaseModel):
    job_id: int
    applicant_id: Optional[int] = None
    candidate_id: Optional[int] = None


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    job_id: int
    job_title: Optional[str] = None
    job_position: Optional[str] = None
    client_company_name: Optional[str] = None
    candidate_id: Optional[int] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[EmailStr] = None
    applicant_id: Optional[int] = None
    applicant_name: Optional[str] = None
    applicant_email: Optional[EmailStr] = None
    matched_by_user_id: Optional[int] = None
    matched_by_name: Optional[str] = None
    matched_by_email: Optional[EmailStr] = None
    source: ApplicationSource = ApplicationSource.DIRECT_APPLY
    resume_path: str
    matching_score: Optional[float]
    answer_score: Optional[float]
    resume_comment: Optional[str]
    answer_comment: Optional[str]
    hr_final_comment: Optional[str] = None
    hr_final_decided_at: Optional[datetime] = None
    interview_id: Optional[int] = None
    scheduled_hiring_manager_id: Optional[int] = None
    scheduled_hiring_manager_name: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    hiring_manager_recommendation: Optional[InterviewVerdict] = None
    status: ApplicationStatus
    created_at: datetime


class AnswerCreate(BaseModel):
    question_id: int
    answer_text: str
    score: Optional[float] = None


class InterviewCreate(BaseModel):
    application_id: int
    hiring_manager_id: int
    schedule_time: Optional[datetime] = None


class InterviewRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    hiring_manager_id: Optional[int]
    schedule_time: Optional[datetime]
    manager_comment: Optional[str]
    final_verdict: Optional[InterviewVerdict]
    created_at: datetime
    application: Optional[ApplicationRead] = None


class ApplicationSubmit(BaseModel):
    job_id: int
    answers: List[QuestionCreate]


class CandidateJobMatch(BaseModel):
    job_id: int


class CandidateBatchMatchRead(BaseModel):
    candidate: CandidateRead
    application: Optional[ApplicationRead] = None
    filename: str
    status: str
    message: Optional[str] = None


class CandidatePotentialJobMatchRead(BaseModel):
    job_id: int
    job_title: str
    client_company_name: Optional[str] = None
    match_score: float
    already_matched: bool = False
    imported_for_job: bool = False


class CandidateSubmissionCreate(BaseModel):
    submitted_to_name: str = Field(..., min_length=2, max_length=120)
    submitted_to_email: EmailStr
    submission_status: Literal["pending", "reviewed", "accepted", "rejected"] = "pending"
    client_feedback: Optional[str] = Field(None, max_length=4000)


class CandidateSubmissionFeedback(BaseModel):
    submission_status: Literal["pending", "reviewed", "accepted", "rejected"]
    client_feedback: Optional[str] = Field(None, max_length=4000)


class CandidateSubmissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    submitted_by_user_id: Optional[int] = None
    submitted_to_name: str
    submitted_to_email: EmailStr
    submission_status: str
    client_feedback: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[EmailStr] = None
    job_title: Optional[str] = None
    client_company_name: Optional[str] = None


class TalentMatchRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    candidate_id: int
    job_id: int
    match_score: Optional[float] = None
    strengths: Optional[list[str]] = None
    weaknesses: Optional[list[str]] = None
    status: str
    created_at: datetime
    updated_at: datetime


class ExtractedCandidateProfile(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    address: str = ""
    experience: list[Any] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    education: list[Any] = Field(default_factory=list)


class AnalysisScoreBreakdown(BaseModel):
    category: str
    score: float
    reason: str = ""
    evidence: list[str] = Field(default_factory=list)


class AnalysisRequirementMatch(BaseModel):
    requirement: str
    evidence: list[str] = Field(default_factory=list)
    strength: str = "medium"


class AnalysisMissingRequirement(BaseModel):
    requirement: str
    reason: str = ""
    severity: str = "medium"


class AnalysisEvidenceQuote(BaseModel):
    source: str
    quote: str
    supports: str = ""


class EnhancedAnalysisFields(BaseModel):
    score_breakdown: list[AnalysisScoreBreakdown] = Field(default_factory=list)
    requirement_matches: list[AnalysisRequirementMatch] = Field(default_factory=list)
    missing_requirements: list[AnalysisMissingRequirement] = Field(default_factory=list)
    evidence_quotes: list[AnalysisEvidenceQuote] = Field(default_factory=list)
    confidence_level: str = "medium"
    confidence_reason: str = ""


class PublicAnalysisRead(BaseModel):
    match_score: float
    strengths: list[str]
    weaknesses: list[str]
    extracted_profile: ExtractedCandidateProfile
    anonymous_candidate_id: Optional[int] = None
    score_breakdown: list[AnalysisScoreBreakdown] = Field(default_factory=list)
    requirement_matches: list[AnalysisRequirementMatch] = Field(default_factory=list)
    missing_requirements: list[AnalysisMissingRequirement] = Field(default_factory=list)
    evidence_quotes: list[AnalysisEvidenceQuote] = Field(default_factory=list)
    confidence_level: str = "medium"
    confidence_reason: str = ""


class ApplicationAnalysisRead(PublicAnalysisRead):
    application: ApplicationRead


class PublicHiringManagerQuestionsRead(BaseModel):
    match_score: float
    strengths: list[str]
    weaknesses: list[str]
    extracted_profile: ExtractedCandidateProfile
    score_breakdown: list[AnalysisScoreBreakdown] = Field(default_factory=list)
    requirement_matches: list[AnalysisRequirementMatch] = Field(default_factory=list)
    missing_requirements: list[AnalysisMissingRequirement] = Field(default_factory=list)
    evidence_quotes: list[AnalysisEvidenceQuote] = Field(default_factory=list)
    confidence_level: str = "medium"
    confidence_reason: str = ""
    questions: list[dict[str, Any]]


class PublicHiringManagerQuestionSetRead(BaseModel):
    questions: list[dict[str, Any]]


class PublicOptInCandidateData(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=80)
    address: Optional[str] = Field(None, max_length=160)
    searchable_title: Optional[str] = Field(None, max_length=200)
    experience: list[Any] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    education: list[Any] = Field(default_factory=list)


class PublicOptInCreate(BaseModel):
    candidate_data: PublicOptInCandidateData
    password: str = Field(..., min_length=8)


class PublicOptInRead(BaseModel):
    candidate_id: int
    account_created: bool


class TalentProfileUpdate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    phone: Optional[str] = Field(None, max_length=80)
    location: Optional[str] = Field(None, max_length=160)
    searchable_title: Optional[str] = Field(None, max_length=200)
    searchable_skills: list[str] = Field(default_factory=list)
    consent_talent_network: bool = False
    profile_status: CandidateProfileStatus = CandidateProfileStatus.REGISTERED


class ApplicantResumeReview(BaseModel):
    headline: str
    readiness_score: float
    score_label: str = "Needs polish"
    score_explanation: str = "Private coaching score based only on the resume text Career Coaching AI could extract."
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    next_steps: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)


class ApplicantResumeProfileRead(BaseModel):
    candidate: Optional[CandidateRead] = None
    has_resume: bool = False
    resume_file_name: Optional[str] = None
    resume_updated_at: Optional[datetime] = None
    review: ApplicantResumeReview


class ApplicantResumeMatchCreate(BaseModel):
    job_title: Optional[str] = Field(None, max_length=200)
    job_description: str = Field(..., min_length=40, max_length=20000)


class ApplicantResumeMatchRead(BaseModel):
    job_title: Optional[str] = None
    target_title: Optional[str] = None
    match_score: float
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    extracted_profile: ExtractedCandidateProfile
    score_breakdown: list[AnalysisScoreBreakdown] = Field(default_factory=list)
    requirement_matches: list[AnalysisRequirementMatch] = Field(default_factory=list)
    missing_requirements: list[AnalysisMissingRequirement] = Field(default_factory=list)
    evidence_quotes: list[AnalysisEvidenceQuote] = Field(default_factory=list)
    confidence_level: str = "medium"
    confidence_reason: str = ""


class ApplicantPracticeQuestion(BaseModel):
    id: int
    text: str
    category: str
    type: Literal["Resume-Based", "JD-Based"] = "JD-Based"
    skill_type: Literal["Hard", "Soft"] = "Hard"
    weight: float = 0.7
    source: str = "jd_gap"
    rubric: dict[str, str] = Field(default_factory=dict)


class ApplicantPracticeQuestionsCreate(BaseModel):
    job_title: Optional[str] = Field(None, max_length=200)
    job_description: str = Field(..., min_length=40, max_length=20000)


class ApplicantPracticeQuestionsRead(BaseModel):
    job_title: Optional[str] = None
    questions: list[ApplicantPracticeQuestion]


class ApplicantPracticeAnswer(BaseModel):
    question_id: int
    question_text: str
    category: str = "General"
    type: Literal["Resume-Based", "JD-Based"] = "JD-Based"
    skill_type: Literal["Hard", "Soft"] = "Hard"
    weight: float = 0.7
    rubric: dict[str, str] = Field(default_factory=dict)
    answer_text: str = ""


class ApplicantPracticeSubmit(BaseModel):
    job_title: Optional[str] = Field(None, max_length=200)
    job_description: str = Field(..., min_length=40, max_length=20000)
    answers: list[ApplicantPracticeAnswer]


class ApplicantPracticeRead(BaseModel):
    job_title: Optional[str] = None
    answer_score: float
    hard_score: Optional[float] = None
    soft_score: Optional[float] = None
    answered_count: int
    total_questions: int
    coach_comment: str


class UsageEventCreate(BaseModel):
    session_id: Optional[str] = Field(None, max_length=128)
    visitor_id: Optional[str] = Field(None, max_length=128)
    role: Optional[UserRole] = None
    market: Optional[str] = Field(None, max_length=40)
    locale: Optional[str] = Field(None, max_length=20)
    host: Optional[str] = Field(None, max_length=255)
    event_type: str = Field(..., min_length=2, max_length=80)
    path: Optional[str] = Field(None, max_length=255)
    result_score: Optional[float] = None
    metadata_json: dict[str, Any] = Field(default_factory=dict)


class UsageEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: Optional[int] = None
    user_id: Optional[int] = None
    session_id: Optional[str] = None
    visitor_id: Optional[str] = None
    role: Optional[str] = None
    market: Optional[str] = None
    locale: Optional[str] = None
    host: Optional[str] = None
    ip_address: Optional[str] = None
    event_type: str
    path: Optional[str] = None
    result_score: Optional[float] = None
    created_at: datetime


class UsageSeriesPoint(BaseModel):
    label: str
    visitors: int = 0
    applicant_active: int = 0
    hiring_manager_active: int = 0
    free_analysis: int = 0
    hm_activity: int = 0


class PlatformPerformanceSummary(BaseModel):
    period_days: Optional[int] = None
    total_visitors: int = 0
    external_visitors: int = 0
    internal_visitors: int = 0
    total_page_views: int = 0
    total_applicant_events: int = 0
    total_hiring_manager_events: int = 0
    daily_active_applicants: int = 0
    monthly_active_applicants: int = 0
    daily_active_hiring_managers: int = 0
    monthly_active_hiring_managers: int = 0
    external_visitors_today: int = 0
    external_registered_users_today: int = 0
    external_applicants_today: int = 0
    external_hiring_managers_today: int = 0
    internal_events_today: int = 0
    new_applicant_accounts: int = 0
    total_hiring_manager_accounts: int = 0
    free_analysis_volume: int = 0
    extraction_success_rate: float = 0
    global_average_match_score: Optional[float] = None
    talent_network_opt_in_rate: float = 0
    dossier_completion_rate: float = 0
    final_verdict_volume: int = 0
    average_final_verdict_hours: Optional[float] = None
    cold_start_events: int = 0
    warm_start_events: int = 0
    visitors_by_market: list[dict[str, int | str]] = Field(default_factory=list)
    visitors_by_locale: list[dict[str, int | str]] = Field(default_factory=list)
    daily: list[UsageSeriesPoint] = Field(default_factory=list)
    monthly: list[UsageSeriesPoint] = Field(default_factory=list)
    top_paths: list[dict[str, int | str]] = Field(default_factory=list)


class PlatformFreeServiceUser(BaseModel):
    actor_key: str
    user_id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    company_name: Optional[str] = None
    organization_type: Optional[str] = None
    visitor_id: Optional[str] = None
    session_id: Optional[str] = None
    host: Optional[str] = None
    market: Optional[str] = None
    locale: Optional[str] = None
    ip_address: Optional[str] = None
    is_internal: bool = False
    traffic_source: str = "external"
    internal_reason: Optional[str] = None
    first_seen_at: datetime
    last_seen_at: datetime
    event_count: int = 0
    services: list[str] = Field(default_factory=list)
    last_path: Optional[str] = None


class PlatformFreeServiceUserSummary(BaseModel):
    period_days: Optional[int] = None
    total_users: int = 0
    registered_users: int = 0
    anonymous_visitors: int = 0
    users: list[PlatformFreeServiceUser] = Field(default_factory=list)


class ScoringSandboxFile(BaseModel):
    path: str
    name: str
    size_bytes: int = 0
    updated_at: datetime


class ScoringSandboxStatus(BaseModel):
    base_dir: str
    job_titles: list[str] = Field(default_factory=list)
    input_cases: int = 0
    input_files: int = 0
    analysis_outputs: int = 0
    evaluation_reports: int = 0
    active_regression_cases: int = 0
    planned_regression_cases: int = 0
    recent_inputs: list[ScoringSandboxFile] = Field(default_factory=list)
    recent_outputs: list[ScoringSandboxFile] = Field(default_factory=list)
    recent_evaluations: list[ScoringSandboxFile] = Field(default_factory=list)


class ScoringSandboxTitlesUpdate(BaseModel):
    titles: list[str] = Field(default_factory=list)


class ScoringSandboxRunRequest(BaseModel):
    stage: Literal["generate", "score", "judge", "all"]


class ScoringSandboxRunResult(BaseModel):
    stage: str
    message: str
    generated_cases: int = 0
    scored_outputs: int = 0
    judged_reports: int = 0
    status: ScoringSandboxStatus


class ScoringSandboxRealJdRequest(BaseModel):
    job_title: str = Field(..., min_length=2, max_length=160)
    job_description: str = Field(..., min_length=120, max_length=60000)


class ScoringSandboxPromotionCandidate(BaseModel):
    id: str
    failure_mode: str
    case_slug: str
    resume_file: str
    requirement: str
    evidence: str
    reason: str
    analysis_path: str
    proposed_case: dict[str, Any]
    already_promoted: bool = False


class ScoringSandboxPromotionReport(BaseModel):
    raw_candidates: int = 0
    total_candidates: int = 0
    unpromoted_candidates: int = 0
    ignored_candidates: int = 0
    saved_lesson_candidates: int = 0
    already_promoted_candidates: int = 0
    shown_candidates: int = 0
    candidates: list[ScoringSandboxPromotionCandidate] = Field(default_factory=list)


class ScoringSandboxRealJdResult(BaseModel):
    case_slug: str
    message: str
    generated_cases: int = 0
    scored_outputs: int = 0
    judged_reports: int = 0
    status: ScoringSandboxStatus
    report: ScoringSandboxPromotionReport


class ScoringSandboxLessonSelection(BaseModel):
    candidate_id: str
    lesson_type: Literal["regression_bug", "adjacent_partial", "correct_match"] = "regression_bug"


class ScoringSandboxPromoteRequest(BaseModel):
    candidate_ids: list[str] = Field(default_factory=list)
    lessons: list[ScoringSandboxLessonSelection] = Field(default_factory=list)


class ScoringSandboxIgnoreRequest(BaseModel):
    candidate_ids: list[str] = Field(default_factory=list)


class ScoringSandboxPromoteResult(BaseModel):
    promoted: list[str] = Field(default_factory=list)
    skipped: list[str] = Field(default_factory=list)
    status: ScoringSandboxStatus
    report: ScoringSandboxPromotionReport


class ScoringSandboxIgnoreResult(BaseModel):
    ignored: list[str] = Field(default_factory=list)
    skipped: list[str] = Field(default_factory=list)
    report: ScoringSandboxPromotionReport


class PlatformSiteVisitor(PlatformFreeServiceUser):
    pass


class PlatformSiteVisitorSummary(BaseModel):
    period_days: Optional[int] = None
    total_users: int = 0
    registered_users: int = 0
    anonymous_visitors: int = 0
    internal_users: int = 0
    external_users: int = 0
    external_registered_users: int = 0
    external_anonymous_visitors: int = 0
    users: list[PlatformSiteVisitor] = Field(default_factory=list)


class RecruiterPerformanceRead(BaseModel):
    user_id: int
    name: str
    email: EmailStr
    role: UserRole
    candidates_added: int = 0
    matches_created: int = 0
    submissions_sent: int = 0
    pending_submissions: int = 0
    reviewed_submissions: int = 0
    accepted_submissions: int = 0
    rejected_submissions: int = 0
    last_candidate_created_at: Optional[datetime] = None
    last_match_created_at: Optional[datetime] = None
    last_submission_at: Optional[datetime] = None


class RecruiterPerformanceSummary(BaseModel):
    period_days: Optional[int] = None
    total_candidates_added: int = 0
    total_matches_created: int = 0
    total_submissions_sent: int = 0
    total_accepted_submissions: int = 0
    recruiters: List[RecruiterPerformanceRead]


class InterviewDecision(BaseModel):
    manager_comment: str = Field(..., max_length=2000)
    final_verdict: Optional[InterviewVerdict] = None

    @model_validator(mode="after")
    def require_comment_for_final_decision(self):
        if self.final_verdict is not None and len(self.manager_comment.strip()) < 10:
            raise ValueError("Manager notes must be at least 10 characters for a submitted recommendation.")
        return self


class HrFinalDecision(BaseModel):
    status: ApplicationStatus
    comment: Optional[str] = Field(None, max_length=2000)

    @model_validator(mode="after")
    def require_final_status(self):
        allowed_statuses = {
            ApplicationStatus.OFFER_PENDING,
            ApplicationStatus.ON_HOLD,
            ApplicationStatus.HIRED,
            ApplicationStatus.REJECTED,
        }
        if self.status not in allowed_statuses:
            raise ValueError("HR final status must be Offer pending, On hold, Hired, or Rejected.")
        if self.status in {ApplicationStatus.ON_HOLD, ApplicationStatus.REJECTED}:
            if not self.comment or len(self.comment.strip()) < 10:
                raise ValueError("HR notes must be at least 10 characters for hold or reject decisions.")
        return self
