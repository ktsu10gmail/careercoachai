"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnalysisEvidenceDetails } from "@/components/AnalysisEvidenceDetails";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  type ApplicantPracticeQuestion,
  type ApplicantPracticeQuestions,
  type ApplicantPracticeResult,
  type ApplicantResumeMatch,
  type ApplicantResumeProfile,
  type Application,
  type Candidate,
  type Job,
  type Question,
  type TalentProfileUpdate,
} from "@/lib/api";
import {
  APPLICANT_TOKEN_KEY,
  clearToken,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  EraserIcon,
  FileUpIcon,
  LightbulbIcon,
  ListChecksIcon,
  LogOutIcon,
  MessageSquareTextIcon,
  RefreshCcwIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

export default function ApplicantPortalPage() {
  const [token, setToken] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationMode, setApplicationMode] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [resume, setResume] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [applicantEmail, setApplicantEmail] = useState("");
  const [talentProfile, setTalentProfile] = useState<Candidate | null>(null);
  const [resumeProfile, setResumeProfile] = useState<ApplicantResumeProfile | null>(null);
  const [studioResume, setStudioResume] = useState<File | null>(null);
  const [loadingResumeProfile, setLoadingResumeProfile] = useState(false);
  const [uploadingStudioResume, setUploadingStudioResume] = useState(false);
  const [matchJobTitle, setMatchJobTitle] = useState("");
  const [matchJobDescription, setMatchJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState<ApplicantResumeMatch | null>(null);
  const [matchingResume, setMatchingResume] = useState(false);
  const [matchError, setMatchError] = useState("");
  const matchResultRef = useRef<HTMLDivElement | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<ApplicantPracticeQuestion[]>([]);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, string>>({});
  const [practiceResult, setPracticeResult] = useState<ApplicantPracticeResult | null>(null);
  const [generatingPractice, setGeneratingPractice] = useState(false);
  const [scoringPractice, setScoringPractice] = useState(false);
  const [talentProfileForm, setTalentProfileForm] = useState<TalentProfileUpdate>({
    name: "",
    phone: null,
    location: null,
    searchable_title: null,
    searchable_skills: [],
    consent_talent_network: false,
    profile_status: "REGISTERED",
  });
  const [skillsText, setSkillsText] = useState("");
  const [savingTalentProfile, setSavingTalentProfile] = useState(false);
  const studioUploadRequestRef = useRef(0);

  const applyTalentProfile = useCallback((profile: Candidate | null, fallbackName = "") => {
    setTalentProfile(profile);
    setTalentProfileForm({
      name: profile?.name || fallbackName,
      phone: profile?.phone || null,
      location: profile?.location || null,
      searchable_title: profile?.searchable_title || null,
      searchable_skills: profile?.searchable_skills || [],
      consent_talent_network: Boolean(profile?.consent_talent_network),
      profile_status:
        profile?.profile_status === "ARCHIVED"
          ? "ARCHIVED"
          : profile?.consent_talent_network
            ? "OPTED_IN"
            : "REGISTERED",
    });
    setSkillsText((profile?.searchable_skills || []).join(", "));
  }, []);

  const loadResumeProfile = useCallback(async (savedToken: string) => {
    if (!savedToken) return;
    setLoadingResumeProfile(true);
    try {
      const data = await apiFetch<ApplicantResumeProfile>("/applicant/resume-profile", {
        token: savedToken,
      });
      setResumeProfile(data);
      if (data.candidate) {
        applyTalentProfile(data.candidate);
      }
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoadingResumeProfile(false);
    }
  }, [applyTalentProfile]);

  const loadTalentProfile = useCallback(async (savedToken: string, fallbackName = "") => {
    if (!savedToken) return;
    try {
      const data = await apiFetch<Candidate | null>("/talent-profile/me", {
        token: savedToken,
      });
      applyTalentProfile(data, fallbackName);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [applyTalentProfile]);

  useEffect(() => {
    async function checkApplicant() {
      const saved = readToken(APPLICANT_TOKEN_KEY);
      if (!saved) {
        window.location.href = `/applicant/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`;
        return;
      }
      try {
        const user = await getCurrentUser(saved);
        if (!(user.roles?.length ? user.roles : [user.role]).includes("Applicant")) {
          clearToken(APPLICANT_TOKEN_KEY);
          setMessage("Please log in with an applicant account.");
          window.setTimeout(() => {
            window.location.href = `/applicant/login?next=${encodeURIComponent(
              `${window.location.pathname}${window.location.search}`,
            )}`;
          }, 900);
          return;
        }
        saveToken(APPLICANT_TOKEN_KEY, saved);
        setToken(saved);
        setApplicantEmail(user.email);
        await loadTalentProfile(saved, user.name);
        await loadResumeProfile(saved);
        const jobUrl = new URLSearchParams(window.location.search).get("job");
        setApplicationMode(Boolean(jobUrl));
        if (jobUrl) {
          const job = await apiFetch<Job>(`/jobs/${encodeURIComponent(jobUrl)}`);
          const data = await apiFetch<Question[]>(
            `/jobs/${encodeURIComponent(job.job_url)}/questions`,
          );
          setSelectedJob(job);
          setQuestions(data);
          setAnswers({});
          setMessage("");
        } else {
          setSelectedJob(null);
          setQuestions([]);
          setAnswers({});
        }
      } catch {
        clearToken(APPLICANT_TOKEN_KEY);
        window.location.href = `/applicant/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`;
      }
    }
    void checkApplicant();
  }, [loadResumeProfile, loadTalentProfile]);

  const readinessScore = Math.round(resumeProfile?.review.readiness_score || 0);
  const completionItems = [
    Boolean(talentProfileForm.name.trim()),
    Boolean(talentProfileForm.searchable_title?.trim()),
    Boolean(talentProfileForm.location?.trim()),
    Boolean(skillsText.trim()),
    Boolean(resumeProfile?.has_resume),
  ];
  const completionScore = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100,
  );

  async function uploadStudioResume() {
    if (!token) return;
    if (!studioResume) {
      setMessage("Choose a resume file first.");
      return;
    }

    const requestId = studioUploadRequestRef.current + 1;
    studioUploadRequestRef.current = requestId;
    const submittedResume = studioResume;
    setUploadingStudioResume(true);
    setMessage(`Reviewing ${submittedResume.name}. This can take a moment.`);
    const form = new FormData();
    form.append("resume", submittedResume);
    try {
      const data = await apiFetch<ApplicantResumeProfile>(
        "/applicant/resume-profile/upload",
        {
          method: "POST",
          token,
          body: form,
        },
      );
      if (studioUploadRequestRef.current !== requestId) {
        return;
      }
      setResumeProfile(data);
      setMatchResult(null);
      setPracticeQuestions([]);
      setPracticeAnswers({});
      setPracticeResult(null);
      if (data.candidate) {
        applyTalentProfile(data.candidate);
      }
      setStudioResume(null);
      setMessage(
        `Resume Studio updated from ${submittedResume.name}. Rerun Match Lab or practice questions for this new resume.`,
      );
    } catch (error) {
      if (studioUploadRequestRef.current === requestId) {
        setMessage(detailMessage(error));
      }
    } finally {
      if (studioUploadRequestRef.current === requestId) {
        setUploadingStudioResume(false);
      }
    }
  }

  async function runResumeMatch() {
    if (!token) return;
    if (!resumeProfile?.has_resume) {
      setMessage("Upload a resume in Resume Studio before running a JD match.");
      return;
    }
    if (matchJobDescription.trim().length < 40) {
      setMessage("Paste a fuller job description before running the match.");
      return;
    }

    setMatchingResume(true);
    setMatchError("");
    setMessage("Comparing your saved resume to the job description.");
    try {
      const data = await apiFetch<ApplicantResumeMatch>("/applicant/resume-match", {
        method: "POST",
        token,
        body: JSON.stringify({
          job_title: matchJobTitle.trim() || talentProfileForm.searchable_title || null,
          job_description: matchJobDescription.trim(),
        }),
      });
      setMatchResult(data);
      setPracticeResult(null);
      setMessage("Resume/JD match complete.");
      window.setTimeout(() => {
        matchResultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    } catch (error) {
      const message = detailMessage(error);
      setMatchError(
        message === "Failed to fetch"
          ? "The browser could not reach the AI matching backend on port 8000. Refresh the portal and confirm you opened it from the same host as the backend, for example localhost or 192.168.1.46."
          : message,
      );
      setMessage(message);
    } finally {
      setMatchingResume(false);
    }
  }

  function clearMatchLab() {
    setMatchJobTitle("");
    setMatchJobDescription("");
    setMatchResult(null);
    setMatchError("");
    setPracticeQuestions([]);
    setPracticeAnswers({});
    setPracticeResult(null);
    setMessage("Match Lab cleared. Paste another job description when ready.");
  }

  async function generatePracticeQuestions() {
    if (!token) return;
    if (matchJobDescription.trim().length < 40) {
      setMessage("Paste a fuller job description before generating practice questions.");
      return;
    }

    setGeneratingPractice(true);
    setMessage("Generating 10 practice questions from the resume and job description.");
    try {
      const data = await apiFetch<ApplicantPracticeQuestions>(
        "/applicant/practice/questions",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            job_title: matchJobTitle.trim() || talentProfileForm.searchable_title || null,
            job_description: matchJobDescription.trim(),
          }),
        },
      );
      setPracticeQuestions(data.questions);
      setPracticeAnswers({});
      setPracticeResult(null);
      setMessage("Practice questions generated.");
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setGeneratingPractice(false);
    }
  }

  async function scorePracticeAnswers() {
    if (!token) return;
    if (!practiceQuestions.length) {
      setMessage("Generate practice questions first.");
      return;
    }
    const answered = Object.values(practiceAnswers).filter((answer) => answer.trim()).length;
    if (!answered) {
      setMessage("Answer at least one practice question before scoring.");
      return;
    }

    setScoringPractice(true);
    setMessage("Scoring your practice answers.");
    try {
      const data = await apiFetch<ApplicantPracticeResult>(
        "/applicant/practice/score",
        {
          method: "POST",
          token,
          body: JSON.stringify({
            job_title: matchJobTitle.trim() || talentProfileForm.searchable_title || null,
            job_description: matchJobDescription.trim(),
            answers: practiceQuestions.map((question) => ({
              question_id: question.id,
              question_text: question.text,
              category: question.category,
              type: question.type,
              skill_type: question.skill_type,
              weight: question.weight,
              rubric: question.rubric,
              answer_text: practiceAnswers[question.id] || "",
            })),
          }),
        },
      );
      setPracticeResult(data);
      setMessage("Practice answers scored.");
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setScoringPractice(false);
    }
  }

  async function saveTalentProfile() {
    if (!token) return;
    setSavingTalentProfile(true);
    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    const profileStatus =
      talentProfileForm.profile_status === "ARCHIVED"
        ? "ARCHIVED"
        : talentProfileForm.consent_talent_network
          ? "OPTED_IN"
          : "REGISTERED";

    try {
      const data = await apiFetch<Candidate>("/talent-profile/me", {
        method: "PUT",
        token,
        body: JSON.stringify({
          ...talentProfileForm,
          phone: talentProfileForm.phone || null,
          location: talentProfileForm.location || null,
          searchable_title: talentProfileForm.searchable_title || null,
          searchable_skills: skills,
          consent_talent_network:
            talentProfileForm.consent_talent_network && profileStatus !== "ARCHIVED",
          profile_status: profileStatus,
        }),
      });
      applyTalentProfile(data, talentProfileForm.name);
      setMessage("Career profile saved.");
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setSavingTalentProfile(false);
    }
  }

  async function submitApplication() {
    const currentToken = readToken(APPLICANT_TOKEN_KEY) || token;
    if (!currentToken) {
      setMessage("Your applicant session expired. Please sign in again before submitting.");
      window.setTimeout(() => {
        window.location.href = `/applicant/login?next=${encodeURIComponent(
          `${window.location.pathname}${window.location.search}`,
        )}`;
      }, 900);
      return;
    }
    if (!selectedJob) {
      setMessage("Select a job first.");
      return;
    }
    if (!resume) {
      setMessage("Choose a resume file.");
      return;
    }

    setSubmitting(true);
    setMessage("Submitting application. This can take a moment while your resume and answers are scored.");
    setSubmittedApplication(null);
    const form = new FormData();
    form.append(
      "application_in",
      JSON.stringify({
        job_id: selectedJob.id,
        answers: questions.map((question) => ({
          question_id: question.id,
          answer_text: answers[question.id] || "",
        })),
      }),
    );
    form.append("resume", resume);

    try {
      const data = await apiFetch<Application>("/applications", {
        method: "POST",
        token: currentToken,
        body: form,
      });
      setSubmittedApplication(data);
      setMessage(
        `Application submitted successfully for ${data.job_title || selectedJob.title}.`,
      );
      setResume(null);
    } catch (error) {
      const message = detailMessage(error);
      if (message === "Could not validate credentials" || message === "User not found") {
        clearToken(APPLICANT_TOKEN_KEY);
        setToken("");
        setMessage("Your applicant session expired. Please sign in again, then submit the application.");
        window.setTimeout(() => {
          window.location.href = `/applicant/login?next=${encodeURIComponent(
            `${window.location.pathname}${window.location.search}`,
          )}`;
        }, 1200);
      } else {
        setMessage(message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  function logoutApplicant() {
    clearToken(APPLICANT_TOKEN_KEY);
    setToken("");
    window.location.href = "/applicant/login";
  }

  return (
    <AppShell
      eyebrow="Applicant portal"
      title="Build a stronger profile before the market opens."
      description="Review your resume, tighten your profile, and keep your career materials ready. Job search stays available when employers are connected."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <GuideLink href="/guides/applicant" />
          <Button className="gap-2" onClick={logoutApplicant} type="button" variant="outline">
            <LogOutIcon className="size-4" />
            Logout
          </Button>
        </div>
      }
    >
      <Panel
        title="Resume Studio"
        description="Private coaching tools for applicants. Upload your latest resume to refresh the review and extracted profile."
        action={
          <Badge className="rounded-full bg-teal-700 text-white hover:bg-teal-700">
            {loadingResumeProfile
              ? "Loading"
              : resumeProfile?.review.score_label || "Resume check"}
          </Badge>
        }
        className="mb-5 overflow-hidden border-teal-200 bg-[linear-gradient(135deg,#f0fdfa_0%,#ffffff_42%,#f8fafc_100%)] dark:border-teal-900 dark:bg-[linear-gradient(135deg,rgba(20,184,166,0.18)_0%,rgba(2,6,23,0.92)_46%,rgba(15,23,42,1)_100%)]"
      >
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            <div className="rounded-lg border bg-background/75 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resume coaching score
                  </p>
                  <p className="mt-1 text-4xl font-semibold tracking-tight">
                    {readinessScore}
                    <span className="text-xl text-muted-foreground">/100</span>
                  </p>
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-md bg-teal-700 text-white">
                  <SparklesIcon className="size-5" />
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-teal-700 transition-all"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {resumeProfile?.review.headline ||
                  "Upload a resume to unlock your private coaching dashboard."}
              </p>
              <p className="mt-3 rounded-md border bg-muted/25 p-3 text-xs leading-5 text-muted-foreground">
                {resumeProfile?.review.score_explanation ||
                  "This is a private resume-coaching score based only on the resume text we can extract. It is not a job-fit score or a measure of your career value."}
              </p>
            </div>

            <div className="rounded-lg border bg-background/75 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Profile completion
                  </p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {completionScore}%
                  </p>
                </div>
                <TargetIcon className="size-5 text-teal-700" />
              </div>
              <div className="mt-4 grid gap-2 text-sm">
                {[
                  ["Name", completionItems[0]],
                  ["Target title", completionItems[1]],
                  ["Location", completionItems[2]],
                  ["Skills", completionItems[3]],
                  ["Resume", completionItems[4]],
                ].map(([label, done]) => (
                  <div
                    className="flex items-center justify-between gap-3"
                    key={String(label)}
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <Badge
                      className={cn(
                        "rounded-full",
                        done
                          ? "bg-emerald-600 text-white hover:bg-emerald-600"
                          : "bg-muted text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {done ? "Done" : "Missing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-background/75 p-4">
              <Label htmlFor="studio-resume">Upload or replace resume</Label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Input
                  accept=".txt,.pdf,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  id="studio-resume"
                  disabled={uploadingStudioResume}
                  onChange={(event) => {
                    setStudioResume(event.target.files?.[0] || null);
                    setMatchResult(null);
                    setPracticeQuestions([]);
                    setPracticeAnswers({});
                    setPracticeResult(null);
                  }}
                  type="file"
                />
                <Button
                  className="gap-2"
                  disabled={uploadingStudioResume}
                  onClick={() => void uploadStudioResume()}
                  type="button"
                >
                  {uploadingStudioResume ? (
                    <RefreshCcwIcon className="size-4 animate-spin" />
                  ) : (
                    <FileUpIcon className="size-4" />
                  )}
                  {uploadingStudioResume ? "Reviewing" : "Review"}
                </Button>
              </div>
              {resumeProfile?.resume_file_name ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Current resume: {resumeProfile.resume_file_name}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border bg-background/75 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <CheckCircle2Icon className="size-4 text-emerald-600" />
                Strengths
              </div>
              <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                {(resumeProfile?.review.strengths.length
                  ? resumeProfile.review.strengths
                  : resumeProfile?.has_resume
                    ? ["No specific strengths were returned for this resume review yet."]
                    : ["Upload a resume to see strengths."]).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-background/75 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <LightbulbIcon className="size-4 text-amber-600" />
                Gaps
              </div>
              <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                {(resumeProfile?.review.gaps.length
                  ? resumeProfile.review.gaps
                  : resumeProfile?.has_resume
                    ? ["No major gaps were identified in this resume review."]
                    : ["Upload a resume to see improvement areas."]).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-background/75 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <ListChecksIcon className="size-4 text-teal-700" />
                Next steps
              </div>
              <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                {(resumeProfile?.review.next_steps.length
                  ? resumeProfile.review.next_steps
                  : resumeProfile?.has_resume
                    ? ["Review your profile fields below and keep your resume updated."]
                    : ["Upload your resume, then update the profile fields below."]).map(
                  (item) => (
                    <p key={item}>{item}</p>
                  ),
                )}
              </div>
            </div>

            {resumeProfile?.review.keywords.length ? (
              <div className="rounded-lg border bg-background/75 p-4 md:col-span-3">
                <p className="mb-3 font-semibold">Keywords found</p>
                <div className="flex flex-wrap gap-2">
                  {resumeProfile.review.keywords.map((keyword) => (
                    <Badge className="rounded-full" key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Panel>

      <Panel
        title="Resume/JD Match Lab"
        description="Paste any job description and compare it with your saved resume. This is private and can be repeated whenever you want to tailor your resume."
        action={
          <Badge className="rounded-full" variant="secondary">
            {talentProfileForm.searchable_title || "No target title"}
          </Badge>
        }
        className="mb-5 border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_48%,#f8fafc_100%)] dark:border-cyan-900 dark:bg-[linear-gradient(135deg,rgba(8,145,178,0.18)_0%,rgba(2,6,23,0.9)_48%,rgba(15,23,42,1)_100%)]"
      >
        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            <div className="rounded-lg border bg-background/75 p-4">
              <p className="font-semibold">How target title is used</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Your target title tells Career Coaching AI what kind of role you want.
                Right now it affects profile completion, Talent Network search, and the
                default label for this match lab. The actual match score still compares
                your resume evidence against the job description you paste.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="match-title">Job title</Label>
              <Input
                id="match-title"
                onChange={(event) => setMatchJobTitle(event.target.value)}
                placeholder={talentProfileForm.searchable_title || "Senior product manager"}
                value={matchJobTitle}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="match-jd">Job description</Label>
                <Button
                  className="h-8 gap-2 px-2"
                  disabled={!matchJobDescription && !matchResult && !practiceQuestions.length}
                  onClick={clearMatchLab}
                  type="button"
                  variant="outline"
                >
                  <EraserIcon className="size-3.5" />
                  Clear
                </Button>
              </div>
              <Textarea
                className="min-h-52"
                id="match-jd"
                onChange={(event) => {
                  setMatchJobDescription(event.target.value);
                  setMatchResult(null);
                  setMatchError("");
                  setPracticeQuestions([]);
                  setPracticeAnswers({});
                  setPracticeResult(null);
                }}
                placeholder="Paste the full job description here..."
                value={matchJobDescription}
              />
              <p className="text-xs text-muted-foreground">
                Try as many job descriptions as you want. Clear the box to start a new
                match before generating practice questions.
              </p>
            </div>

            <Button
              className="w-fit gap-2"
              disabled={matchingResume}
              onClick={() => void runResumeMatch()}
              type="button"
            >
              {matchingResume ? (
                <RefreshCcwIcon className="size-4 animate-spin" />
              ) : (
                <TargetIcon className="size-4" />
              )}
              {matchingResume ? "Matching" : "Run match"}
            </Button>
          </div>

          <div className="rounded-lg border bg-background/75 p-4" ref={matchResultRef}>
            {matchingResume ? (
              <div className="grid h-full min-h-80 place-items-center rounded-md border border-dashed bg-cyan-50/70 p-6 text-center dark:bg-cyan-950/20">
                <div>
                  <RefreshCcwIcon className="mx-auto size-8 animate-spin text-cyan-700" />
                  <p className="mt-4 font-semibold">Building your match report</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    CareerCoachAI is comparing your saved resume against the job
                    description. This can take up to a minute on the local model.
                  </p>
                </div>
              </div>
            ) : matchError ? (
              <div className="grid h-full min-h-80 place-items-center rounded-md border border-rose-200 bg-rose-50 p-6 text-center text-rose-950 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-100">
                <div>
                  <AlertCircleIcon className="mx-auto size-8 text-rose-600" />
                  <p className="mt-4 font-semibold">Match report did not complete</p>
                  <p className="mt-2 max-w-md text-sm leading-6">{matchError}</p>
                  <Button
                    className="mt-4 gap-2"
                    onClick={() => void runResumeMatch()}
                    type="button"
                    variant="outline"
                  >
                    <RefreshCcwIcon className="size-4" />
                    Try again
                  </Button>
                </div>
              </div>
            ) : matchResult ? (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Resume/JD match
                    </p>
                    <h3 className="mt-1 text-3xl font-semibold tracking-tight">
                      {Math.round(matchResult.match_score)}
                      <span className="text-xl text-muted-foreground">/100</span>
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {matchResult.job_title || "Pasted job description"}
                    </p>
                  </div>
                  <Badge className="w-fit rounded-full bg-cyan-700 text-white hover:bg-cyan-700">
                    Private result
                  </Badge>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2 font-semibold">
                      <CheckCircle2Icon className="size-4 text-emerald-600" />
                      Matched evidence
                    </div>
                    <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                      {(matchResult.strengths.length
                        ? matchResult.strengths
                        : ["No strengths were returned. Try a fuller job description."]).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-2 font-semibold">
                      <LightbulbIcon className="size-4 text-amber-600" />
                      Missing or unclear
                    </div>
                    <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                      {(matchResult.weaknesses.length
                        ? matchResult.weaknesses
                        : ["No gaps were returned. Try a more detailed job description to probe fit."]).map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <AnalysisEvidenceDetails analysis={matchResult} />
                </div>
              </div>
            ) : (
              <div className="grid h-full min-h-80 place-items-center rounded-md border border-dashed bg-muted/20 p-6 text-center">
                <div>
                  <TargetIcon className="mx-auto size-8 text-cyan-700" />
                  <p className="mt-4 font-semibold">Compare before you apply</p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Upload one resume, then paste different JDs here whenever you
                    want. Use the gaps to decide what to tailor before submitting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-lg border bg-background/75 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <MessageSquareTextIcon className="size-4 text-cyan-700" />
                Practice interview
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Generate 10 practice questions: 4 JD-based prompts, 3 resume-based
                prompts, and 3 soft-skill prompts. Each question includes
                a rubric so you can see what strong evidence looks like before you answer.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="gap-2"
                disabled={generatingPractice}
                onClick={() => void generatePracticeQuestions()}
                type="button"
                variant="outline"
              >
                {generatingPractice ? (
                  <RefreshCcwIcon className="size-4 animate-spin" />
                ) : (
                  <ListChecksIcon className="size-4" />
                )}
                {generatingPractice ? "Generating" : "Generate 10 practice questions"}
              </Button>
              <Button
                className="gap-2"
                disabled={scoringPractice || practiceQuestions.length === 0}
                onClick={() => void scorePracticeAnswers()}
                type="button"
              >
                {scoringPractice ? (
                  <RefreshCcwIcon className="size-4 animate-spin" />
                ) : (
                  <SparklesIcon className="size-4" />
                )}
                {scoringPractice ? "Scoring" : "Score answers"}
              </Button>
            </div>
          </div>

          {practiceQuestions.length ? (
            <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="max-h-[720px] overflow-auto pr-1">
                <div className="grid gap-3">
                  {practiceQuestions.map((question, index) => (
                    <div
                      className="rounded-lg border bg-muted/15 p-4"
                      key={question.id}
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p className="font-medium">
                          Q{index + 1}. {question.text}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="w-fit rounded-full" variant="secondary">
                            {question.type}
                          </Badge>
                          <Badge className="w-fit rounded-full" variant="secondary">
                            {question.category}
                          </Badge>
                          <Badge
                            className={cn(
                              "w-fit rounded-full",
                              question.skill_type === "Hard"
                                ? "bg-cyan-700 text-white hover:bg-cyan-700"
                                : "bg-amber-600 text-white hover:bg-amber-600",
                            )}
                          >
                            {question.skill_type} {Math.round(question.weight * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 rounded-md border bg-background p-3 text-xs leading-5 text-muted-foreground">
                        <p>
                          <strong className="text-foreground">1:</strong>{" "}
                          {question.rubric["1"] || "Vague, incomplete, or not relevant."}
                        </p>
                        <p>
                          <strong className="text-foreground">3:</strong>{" "}
                          {question.rubric["3"] || "Relevant but missing depth or evidence."}
                        </p>
                        <p>
                          <strong className="text-foreground">5:</strong>{" "}
                          {question.rubric["5"] ||
                            "Specific, complete, evidence-backed answer."}
                        </p>
                      </div>
                      <Textarea
                        className="mt-3 min-h-24 bg-background"
                        onChange={(event) =>
                          setPracticeAnswers((current) => ({
                            ...current,
                            [question.id]: event.target.value,
                          }))
                        }
                        placeholder="Practice your answer here. Use examples, numbers, and decisions you made."
                        value={practiceAnswers[question.id] || ""}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-muted/15 p-4">
                {practiceResult ? (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Practice answer score
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight">
                      {practiceResult.answer_score.toFixed(1)}
                      <span className="text-xl text-muted-foreground">/10</span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Scored {practiceResult.answered_count} of{" "}
                      {practiceResult.total_questions} questions.
                    </p>
                    <div className="mt-4 grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
                        <span className="text-muted-foreground">Hard skill</span>
                        <span className="font-semibold">
                          {practiceResult.hard_score === null
                            ? "Not answered"
                            : `${practiceResult.hard_score.toFixed(1)}/10`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
                        <span className="text-muted-foreground">Soft skill</span>
                        <span className="font-semibold">
                          {practiceResult.soft_score === null
                            ? "Not answered"
                            : `${practiceResult.soft_score.toFixed(1)}/10`}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 rounded-md border bg-background p-4 text-sm leading-6 text-muted-foreground">
                      <pre className="whitespace-pre-wrap font-sans">
                        {practiceResult.coach_comment}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="grid min-h-72 place-items-center text-center">
                    <div>
                      <MessageSquareTextIcon className="mx-auto size-8 text-cyan-700" />
                      <p className="mt-4 font-semibold">Answer, then score</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        You do not need to answer all 20 at once. Score what you have,
                        improve it, and run the score again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel
        title="Career profile"
        description="Keep this profile clean now. You can make it visible to the Talent Network later when you are ready."
        action={
          <Badge
            className={cn(
              "rounded-full",
              talentProfileForm.profile_status === "OPTED_IN"
                ? "bg-emerald-600 text-white hover:bg-emerald-600"
                : talentProfileForm.profile_status === "ARCHIVED"
                  ? "bg-zinc-700 text-white hover:bg-zinc-700"
                  : "bg-amber-600 text-white hover:bg-amber-600",
            )}
          >
            {talentProfileForm.profile_status === "OPTED_IN"
              ? "Visible"
              : talentProfileForm.profile_status === "ARCHIVED"
                ? "Archived"
                : "Hidden"}
          </Badge>
        }
        className="mb-5 overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 via-background to-background dark:border-emerald-900 dark:from-emerald-950/25"
      >
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border bg-background/70 p-4">
            <p className="text-sm font-medium text-muted-foreground">Account email</p>
            <p className="mt-1 font-semibold">{applicantEmail || "Loading..."}</p>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border bg-muted/20 p-3">
              <div>
                <p className="font-medium">Talent Network visibility</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {talentProfileForm.consent_talent_network
                    ? "Profile is opted in."
                    : "Profile is saved privately."}
                </p>
              </div>
              <Switch
                checked={talentProfileForm.consent_talent_network}
                disabled={talentProfileForm.profile_status === "ARCHIVED"}
                onCheckedChange={(checked) =>
                  setTalentProfileForm((current) => ({
                    ...current,
                    consent_talent_network: checked,
                    profile_status: checked ? "OPTED_IN" : "REGISTERED",
                  }))
                }
              />
            </div>
            {talentProfile ? (
              <div className="mt-4 text-sm text-muted-foreground">
                Candidate #{talentProfile.id}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="talent-name">Name</Label>
                <Input
                  id="talent-name"
                  value={talentProfileForm.name}
                  onChange={(event) =>
                    setTalentProfileForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="talent-title">Target title</Label>
                <Input
                  id="talent-title"
                  placeholder="Senior software engineer"
                  value={talentProfileForm.searchable_title || ""}
                  onChange={(event) =>
                    setTalentProfileForm((current) => ({
                      ...current,
                      searchable_title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="talent-phone">Phone</Label>
                <Input
                  id="talent-phone"
                  value={talentProfileForm.phone || ""}
                  onChange={(event) =>
                    setTalentProfileForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="talent-location">Location</Label>
                <Input
                  id="talent-location"
                  value={talentProfileForm.location || ""}
                  onChange={(event) =>
                    setTalentProfileForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="talent-skills">Skills</Label>
              <Input
                id="talent-skills"
                placeholder="Python, FastAPI, PostgreSQL"
                value={skillsText}
                onChange={(event) => setSkillsText(event.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={savingTalentProfile}
                onClick={() => void saveTalentProfile()}
                type="button"
              >
                {savingTalentProfile ? "Saving..." : "Save profile"}
              </Button>
              <Button
                disabled={savingTalentProfile}
                onClick={() => {
                  setTalentProfileForm((current) => ({
                    ...current,
                    consent_talent_network: false,
                    profile_status: "ARCHIVED",
                  }));
                }}
                type="button"
                variant="outline"
              >
                Archive
              </Button>
              {talentProfileForm.profile_status === "ARCHIVED" ? (
                <Button
                  disabled={savingTalentProfile}
                  onClick={() =>
                    setTalentProfileForm((current) => ({
                      ...current,
                      profile_status: "REGISTERED",
                    }))
                  }
                  type="button"
                  variant="outline"
                >
                  Restore
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </Panel>
      {submittedApplication ? (
        <Panel className="mb-5 border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Badge className="mb-3 bg-emerald-600 text-white hover:bg-emerald-600">
                Submission complete
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight">
                Your application was submitted.
              </h2>
              <p className="mt-2 text-sm leading-6">
                We received your application for{" "}
                <strong>{submittedApplication.job_title || selectedJob?.title}</strong>.
                The hiring team can now review your resume, answers, and application
                status.
              </p>
            </div>
            <div className="text-sm leading-6 sm:text-right">
              <p>Application #{submittedApplication.id}</p>
              <p>Status: {submittedApplication.status}</p>
            </div>
          </div>
        </Panel>
      ) : null}
      {applicationMode ? (
        <Panel
          title={selectedJob ? selectedJob.title : "Application"}
          description="This section appears only when you enter the portal from a company job link."
        >
          {selectedJob ? (
            <div className="grid gap-4">
              <div className="rounded-lg border bg-muted/20 p-4">
                <p className="font-semibold">{selectedJob.position}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {selectedJob.description}
                </p>
              </div>
              {questions.map((question, index) => (
                <div className="grid gap-2" key={question.id}>
                  <Label htmlFor={`question-${question.id}`}>
                    Q{index + 1} · {question.category}
                  </Label>
                  <p className="font-medium">{question.text}</p>
                  <Textarea
                    id={`question-${question.id}`}
                    className="min-h-28"
                    onChange={(event) =>
                      setAnswers({ ...answers, [question.id]: event.target.value })
                    }
                    value={answers[question.id] || ""}
                  />
                </div>
              ))}
              <div className="grid gap-2">
                <Label htmlFor="resume">Resume</Label>
                <Input
                  accept=".txt,.pdf,.docx,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  id="resume"
                  onChange={(event) => setResume(event.target.files?.[0] || null)}
                  type="file"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: TXT, PDF, or DOCX.
                </p>
              </div>
              <Button
                className="w-fit"
                disabled={submitting}
                onClick={submitApplication}
                type="button"
              >
                {submitting ? "Submitting..." : "Submit application"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Loading the job from your application link.
            </p>
          )}
        </Panel>
      ) : null}
      <Message>{message}</Message>
    </AppShell>
  );
}
