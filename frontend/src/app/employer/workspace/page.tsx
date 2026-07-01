"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3Icon,
  BeakerIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  ClipboardListIcon,
  Clock3Icon,
  MailPlusIcon,
  Settings2Icon,
  UsersRoundIcon,
} from "lucide-react";
import { AppShell, Message, Panel } from "@/components/AppShell";
import { GuideLink } from "@/components/GuideLink";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  listWorkspaceActivity,
  type User,
  type UserRole,
  type WorkspaceActivityEvent,
} from "@/lib/api";
import {
  clearToken,
  EMPLOYER_TOKEN_KEY,
  getCurrentUser,
  readToken,
  saveToken,
} from "@/lib/auth";
import { detailMessage } from "@/lib/format";

type Workspace = {
  title: string;
  body: string;
  href: string;
  icon: typeof Settings2Icon;
  roles?: UserRole[];
  agencyOnly?: boolean;
};

const collaborativeWorkspaces: Workspace[] = [
  {
    title: "Team Members",
    body: "Invite coworkers into the shared workspace and review recent enrollment activity.",
    href: "/employer/team-invite",
    icon: MailPlusIcon,
  },
  {
    title: "Jobs & Job Links",
    body: "Create jobs, manage openings, and share public application links.",
    href: "/employer/jobs",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Applicant Review",
    body: "Review scores, resume evidence, gaps, recommendations, and applicant status.",
    href: "/employer/applications",
    icon: ClipboardListIcon,
  },
  {
    title: "Interview Scheduling",
    body: "Move candidates into interviews and coordinate next steps with the team.",
    href: "/hr/dashboard",
    icon: UsersRoundIcon,
  },
  {
    title: "Interview Feedback",
    body: "Open interview work, add comments, and record team hiring feedback.",
    href: "/hiring_manager/interviews",
    icon: Clock3Icon,
  },
  {
    title: "Client Companies",
    body: "Manage agency clients before opening roles on their behalf.",
    href: "/agency/clients",
    icon: Building2Icon,
    agencyOnly: true,
  },
  {
    title: "Candidate Matching",
    body: "Match candidates to client jobs and submit shortlists.",
    href: "/agency/matching",
    icon: ClipboardListIcon,
    agencyOnly: true,
  },
  {
    title: "Agency Performance",
    body: "Track recruiter activity, submissions, and outcomes.",
    href: "/agency/performance",
    icon: BarChart3Icon,
    agencyOnly: true,
  },
];

const workspaces: Workspace[] = [
  {
    title: "Company Admin",
    body: "Manage users, roles, emails, and access.",
    href: "/employer/admin",
    roles: ["Company_Admin"],
    icon: Settings2Icon,
  },
  {
    title: "HR Dashboard",
    body: "Create jobs, review applications, and pre-qualify candidates.",
    href: "/hr/dashboard",
    roles: ["HR", "Recruiter"],
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Hiring Manager",
    body: "Review assigned interviews and submit decisions.",
    href: "/hiring_manager/interviews",
    roles: ["Hiring_Manager"],
    icon: UsersRoundIcon,
  },
  {
    title: "Client Companies",
    body: "Manage agency clients before opening roles on their behalf.",
    href: "/agency/clients",
    roles: ["Company_Admin", "HR", "Recruiter"],
    icon: Building2Icon,
    agencyOnly: true,
  },
  {
    title: "Candidate Matching",
    body: "Match candidates to client jobs and submit shortlists.",
    href: "/agency/matching",
    roles: ["HR", "Recruiter"],
    icon: ClipboardListIcon,
    agencyOnly: true,
  },
  {
    title: "Agency Performance",
    body: "Track recruiter activity, submissions, and outcomes.",
    href: "/agency/performance",
    roles: ["Company_Admin", "HR", "Recruiter"],
    icon: BarChart3Icon,
    agencyOnly: true,
  },
  {
    title: "Platform Performance",
    body: "Review sitewide visitors and launch adoption signals.",
    href: "/platform/performance",
    roles: ["Platform_Admin"],
    icon: BarChart3Icon,
  },
  {
    title: "Scoring Sandbox",
    body: "Generate synthetic JDs and resumes, run scoring QA, and review judge reports.",
    href: "/platform/scoring-sandbox",
    roles: ["Platform_Admin"],
    icon: BeakerIcon,
  },
];

export default function EmployerWorkspacePage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [activity, setActivity] = useState<WorkspaceActivityEvent[]>([]);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [activityOffset, setActivityOffset] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const token = readToken(EMPLOYER_TOKEN_KEY);
      if (!token) {
        window.location.href = "/employer/login";
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);
        const roles = currentUser.roles?.length ? currentUser.roles : [currentUser.role];
        if (roles.includes("Applicant")) {
          clearToken(EMPLOYER_TOKEN_KEY);
          window.location.href = "/employer/login";
          return;
        }
        saveToken(EMPLOYER_TOKEN_KEY, token);
        setToken(token);
        setUser(currentUser);
        const recentActivity = await listWorkspaceActivity(token, { limit: 5, offset: 0 });
        setActivity(recentActivity);
      } catch (error) {
        clearToken(EMPLOYER_TOKEN_KEY);
        setMessage(detailMessage(error));
        window.location.href = "/employer/login";
      }
    }

    void init();
  }, []);

  const userRoles = useMemo(() => {
    if (!user) return [];
    return user.roles?.length ? user.roles : [user.role];
  }, [user]);
  const canInvite = userRoles.includes("Company_Admin");
  const isCollaborative = user?.access_model === "Collaborative";
  const boardHref = user?.company_slug ? `/${user.company_slug}` : "";
  const availableWorkspaces = useMemo(() => {
    if (!user) return [];
    if (user.access_model === "Collaborative") {
      return collaborativeWorkspaces.filter(
        (workspace) => !workspace.agencyOnly || user.organization_type === "Recruiting_Agency",
      );
    }
    return workspaces
      .filter((workspace) => workspace.roles?.some((role) => userRoles.includes(role)))
      .filter((workspace) => !workspace.agencyOnly || user.organization_type === "Recruiting_Agency");
  }, [user, userRoles]);

  const guideHref =
    userRoles.includes("Platform_Admin")
      ? "/platform/performance"
      : userRoles.includes("Company_Admin")
      ? "/guides/company-admin"
      : userRoles.includes("Hiring_Manager")
        ? "/guides/hiring-manager"
        : "/guides/hr";

  async function loadActivity(nextOffset: number, expanded = activityExpanded) {
    if (!token) return;
    setActivityLoading(true);
    try {
      const events = await listWorkspaceActivity(token, {
        limit: expanded ? 10 : 5,
        offset: nextOffset,
      });
      setActivity(events);
      setActivityOffset(nextOffset);
    } catch (error) {
      setMessage(detailMessage(error));
    } finally {
      setActivityLoading(false);
    }
  }

  async function showMoreActivity() {
    setActivityExpanded(true);
    await loadActivity(0, true);
  }

  async function showLessActivity() {
    setActivityExpanded(false);
    await loadActivity(0, false);
  }

  return (
    <AppShell
      eyebrow={user?.organization_type === "Recruiting_Agency" ? "Agency workspace" : "Employer workspace"}
      title={user?.company_name ? `${user.company_name} workspace` : "Workspace"}
      description={
        user
          ? isCollaborative
            ? `Signed in as ${user.name}. Your team shares one collaborative hiring workspace.`
            : `Signed in as ${user.name}. Open the tools available for your role.`
          : "Checking employer login..."
      }
      actions={
        <>
          {canInvite ? (
            <Link className={buttonVariants()} href="/employer/team-invite">
              <MailPlusIcon className="size-4" />
              Invite teammates
            </Link>
          ) : null}
          <GuideLink href={guideHref} />
          {boardHref ? (
            <Link className={buttonVariants({ variant: "outline" })} href={boardHref}>
              View public job board
            </Link>
          ) : null}
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isCollaborative ? (
          <Panel className="md:col-span-2 xl:col-span-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-3 rounded-full" variant="secondary">
                  Collaborative workspace
                </Badge>
                <h2 className="text-xl font-semibold tracking-tight">Shared team dashboard</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                  Everyone in this workspace can use the same hiring tools. Activity
                  below keeps changes traceable by teammate.
                </p>
              </div>
              <Badge className="rounded-full" variant="outline">
                Shared permissions
              </Badge>
            </div>
          </Panel>
        ) : null}
        {availableWorkspaces.map((workspace) => {
          const Icon = workspace.icon;
          return (
            <Link
              className="group rounded-md border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-sm"
              href={workspace.href}
              key={`${workspace.title}-${workspace.href}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid size-9 place-items-center rounded-md border bg-muted">
                  <Icon className="size-4" />
                </span>
                <Badge className="rounded-full" variant="outline">
                  Open
                </Badge>
              </div>
              <h3 className="font-semibold tracking-tight">{workspace.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{workspace.body}</p>
            </Link>
          );
        })}
        {user && !availableWorkspaces.length ? (
          <Panel>
            <p className="text-muted-foreground">No employer workspace is available for this role.</p>
          </Panel>
        ) : null}
      </div>
      {user ? (
        <Panel
          action={
            activityExpanded ? (
              <Button disabled={activityLoading} onClick={showLessActivity} type="button" variant="outline">
                Show latest 5
              </Button>
            ) : activity.length >= 5 ? (
              <Button disabled={activityLoading} onClick={showMoreActivity} type="button" variant="outline">
                View more activity
              </Button>
            ) : null
          }
          className="mt-5"
          title={activityExpanded ? "Activity history" : "Recent Activity"}
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-6 text-muted-foreground">
                {activityExpanded
                  ? "Showing 10 activities per page for this company workspace."
                  : "Latest 5 traceable workspace actions for this company."}
              </p>
              <Badge className="rounded-full" variant="secondary">
                Company-scoped
              </Badge>
            </div>

            {activity.length ? (
              <div className="grid gap-3">
                {activity.map((event) => (
                  <div
                    className="grid gap-3 rounded-md border bg-muted/20 p-4 sm:grid-cols-[auto_1fr_auto]"
                    key={event.id}
                  >
                    <span className="grid size-9 place-items-center rounded-md border bg-background text-muted-foreground">
                      <Clock3Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-6">{event.summary}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {event.actor_name_snapshot || "Workspace user"}
                        {event.entity_label ? ` • ${event.entity_label}` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      <Badge className="rounded-full" variant="outline">
                        {event.event_type.replaceAll("_", " ")}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-md border bg-muted/30 p-4 text-sm text-muted-foreground">
                No workspace activity has been recorded yet.
              </div>
            )}

            {activityExpanded ? (
              <div className="flex items-center justify-between gap-3">
                <Button
                  disabled={activityLoading || activityOffset === 0}
                  onClick={() => loadActivity(Math.max(0, activityOffset - 10), true)}
                  type="button"
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Showing {activityOffset + 1}-{activityOffset + activity.length}
                </span>
                <Button
                  disabled={activityLoading || activity.length < 10}
                  onClick={() => loadActivity(activityOffset + 10, true)}
                  type="button"
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            ) : null}
          </div>
        </Panel>
      ) : null}
      <Message>{message}</Message>
    </AppShell>
  );
}
