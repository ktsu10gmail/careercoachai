"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useState } from "react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { apiFetch, type Job } from "@/lib/api";
import { APPLICANT_TOKEN_KEY, readToken } from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ApplyPage({
  params,
}: {
  params: Promise<{ jobUrl: string }>;
}) {
  const [jobUrl, setJobUrl] = useState("");
  const [job, setJob] = useState<Job | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setJobUrl(decodeURIComponent(resolved.jobUrl));
    }
    void resolveParams();
  }, [params]);

  useEffect(() => {
    if (!jobUrl) return;

    async function loadJob() {
      try {
        const data = await apiFetch<Job>(`/jobs/${encodeURIComponent(jobUrl)}`);
        setJob(data);
        setMessage("");
      } catch (error) {
        setMessage(detailMessage(error));
      }
    }

    void loadJob();
  }, [jobUrl]);

  const nextPath = jobUrl
    ? `/applicant/portal?job=${encodeURIComponent(jobUrl)}`
    : "/applicant/portal";
  const loginPath = `/applicant/login?next=${encodeURIComponent(nextPath)}`;
  const continueToApplication = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.location.href = readToken(APPLICANT_TOKEN_KEY) ? nextPath : loginPath;
  };

  return (
    <AppShell
      eyebrow="Apply"
      title={job ? job.title : "Start your application"}
      description="Sign in or create an applicant account to upload your resume and complete the standardized assessment."
      actions={
        <>
          <GuideLink href="/guides/applicant" />
          <Link
            className={buttonVariants()}
            href={loginPath}
            onClick={continueToApplication}
          >
            Continue
          </Link>
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Panel title={job ? job.title : "Role"}>
          {job ? (
            <div className="grid gap-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{job.status}</Badge>
                <Badge variant="secondary">{job.position}</Badge>
                {job.salary_range ? (
                  <Badge variant="secondary">{job.salary_range}</Badge>
                ) : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                {job.description}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading role...</p>
          )}
        </Panel>

        <Panel title="Application steps">
          <div className="grid gap-4">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="font-semibold">Single session assessment</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You will upload a TXT, PDF, or DOCX resume and answer 10 role-specific
                questions: 7 hard skill and 3 soft skill.
              </p>
            </div>
            <div className="grid gap-3">
              <Link
                className={cn(buttonVariants(), "w-full")}
                href={loginPath}
                onClick={continueToApplication}
              >
                Sign in and apply
              </Link>
              <Link
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                href={`/applicant/setup?next=${encodeURIComponent(nextPath)}`}
              >
                Create applicant account
              </Link>
            </div>
          </div>
        </Panel>
      </div>
      <Message>{message}</Message>
    </AppShell>
  );
}
