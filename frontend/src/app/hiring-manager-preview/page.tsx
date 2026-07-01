import Link from "next/link";
import type { Metadata } from "next";
import {
  ClipboardListIcon,
  FileQuestionIcon,
  SendIcon,
  UploadIcon,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { HiringManagerPublicWorkbench } from "@/components/HiringManagerPublicWorkbench";
import { PublicWorkflowBanner } from "@/components/PublicWorkflowBanner";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hiring Manager Preview | CareerCoachAI",
  description:
    "Paste a job description, upload a resume, review fit evidence, and generate focused interview questions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HiringManagerPreviewPage() {
  const workflowSteps = [
    {
      label: "1",
      title: "Paste the Job Description",
      body: "Use the role, responsibilities, requirements, and qualifications.",
      icon: ClipboardListIcon,
    },
    {
      label: "2",
      title: "Upload one resume",
      body: "The preview reads the resume only for this private pre-screen.",
      icon: UploadIcon,
    },
    {
      label: "3",
      title: "Review evidence",
      body: "See matched requirements, gaps to verify, and a focused guide.",
      icon: FileQuestionIcon,
    },
  ];

  return (
    <AppShell
      eyebrow="Hiring manager preview"
      title="Pre-screen one candidate with evidence you can defend."
      description="This preview gives hiring managers a private resume-to-JD fit check and a 10-question interview guide before creating a full workspace."
      actions={
        <>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            Public beta
          </Link>
          <Link className={buttonVariants()} href="/employer/setup?type=employer&source=hm">
            Create workspace
          </Link>
        </>
      }
      contentClassName="max-w-7xl"
    >
      <PublicWorkflowBanner
        action={{
          href: "/employer/setup?type=employer&source=hm",
          label: "Create workspace",
          icon: SendIcon,
        }}
        asideBody="Applicant links, submitted answer scores, candidate comparison, and a fuller hiring record."
        asideItems={["Send the assessment link", "Score applicant answers", "Compare finalists"]}
        asideTitle="Workspace unlocks"
        badges={["Private preview", "70% hard skill / 30% soft skill", "10 interview prompts"]}
        className="mb-6"
        steps={workflowSteps}
      />

      <HiringManagerPublicWorkbench />
    </AppShell>
  );
}
