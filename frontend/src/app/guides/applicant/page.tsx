import { UserGuidePage } from "@/components/UserGuidePage";

export default function ApplicantGuidePage() {
  return (
    <UserGuidePage
      eyebrow="Applicant guide"
      title="Build your profile, prepare for roles, and submit complete applications."
      description="Use this guide while reviewing your resume, testing a job fit, practicing answers, and applying through an employer link."
      quickFacts={[
        "Keep this guide open in a second browser window while you complete your profile or application.",
        "Resume Studio accepts TXT, PDF, and DOCX files and creates a private resume review.",
        "Match Lab compares your saved resume with a pasted job title and description before you apply.",
        "Practice interview can generate and score 10 practice answers from your current resume and job match.",
        "Applications include 10 standardized questions: 7 hard skill and 3 soft skill questions.",
        "A public free analysis is only a private preview; a real application starts from an employer job link.",
        "Your career profile can stay private or be made visible to the Talent Network when you are ready.",
      ]}
      workflowLink={{
        href: "/applicant/portal",
        label: "Open applicant portal",
      }}
      sections={[
        {
          title: "Prepare your profile",
          items: [
            "Open the applicant portal and upload a current resume in Resume Studio before running role-specific tools.",
            "Review the resume coaching score, strengths, gaps, and suggested improvements before replacing or reusing the file.",
            "Complete your career profile with name, target title, location, and searchable skills.",
            "Leave Talent Network visibility off until you want employers or agencies to discover the profile.",
          ],
        },
        {
          title: "Check a role fit",
          items: [
            "Paste the job title and full job description into Resume/JD Match Lab.",
            "Run the match to see the resume-to-job score, matching evidence, gaps, and suggested positioning.",
            "Clear Match Lab when you want to test another role with the same saved resume.",
            "Use the match report as preparation only; it does not submit an application.",
          ],
        },
        {
          title: "Practice before submitting",
          items: [
            "Generate 10 practice questions after running a resume/job match.",
            "Answer each question with specific examples, tools, decisions, constraints, and measurable outcomes.",
            "Score the practice answers and review feedback before copying any ideas into a real application.",
            "Regenerate or re-score after updating your resume or changing the target job description.",
          ],
        },
        {
          title: "Complete the assessment",
          items: [
            "Open the public company job board or the direct application link sent by the employer.",
            "If HR or the hiring manager sent an Auto Mediator job URL, use that link so your answers attach to the correct role.",
            "Choose Continue if you already have an applicant account, or create an account if this is your first application.",
            "Answer every hard skill and soft skill question with specific examples from your work, school, or project experience.",
            "Avoid copying the same answer into multiple questions because the assessment is scored against each prompt.",
            "Upload the resume you want HR and the hiring manager to review for this specific role.",
          ],
        },
        {
          title: "Upload and submit",
          items: [
            "Use a readable TXT, PDF, or DOCX resume because the system extracts text for resume-to-job matching.",
            "Review the selected job before submitting so the resume and answers are attached to the correct role.",
            "Submit the application once; HR will review the resume match, Q&A score, and AI comments.",
            "A submitted application also creates or updates a reusable candidate profile for that employer or agency.",
          ],
        },
        {
          title: "Track your application",
          items: [
            "Open the applicant portal after signing in to review submitted applications and current status.",
            "If you apply to another role at the same employer or agency, your profile can be reused with the new application.",
            "Keep using the applicant portal even if the same company contact has several employer-side roles.",
            "Watch for interview scheduling updates if HR moves your application into the qualified or scheduled stages.",
          ],
        },
      ]}
    />
  );
}
