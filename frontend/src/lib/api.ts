const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend";
const LONG_API_BASE_URL = process.env.NEXT_PUBLIC_LONG_API_BASE_URL ?? "";

const LONG_RUNNING_PATHS = [
  "/applicant/resume-match",
  "/applicant/practice/questions",
  "/applicant/practice/score",
  "/api/public/analyze",
  "/api/public/hiring-manager/analyze",
  "/api/public/hiring-manager/questions",
  "/hr/application-analysis",
  "/platform/scoring-sandbox/run",
  "/platform/scoring-sandbox/real-jd",
  "/candidates/batch-match",
];

function apiBaseUrlForPath(path: string) {
  if (
    typeof window !== "undefined" &&
    LONG_RUNNING_PATHS.some((longPath) => path.startsWith(longPath))
  ) {
    if (LONG_API_BASE_URL) {
      return LONG_API_BASE_URL;
    }
    return "/ai-backend";
  }

  return API_BASE_URL;
}

type ApiFetchOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(
  path: string,
  { headers, token, ...options }: ApiFetchOptions = {},
): Promise<T> {
  const hasBody = options.body !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const response = await fetch(`${apiBaseUrlForPath(path)}${path}`, {
    ...options,
    headers: {
      ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to sign in");
  }

  return response.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return apiFetch<User>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ message: string }>("/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(token: string, password: string) {
  return apiFetch<{ message: string }>("/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export type UserRole =
  | "Platform_Admin"
  | "Company_Admin"
  | "HR"
  | "Recruiter"
  | "Applicant"
  | "Hiring_Manager";

export type OrganizationType = "Employer" | "Recruiting_Agency";
export type AccessModel = "Collaborative" | "Role_Based";

export type User = {
  id: number;
  company_id: number | null;
  company_name: string | null;
  company_slug: string | null;
  organization_type: OrganizationType | null;
  access_model: AccessModel | null;
  name: string;
  email: string;
  role: UserRole;
  roles: UserRole[];
  created_at: string;
};

export type EmployerInvitation = {
  id: number;
  company_id: number;
  email: string;
  role: UserRole;
  roles: UserRole[];
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
};

export type EmployerInvitationPreview = {
  company_name: string;
  invited_by_name: string | null;
  email: string;
  role: UserRole;
  roles: UserRole[];
  access_model: AccessModel;
  expires_at: string;
  accepted: boolean;
};

export async function createEmployerInvitation(
  token: string,
  payload: { email: string; role: UserRole; roles?: UserRole[] },
) {
  return apiFetch<EmployerInvitation>("/employer/invitations", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function listEmployerInvitations(token: string) {
  return apiFetch<EmployerInvitation[]>("/employer/invitations", { token });
}

export async function listEmployerUsers(token: string) {
  return apiFetch<User[]>("/employer/users", { token });
}

export async function previewEmployerInvitation(token: string) {
  return apiFetch<EmployerInvitationPreview>(
    `/employer/invitations/preview?token=${encodeURIComponent(token)}`,
  );
}

export async function acceptEmployerInvitation(payload: {
  token: string;
  name: string;
  password: string;
}) {
  return apiFetch<User>("/employer/invitations/accept", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type WorkspaceActivityEvent = {
  id: number;
  company_id: number;
  actor_user_id: number | null;
  actor_name_snapshot: string | null;
  actor_email_snapshot: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_label: string | null;
  summary: string;
  metadata_json: Record<string, unknown>;
  created_at: string;
};

export async function listWorkspaceActivity(
  token: string,
  params: { limit?: number; offset?: number } = {},
) {
  const search = new URLSearchParams({
    limit: String(params.limit ?? 5),
    offset: String(params.offset ?? 0),
  });
  return apiFetch<WorkspaceActivityEvent[]>(`/employer/activity?${search.toString()}`, {
    token,
  });
}

export type Company = {
  id: number;
  name: string;
  slug: string;
  industry: string | null;
  website: string | null;
  size: string | null;
  organization_type: OrganizationType;
  access_model: AccessModel;
  status: string;
  created_at: string;
};

export type ClientCompany = {
  id: number;
  agency_company_id: number;
  company_name: string;
  industry: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Candidate = {
  id: number;
  owner_company_id: number;
  applicant_user_id: number | null;
  created_by_user_id: number | null;
  imported_for_job_id: number | null;
  created_by_name: string | null;
  created_by_email: string | null;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  notes: string | null;
  resume_file_url: string | null;
  resume_text: string | null;
  parsed_profile_json: Record<string, unknown> | null;
  consent_talent_network: boolean;
  profile_status: "ANONYMOUS" | "REGISTERED" | "OPTED_IN" | "HIRED" | "ARCHIVED";
  searchable_title: string | null;
  searchable_skills: string[];
  last_ai_score: string | null;
  created_at: string;
  updated_at: string;
};

export type CandidateResumeImportPreview = {
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  resume_file_url: string;
  resume_text: string;
  parsed_profile_json: Record<string, unknown>;
  existing_candidate_id: number | null;
};

export type CandidateBatchMatch = {
  candidate: Candidate;
  application: Application | null;
  filename: string;
  status: string;
  message: string | null;
};

export type CandidatePotentialJobMatch = {
  job_id: number;
  job_title: string;
  client_company_name: string | null;
  match_score: number;
  already_matched: boolean;
  imported_for_job: boolean;
};

export type Job = {
  id: number;
  company_id: number | null;
  company_slug: string | null;
  client_company_id: number | null;
  client_company_name: string | null;
  hr_id: number;
  assigned_recruiter_id: number | null;
  assigned_recruiter_name: string | null;
  hiring_manager_id: number | null;
  title: string;
  position: string;
  description: string;
  salary_range: string | null;
  department: string | null;
  employment_type: string | null;
  work_mode: string | null;
  location: string | null;
  job_level: string | null;
  number_openings: number;
  required_skills: string | null;
  target_start_date: string | null;
  application_deadline: string | null;
  job_url: string;
  status: "Draft" | "Active" | "Closed";
  created_at: string;
};

export type Question = {
  id: number;
  job_id: number;
  text: string;
  category: string;
};

export type Application = {
  id: number;
  job_id: number;
  job_title: string | null;
  job_position: string | null;
  client_company_name: string | null;
  candidate_id: number | null;
  candidate_name: string | null;
  candidate_email: string | null;
  applicant_id: number | null;
  applicant_name: string | null;
  applicant_email: string | null;
  matched_by_user_id: number | null;
  matched_by_name: string | null;
  matched_by_email: string | null;
  source: "direct_apply" | "recruiter_submit" | "talent_network";
  resume_path: string;
  matching_score: number | null;
  answer_score: number | null;
  resume_comment: string | null;
  answer_comment: string | null;
  hr_final_comment: string | null;
  hr_final_decided_at: string | null;
  interview_id: number | null;
  scheduled_hiring_manager_id: number | null;
  scheduled_hiring_manager_name: string | null;
  scheduled_time: string | null;
  hiring_manager_recommendation:
    | "Acceptable"
    | "Strongly recommend"
    | "Reject"
    | null;
  status: string;
  created_at: string;
};

export type ExtractedCandidateProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  experience: unknown[];
  skills: string[];
  education: unknown[];
};

export type AnalysisScoreBreakdown = {
  category: string;
  score: number;
  reason: string;
  evidence: string[];
};

export type AnalysisRequirementMatch = {
  requirement: string;
  evidence: string[];
  strength: "high" | "medium" | "low" | string;
};

export type AnalysisMissingRequirement = {
  requirement: string;
  reason: string;
  severity: "high" | "medium" | "low" | string;
};

export type AnalysisEvidenceQuote = {
  source: "resume" | "job_description" | string;
  quote: string;
  supports: string;
};

export type PublicAnalysis = {
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  extracted_profile: ExtractedCandidateProfile;
  anonymous_candidate_id?: number | null;
  score_breakdown?: AnalysisScoreBreakdown[];
  requirement_matches?: AnalysisRequirementMatch[];
  missing_requirements?: AnalysisMissingRequirement[];
  evidence_quotes?: AnalysisEvidenceQuote[];
  confidence_level?: "high" | "medium" | "low" | string;
  confidence_reason?: string;
};

export type ApplicationAnalysis = PublicAnalysis & {
  application: Application;
};

export type PublicHiringManagerQuestions = PublicAnalysis & {
  questions: ApplicantPracticeQuestion[];
};

export type PublicHiringManagerQuestionSet = {
  questions: ApplicantPracticeQuestion[];
};

export type PublicOptInPayload = {
  candidate_data: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    searchable_title: string | null;
    experience: unknown[];
    skills: string[];
    education: unknown[];
  };
  password: string;
};

export type ApplicantResumeReview = {
  headline: string;
  readiness_score: number;
  score_label: string;
  score_explanation: string;
  strengths: string[];
  gaps: string[];
  next_steps: string[];
  keywords: string[];
};

export type ApplicantResumeProfile = {
  candidate: Candidate | null;
  has_resume: boolean;
  resume_file_name: string | null;
  resume_updated_at: string | null;
  review: ApplicantResumeReview;
};

export type ApplicantResumeMatch = {
  job_title: string | null;
  target_title: string | null;
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  extracted_profile: ExtractedCandidateProfile;
  score_breakdown?: AnalysisScoreBreakdown[];
  requirement_matches?: AnalysisRequirementMatch[];
  missing_requirements?: AnalysisMissingRequirement[];
  evidence_quotes?: AnalysisEvidenceQuote[];
  confidence_level?: "high" | "medium" | "low" | string;
  confidence_reason?: string;
};

export type ApplicantPracticeQuestion = {
  id: number;
  text: string;
  category: string;
  type: "Resume-Based" | "JD-Based";
  skill_type: "Hard" | "Soft";
  weight: number;
  source: string;
  rubric: Record<string, string>;
};

export type ApplicantPracticeQuestions = {
  job_title: string | null;
  questions: ApplicantPracticeQuestion[];
};

export type ApplicantPracticeResult = {
  job_title: string | null;
  answer_score: number;
  hard_score: number | null;
  soft_score: number | null;
  answered_count: number;
  total_questions: number;
  coach_comment: string;
};

export type PublicOptInResult = {
  candidate_id: number;
  account_created: boolean;
};

export async function analyzeResumePublic(payload: {
  resume: File;
  jobDescription: string;
  targetPosition?: string;
  market?: string;
  locale?: string;
  host?: string;
  token?: string;
}) {
  const formData = new FormData();
  formData.append("resume", payload.resume);
  formData.append("job_description", payload.jobDescription);
  formData.append("target_position", payload.targetPosition || "");
  formData.append("market", payload.market || "");
  formData.append("locale", payload.locale || "");
  formData.append("host", payload.host || "");

  return apiFetch<PublicAnalysis>("/api/public/analyze", {
    method: "POST",
    token: payload.token,
    body: formData,
  });
}

export async function optIntoTalentNetwork(payload: PublicOptInPayload) {
  return apiFetch<PublicOptInResult>("/api/public/opt-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type TalentProfileUpdate = {
  name: string;
  phone: string | null;
  location: string | null;
  searchable_title: string | null;
  searchable_skills: string[];
  consent_talent_network: boolean;
  profile_status: "REGISTERED" | "OPTED_IN" | "ARCHIVED";
};

export type CandidateSubmission = {
  id: number;
  application_id: number;
  submitted_by_user_id: number | null;
  submitted_to_name: string;
  submitted_to_email: string;
  submission_status: string;
  client_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  candidate_name: string | null;
  candidate_email: string | null;
  job_title: string | null;
  client_company_name: string | null;
};

export type RecruiterPerformance = {
  user_id: number;
  name: string;
  email: string;
  role: UserRole;
  candidates_added: number;
  matches_created: number;
  submissions_sent: number;
  pending_submissions: number;
  reviewed_submissions: number;
  accepted_submissions: number;
  rejected_submissions: number;
  last_candidate_created_at: string | null;
  last_match_created_at: string | null;
  last_submission_at: string | null;
};

export type RecruiterPerformanceSummary = {
  period_days: number | null;
  total_candidates_added: number;
  total_matches_created: number;
  total_submissions_sent: number;
  total_accepted_submissions: number;
  recruiters: RecruiterPerformance[];
};

export type UsageSeriesPoint = {
  label: string;
  visitors: number;
  applicant_active: number;
  hiring_manager_active: number;
  free_analysis: number;
  hm_activity: number;
};

export type PlatformPerformanceSummary = {
  period_days: number | null;
  total_visitors: number;
  external_visitors: number;
  internal_visitors: number;
  total_page_views: number;
  total_applicant_events: number;
  total_hiring_manager_events: number;
  daily_active_applicants: number;
  monthly_active_applicants: number;
  daily_active_hiring_managers: number;
  monthly_active_hiring_managers: number;
  external_visitors_today: number;
  external_registered_users_today: number;
  external_applicants_today: number;
  external_hiring_managers_today: number;
  internal_events_today: number;
  new_applicant_accounts: number;
  total_hiring_manager_accounts: number;
  free_analysis_volume: number;
  extraction_success_rate: number;
  global_average_match_score: number | null;
  talent_network_opt_in_rate: number;
  dossier_completion_rate: number;
  final_verdict_volume: number;
  average_final_verdict_hours: number | null;
  cold_start_events: number;
  warm_start_events: number;
  visitors_by_market: Array<{ market: string; visitors: number }>;
  visitors_by_locale: Array<{ locale: string; visitors: number }>;
  daily: UsageSeriesPoint[];
  monthly: UsageSeriesPoint[];
  top_paths: Array<{ path: string; count: number }>;
};

export type PlatformFreeServiceUser = {
  actor_key: string;
  user_id: number | null;
  name: string | null;
  email: string | null;
  role: string | null;
  company_name: string | null;
  organization_type: string | null;
  visitor_id: string | null;
  session_id: string | null;
  host: string | null;
  market: string | null;
  locale: string | null;
  ip_address: string | null;
  is_internal: boolean;
  traffic_source: string;
  internal_reason: string | null;
  first_seen_at: string;
  last_seen_at: string;
  event_count: number;
  services: string[];
  last_path: string | null;
};

export type PlatformFreeServiceUserSummary = {
  period_days: number | null;
  total_users: number;
  registered_users: number;
  anonymous_visitors: number;
  users: PlatformFreeServiceUser[];
};

export type ScoringSandboxFile = {
  path: string;
  name: string;
  size_bytes: number;
  updated_at: string;
};

export type ScoringSandboxStatus = {
  base_dir: string;
  job_titles: string[];
  input_cases: number;
  input_files: number;
  analysis_outputs: number;
  evaluation_reports: number;
  active_regression_cases: number;
  planned_regression_cases: number;
  recent_inputs: ScoringSandboxFile[];
  recent_outputs: ScoringSandboxFile[];
  recent_evaluations: ScoringSandboxFile[];
};

export type ScoringSandboxRunStage = "generate" | "score" | "judge" | "all";

export type ScoringSandboxRunResult = {
  stage: ScoringSandboxRunStage;
  message: string;
  generated_cases: number;
  scored_outputs: number;
  judged_reports: number;
  status: ScoringSandboxStatus;
};

export type ScoringSandboxRealJdResult = {
  case_slug: string;
  message: string;
  generated_cases: number;
  scored_outputs: number;
  judged_reports: number;
  status: ScoringSandboxStatus;
  report: ScoringSandboxPromotionReport;
};

export type ScoringSandboxPromotionCandidate = {
  id: string;
  failure_mode: string;
  case_slug: string;
  resume_file: string;
  requirement: string;
  evidence: string;
  reason: string;
  analysis_path: string;
  proposed_case: Record<string, unknown>;
  already_promoted: boolean;
};

export type ScoringSandboxPromotionReport = {
  raw_candidates: number;
  total_candidates: number;
  unpromoted_candidates: number;
  ignored_candidates: number;
  saved_lesson_candidates: number;
  already_promoted_candidates: number;
  shown_candidates: number;
  candidates: ScoringSandboxPromotionCandidate[];
};

export type ScoringSandboxLessonType =
  | "regression_bug"
  | "adjacent_partial"
  | "correct_match";

export type ScoringSandboxPromoteResult = {
  promoted: string[];
  skipped: string[];
  status: ScoringSandboxStatus;
  report: ScoringSandboxPromotionReport;
};

export type ScoringSandboxIgnoreResult = {
  ignored: string[];
  skipped: string[];
  report: ScoringSandboxPromotionReport;
};

export type PlatformSiteVisitor = PlatformFreeServiceUser;

export type PlatformSiteVisitorSummary = {
  period_days: number | null;
  total_users: number;
  registered_users: number;
  anonymous_visitors: number;
  internal_users: number;
  external_users: number;
  external_registered_users: number;
  external_anonymous_visitors: number;
  users: PlatformSiteVisitor[];
};

export type Interview = {
  id: number;
  application_id: number;
  hiring_manager_id: number | null;
  schedule_time: string | null;
  manager_comment: string | null;
  final_verdict: "Acceptable" | "Strongly recommend" | "Reject" | null;
  created_at: string;
  application: Application | null;
};
