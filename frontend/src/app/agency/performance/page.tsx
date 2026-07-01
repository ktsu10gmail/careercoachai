"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3Icon,
  CheckCircle2Icon,
  RefreshCcwIcon,
  SendIcon,
  SparklesIcon,
  UsersRoundIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { apiFetch, type RecruiterPerformanceSummary } from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const periodOptions = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

function rate(numerator: number, denominator: number) {
  if (!denominator) return "0%";
  return `${Math.round((numerator / denominator) * 100)}%`;
}

export default function AgencyPerformancePage() {
  const [token, setToken] = useState("");
  const [period, setPeriod] = useState("30");
  const [summary, setSummary] = useState<RecruiterPerformanceSummary | null>(null);
  const [message, setMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("Checking agency login...");

  const loadPerformance = useCallback(async () => {
    try {
      const query = period === "all" ? "" : `?period_days=${period}`;
      const data = await apiFetch<RecruiterPerformanceSummary>(
        `/recruiter-performance${query}`,
        { token },
      );
      setSummary(data);
      setMessage("");
    } catch (error) {
      setMessage(detailMessage(error));
    }
  }, [period, token]);

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
    if (token) void Promise.resolve().then(loadPerformance);
  }, [loadPerformance, token]);

  const maxActivity = useMemo(() => {
    if (!summary?.recruiters.length) return 1;
    return Math.max(
      1,
      ...summary.recruiters.map(
        (recruiter) =>
          recruiter.candidates_added +
          recruiter.matches_created +
          recruiter.submissions_sent,
      ),
    );
  }, [summary]);

  const metrics = [
    {
      label: "Candidates added",
      value: summary?.total_candidates_added ?? 0,
      icon: UsersRoundIcon,
    },
    {
      label: "Matches created",
      value: summary?.total_matches_created ?? 0,
      icon: SparklesIcon,
    },
    {
      label: "Submissions sent",
      value: summary?.total_submissions_sent ?? 0,
      icon: SendIcon,
    },
    {
      label: "Accepted",
      value: summary?.total_accepted_submissions ?? 0,
      icon: CheckCircle2Icon,
    },
  ];

  return (
    <AppShell
      eyebrow="Agency performance"
      title="Recruiter performance dashboard."
      description={authMessage}
      actions={
        <>
          <GuideLink href="/guides/hr" label="Performance guide" />
          <Select value={period} onValueChange={(value) => setPeriod(value || "30")}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => void loadPerformance()} type="button" variant="outline">
            <RefreshCcwIcon className="size-4" />
            Refresh
          </Button>
        </>
      }
      contentClassName="max-w-[1500px]"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Panel key={metric.label}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-md border bg-muted">
                  <Icon className="size-5" />
                </span>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel
        title="Recruiter leaderboard"
        description="Activity is grouped by profile creator, match creator, and submission sender."
        action={
          <Badge variant="outline">
            {periodOptions.find((option) => option.value === period)?.label || "Period"}
          </Badge>
        }
      >
        {summary?.recruiters.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recruiter</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Outcomes</TableHead>
                <TableHead>Last activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.recruiters.map((recruiter, index) => {
                const totalActivity =
                  recruiter.candidates_added +
                  recruiter.matches_created +
                  recruiter.submissions_sent;
                const activityWidth = Math.max(
                  4,
                  Math.round((totalActivity / maxActivity) * 100),
                );
                const lastActivity = [
                  recruiter.last_submission_at,
                  recruiter.last_match_created_at,
                  recruiter.last_candidate_created_at,
                ]
                  .filter(Boolean)
                  .sort()
                  .at(-1);

                return (
                  <TableRow key={recruiter.user_id}>
                    <TableCell className="whitespace-normal">
                      <div className="flex items-start gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-md border text-sm font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-medium">{recruiter.name}</span>
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {recruiter.email}
                          </span>
                          <br />
                          <Badge className="mt-2" variant="secondary">
                            {recruiter.role.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-40">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            index === 0
                              ? "bg-emerald-500"
                              : index === 1
                                ? "bg-sky-500"
                                : "bg-zinc-500",
                          )}
                          style={{ width: `${activityWidth}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {totalActivity} tracked actions
                      </p>
                    </TableCell>
                    <TableCell>{recruiter.candidates_added}</TableCell>
                    <TableCell>{recruiter.matches_created}</TableCell>
                    <TableCell>{recruiter.submissions_sent}</TableCell>
                    <TableCell className="whitespace-normal">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {recruiter.accepted_submissions} accepted
                        </Badge>
                        <Badge variant="outline">
                          {recruiter.pending_submissions} pending
                        </Badge>
                        <Badge variant="outline">
                          {recruiter.rejected_submissions} rejected
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Acceptance {rate(recruiter.accepted_submissions, recruiter.submissions_sent)}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      {lastActivity ? formatDateTime(lastActivity) : "No activity"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <BarChart3Icon className="size-8" />
            <p>No recruiter activity for this period.</p>
          </div>
        )}
      </Panel>
      <Message>{message}</Message>
    </AppShell>
  );
}
