"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CopyIcon, FileTextIcon } from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch, type Company, type Job } from "@/lib/api";
import { detailMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function CompanyJobBoardPage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const [companySlug, setCompanySlug] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [message, setMessage] = useState("");
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  function jobUrl(job: Job) {
    if (typeof window === "undefined") return `/apply/${encodeURIComponent(job.job_url)}`;
    return `${window.location.origin}/apply/${encodeURIComponent(job.job_url)}`;
  }

  async function copyJobLink(job: Job) {
    const url = jobUrl(job);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setMessage(`Copied job link for ${job.title}: ${url}`);
    } catch {
      setMessage(`Unable to copy automatically. Job link: ${url}`);
    }
  }

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setCompanySlug(resolved.companySlug);
    }
    void resolveParams();
  }, [params]);

  useEffect(() => {
    if (!companySlug) return;

    async function loadBoard() {
      try {
        const [companyData, jobsData] = await Promise.all([
          apiFetch<Company>(`/companies/by-slug/${encodeURIComponent(companySlug)}`),
          apiFetch<Job[]>(`/companies/by-slug/${encodeURIComponent(companySlug)}/jobs`),
        ]);
        setCompany(companyData);
        setJobs(jobsData);
        setMessage(jobsData.length ? "" : "No active jobs are listed right now.");
      } catch (error) {
        setMessage(detailMessage(error));
      }
    }

    void loadBoard();
  }, [companySlug]);

  return (
    <AppShell
      eyebrow="Company job board"
      title={company ? `${company.name} careers` : "Company careers"}
      description="Review open roles and start a structured application when you are ready."
      actions={
        <>
          <GuideLink href="/guides/applicant" label="Applicant guide" />
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            Career Coaching AI
          </Link>
        </>
      }
    >
      <div className="grid gap-5">
        {company ? (
          <Panel>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{company.name}</h2>
                <p className="mt-2 text-muted-foreground">
                  {[company.industry, company.size].filter(Boolean).join(" · ") ||
                    "Hiring team"}
                </p>
              </div>
              <Badge className="w-fit rounded-full" variant="secondary">
                {jobs.length} active {jobs.length === 1 ? "role" : "roles"}
              </Badge>
            </div>
          </Panel>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {jobs.map((job) => (
            <Panel className="transition hover:-translate-y-0.5 hover:shadow-md" key={job.id}>
              <div className="flex min-h-64 flex-col justify-between gap-6">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{job.status}</Badge>
                    {job.client_company_name ? (
                      <Badge>{job.client_company_name}</Badge>
                    ) : null}
                    {job.employment_type ? (
                      <Badge variant="secondary">{job.employment_type}</Badge>
                    ) : null}
                    {job.work_mode ? <Badge variant="secondary">{job.work_mode}</Badge> : null}
                    {job.salary_range ? (
                      <Badge variant="secondary">{job.salary_range}</Badge>
                    ) : null}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">{job.title}</h2>
                  <p className="mt-1 font-medium text-muted-foreground">{job.position}</p>
                  <div className="mt-4 grid gap-2 rounded-md border bg-muted/20 p-3 text-sm sm:grid-cols-2">
                    {[
                      ["Department", job.department],
                      ["Level", job.job_level],
                      ["Openings", String(job.number_openings || 1)],
                      ["Location", job.location],
                      ["Apply by", formatDate(job.application_deadline)],
                      ["Start date", formatDate(job.target_start_date)],
                    ]
                      .filter(([, value]) => Boolean(value))
                      .map(([label, value]) => (
                        <div className="min-w-0" key={label}>
                          <div className="text-xs font-medium uppercase text-muted-foreground">
                            {label}
                          </div>
                          <div className="truncate font-medium">{value}</div>
                        </div>
                      ))}
                  </div>
                  {job.required_skills ? (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">Skills:</span>{" "}
                      {job.required_skills}
                    </p>
                  ) : null}
                  <p className="mt-4 line-clamp-5 text-sm leading-6 text-muted-foreground">
                    {job.description}
                  </p>
                  {expandedJobId === job.id ? (
                    <div className="mt-4 rounded-md border bg-muted/20 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <FileTextIcon className="size-4" />
                        Full job description
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() =>
                      setExpandedJobId(expandedJobId === job.id ? null : job.id)
                    }
                    type="button"
                    variant="outline"
                  >
                    <FileTextIcon className="size-4" />
                    {expandedJobId === job.id ? "Hide JD" : "View JD"}
                  </Button>
                  <Link
                    className={cn(buttonVariants(), "w-fit")}
                    href={`/apply/${encodeURIComponent(job.job_url)}`}
                  >
                    Apply
                  </Link>
                  <Button
                    onClick={() => void copyJobLink(job)}
                    type="button"
                    variant="outline"
                  >
                    <CopyIcon className="size-4" />
                    Copy link
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        {!jobs.length ? (
          <Panel>
            <p className="text-muted-foreground">
              This company does not have active roles listed right now.
            </p>
          </Panel>
        ) : null}
        <Message>{message}</Message>
      </div>
    </AppShell>
  );
}
