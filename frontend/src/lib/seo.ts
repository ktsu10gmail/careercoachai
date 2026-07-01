export const siteName = "CareerCoachAI";

export const defaultSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://192.168.1.46:5001";

export function siteUrl(path = "/") {
  return new URL(path, defaultSiteUrl).toString();
}

export const applicantKeywords = [
  "free AI career coach",
  "AI resume-to-job match score",
  "resume to job description match score",
  "free resume match analysis",
  "AI job fit analysis",
  "Talent Network for job applicants",
  "standardized interview questions",
  "10 focused interview questions",
  "resume and job-based interview questions",
  "AI interview guide for hiring managers",
  "pre-vetted candidate dossier",
];
