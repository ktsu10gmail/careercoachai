"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  DownloadIcon,
  RefreshCcwIcon,
  SaveIcon,
  SendIcon,
  SparklesIcon,
  UploadIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  type CandidateBatchMatch,
  type CandidateSubmission,
  type Job,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatScore } from "@/lib/format";

export default function AgencyMatchingPage() {
  const [token, setToken] = useState("");
  const [authMessage, setAuthMessage] = useState("Checking agency login...");
  const [message, setMessage] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [jobId, setJobId] = useState("");
  const [matchedApplication, setMatchedApplication] = useState<Application | null>(null);
  const [shortlistResults, setShortlistResults] = useState<CandidateBatchMatch[]>([]);
  const [busy, setBusy] = useState("");
  const [feedbackDrafts, setFeedbackDrafts] = useState<
    Record<number, { status: string; feedback: string }>
  >({});

  const clientJobs = useMemo(
    () => jobs.filter((job) => job.client_company_id !== null),
    [jobs],
  );
  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === Number(candidateId),
  );
  const selectedJob = clientJobs.find((job) => job.id === Number(jobId));

  const loadData = useCallback(async () => {
    try {
      const [candidateData, jobData, submissionData] = await Promise.all([
        apiFetch<Candidate[]>("/candidates", { token }),
        apiFetch<Job[]>("/hr/jobs", { token }),
        apiFetch<CandidateSubmission[]>("/submissions", { token }),
      ]);
      setCandidates(candidateData);
      setJobs(jobData);
      setSubmissions(submissionData);
      setMessage("");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [token]);

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
        if (!roles.some((role) => ["HR", "Recruiter"].includes(role))) {
          setAuthMessage("This page requires an agency HR or recruiter login.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
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
    if (token) void Promise.resolve().then(loadData);
  }, [loadData, token]);

  async function matchCandidate() {
    if (!candidateId || !jobId) {
      setMessage("Select a candidate and a client job first.");
      return;
    }
    setBusy("match");
    try {
      const application = await apiFetch<Application>(
        `/candidates/${candidateId}/match-job`,
        {
          method: "POST",
          token,
          body: JSON.stringify({ job_id: Number(jobId) }),
        },
      );
      setMatchedApplication(application);
      setMessage(
        `Application #${application.id} is ready. Resume/JD score: ${formatScore(
          application.matching_score,
        )}.`,
      );
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusy("");
    }
  }

  async function batchMatchResumes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!jobId) {
      setMessage("Select a client job first.");
      return;
    }
    const formElement = event.currentTarget;
    const input = formElement.elements.namedItem("resumes");
    const files =
      input instanceof HTMLInputElement ? Array.from(input.files || []) : [];
    if (!files.length) {
      setMessage("Upload at least one resume.");
      return;
    }
    if (files.length > 5) {
      setMessage("Upload up to 5 resumes at a time.");
      return;
    }

    const form = new FormData();
    form.append("job_id", jobId);
    files.forEach((file) => form.append("resumes", file));
    setBusy("batch");
    setShortlistResults([]);
    try {
      const results = await apiFetch<CandidateBatchMatch[]>("/candidates/batch-match", {
        method: "POST",
        token,
        body: form,
      });
      setShortlistResults(results);
      setMessage(
        `Scored ${results.length} ${results.length === 1 ? "candidate" : "candidates"} for ${
          clientJobs.find((job) => job.id === Number(jobId))?.title || "the selected job"
        }.`,
      );
      formElement.reset();
      await loadData();
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusy("");
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

  async function submitToClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matchedApplication) {
      setMessage("Create or select a matched application first.");
      return;
    }
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy("submit");
    try {
      const submission = await apiFetch<CandidateSubmission>(
        `/applications/${matchedApplication.id}/submit-to-client`,
        {
          method: "POST",
          token,
          body: JSON.stringify({
            submitted_to_name: String(form.get("submitted_to_name") || "").trim(),
            submitted_to_email: String(form.get("submitted_to_email") || "").trim(),
            submission_status: "pending",
            client_feedback: String(form.get("client_feedback") || "").trim() || null,
          }),
        },
      );
      setMessage(`Submission #${submission.id} was sent to ${submission.submitted_to_name}.`);
      formElement.reset();
      await loadData();
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusy("");
    }
  }

  async function saveFeedback(submission: CandidateSubmission) {
    const draft = feedbackDrafts[submission.id] || {
      status: submission.submission_status,
      feedback: submission.client_feedback || "",
    };
    setBusy(`feedback-${submission.id}`);
    try {
      const updated = await apiFetch<CandidateSubmission>(
        `/submissions/${submission.id}/feedback`,
        {
          method: "PUT",
          token,
          body: JSON.stringify({
            submission_status: draft.status,
            client_feedback: draft.feedback.trim() || null,
          }),
        },
      );
      setMessage(`Submission #${updated.id} updated to ${updated.submission_status}.`);
      await loadData();
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setBusy("");
    }
  }

  function updateFeedbackDraft(
    submission: CandidateSubmission,
    patch: Partial<{ status: string; feedback: string }>,
  ) {
    setFeedbackDrafts((current) => ({
      ...current,
      [submission.id]: {
        status: current[submission.id]?.status || submission.submission_status,
        feedback:
          current[submission.id]?.feedback ?? submission.client_feedback ?? "",
        ...patch,
      },
    }));
  }

  return (
    <AppShell
      eyebrow="Agency matching"
      title="Match candidates to client jobs."
      description={authMessage}
      actions={<GuideLink href="/guides/hr" label="Matching guide" />}
      contentClassName="max-w-[1600px]"
    >
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-5">
          <Panel
            title="Create match"
            description="Choose a candidate and client job to create a scored application."
            action={
              <Button onClick={() => void loadData()} type="button" variant="outline">
                <RefreshCcwIcon className="size-4" />
                Refresh
              </Button>
            }
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Candidate</Label>
                <Select
                  value={candidateId}
                  onValueChange={(value) => {
                    setCandidateId(value || "");
                    setMatchedApplication(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select candidate">
                      {selectedCandidate
                        ? `${selectedCandidate.name} - ${selectedCandidate.email}`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={String(candidate.id)}>
                        {candidate.name} - {candidate.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Client job</Label>
                <Select
                  value={jobId}
                  onValueChange={(value) => {
                    setJobId(value || "");
                    setMatchedApplication(null);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select client job">
                      {selectedJob
                        ? `${selectedJob.title} - ${selectedJob.client_company_name || "Client"}`
                        : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clientJobs.map((job) => (
                      <SelectItem key={job.id} value={String(job.id)}>
                        {job.title} - {job.client_company_name || "Client"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-fit"
                disabled={busy === "match"}
                onClick={matchCandidate}
                type="button"
              >
                <SparklesIcon className="size-4" />
                {busy === "match" ? "Matching..." : "Create scored match"}
              </Button>
              {matchedApplication ? (
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-semibold">
                    Application #{matchedApplication.id}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {matchedApplication.candidate_name} matched to{" "}
                    {matchedApplication.job_title}. Score:{" "}
                    {formatScore(matchedApplication.matching_score)}
                  </p>
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel
            title="Compare shortlist"
            description="Upload a few resumes for the selected client job and rank them by fit."
          >
            <form className="grid gap-4" onSubmit={batchMatchResumes}>
              <div className="grid gap-2">
                <Label htmlFor="shortlist-resumes">Resumes</Label>
                <Input
                  accept=".txt,.pdf,.docx"
                  id="shortlist-resumes"
                  multiple
                  name="resumes"
                  type="file"
                />
              </div>
              <Button className="w-fit" disabled={busy === "batch"} type="submit">
                <UploadIcon className="size-4" />
                {busy === "batch" ? "Scoring shortlist..." : "Upload and score"}
              </Button>
            </form>
            {shortlistResults.length ? (
              <div className="mt-5 overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Resume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortlistResults.map((result) => (
                      <TableRow key={`${result.candidate.id}-${result.filename}`}>
                        <TableCell className="whitespace-normal">
                          <span className="font-medium">{result.candidate.name}</span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {result.candidate.email}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatScore(result.application?.matching_score ?? null)}
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          <Badge variant="secondary">{result.status}</Badge>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {result.message || result.filename}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => void downloadResume(result.candidate)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            <DownloadIcon className="size-4" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </Panel>

          <Panel
            title="Submit to client"
            description="Record the client contact that received this candidate."
          >
            <form className="grid gap-4" onSubmit={submitToClient}>
              <div className="grid gap-2">
                <Label htmlFor="submitted_to_name">Client contact name</Label>
                <Input id="submitted_to_name" name="submitted_to_name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="submitted_to_email">Client contact email</Label>
                <Input id="submitted_to_email" name="submitted_to_email" required type="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client_feedback">Initial notes</Label>
                <Textarea id="client_feedback" name="client_feedback" />
              </div>
              <Button
                className="w-fit"
                disabled={!matchedApplication || busy === "submit"}
                type="submit"
              >
                <SendIcon className="size-4" />
                {busy === "submit" ? "Submitting..." : "Submit to client"}
              </Button>
            </form>
          </Panel>
        </div>

        <Panel title="Recent submissions" description="Track candidates sent to clients.">
          {submissions.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job / Client</TableHead>
                  <TableHead>Sent to</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Feedback</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => {
                  const draft = feedbackDrafts[submission.id] || {
                    status: submission.submission_status,
                    feedback: submission.client_feedback || "",
                  };
                  return (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-normal">
                        <span className="font-medium">
                          {submission.candidate_name || "Unknown candidate"}
                        </span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {submission.candidate_email || ""}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <span>{submission.job_title || "Unknown job"}</span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {submission.client_company_name || "Client"}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        {submission.submitted_to_name}
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {submission.submitted_to_email}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <div className="grid gap-2">
                          <Badge className="w-fit" variant="secondary">
                            {submission.submission_status}
                          </Badge>
                          <Select
                            value={draft.status}
                            onValueChange={(value) =>
                              updateFeedbackDraft(submission, {
                                status: value || submission.submission_status,
                              })
                            }
                          >
                            <SelectTrigger className="w-full min-w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["pending", "reviewed", "accepted", "rejected"].map(
                                (status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-72 whitespace-normal">
                        <div className="grid gap-2">
                          <Textarea
                            aria-label={`Feedback for submission ${submission.id}`}
                            className="min-h-20"
                            onChange={(event) =>
                              updateFeedbackDraft(submission, {
                                feedback: event.target.value,
                              })
                            }
                            value={draft.feedback}
                          />
                          <Button
                            className="w-fit"
                            disabled={busy === `feedback-${submission.id}`}
                            onClick={() => void saveFeedback(submission)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            <SaveIcon className="size-4" />
                            {busy === `feedback-${submission.id}`
                              ? "Saving..."
                              : "Save feedback"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No submissions yet.</p>
          )}
        </Panel>
      </div>
      <Message>{message}</Message>
    </AppShell>
  );
}
