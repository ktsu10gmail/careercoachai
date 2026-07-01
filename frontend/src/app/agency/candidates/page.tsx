"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  DownloadIcon,
  FileTextIcon,
  RefreshCcwIcon,
  SparklesIcon,
  UploadIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  apiFetch,
  type Application,
  type Candidate,
  type CandidatePotentialJobMatch,
  type CandidateResumeImportPreview,
  type Job,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatDateTime, formatScore } from "@/lib/format";

export default function AgencyCandidatesPage() {
  const [token, setToken] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("Checking agency login...");
  const [allowAgencyJobMatching, setAllowAgencyJobMatching] = useState(true);
  const [newCandidateResume, setNewCandidateResume] = useState<File | null>(null);
  const [importedResumeText, setImportedResumeText] = useState("");
  const [importedParsedProfile, setImportedParsedProfile] = useState<Record<string, unknown> | null>(null);
  const [importedExistingCandidateId, setImportedExistingCandidateId] = useState<number | null>(null);
  const [importingCandidate, setImportingCandidate] = useState(false);
  const [uploadingCandidateId, setUploadingCandidateId] = useState<number | null>(null);
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [importedForJobId, setImportedForJobId] = useState("");
  const [potentialMatches, setPotentialMatches] = useState<CandidatePotentialJobMatch[]>([]);
  const [scoringPotentialMatches, setScoringPotentialMatches] = useState(false);
  const [matchJobId, setMatchJobId] = useState("");
  const [busyAction, setBusyAction] = useState("");
  const addCandidateFormRef = useRef<HTMLFormElement | null>(null);

  const selectedCandidate =
    candidates.find((candidate) => candidate.id === selectedCandidateId) || null;
  const ownerOptions = Array.from(
    new Map(
      candidates
        .filter((candidate) => candidate.created_by_user_id && candidate.created_by_name)
        .map((candidate) => [
          String(candidate.created_by_user_id),
          candidate.created_by_name || "Unknown",
        ]),
    ).entries(),
  ).sort((left, right) => left[1].localeCompare(right[1]));
  const [ownerFilter, setOwnerFilter] = useState("all");
  const filteredCandidates = candidates.filter((candidate) => {
    if (ownerFilter === "all") return true;
    if (ownerFilter === "unassigned") return candidate.created_by_user_id === null;
    return candidate.created_by_user_id === Number(ownerFilter);
  });
  const agencyJobs = jobs;
  const selectedMatchJob = agencyJobs.find((job) => job.id === Number(matchJobId));
  const importedForJob = agencyJobs.find((job) => job.id === Number(importedForJobId));
  const duplicateApplication = applications.find(
    (application) => application.job_id === Number(matchJobId),
  );
  const canMatchCandidate = ["HR", "Recruiter"].includes(role);
  const jobOptionLabel = (job: Job) =>
    `${job.client_company_name || "Agency"} - ${job.title}`;
  const matchScoreTone = (score: number) => {
    if (score >= 75) return "bg-emerald-600";
    if (score >= 55) return "bg-cyan-700";
    if (score >= 35) return "bg-amber-600";
    return "bg-muted-foreground";
  };

  async function loadPotentialMatches(candidateId: number) {
    setScoringPotentialMatches(true);
    try {
      const data = await apiFetch<CandidatePotentialJobMatch[]>(
        `/candidates/${candidateId}/potential-matches`,
        { token },
      );
      setPotentialMatches(data);
      if (!data.length) {
        setMessage("Candidate saved. No active client jobs were available for potential matching.");
      }
    } catch (error) {
      setPotentialMatches([]);
      setMessage(detailMessage(error));
    } finally {
      setScoringPotentialMatches(false);
    }
  }

  const loadCandidates = useCallback(async () => {
    try {
      const data = await apiFetch<Candidate[]>("/candidates", { token });
      setCandidates(data);
      setSelectedCandidateId((current) => {
        if (current && data.some((candidate) => candidate.id === current)) {
          return current;
        }
        return data[0]?.id || null;
      });
      setMessage(data.length ? "" : "No candidate profiles yet.");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

  const loadJobs = useCallback(async () => {
    try {
      const data = await apiFetch<Job[]>("/hr/jobs", { token });
      setJobs(data);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

  const loadCandidateApplications = useCallback(
    async (candidateId: number) => {
      try {
        const data = await apiFetch<Application[]>(
          `/candidates/${candidateId}/applications`,
          { token },
        );
        setApplications(data);
      } catch (error) {
        setApplications([]);
        setMessage(detailMessage(error));
      }
    },
    [token],
  );

  useEffect(() => {
    async function init() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      try {
        const me = await getCurrentUser(saved);
        if (me.organization_type !== "Recruiting_Agency") {
          setAuthMessage("This page is only available to recruiting agencies.");
          return;
        }
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.some((role) => ["Company_Admin", "HR", "Recruiter"].includes(role))) {
          setAuthMessage("This page requires an agency admin, HR, or recruiter login.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setRole(me.role);
        setToken(saved);
        setAuthMessage(`Signed in as ${me.name} (${me.role.replace("_", " ")}).`);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }
    void init();
  }, []);

  useEffect(() => {
    if (token) void Promise.resolve().then(() => Promise.all([loadCandidates(), loadJobs()]));
  }, [loadCandidates, loadJobs, token]);

  useEffect(() => {
    if (token && selectedCandidateId) {
      void Promise.resolve().then(() => loadCandidateApplications(selectedCandidateId));
    } else {
      void Promise.resolve().then(() => setApplications([]));
    }
  }, [loadCandidateApplications, selectedCandidateId, token]);

  async function createCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim();
      if (!name || !email) {
        setMessage("Enter name and email, or choose a resume and click Import to auto-populate candidate details.");
        return;
      }
      const payload = {
        name,
        email,
        phone: String(form.get("phone") || "").trim() || null,
        location: String(form.get("location") || "").trim() || null,
        notes: String(form.get("notes") || "").trim() || null,
        imported_for_job_id: importedForJobId ? Number(importedForJobId) : null,
        resume_file_url: String(form.get("resume_file_url") || "").trim() || null,
        resume_text: importedResumeText || null,
        parsed_profile_json: importedParsedProfile,
        consent_talent_network: allowAgencyJobMatching,
      };
      const saved = await apiFetch<Candidate>(
        importedExistingCandidateId
          ? `/candidates/${importedExistingCandidateId}`
          : "/candidates",
        {
          method: importedExistingCandidateId ? "PUT" : "POST",
          token,
          body: JSON.stringify(payload),
        },
      );
      setMessage(`Candidate "${saved.name}" was ${importedExistingCandidateId ? "updated" : "created"}.`);
      formElement.reset();
      setNewCandidateResume(null);
      setImportedResumeText("");
      setImportedParsedProfile(null);
      setImportedExistingCandidateId(null);
      setImportedForJobId("");
      setAllowAgencyJobMatching(true);
      await loadCandidates();
      setSelectedCandidateId(saved.id);
      if (allowAgencyJobMatching) {
        await loadPotentialMatches(saved.id);
      } else {
        setPotentialMatches([]);
      }
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setImportingCandidate(false);
    }
  }

  async function importNewCandidateResume() {
    if (!newCandidateResume) {
      setMessage("Choose a resume before importing candidate details.");
      return;
    }
    const form = new FormData();
    form.append("resume", newCandidateResume);
    setImportingCandidate(true);
    try {
      const preview = await apiFetch<CandidateResumeImportPreview>(
        "/candidates/preview-resume",
        {
          method: "POST",
          token,
          body: form,
        },
      );
      const formElement = addCandidateFormRef.current;
      if (formElement) {
        const setField = (name: string, value: string | null) => {
          const field = formElement.elements.namedItem(name);
          if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
            field.value = value || "";
          }
        };
        setField("name", preview.name);
        setField("email", preview.email);
        setField("phone", preview.phone);
        setField("location", preview.location);
        setField("resume_file_url", preview.resume_file_url);
      }
      setImportedResumeText(preview.resume_text);
      setImportedParsedProfile(preview.parsed_profile_json);
      setImportedExistingCandidateId(preview.existing_candidate_id);
      setMessage(
        preview.existing_candidate_id
          ? "Resume imported. This email already exists, so Add candidate will update that roster profile."
          : "Resume imported. Review the populated details, add notes if needed, then click Add candidate.",
      );
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setImportingCandidate(false);
    }
  }

  async function uploadResume(candidateId: number, file: File | null) {
    if (!file) return;
    const form = new FormData();
    form.append("resume", file);
    setUploadingCandidateId(candidateId);
    try {
      const updated = await apiFetch<Candidate>(
        `/candidates/${candidateId}/upload-resume`,
        {
          method: "POST",
          token,
          body: form,
        },
      );
      setMessage(`Resume uploaded and parsed for ${updated.name}.`);
      await loadCandidates();
      if (selectedCandidateId === candidateId) {
        await loadCandidateApplications(candidateId);
      }
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setUploadingCandidateId(null);
    }
  }

  async function downloadResume(candidate: Candidate) {
    if (!candidate.resume_file_url) {
      setMessage(`${candidate.name} does not have an attached resume.`);
      return;
    }
    try {
      const response = await fetch(`/backend/candidates/${candidate.id}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = candidate.resume_file_url.split("/").pop() || `${candidate.name}-resume`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function matchSelectedCandidate() {
    if (!selectedCandidate) {
      setMessage("Select a candidate first.");
      return;
    }
    if (!matchJobId) {
      setMessage("Select a client job first.");
      return;
    }
    if (duplicateApplication) {
      setMessage(
        `${selectedCandidate.name} is already matched to ${selectedMatchJob?.title || "that job"} as application #${duplicateApplication.id}.`,
      );
      return;
    }
    setBusyAction("match");
    try {
      const application = await apiFetch<Application>(
        `/candidates/${selectedCandidate.id}/match-job`,
        {
          method: "POST",
          token,
          body: JSON.stringify({ job_id: Number(matchJobId) }),
        },
      );
      setMessage(
        `Matched ${selectedCandidate.name} to ${application.job_title || "the selected job"} with score ${formatScore(application.matching_score)}.`,
      );
      await loadCandidateApplications(selectedCandidate.id);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function createCandidateMatch(candidateId: number, jobId: number) {
    setBusyAction(`match-${jobId}`);
    try {
      const application = await apiFetch<Application>(
        `/candidates/${candidateId}/match-job`,
        {
          method: "POST",
          token,
          body: JSON.stringify({ job_id: jobId }),
        },
      );
      setMessage(
        `Matched ${application.candidate_name || selectedCandidate?.name || "candidate"} to ${application.job_title || "the selected job"} with score ${formatScore(application.matching_score)}.`,
      );
      await loadCandidateApplications(candidateId);
      await loadPotentialMatches(candidateId);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  return (
    <AppShell
      eyebrow="Agency candidates"
      title="Manage candidate profiles."
      description={authMessage}
      actions={<GuideLink href="/guides/hr" label="Candidate guide" />}
      contentClassName="max-w-[1500px]"
    >
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel
          title="Add candidate"
          description="Create a recruiter-owned profile manually, or upload a resume to auto-populate basic information."
        >
          <form className="grid gap-5" onSubmit={createCandidate} ref={addCandidateFormRef}>
            <div className="border-l-4 border-l-cyan-700 bg-cyan-50/60 p-4 dark:bg-cyan-950/20">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-cyan-700 text-sm font-semibold text-white">
                    1
                  </span>
                  <div>
                    <div className="flex items-center gap-2 font-semibold">
                      <FileTextIcon className="size-4 text-cyan-800" />
                      Import from resume
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Choose a PDF, DOCX, or TXT resume, then click Import. The system fills
                      the candidate fields below without saving the record yet.
                    </p>
                  </div>
                </div>
                <div className="grid w-full gap-2 sm:w-[220px]">
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-medium shadow-xs hover:bg-muted">
                    <UploadIcon className="size-4" />
                    {newCandidateResume ? "Change resume" : "Choose resume"}
                    <input
                      accept=".txt,.pdf,.docx"
                      className="sr-only"
                      onChange={(event) => {
                        setNewCandidateResume(event.target.files?.[0] || null);
                        setImportedResumeText("");
                        setImportedParsedProfile(null);
                        setImportedExistingCandidateId(null);
                      }}
                      type="file"
                    />
                  </label>
                  <Button
                    className="justify-center"
                    disabled={!newCandidateResume || importingCandidate}
                    onClick={() => void importNewCandidateResume()}
                    type="button"
                    variant="outline"
                  >
                    {importingCandidate ? (
                      <RefreshCcwIcon className="size-4 animate-spin" />
                    ) : (
                      <SparklesIcon className="size-4" />
                    )}
                    Import
                  </Button>
                </div>
              </div>
              {newCandidateResume ? (
                <p className="mt-3 truncate text-sm text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{newCandidateResume.name}</span>
                </p>
              ) : null}
              {importedResumeText ? (
                <div className="mt-3 flex items-start gap-2 text-sm font-medium text-emerald-700">
                  <CheckCircle2Icon className="mt-0.5 size-4 shrink-0" />
                  Basic information populated. Review the fields before adding the candidate.
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 border-l-4 border-l-slate-300 pl-4">
              <div className="flex items-center gap-2 font-semibold">
                <span className="grid size-7 place-items-center rounded-md bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                  2
                </span>
                Review candidate details
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="resume_file_url">Resume file URL</Label>
                <Input id="resume_file_url" name="resume_file_url" />
              </div>
              <div className="grid gap-2">
                <Label>Imported for job</Label>
                <Select
                  value={importedForJobId || "none"}
                  onValueChange={(value) => {
                    const nextValue = value || "none";
                    setImportedForJobId(nextValue === "none" ? "" : nextValue);
                  }}
                >
                  <SelectTrigger className="h-auto min-h-8 w-full whitespace-normal text-left">
                    <SelectValue className="whitespace-normal">
                      {importedForJob ? jobOptionLabel(importedForJob) : "Select the job this candidate came in for"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific job</SelectItem>
                    {agencyJobs.map((job) => (
                      <SelectItem key={job.id} value={String(job.id)}>
                        {jobOptionLabel(job)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs leading-5 text-muted-foreground">
                  Use this to remember the original client job or requisition that prompted the import.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Resume notes</Label>
                <Textarea
                  className="min-h-24"
                  id="notes"
                  name="notes"
                  placeholder="Add recruiter notes, source context, availability, compensation notes, or follow-up reminders."
                />
              </div>
            </div>
            <div className="grid gap-4 border-l-4 border-l-emerald-600 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
              <div className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-emerald-700 text-xs font-semibold text-white">
                  3
                </span>
                <label className="flex items-start gap-3 text-sm">
                  <Checkbox
                    checked={allowAgencyJobMatching}
                    onCheckedChange={(value) => setAllowAgencyJobMatching(Boolean(value))}
                  />
                  <span>
                    <span className="font-semibold">Allow matching across this agency&apos;s jobs</span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      Keeps this candidate private to your agency while scoring potential fits across agency-owned jobs after save.
                    </span>
                  </span>
                </label>
              </div>
              <Button className="w-fit" type="submit">
                {importingCandidate ? (
                  <RefreshCcwIcon className="size-4 animate-spin" />
                ) : (
                  <UserRoundPlusIcon className="size-4" />
                )}
                {importingCandidate ? "Saving..." : "Add candidate"}
              </Button>
            </div>
          </form>
        </Panel>

        <Panel
          title="Candidate roster"
          description="This is your agency's shared candidate database: direct applicants, recruiter-added profiles, and resume imports live here before you match them to client jobs."
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={ownerFilter}
                onValueChange={(value) => setOwnerFilter(value || "all")}
              >
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All owners</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {ownerOptions.map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => void Promise.all([loadCandidates(), loadJobs()])}
                type="button"
                variant="outline"
              >
                <RefreshCcwIcon className="size-4" />
                Refresh
              </Button>
            </div>
          }
        >
          {filteredCandidates.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow
                    className={candidate.id === selectedCandidateId ? "bg-muted/60" : ""}
                    key={candidate.id}
                  >
                    <TableCell className="whitespace-normal">
                      <button
                        className="text-left font-medium underline-offset-4 hover:underline"
                        onClick={() => {
                          setSelectedCandidateId(candidate.id);
                          setMatchJobId("");
                        }}
                        type="button"
                      >
                        {candidate.name}
                      </button>
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {candidate.email}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <span>{[candidate.location, candidate.phone].filter(Boolean).join(" - ") || "No contact details"}</span>
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {candidate.consent_talent_network
                          ? "Reusable across agency jobs"
                          : "Private roster only"}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="grid gap-2">
                        <Badge variant={candidate.resume_text ? "secondary" : "outline"}>
                          {candidate.resume_text ? "Parsed" : "No resume"}
                        </Badge>
                        {candidate.resume_file_url ? (
                          <Button
                            className="w-fit"
                            onClick={() => void downloadResume(candidate)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            <DownloadIcon className="size-4" />
                            Download
                          </Button>
                        ) : null}
                        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
                          <UploadIcon className="size-4" />
                          {uploadingCandidateId === candidate.id ? "Uploading..." : "Upload"}
                          <input
                            accept=".txt,.pdf,.docx"
                            className="sr-only"
                            disabled={uploadingCandidateId === candidate.id}
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              event.target.value = "";
                              void uploadResume(candidate.id, file);
                            }}
                            type="file"
                          />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <span className="font-medium">
                        {candidate.created_by_name || "Unassigned"}
                      </span>
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {candidate.created_by_email || "No owner recorded"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={candidate.applicant_user_id ? "secondary" : "outline"}>
                        {candidate.applicant_user_id ? "Applicant account" : "Recruiter profile"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No candidate profiles yet.</p>
          )}
        </Panel>
      </div>
      {potentialMatches.length || scoringPotentialMatches ? (
        <Panel
          title="Potential matching jobs"
          description="Scored against active jobs owned by this agency after the candidate is saved."
        >
          {scoringPotentialMatches ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCcwIcon className="size-4 animate-spin" />
              Scoring active agency jobs...
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company / Job</TableHead>
                    <TableHead className="w-[220px]">Resume match</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {potentialMatches.map((match) => (
                    <TableRow key={match.job_id}>
                      <TableCell className="whitespace-normal">
                        <div className="grid gap-1">
                          <span className="text-xs font-medium uppercase text-muted-foreground">
                            {match.client_company_name || "Agency"}
                          </span>
                          <span className="font-medium">{match.job_title}</span>
                          {match.imported_for_job ? (
                            <Badge className="w-fit" variant="secondary">
                              Imported-for job
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="grid gap-2">
                          <span className="font-medium">{formatScore(match.match_score)}</span>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${matchScoreTone(match.match_score)}`}
                              style={{ width: `${Math.max(4, Math.min(100, match.match_score))}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={match.already_matched ? "secondary" : "outline"}>
                          {match.already_matched ? "Already matched" : "Potential fit"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          disabled={match.already_matched || busyAction === `match-${match.job_id}` || !selectedCandidateId}
                          onClick={() => {
                            if (selectedCandidateId) void createCandidateMatch(selectedCandidateId, match.job_id);
                          }}
                          size="sm"
                          type="button"
                          variant="outline"
                        >
                          <SparklesIcon className="size-4" />
                          {busyAction === `match-${match.job_id}` ? "Matching..." : "Create match"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Panel>
      ) : null}
      <Panel
        title="Candidate profile"
        description="Review matched jobs and create another client-job match from the selected profile."
      >
        {selectedCandidate ? (
          <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
            <div className="grid gap-4">
              <div className="rounded-md border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCandidate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCandidate.email}
                    </p>
                  </div>
                  <Badge variant={selectedCandidate.resume_text ? "secondary" : "outline"}>
                    {selectedCandidate.resume_text ? "Resume parsed" : "Resume missing"}
                  </Badge>
                </div>
                {selectedCandidate.resume_file_url ? (
                  <Button
                    className="mt-4 w-fit"
                    onClick={() => void downloadResume(selectedCandidate)}
                    type="button"
                    variant="outline"
                  >
                    <DownloadIcon className="size-4" />
                    Download resume
                  </Button>
                ) : null}
                <div className="mt-4 grid gap-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="text-right">{selectedCandidate.phone || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Location</span>
                    <span className="text-right">{selectedCandidate.location || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Source</span>
                    <span className="text-right">
                      {selectedCandidate.applicant_user_id
                        ? "Applicant account"
                        : "Recruiter profile"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="text-right">
                      {selectedCandidate.created_by_name || "Unassigned"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center gap-2 font-semibold">
                  <BriefcaseBusinessIcon className="size-4" />
                  Match to another job
                </div>
                {canMatchCandidate ? (
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label>Client job</Label>
                      <Select
                        value={matchJobId}
                        onValueChange={(value) => setMatchJobId(value || "")}
                      >
                        <SelectTrigger className="h-auto min-h-8 w-full whitespace-normal text-left">
                          <SelectValue className="whitespace-normal">
                            {selectedMatchJob ? jobOptionLabel(selectedMatchJob) : "Select client job"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {agencyJobs.map((job) => (
                            <SelectItem key={job.id} value={String(job.id)}>
                              {jobOptionLabel(job)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {duplicateApplication ? (
                      <p className="text-sm font-medium text-amber-600">
                        Already matched as application #{duplicateApplication.id}.
                      </p>
                    ) : null}
                    <Button
                      className="w-fit"
                      disabled={!matchJobId || Boolean(duplicateApplication) || busyAction === "match"}
                      onClick={() => void matchSelectedCandidate()}
                      type="button"
                    >
                      <SparklesIcon className="size-4" />
                      {busyAction === "match" ? "Matching..." : "Create match"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Sign in as agency HR or recruiter to create candidate matches.
                  </p>
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-md border">
              {applications.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matched job</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Matched by</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="whitespace-normal">
                          <span className="font-medium">
                            {application.job_title || `Job #${application.job_id}`}
                          </span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {application.job_position || "Position not provided"}
                          </span>
                        </TableCell>
                        <TableCell>{formatScore(application.matching_score)}</TableCell>
                        <TableCell className="whitespace-normal">
                          <span>{application.matched_by_name || "Unassigned"}</span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {application.matched_by_email || "No matcher recorded"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{application.status}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          {formatDateTime(application.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="p-4 text-muted-foreground">
                  No matched jobs for this candidate yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a candidate from the roster.</p>
        )}
      </Panel>
      <Message>{message}</Message>
    </AppShell>
  );
}
