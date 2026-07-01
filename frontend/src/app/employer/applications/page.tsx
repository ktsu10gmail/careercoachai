"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiFetch, type Application, type Job } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatScore } from "@/lib/format";

const stages = [
  "all",
  "Submitted",
  "Pre-qualified",
  "Offer pending",
  "On hold",
  "Hired",
  "Rejected",
];

export default function EmployerApplicationsPage() {
  const [token, setToken] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [stage, setStage] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function init() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      try {
        const me = await getCurrentUser(saved);
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.includes("HR") && !roles.includes("Recruiter")) {
          setMessage("This page requires shared hiring access.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        const [jobData, applicationData] = await Promise.all([
          apiFetch<Job[]>("/hr/jobs", { token: saved }),
          apiFetch<Application[]>("/hr/applications", { token: saved }),
        ]);
        setJobs(jobData);
        setApplications(applicationData);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }
    void init();
  }, []);

  const filtered = useMemo(
    () =>
      applications.filter((application) => {
        const jobMatches =
          selectedJobId === "all" || String(application.job_id) === selectedJobId;
        const stageMatches = stage === "all" || application.status === stage;
        return jobMatches && stageMatches;
      }),
    [applications, selectedJobId, stage],
  );

  async function refresh() {
    if (!token) return;
    try {
      const data = await apiFetch<Application[]>("/hr/applications", { token });
      setApplications(data);
      setMessage("");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  return (
    <AppShell
      eyebrow="Collaborative workspace"
      title="Applicant Review"
      description="Review applications, match scores, answer scores, and candidate status without job setup controls."
      actions={
        <>
          <Link className={buttonVariants({ variant: "secondary" })} href="/employer/workspace">
            Back to workspace
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} href="/hr/dashboard">
            Open full HR tools
          </Link>
        </>
      }
      contentClassName="max-w-[1800px]"
    >
      <Panel title="Applications" description="Filter by job or status. Use full HR tools for scheduling and final workflow actions.">
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]">
          <Select value={selectedJobId} onValueChange={(value) => setSelectedJobId(value || "all")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={String(job.id)}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={stage} onValueChange={(value) => setStage(value || "all")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stages.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "all" ? "All statuses" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={refresh} type="button">Refresh</Button>
        </div>

        <div className="grid gap-3">
          {filtered.map((application) => (
            <div className="rounded-md border bg-card p-4" key={application.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {application.candidate_name || application.applicant_name || "Unknown candidate"}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {application.candidate_email || application.applicant_email || "No email"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {application.matching_score === null ||
                  application.matching_score === undefined ? null : (
                    <Link
                      className={buttonVariants({ size: "sm", variant: "secondary" })}
                      href={`/employer/applications/${application.id}/analysis`}
                    >
                      View analysis
                    </Link>
                  )}
                  <Badge variant="outline">{application.status}</Badge>
                </div>
              </div>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
                <div>
                  <p className="text-muted-foreground">Job</p>
                  <p className="font-medium">{application.job_title || `Job #${application.job_id}`}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Resume/JD score</p>
                  {application.matching_score === null ||
                  application.matching_score === undefined ? (
                    <p className="font-medium">{formatScore(application.matching_score)}</p>
                  ) : (
                    <Link
                      className="font-medium text-cyan-700 underline-offset-4 hover:underline"
                      href={`/employer/applications/${application.id}/analysis`}
                    >
                      {formatScore(application.matching_score)}
                    </Link>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground">Answer score</p>
                  <p className="font-medium">{formatScore(application.answer_score)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Submitted</p>
                  <p className="font-medium">{new Date(application.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              {application.resume_comment || application.answer_comment ? (
                <div className="mt-4 grid gap-3 text-sm lg:grid-cols-2">
                  {application.resume_comment ? (
                    <p className="rounded-md bg-muted/40 p-3 leading-6">{application.resume_comment}</p>
                  ) : null}
                  {application.answer_comment ? (
                    <p className="rounded-md bg-muted/40 p-3 leading-6">{application.answer_comment}</p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
          {!filtered.length ? (
            <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
              No applications match the current filters.
            </div>
          ) : null}
        </div>
      </Panel>
      <Message>{message}</Message>
    </AppShell>
  );
}
