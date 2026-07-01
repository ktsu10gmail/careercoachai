import { UserGuidePage } from "@/components/UserGuidePage";

export default function CompanyAdminGuidePage() {
  return (
    <UserGuidePage
      eyebrow="Company IT admin guide"
      title="Manage secure access across employer and agency workspaces."
      description="Use this guide when creating users, assigning workspace roles, resetting passwords, and supporting hiring operations."
      quickFacts={[
        "Company admins manage users for only their own employer or recruiting agency workspace.",
        "One account can have multiple workspace roles, such as Company Admin, HR, and Hiring Manager.",
        "The Auto Mediator workspace requires HR/HM users to sign in before they can create job links or review applicant answer scores.",
        "HR users create jobs, review applicants, and schedule interviews.",
        "Recruiter users are visible only for recruiting agency workspaces.",
        "Recruiter users can manage agency candidates, upload resumes, match candidates to client jobs, submit shortlists, and update client feedback.",
        "Hiring managers review assigned interviews and submit recommendations for HR.",
      ]}
      workflowLink={{
        href: "/employer/admin",
        label: "Open admin page",
      }}
      sections={[
        {
          title: "Create the right user",
          items: [
            "Add the user's full name and company email address.",
            "Set a temporary password that meets the minimum length requirement, then ask the user to change it after first sign-in.",
            "Choose a primary role that best describes the user's default responsibility in the company.",
            "Use Workspace access to assign every role the user should have. Small-company owners can have Company Admin, HR, and Hiring Manager access on the same account.",
            "Assign HR to recruiting team members who create jobs, generate applicant URLs, manage candidates, and schedule interviews.",
            "Assign Recruiter only in agency workspaces for users who source candidates, upload TXT/PDF/DOCX resumes, match candidates to client roles, and send submissions.",
            "Assign Hiring Manager to interview reviewers who need assigned interviews and recommendation controls.",
          ],
        },
        {
          title: "Maintain access",
          items: [
            "Use the Team section to update names, emails, the primary role, workspace access, or reset a password when needed.",
            "Confirm each user signs in through the employer login and sees only the workspace links for assigned roles.",
            "For users with multiple roles, confirm the top workspace links let them switch between Company Admin, HR, and Hiring Manager work areas.",
            "For recruiting agencies, confirm recruiters can open Clients, Candidates, Matching, and Performance from the workspace when their role allows it.",
            "Keep admin access limited to people responsible for account setup and user governance.",
          ],
        },
        {
          title: "Support the hiring workflow",
          items: [
            "Make sure at least one HR user can create jobs before the team sends Auto Mediator links to applicants.",
            "Share the public company job board link with HR so they can verify published roles.",
            "For agencies, add client companies before HR or recruiters create client jobs.",
            "Create recruiter accounts before importing agency candidates if ownership and performance metrics matter.",
            "Use the Performance dashboard to review candidate ownership, match volume, submission volume, and accepted or rejected client outcomes by recruiter.",
            "Create hiring manager accounts before HR begins scheduling interviews.",
            "If a user cannot open a workspace, confirm their Workspace access checkbox in the Team section.",
          ],
        },
      ]}
    />
  );
}
