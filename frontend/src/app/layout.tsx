import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { AuthCorner } from "@/components/AuthCorner";
import { applicantKeywords, defaultSiteUrl, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultSiteUrl),
  applicationName: siteName,
  title: {
    default: "CareerCoachAI | Free AI Resume Match & Career Coaching",
    template: `%s | ${siteName}`,
  },
  description:
    "Stop blindly applying into a black hole. CareerCoachAI gives applicants a free AI resume-to-job match score, coaching insights, and optional Talent Network profile.",
  keywords: applicantKeywords,
  alternates: {
    canonical: siteUrl("/"),
  },
  openGraph: {
    type: "website",
    siteName,
    url: siteUrl("/"),
    title: "CareerCoachAI | Free AI Resume Match & Career Coaching",
    description:
      "Get a free AI resume-to-job match score, strengths and weaknesses analysis, coaching advice, and optional Talent Network profile.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerCoachAI | Free AI Resume Match & Career Coaching",
    description:
      "Apply to jobs that better fit your experience with a free AI resume match score and coaching insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AnalyticsTracker />
          <AuthCorner />
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
