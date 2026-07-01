import Link from "next/link";
import { ArrowUpRightIcon, CheckCircle2Icon } from "lucide-react";

import { AppShell, Panel } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

type GuideSection = {
  title: string;
  items: string[];
};

type UserGuidePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  quickFacts: string[];
  sections: GuideSection[];
  workflowLink: {
    href: string;
    label: string;
  };
};

export function UserGuidePage({
  eyebrow,
  title,
  description,
  quickFacts,
  sections,
  workflowLink,
}: UserGuidePageProps) {
  return (
    <AppShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={
        <Link className={buttonVariants()} href={workflowLink.href}>
          {workflowLink.label}
          <ArrowUpRightIcon className="size-4" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <Panel title="At a glance">
          <div className="grid gap-3">
            {quickFacts.map((fact) => (
              <div
                className="flex gap-3 rounded-lg border bg-muted/20 p-3 text-sm leading-6"
                key={fact}
              >
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-5">
          {sections.map((section, sectionIndex) => (
            <Panel
              action={<Badge variant="secondary">{section.items.length} steps</Badge>}
              key={section.title}
              title={`${sectionIndex + 1}. ${section.title}`}
            >
              <ol className="grid gap-3">
                {section.items.map((item, itemIndex) => (
                  <li
                    className="grid gap-1 rounded-lg border bg-background p-4 sm:grid-cols-[2rem_1fr]"
                    key={item}
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {itemIndex + 1}
                    </span>
                    <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
