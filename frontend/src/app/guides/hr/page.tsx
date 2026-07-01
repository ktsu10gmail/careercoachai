import { UserGuidePage } from "@/components/UserGuidePage";

export default function HrGuidePage() {
  return (
    <UserGuidePage
      eyebrow="HR and recruiter guide"
      title="Run the hiring pipeline from job setup to final decision."
      description="Use this guide while creating jobs, reviewing direct applicants, managing agency candidates, scheduling interviews, and tracking outcomes."
      quickFacts={[
        "The dashboard auto-loads a job and its candidates when you sign in.",
        "If your account has multiple roles, use the employer workspace links to switch between HR, Company Admin, and Hiring Manager tools.",
        "Each job generates 10 applicant questions: 7 hard skill and 3 soft skill prompts.",
        "The public HM pre-screening tool is useful for one-off resume/JD previews, but applicant answer scores require a signed-in workspace and job link.",
        "The Applications pipeline supports new, qualified, scheduled, pending, offer, hired, rejected, and on-hold decisions.",
        "Agency workspaces add client companies, candidate profiles, shortlist matching, client submissions, and recruiter performance reporting.",
      ]}
      workflowLink={{
        href: "/hr/dashboard",
        label: "Open HR dashboard",
      }}
      sections={[
        {
          title: "Create and publish a job",
          items: [
            "Open the HR dashboard from the employer workspace if your account also has Company Admin or Hiring Manager access.",
            "Open Create job only when you need a new role so the active candidate queue remains easy to scan.",
            "For recruiting agencies, select the client company before creating a client job and optionally assign a recruiter owner.",
            "Enter the title, position, salary range if available, and a complete job description.",
            "After creation, share the public company board or direct apply URL with applicants so answer scores attach to the role.",
          ],
        },
        {
          title: "Use the public HM preview",
          items: [
            "Use the public pre-screening tool when you want a fast no-account resume-to-JD check and focused interview questions.",
            "Treat the preview as interview preparation only because it cannot collect applicant answers by itself.",
            "When the role should become a real workflow, create the job in the workspace and send the generated URL to applicants.",
          ],
        },
        {
          title: "Manage agency candidates",
          items: [
            "Open Clients before creating client-owned jobs for a recruiting agency.",
            "Open Candidates to create reusable recruiter-owned profiles without applicant login accounts.",
            "Import or upload TXT, PDF, or DOCX resumes so profiles can be parsed and scored against active jobs.",
            "Review candidate ownership, source job, Talent Network consent, parsed resume status, matched jobs, and duplicate match warnings.",
          ],
        },
        {
          title: "Match and submit candidates",
          items: [
            "Use Potential matching jobs from a selected profile to create a match from scored fit evidence.",
            "Open Matching when you need to select a candidate and client job manually or compare a shortlist of uploaded resumes.",
            "Create a scored application before submitting the candidate to a client.",
            "Record the client recipient and notes, then update submission feedback as pending, reviewed, accepted, or rejected.",
          ],
        },
        {
          title: "Review applicants",
          items: [
            "Use the Applications pipeline to filter candidates by status before narrowing by job.",
            "Open evaluation notes when you need the resume-to-JD comparison or Q&A comments for HR and hiring manager context.",
            "Use Re-score when new AI scoring is needed, then refresh candidates to confirm the updated scores.",
            "Use pagination and status filters together when a role has a large candidate pool.",
          ],
        },
        {
          title: "Qualify and schedule",
          items: [
            "Qualify applicants who should move into interview scheduling.",
            "Assign interviews to the correct hiring manager account, even if that person also has HR or Company Admin access.",
            "Use the scheduling controls inside each qualified application row to choose the assigned hiring manager, interview date, and office-hour time slot.",
            "Filter Scheduled when you need upcoming interviews, Pending when you need manager decisions, and Offer when HR is preparing next steps.",
            "Record final decisions as offer pending, hired, rejected, or on hold after reviewing the hiring manager recommendation.",
          ],
        },
        {
          title: "Review recruiter performance",
          items: [
            "Open Performance to compare candidates added, matches created, submissions sent, and accepted outcomes by recruiter.",
            "Use the 7 day, 30 day, 90 day, or all-time period selector to review recent activity or historical totals.",
            "Use ownership and matched-by fields in Candidates to understand who created each profile and match.",
          ],
        },
      ]}
    />
  );
}
