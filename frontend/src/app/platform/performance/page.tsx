"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIcon,
  BarChart3Icon,
  CalendarDaysIcon,
  ListChecksIcon,
  MousePointerClickIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  UserRoundCheckIcon,
  UsersRoundIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppShell, Message, Panel } from "@/components/AppShell";
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
  apiFetch,
  type PlatformPerformanceSummary,
  type PlatformSiteVisitor,
  type PlatformSiteVisitorSummary,
  type UsageSeriesPoint,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";
import { cn } from "@/lib/utils";

const periodOptions = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

const chartColors = {
  visitors: "#0f766e",
  applicants: "#2563eb",
  hiringManagers: "#b45309",
  freeAnalysis: "#7c3aed",
};

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value: number) {
  return `${formatNumber(value)}%`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function maxSeriesValue(points: UsageSeriesPoint[], keys: Array<keyof UsageSeriesPoint>) {
  return Math.max(
    1,
    ...points.flatMap((point) =>
      keys.map((key) => (typeof point[key] === "number" ? Number(point[key]) : 0)),
    ),
  );
}

function linePath(
  points: UsageSeriesPoint[],
  key: keyof UsageSeriesPoint,
  width: number,
  height: number,
  maxValue: number,
) {
  if (!points.length) return "";
  if (points.length === 1) {
    const y = height - (Number(points[0][key]) / maxValue) * height;
    return `M 0 ${y} L ${width} ${y}`;
  }
  return points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - (Number(point[key]) / maxValue) * height;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function TrendChart({ points }: { points: UsageSeriesPoint[] }) {
  const width = 720;
  const height = 260;
  const maxValue = maxSeriesValue(points, [
    "visitors",
    "applicant_active",
    "hiring_manager_active",
  ]);

  if (!points.length) {
    return <EmptyChart label="Usage data will appear as visitors and users interact with the site." />;
  }

  return (
    <div className="overflow-hidden rounded-md border bg-[#fbfcfb] p-4">
      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <Legend color={chartColors.visitors} label="Visitors" />
        <Legend color={chartColors.applicants} label="Applicants" />
        <Legend color={chartColors.hiringManagers} label="Hiring managers" />
      </div>
      <svg className="h-[300px] w-full" viewBox={`0 0 ${width} ${height + 40}`} role="img">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            stroke="#d7dfdc"
            strokeDasharray="4 6"
            x1="0"
            x2={width}
            y1={ratio * height}
            y2={ratio * height}
          />
        ))}
        <path
          d={linePath(points, "visitors", width, height, maxValue)}
          fill="none"
          stroke={chartColors.visitors}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d={linePath(points, "applicant_active", width, height, maxValue)}
          fill="none"
          stroke={chartColors.applicants}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <path
          d={linePath(points, "hiring_manager_active", width, height, maxValue)}
          fill="none"
          stroke={chartColors.hiringManagers}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        {points.map((point, index) => {
          if (index % Math.ceil(points.length / 6) !== 0 && index !== points.length - 1) {
            return null;
          }
          const x = points.length === 1 ? 0 : (index / (points.length - 1)) * width;
          return (
            <text fill="#64716d" fontSize="13" key={point.label} x={x} y={height + 28}>
              {point.label.slice(5)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function MonthlyBars({ points }: { points: UsageSeriesPoint[] }) {
  const maxValue = maxSeriesValue(points, ["visitors", "applicant_active", "hiring_manager_active"]);

  if (!points.length) {
    return <EmptyChart label="Monthly trends will appear after tracked activity is collected." />;
  }

  return (
    <div className="grid gap-3">
      {points.slice(-12).map((point) => (
        <div className="grid gap-2" key={point.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{point.label}</span>
            <span className="text-muted-foreground">
              {point.visitors} visitors · {point.applicant_active} applicants ·{" "}
              {point.hiring_manager_active} HMs
            </span>
          </div>
          <div className="grid h-8 grid-cols-3 overflow-hidden rounded-md border bg-muted/30">
            <div
              className="bg-teal-700"
              style={{ width: `${Math.max(3, (point.visitors / maxValue) * 100)}%` }}
            />
            <div
              className="bg-blue-600"
              style={{ width: `${Math.max(3, (point.applicant_active / maxValue) * 100)}%` }}
            />
            <div
              className="bg-amber-700"
              style={{ width: `${Math.max(3, (point.hiring_manager_active / maxValue) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-md border bg-muted/20 p-6 text-center text-muted-foreground">
      {label}
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
  onClick,
  active = false,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const content = (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 text-left">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      </div>
      <span
        className="grid size-11 shrink-0 place-items-center rounded-md text-white"
        style={{ backgroundColor: accent }}
      >
        <Icon className="size-5" />
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button
        className={cn(
          "rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition hover:border-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active ? "border-slate-900 ring-2 ring-slate-300" : "",
        )}
        onClick={onClick}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Panel>
      {content}
    </Panel>
  );
}

function SiteVisitorsPanel({
  summary,
  loading,
}: {
  summary: PlatformSiteVisitorSummary | null;
  loading: boolean;
}) {
  const [trafficFilter, setTrafficFilter] = useState<"external" | "internal" | "all">("external");
  const users = useMemo(() => {
    const allUsers = summary?.users ?? [];
    if (trafficFilter === "all") return allUsers;
    return allUsers.filter((user) =>
      trafficFilter === "internal" ? user.is_internal : !user.is_internal,
    );
  }, [summary?.users, trafficFilter]);

  return (
    <Panel
      action={<Badge variant="secondary"><ListChecksIcon className="mr-1 size-3" /> Users</Badge>}
      description="Platform Admin-only view of registered accounts and anonymous visitors. Internal means private/local IPs, 173.72.11.225, or any @jetta.com account."
      title="Site users and visitors"
    >
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-md border bg-muted/15 p-3">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-semibold">{formatNumber(summary?.total_users ?? 0)}</p>
          </div>
          <div className="rounded-md border bg-muted/15 p-3">
            <p className="text-sm text-muted-foreground">External</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatNumber(summary?.external_users ?? 0)}
            </p>
          </div>
          <div className="rounded-md border bg-muted/15 p-3">
            <p className="text-sm text-muted-foreground">External registered</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatNumber(summary?.external_registered_users ?? 0)}
            </p>
          </div>
          <div className="rounded-md border bg-muted/15 p-3">
            <p className="text-sm text-muted-foreground">Internal/test</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatNumber(summary?.internal_users ?? 0)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "External only", value: "external" },
            { label: "Internal only", value: "internal" },
            { label: "All activity", value: "all" },
          ].map((option) => (
            <Button
              key={option.value}
              onClick={() => setTrafficFilter(option.value as "external" | "internal" | "all")}
              size="sm"
              type="button"
              variant={trafficFilter === option.value ? "default" : "outline"}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-md border bg-muted/15 p-5 text-sm text-muted-foreground">
            Loading site users and visitors...
          </div>
        ) : users.length ? (
          <div className="overflow-hidden rounded-md border">
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full min-w-[1080px] text-sm">
                <thead className="sticky top-0 bg-slate-950 text-left text-white">
                  <tr>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Activity</th>
                    <th className="px-4 py-3 font-medium">Events</th>
                    <th className="px-4 py-3 font-medium">IP</th>
                    <th className="px-4 py-3 font-medium">Last seen</th>
                    <th className="px-4 py-3 font-medium">Host / path</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <SiteVisitorRow key={user.actor_key} user={user} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-md border bg-muted/15 p-5 text-sm text-muted-foreground">
            No site usage was found for this period.
          </div>
        )}
      </div>
    </Panel>
  );
}

function SiteVisitorRow({ user }: { user: PlatformSiteVisitor }) {
  const displayName = user.name || user.email || "Anonymous visitor";
  const displayEmail = user.email || user.visitor_id || user.session_id || user.actor_key;

  return (
    <tr className="border-t align-top">
      <td className="px-4 py-3">
        <Badge variant={user.is_internal ? "secondary" : "default"}>
          {user.is_internal ? "Internal" : "External"}
        </Badge>
        {user.internal_reason ? (
          <div className="mt-1 text-xs text-muted-foreground">{user.internal_reason}</div>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <div className="font-medium">{displayName}</div>
        <div className="mt-1 max-w-[240px] truncate text-xs text-muted-foreground">
          {displayEmail}
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline">{user.role?.replace("_", " ") || "Unknown"}</Badge>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <div>{user.company_name || "Not tied to company"}</div>
        {user.organization_type ? (
          <div className="mt-1 text-xs">{user.organization_type.replace("_", " ")}</div>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <div className="flex max-w-[300px] flex-wrap gap-1.5">
          {user.services.length ? (
            user.services.map((service) => (
              <Badge key={service} variant="secondary">
                {service}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">Tracked visit</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 font-medium">{user.event_count}</td>
      <td className="px-4 py-3 text-muted-foreground">{user.ip_address || "Unknown"}</td>
      <td className="px-4 py-3 text-muted-foreground">
        <div>{formatDateTime(user.last_seen_at)}</div>
        <div className="mt-1 text-xs">First {formatDateTime(user.first_seen_at)}</div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <div className="max-w-[220px] truncate">{user.host || "Unknown host"}</div>
        <div className="mt-1 max-w-[220px] truncate text-xs">{user.last_path || "No path"}</div>
      </td>
    </tr>
  );
}

function ExternalUsagePanel({ summary }: { summary: PlatformPerformanceSummary }) {
  const externalCards = [
    {
      label: "External visitors today",
      value: summary.external_visitors_today,
      helper: "Anonymous or signed-in visitors outside internal/test rules.",
    },
    {
      label: "External registered today",
      value: summary.external_registered_users_today,
      helper: "Signed-in non-Jetta users seen today.",
    },
    {
      label: "External applicants today",
      value: summary.external_applicants_today,
      helper: "External users on applicant/free-analysis workflows today.",
    },
    {
      label: "External HM today",
      value: summary.external_hiring_managers_today,
      helper: "External users on Hiring Manager workflows today.",
    },
  ];

  const hasExternalToday = externalCards.some((card) => card.value > 0);

  return (
    <Panel
      className={cn(
        "border-slate-300",
        hasExternalToday ? "bg-emerald-50" : "bg-[#f7f8f6]",
      )}
      title="External usage check"
      description="Separates likely real visitor activity from internal testing. Internal traffic includes private/local IPs, 173.72.11.225, and @jetta.com accounts."
    >
      <div className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {externalCards.map((card) => (
            <div className="rounded-md border bg-white p-4" key={card.label}>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold">{formatNumber(card.value)}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.helper}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-white p-4">
            <p className="text-sm text-muted-foreground">External visitors in period</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatNumber(summary.external_visitors)}
            </p>
          </div>
          <div className="rounded-md border bg-white p-4">
            <p className="text-sm text-muted-foreground">Internal/test visitors in period</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatNumber(summary.internal_visitors)}
            </p>
          </div>
          <div className="rounded-md border bg-white p-4">
            <p className="text-sm text-muted-foreground">Internal/test events today</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatNumber(summary.internal_events_today)}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function PlatformPerformancePage() {
  const [token, setToken] = useState("");
  const [period, setPeriod] = useState("30");
  const [summary, setSummary] = useState<PlatformPerformanceSummary | null>(null);
  const [siteVisitors, setSiteVisitors] =
    useState<PlatformSiteVisitorSummary | null>(null);
  const [showSiteVisitors, setShowSiteVisitors] = useState(false);
  const [message, setMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("Checking Platform Admin access...");
  const [loading, setLoading] = useState(false);
  const [siteVisitorsLoading, setSiteVisitorsLoading] = useState(false);

  const loadPerformance = useCallback(
    async (activeToken: string) => {
      if (!activeToken) return;
      setLoading(true);
      setMessage("");
      try {
        const query = period === "all" ? "" : `?period_days=${period}`;
        const data = await apiFetch<PlatformPerformanceSummary>(
          `/platform/performance${query}`,
          { token: activeToken },
        );
        setSummary(data);
      } catch (error) {
        setSummary(null);
        setMessage(detailMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [period],
  );

  const loadSiteVisitors = useCallback(
    async (activeToken = token) => {
      if (!activeToken) return;
      setSiteVisitorsLoading(true);
      setMessage("");
      try {
        const query = period === "all" ? "" : `?period_days=${period}`;
        const data = await apiFetch<PlatformSiteVisitorSummary>(
          `/platform/site-visitors${query}`,
          { token: activeToken },
        );
        setSiteVisitors(data);
      } catch (error) {
        setMessage(detailMessage(error));
      } finally {
        setSiteVisitorsLoading(false);
      }
    },
    [period, token],
  );

  useEffect(() => {
    async function checkPlatformAdmin() {
      const saved = readToken(EMPLOYER_TOKEN_KEY);
      if (!saved) {
        window.location.href = "/employer/login";
        return;
      }

      try {
        const user = await getCurrentUser(saved);
        if (!(user.roles?.length ? user.roles : [user.role]).includes("Platform_Admin")) {
          setAuthMessage("Platform Admin access is required.");
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, saved);
        setToken(saved);
        setAuthMessage(`Signed in as ${user.name} (${user.role.replace("_", " ")}).`);
        window.setTimeout(() => {
          void loadPerformance(saved);
        }, 0);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }
    void checkPlatformAdmin();
  }, [loadPerformance]);

  useEffect(() => {
    if (!showSiteVisitors || !token) return;
    const refreshTimer = window.setTimeout(() => {
      void loadSiteVisitors(token);
    }, 0);
    return () => window.clearTimeout(refreshTimer);
  }, [loadSiteVisitors, showSiteVisitors, token]);

  const adoptionRatio = useMemo(() => {
    const cold = summary?.cold_start_events ?? 0;
    const warm = summary?.warm_start_events ?? 0;
    const total = Math.max(1, cold + warm);
    return {
      cold: Math.round((cold / total) * 100),
      warm: Math.round((warm / total) * 100),
    };
  }, [summary]);

  const metrics = [
    {
      label: "Visitors",
      value: formatNumber(summary?.total_visitors ?? 0),
      helper: `${formatNumber(summary?.external_visitors ?? 0)} external · ${formatNumber(summary?.internal_visitors ?? 0)} internal · click for list`,
      icon: MousePointerClickIcon,
      accent: chartColors.visitors,
      onClick: () => {
        setShowSiteVisitors((current) => !current);
        if (!showSiteVisitors) void loadSiteVisitors();
      },
      active: showSiteVisitors,
    },
    {
      label: "Applicants active",
      value: formatNumber(summary?.monthly_active_applicants ?? 0),
      helper: `${formatNumber(summary?.daily_active_applicants ?? 0)} active today`,
      icon: UserRoundCheckIcon,
      accent: chartColors.applicants,
    },
    {
      label: "Hiring managers active",
      value: formatNumber(summary?.monthly_active_hiring_managers ?? 0),
      helper: `${formatNumber(summary?.daily_active_hiring_managers ?? 0)} active today`,
      icon: UsersRoundIcon,
      accent: chartColors.hiringManagers,
    },
    {
      label: "Free analyses",
      value: formatNumber(summary?.free_analysis_volume ?? 0),
      helper: `${formatPercent(summary?.extraction_success_rate ?? 0)} extraction success`,
      icon: ActivityIcon,
      accent: chartColors.freeAnalysis,
    },
  ];

  return (
    <AppShell
      actions={
        <>
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
          <Button
            disabled={loading || !token}
            onClick={() => void loadPerformance(token)}
            type="button"
            variant="outline"
          >
            <RefreshCcwIcon className={cn("size-4", loading ? "animate-spin" : "")} />
            Refresh
          </Button>
        </>
      }
      contentClassName="max-w-[1540px]"
      description={`Back-office usage analytics for site administrators. ${authMessage}`}
      eyebrow="Platform Admin"
      title="Performance command center."
    >
      <div className="grid gap-5">
        {message ? <Message>{message}</Message> : null}
        {!summary ? (
          <Panel className="border-slate-300 bg-[#f7f8f6]">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
                <BarChart3Icon className={cn("size-5", loading ? "animate-pulse" : "")} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">
                  {loading ? "Loading performance data..." : "Performance data did not load."}
                </p>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  {message ||
                    "The dashboard will show live visitor and user activity after the Platform Admin session is verified and the analytics API responds."}
                </p>
              </div>
            </div>
          </Panel>
        ) : (
          <>
        <Panel className="overflow-hidden border-slate-300 bg-[#f7f8f6]">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-md bg-slate-950 text-white">
                  <ShieldCheckIcon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">Admin-only view</p>
                  <p className="font-semibold">Aggregated usage, no resume text or answers</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border bg-white p-4">
                  <p className="text-sm text-muted-foreground">Match score avg.</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {summary?.global_average_match_score ?? "N/A"}
                  </p>
                </div>
                <div className="rounded-md border bg-white p-4">
                  <p className="text-sm text-muted-foreground">Applicant accounts</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatNumber(summary?.new_applicant_accounts ?? 0)}
                  </p>
                </div>
                <div className="rounded-md border bg-white p-4">
                  <p className="text-sm text-muted-foreground">Talent opt-in</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatPercent(summary?.talent_network_opt_in_rate ?? 0)}
                  </p>
                </div>
                <div className="rounded-md border bg-white p-4">
                  <p className="text-sm text-muted-foreground">Dossier completion</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {formatPercent(summary?.dossier_completion_rate ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md border bg-white p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Cold Start vs. Warm Start</p>
                  <p className="text-lg font-semibold">Adoption signal</p>
                </div>
                <Badge variant="outline">
                  {periodOptions.find((option) => option.value === period)?.label}
                </Badge>
              </div>
              <div className="flex h-5 overflow-hidden rounded-full border bg-muted">
                <div
                  className="h-full bg-teal-700"
                  style={{ width: `${Math.max(2, adoptionRatio.cold)}%` }}
                />
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${Math.max(2, adoptionRatio.warm)}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Cold activity</p>
                  <p className="mt-1 text-2xl font-semibold">{adoptionRatio.cold}%</p>
                </div>
                <div className="rounded-md border bg-muted/20 p-3">
                  <p className="text-muted-foreground">Warm activity</p>
                  <p className="mt-1 text-2xl font-semibold">{adoptionRatio.warm}%</p>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <ExternalUsagePanel summary={summary} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        {showSiteVisitors ? (
          <SiteVisitorsPanel
            loading={siteVisitorsLoading}
            summary={siteVisitors}
          />
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
          <Panel
            action={<Badge variant="secondary"><CalendarDaysIcon className="mr-1 size-3" /> Daily</Badge>}
            description="Unique visitors, applicant activity, and Hiring Manager activity by day."
            title="Daily usage trend"
          >
            <TrendChart points={summary?.daily ?? []} />
          </Panel>

          <Panel
            action={<Badge variant="secondary"><BarChart3Icon className="mr-1 size-3" /> Monthly</Badge>}
            description="Month-over-month traffic and active role usage."
            title="Monthly usage"
          >
            <MonthlyBars points={summary?.monthly ?? []} />
          </Panel>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Hiring Manager decisions" description="Signals from review and final decision workflows.">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">HM accounts</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatNumber(summary?.total_hiring_manager_accounts ?? 0)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Final verdicts</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatNumber(summary?.final_verdict_volume ?? 0)}
                </p>
              </div>
              <div className="rounded-md border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Avg. verdict hours</p>
                <p className="mt-2 text-3xl font-semibold">
                  {formatNumber(summary?.average_final_verdict_hours)}
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Market and locale" description="Early Taiwan launch signals from tracked visits.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">By market</p>
                {(summary?.visitors_by_market ?? []).length ? (
                  summary?.visitors_by_market.map((row) => (
                    <div className="flex items-center justify-between rounded-md border bg-muted/15 p-3" key={row.market}>
                      <span className="font-medium">{row.market}</span>
                      <span className="text-sm text-muted-foreground">{row.visitors} visitors</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No market data yet.</p>
                )}
              </div>
              <div className="grid gap-2">
                <p className="text-sm font-medium text-muted-foreground">By locale</p>
                {(summary?.visitors_by_locale ?? []).length ? (
                  summary?.visitors_by_locale.map((row) => (
                    <div className="flex items-center justify-between rounded-md border bg-muted/15 p-3" key={row.locale}>
                      <span className="font-medium">{row.locale}</span>
                      <span className="text-sm text-muted-foreground">{row.visitors} visitors</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No locale data yet.</p>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="grid gap-5">
          <Panel title="Top visited paths" description="Most viewed tracked pages in the selected period.">
            <div className="grid gap-3">
              {(summary?.top_paths ?? []).length ? (
                summary?.top_paths.map((path) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_80px] items-center gap-4 rounded-md border bg-muted/15 p-3"
                    key={path.path}
                  >
                    <span className="truncate font-medium">{path.path}</span>
                    <span className="text-right text-sm text-muted-foreground">
                      {path.count} views
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Tracked page views will appear here.</p>
              )}
            </div>
          </Panel>
        </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
