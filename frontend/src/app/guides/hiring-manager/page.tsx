import { UserGuidePage } from "@/components/UserGuidePage";

export default function HiringManagerGuidePage() {
  return (
    <UserGuidePage
      eyebrow="Hiring manager guide"
      title="Turn assigned interviews into clear recommendations."
      description="Use this guide while reviewing candidate dossiers, generated question sets, AI comments, and final interview notes for HR."
      quickFacts={[
        "The public HM pre-screening tool can generate resume/JD evidence and interview questions without login.",
        "If your account has multiple employer roles, open the Hiring Manager workspace link before reviewing interviews.",
        "Applicant answer scores appear only after HR/HM uses the Auto Mediator workspace job link and applicants submit answers.",
        "Only interviews assigned to you appear in the hiring manager page.",
        "Interviews can be filtered by pending recommendations, reviewed recommendations, or all assigned interviews.",
        "Each dossier can include resume match, Q&A score, AI comments, schedule details, and generated interview questions.",
        "Submitted recommendations require manager review notes before submission.",
        "Candidates can come from direct applicants or recruiter-created agency profiles.",
      ]}
      workflowLink={{
        href: "/hiring_manager/interviews",
        label: "Open interviews",
      }}
      sections={[
        {
          title: "Choose the right HM workflow",
          items: [
            "Use the public pre-screening tool for a quick private preview before a formal workflow exists.",
            "Sign in to the employer workspace when you need assigned interviews, applicant answer scores, and saved recommendations.",
            "If you also have HR or Company Admin access, use the top workspace links to switch into Hiring Manager before reviewing assigned interviews.",
            "Ask HR for the correct job link if applicants need to answer questions before you review them.",
          ],
        },
        {
          title: "Review interview context",
          items: [
            "Start with Pending to focus on interviews that still need your recommendation.",
            "Open the interview card and confirm the applicant name, job name, job ID, schedule, and current status.",
            "Check whether the profile came from a direct applicant or a recruiter-created candidate when that context is available.",
            "Review the one-click dossier: resume match, answer score, resume/JD comment, and Q&A comment.",
            "Use the saved schedule and status badges to distinguish upcoming interviews from already reviewed items.",
          ],
        },
        {
          title: "Use suggested questions",
          items: [
            "Open the generated question set before the interview when questions are available for the job.",
            "Use resume-based questions to validate the candidate's claimed experience and project depth.",
            "Use JD-based questions to test the most important role requirements and gaps from the match analysis.",
            "Treat the suggested questions as a structured starting point, then add role-specific follow-ups from the live conversation.",
          ],
        },
        {
          title: "Add manager review",
          items: [
            "Write concise notes that summarize strengths, risks, interview evidence, and any follow-up concerns.",
            "Use Pending when more information is needed or the recommendation is not ready.",
            "Use Strongly recommend, Acceptable, or Reject only after adding at least 10 characters of review detail for HR to reference later.",
            "Mention which evidence changed your view: resume match, answer quality, interview examples, or unresolved gaps.",
          ],
        },
        {
          title: "Submit and update",
          items: [
            "Choose the recommendation from the selection box and submit the recommendation.",
            "Look for the recorded recommendation message, then refresh if you want to confirm the saved state.",
            "Use the Reviewed filter to confirm recommendations that have already been submitted.",
            "HR can use your recommendation when updating final candidate status, and agency recruiters can reference it when managing client submission feedback.",
            "You can update a recommendation later if HR needs clarification or the interview outcome changes.",
          ],
        },
      ]}
    />
  );
}
