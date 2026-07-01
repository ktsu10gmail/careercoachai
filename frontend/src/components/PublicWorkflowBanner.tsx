import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRightIcon, CheckCircle2Icon, LockKeyholeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BannerIcon = ComponentType<{ className?: string }>;

type WorkflowStep = {
  label: string;
  title: string;
  body: string;
  icon: BannerIcon;
};

type PublicWorkflowBannerProps = {
  badges: string[];
  steps: WorkflowStep[];
  asideTitle: string;
  asideBody: string;
  asideItems: string[];
  action?: {
    href: string;
    label: string;
    icon?: BannerIcon;
  };
  className?: string;
};

export function PublicWorkflowBanner({
  badges,
  steps,
  asideTitle,
  asideBody,
  asideItems,
  action,
  className,
}: PublicWorkflowBannerProps) {
  const ActionIcon = action?.icon;

  return (
    <section className={cn("overflow-hidden rounded-md border bg-white shadow-sm", className)}>
      <div className="grid lg:grid-cols-[1fr_20rem]">
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {badges.map((badge, index) => (
              <Badge
                className={cn(
                  "rounded-full",
                  index === 0 ? "bg-slate-950 text-white hover:bg-slate-950" : "",
                )}
                key={badge}
                variant={index === 0 ? "default" : "secondary"}
              >
                {badge}
              </Badge>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {steps.map(({ label, title, body, icon: Icon }) => (
              <div className="rounded-md border border-slate-200 bg-slate-50/70 p-4" key={title}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                    {label}
                  </span>
                  <Icon className="size-4 text-slate-500" />
                </div>
                <p className="font-semibold text-slate-950">{title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="border-t bg-slate-950 p-5 text-white sm:p-6 lg:border-l lg:border-t-0">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-white/10 text-emerald-200">
              <LockKeyholeIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
                {asideTitle}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{asideBody}</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2 text-sm text-slate-200">
            {asideItems.map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <CheckCircle2Icon className="size-4 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          {action ? (
            <Link
              className={cn(
                buttonVariants(),
                "mt-5 w-full gap-2 bg-emerald-400 text-emerald-950 hover:bg-emerald-300",
              )}
              href={action.href}
            >
              {ActionIcon ? <ActionIcon className="size-4" /> : null}
              {action.label}
              <ArrowRightIcon className="size-4" />
            </Link>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
