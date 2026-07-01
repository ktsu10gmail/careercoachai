import type { Metadata } from "next";

import { applicantKeywords, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free AI Resume-to-Job Match Score",
  description:
    "Upload a resume and paste a job description to get a free AI match score, strengths and weaknesses analysis, coaching advice, and optional CareerCoachAI Talent Network profile.",
  keywords: [
    "free AI resume match analysis",
    "AI resume-to-job match score",
    "resume to job description match score",
    "AI job fit analysis",
    "free AI career coach",
    ...applicantKeywords,
  ],
  alternates: {
    canonical: siteUrl("/free-analysis"),
  },
  openGraph: {
    type: "website",
    siteName,
    url: siteUrl("/free-analysis"),
    title: "Free AI Resume-to-Job Match Score | CareerCoachAI",
    description:
      "Stop blindly applying into a black hole. See your technical fit score and get coaching advice before you apply.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Resume-to-Job Match Score | CareerCoachAI",
    description:
      "Get a free resume-to-JD match score, strengths, gaps, and coaching advice.",
  },
};

export default function FreeAnalysisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

