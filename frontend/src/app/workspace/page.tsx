import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  SearchCheckIcon,
  UsersRoundIcon,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Choose Workspace | CareerCoachAI",
  description:
    "Choose the CareerCoachAI workspace for applicants, direct-hiring teams, or recruiting agencies.",
  robots: {
    index: false,
    follow: false,
  },
};

const workspaces = [
  {
    title: "Applicants",
    badge: "Job seekers",
    href: "/applicant/login",
    setupHref: "/applicant/setup",
    icon: SearchCheckIcon,
    description:
      "For people looking for jobs, checking resume fit against chosen job descriptions, saving analyses, and returning to improve applications over time.",
    points: ["Free resume-to-JD analysis", "Applicant portal", "Optional Talent Network visibility"],
  },
  {
    title: "Hiring Managers",
    badge: "Direct hiring",
    href: "/employer/login",
    setupHref: "/employer/setup?type=employer",
    icon: Building2Icon,
    description:
      "For employers, HR teams, company admins, and hiring managers who directly hire and want job setup, public job links, applicant review, interview guides, and decision workflows.",
    points: [
      "Employer workspace",
      "Job board and shareable job links",
      "HR and hiring manager roles",
      "Applicant answer scoring",
    ],
  },
  {
    title: "Recruiters",
    badge: "Agency",
    href: "/employer/login?next=/agency/clients",
    setupHref: "/employer/setup?type=agency",
    icon: UsersRoundIcon,
    description:
      "For recruiting agencies and agents who manage client companies, job links, candidate pipelines, matching, submissions, and recruiter performance.",
    points: [
      "Client company job boards and links",
      "Client company management",
      "Candidate matching",
      "Agency submissions",
    ],
  },
];

export default function WorkspacePage() {
  return (
    <AppShell
      eyebrow="Workspace"
      title="Choose the workspace that fits your role."
      description="CareerCoachAI has separate paths for applicants, direct-hiring teams, and recruiting agencies. Pick your role to sign in or create the right account."
      contentClassName="max-w-7xl"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {workspaces.map(({ title, badge, href, setupHref, icon: Icon, description, points }) => (
          <div
            className="group relative flex min-h-[22rem] flex-col rounded-md border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            key={title}
          >
            <Link aria-label={`${title} sign in`} className="absolute inset-0" href={href} />
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-md bg-slate-950 text-white">
                <Icon className="size-5" />
              </span>
              <Badge className="rounded-full" variant="secondary">
                {badge}
              </Badge>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>

            <div className="mt-5 grid gap-2">
              {points.map((point) => (
                <div className="flex items-center gap-2 text-sm text-slate-700" key={point}>
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                Sign in
                <ArrowRightIcon className="size-4 transition group-hover:translate-x-0.5" />
              </div>
              <Link
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "relative z-10 mt-3 w-fit bg-background",
                )}
                href={setupHref}
              >
                Create account
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-md border bg-slate-50 p-4 text-sm leading-6 text-muted-foreground">
        <div className="flex items-start gap-3">
          <BriefcaseBusinessIcon className="mt-0.5 size-4 shrink-0 text-slate-700" />
          <p>
            One email can be connected to the role your organization assigns. If you already have an
            employer or agency account, use the direct-hiring or recruiter path and the workspace will
            route you after sign-in.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
