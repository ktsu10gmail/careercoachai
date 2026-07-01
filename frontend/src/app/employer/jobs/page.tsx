"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { CopyIcon, ExternalLinkIcon, PencilIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, type Job } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

const emptyJob = {
  title: "",
  position: "",
  status: "Active",
  salary_range: "",
  department: "",
  employment_type: "",
  work_mode: "",
  location: "",
  job_level: "",
  number_openings: 1,
  target_start_date: "",
  application_deadline: "",
  required_skills: "",
  description: "",
};

type JobDraft = typeof emptyJob;

function draftFromJob(job: Job): JobDraft {
  return {
    title: job.title,
    position: job.position,
    status: job.status,
    salary_range: job.salary_range || "",
    department: job.department || "",
    employment_type: job.employment_type || "",
    work_mode: job.work_mode || "",
    location: job.location || "",
    job_level: job.job_level || "",
    number_openings: job.number_openings || 1,
    target_start_date: job.target_start_date || "",
    application_deadline: job.application_deadline || "",
    required_skills: job.required_skills || "",
    description: job.description,
  };
}

function payloadFromDraft(draft: JobDraft) {
  return {
    title: draft.title,
    position: draft.position,
    description: draft.description,
    status: draft.status,
    salary_range: draft.salary_range || null,
    department: draft.department || null,
    employment_type: draft.employment_type || null,
    work_mode: draft.work_mode || null,
    location: draft.location || null,
    job_level: draft.job_level || null,
    number_openings: Number(draft.number_openings || 1),
    required_skills: draft.required_skills || null,
    target_start_date: draft.target_start_date || null,
    application_deadline: draft.application_deadline || null,
  };
}

export default function EmployerJobsPage() {
  const [token, setToken] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [draft, setDraft] = useState<JobDraft>(emptyJob);
  const [showCreate, setShowCreate] = useState(false);
  const [message, setMessage] = useState("");
  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) || null,
    [jobs, selectedJobId],
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
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.includes("HR") && !roles.includes("Recruiter")) {
          setMessage("This page requires shared hiring access.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        setCompanySlug(me.company_slug || "");
        await loadJobs(saved);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }
    void init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadJobs(authToken = token, preferredId = selectedJobId) {
    const data = await apiFetch<Job[]>("/hr/jobs", { token: authToken });
    setJobs(data);
    const nextSelected = data.find((job) => job.id === preferredId) || data[0] || null;
    setSelectedJobId(nextSelected?.id || null);
    setDraft(nextSelected ? draftFromJob(nextSelected) : emptyJob);
  }

  function selectJob(job: Job) {
    setShowCreate(false);
    setSelectedJobId(job.id);
    setDraft(draftFromJob(job));
  }

  async function createJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const job = await apiFetch<Job>("/hr/jobs", {
        method: "POST",
        token,
        body: JSON.stringify(payloadFromDraft(draft)),
      });
      toast.success(`Created ${job.title}`);
      setMessage(`Created "${job.title}".`);
      setShowCreate(false);
      await loadJobs(token, job.id);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  async function updateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedJob) return;
    try {
      const job = await apiFetch<Job>(`/hr/jobs/${selectedJob.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payloadFromDraft(draft)),
      });
      toast.success(`Updated ${job.title}`);
      setMessage(`Updated "${job.title}".`);
      await loadJobs(token, job.id);
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }

  function applyUrl(job: Job) {
    if (typeof window === "undefined") return `/apply/${job.job_url}`;
    return `${window.location.origin}/apply/${job.job_url}`;
  }

  async function copyApplyUrl(job: Job) {
    await navigator.clipboard.writeText(applyUrl(job));
    toast.success("Job link copied");
  }

  return (
    <AppShell
      eyebrow="Collaborative workspace"
      title="Jobs & Job Links"
      description="Create, edit, publish, close, and share job links without the application review table."
      actions={
        <>
          <Link className={buttonVariants({ variant: "secondary" })} href="/employer/workspace">
            Back to workspace
          </Link>
          {companySlug ? (
            <Link className={buttonVariants({ variant: "outline" })} href={`/${companySlug}`}>
              Public job board
            </Link>
          ) : null}
        </>
      }
      contentClassName="max-w-[1800px]"
    >
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel
          title="Job list"
          description="Select a job to edit it or copy its public application link."
          action={
            <Button
              onClick={() => {
                setShowCreate(true);
                setSelectedJobId(null);
                setDraft(emptyJob);
              }}
              type="button"
            >
              <PlusIcon className="size-4" />
              New job
            </Button>
          }
        >
          <div className="grid gap-3">
            {jobs.map((job) => (
              <button
                className={`rounded-md border p-4 text-left transition hover:border-primary/45 ${
                  selectedJobId === job.id ? "border-primary bg-primary/5" : "bg-card"
                }`}
                key={job.id}
                onClick={() => selectJob(job)}
                type="button"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold">{job.title}</h3>
                  <Badge variant={job.status === "Active" ? "default" : "outline"}>{job.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {[job.department, job.employment_type, job.work_mode, job.location]
                    .filter(Boolean)
                    .join(" - ") || "No attributes"}
                </p>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                  <span>Openings: {job.number_openings || 1}</span>
                  <span>Apply by: {job.application_deadline || "Not set"}</span>
                  <span>Start: {job.target_start_date || "Not set"}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button onClick={(event) => { event.stopPropagation(); void copyApplyUrl(job); }} size="sm" type="button" variant="outline">
                    <CopyIcon className="size-3.5" />
                    Copy link
                  </Button>
                  <Link className={buttonVariants({ size: "sm", variant: "outline" })} href={`/apply/${job.job_url}`} onClick={(event) => event.stopPropagation()}>
                    <ExternalLinkIcon className="size-3.5" />
                    Open
                  </Link>
                </div>
              </button>
            ))}
            {!jobs.length ? (
              <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                No jobs yet. Create the first opening to generate a public job link.
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel
          title={showCreate ? "Create job" : selectedJob ? "Edit job" : "Create job"}
          description={showCreate ? "Create a new public job opening." : "Update job details and public posting attributes."}
        >
          {selectedJob && !showCreate ? (
            <div className="mb-5 rounded-md border bg-muted/25 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Selected posting
                  </p>
                  <h2 className="mt-1 text-lg font-semibold tracking-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[selectedJob.department, selectedJob.employment_type, selectedJob.work_mode, selectedJob.location]
                      .filter(Boolean)
                      .join(" - ") || "No posting attributes"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => void copyApplyUrl(selectedJob)} type="button" variant="outline">
                    <CopyIcon className="size-4" />
                    Copy link
                  </Button>
                  <Link className={buttonVariants({ variant: "outline" })} href={`/apply/${selectedJob.job_url}`}>
                    <ExternalLinkIcon className="size-4" />
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <JobForm
            draft={draft}
            onCancel={showCreate ? () => { setShowCreate(false); if (jobs[0]) selectJob(jobs[0]); } : undefined}
            onChange={setDraft}
            onSubmit={showCreate || !selectedJob ? createJob : updateJob}
            submitLabel={showCreate || !selectedJob ? "Create job" : "Save job changes"}
          />
        </Panel>
      </div>
      <Message>{message}</Message>
    </AppShell>
  );
}

function JobForm({
  draft,
  submitLabel,
  onCancel,
  onChange,
  onSubmit,
}: {
  draft: JobDraft;
  submitLabel: string;
  onCancel?: () => void;
  onChange: (draft: JobDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const patch = (field: keyof JobDraft, value: string | number) =>
    onChange({ ...draft, [field]: value });

  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={onSubmit}>
      <div className="lg:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Posting
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-title">Title</Label>
        <Input id="jobs-title" required value={draft.title} onChange={(e) => patch("title", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-position">Position</Label>
        <Input id="jobs-position" required value={draft.position} onChange={(e) => patch("position", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Status</Label>
        <Select value={draft.status} onValueChange={(value) => patch("status", value || "Active")}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-salary">Salary range</Label>
        <Input id="jobs-salary" value={draft.salary_range} onChange={(e) => patch("salary_range", e.target.value)} />
      </div>
      <div className="lg:col-span-2">
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Attributes
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-department">Department</Label>
        <Input id="jobs-department" value={draft.department} onChange={(e) => patch("department", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Employment type</Label>
        <Select value={draft.employment_type} onValueChange={(value) => patch("employment_type", value || "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Temporary">Temporary</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Work mode</Label>
        <Select value={draft.work_mode} onValueChange={(value) => patch("work_mode", value || "")}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Select mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="On-site">On-site</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-location">Location</Label>
        <Input id="jobs-location" value={draft.location} onChange={(e) => patch("location", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-level">Job level</Label>
        <Input id="jobs-level" value={draft.job_level} onChange={(e) => patch("job_level", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-openings">Openings</Label>
        <Input id="jobs-openings" min={1} type="number" value={draft.number_openings} onChange={(e) => patch("number_openings", Number(e.target.value || 1))} />
      </div>
      <div className="lg:col-span-2">
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Timeline
        </p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-start">Target start date</Label>
        <Input id="jobs-start" type="date" value={draft.target_start_date} onChange={(e) => patch("target_start_date", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="jobs-deadline">Application deadline</Label>
        <Input id="jobs-deadline" type="date" value={draft.application_deadline} onChange={(e) => patch("application_deadline", e.target.value)} />
      </div>
      <div className="grid gap-2 lg:col-span-2">
        <Label htmlFor="jobs-skills">Required skills</Label>
        <Textarea id="jobs-skills" className="min-h-24" value={draft.required_skills} onChange={(e) => patch("required_skills", e.target.value)} />
      </div>
      <div className="grid gap-2 lg:col-span-2">
        <Label htmlFor="jobs-description">Description</Label>
        <Textarea id="jobs-description" className="min-h-44" required value={draft.description} onChange={(e) => patch("description", e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-3 lg:col-span-2">
        <Button type="submit">
          <PencilIcon className="size-4" />
          {submitLabel}
        </Button>
        {onCancel ? <Button onClick={onCancel} type="button" variant="outline">Cancel</Button> : null}
      </div>
    </form>
  );
}
