"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  LightbulbIcon,
  RefreshCcwIcon,
  TargetIcon,
} from "lucide-react";

import { AnalysisEvidenceDetails } from "@/components/AnalysisEvidenceDetails";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch, type ApplicationAnalysis } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

export default function EmployerApplicationAnalysisPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const [applicationId, setApplicationId] = useState("");
  const [token, setToken] = useState("");
  const [analysis, setAnalysis] = useState<ApplicationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function resolveParams() {
      const resolved = await params;
      setApplicationId(resolved.applicationId);
    }
    void resolveParams();
  }, [params]);

  useEffect(() => {
    if (!applicationId) return;

    async function loadAnalysis() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }
      setLoading(true);
      try {
        const me = await getCurrentUser(saved);
        const roles = me.roles?.length ? me.roles : [me.role];
        if (!roles.includes("HR") && !roles.includes("Recruiter")) {
          setMessage("This page requires shared hiring access.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        const data = await apiFetch<ApplicationAnalysis>(
          `/hr/application-analysis/${encodeURIComponent(applicationId)}`,
          { token: saved },
        );
        setAnalysis(data);
        setMessage("");
      } catch (error) {
        const detail = detailMessage(error);
        setMessage(detail);
        if (detail.toLowerCase().includes("not authenticated")) {
          clearToken(EMPLOYER_TOKEN_KEY);
          window.location.href = "/employer/login";
        }
      } finally {
        setLoading(false);
      }
    }

    void loadAnalysis();
  }, [applicationId]);

  async function refreshAnalysis() {
    if (!token || !applicationId) return;
    setLoading(true);
    try {
      const data = await apiFetch<ApplicationAnalysis>(
        `/hr/application-analysis/${encodeURIComponent(applicationId)}`,
        { token },
      );
      setAnalysis(data);
      setMessage("Analysis refreshed from the saved resume and job description.");
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const application = analysis?.application;
  const candidateName =
    application?.candidate_name || application?.applicant_name || "Candidate";
  const jobTitle = application?.job_title || "Job";

  return (
    <AppShell
      eyebrow="Application review"
      title="Resume/JD Analysis"
      description="Evidence-based resume match details generated from the saved resume and job description."
      actions={
        <>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/employer/applications"
          >
            Back to applications
          </Link>
          <Button className="gap-2" disabled={loading} onClick={refreshAnalysis} type="button">
            <RefreshCcwIcon className={loading ? "size-4 animate-spin" : "size-4"} />
            Refresh analysis
          </Button>
        </>
      }
      contentClassName="max-w-[1800px]"
    >
      {loading && !analysis ? (
        <Panel>
          <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-cyan-50/70 p-6 text-center dark:bg-cyan-950/20">
            <div>
              <RefreshCcwIcon className="mx-auto size-8 animate-spin text-cyan-700" />
              <p className="mt-4 font-semibold">Building the match report</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                CareerCoachAI is comparing the saved resume against the job
                description. This can take a moment on the local model.
              </p>
            </div>
          </div>
        </Panel>
      ) : analysis ? (
        <div className="grid gap-5">
          <Panel>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {candidateName}
                </p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                  {Math.round(analysis.match_score)}
                  <span className="text-xl text-muted-foreground">/100</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{jobTitle}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full" variant="secondary">
                  Resume/JD score
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  Answers:{" "}
                  {application?.answer_score === null ||
                  application?.answer_score === undefined
                    ? "Pending"
                    : application.answer_score.toFixed(2)}
                </Badge>
                <Badge className="rounded-full" variant="outline">
                  {application?.status || "Submitted"}
                </Badge>
              </div>
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
            <Panel title="Match summary">
              <div className="grid gap-5">
                <section>
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <CheckCircle2Icon className="size-4 text-emerald-600" />
                    Matched evidence
                  </div>
                  <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                    {(analysis.strengths.length
                      ? analysis.strengths
                      : ["No strengths were returned. Refresh after updating the resume or job description."]).map(
                      (item) => (
                        <p key={item}>{item}</p>
                      ),
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <LightbulbIcon className="size-4 text-amber-600" />
                    Missing or unclear
                  </div>
                  <div className="grid gap-2 text-sm leading-6 text-muted-foreground">
                    {(analysis.weaknesses.length
                      ? analysis.weaknesses
                      : ["No gaps were returned. Refresh after updating the resume or job description."]).map(
                      (item) => (
                        <p key={item}>{item}</p>
                      ),
                    )}
                  </div>
                </section>
              </div>
            </Panel>

            <Panel title="Evidence details">
              <AnalysisEvidenceDetails analysis={analysis} />
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <div className="grid min-h-80 place-items-center rounded-md border border-dashed bg-muted/20 p-6 text-center">
            <div>
              {message ? (
                <AlertCircleIcon className="mx-auto size-8 text-rose-600" />
              ) : (
                <TargetIcon className="mx-auto size-8 text-cyan-700" />
              )}
              <p className="mt-4 font-semibold">
                {message ? "Analysis could not load" : "Select an application"}
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {message ||
                  "Return to Application Review and click a Resume/JD score to open the analysis."}
              </p>
            </div>
          </div>
        </Panel>
      )}
      <Message>{message}</Message>
    </AppShell>
  );
}
