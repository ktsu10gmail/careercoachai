Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume snippet provided in the "evidence_quotes" section contains boilerplate text from the JD description, which may indicate that the candidate is simply copying and pasting from the job posting rather than providing their own experiences.

2. **Generic snippet scattering**: The presence of a generic resume snippet ("Here's a contra-evidence resume snippet for an IT Project Manager position:") in the "evidence_quotes" section could be considered as a failure mode, as it does not provide specific evidence of the candidate's skills and experience.

3. **Title/header proof**: The title of the analysis JSON output ("64. IT Project Managers") appears to match the job title provided in the JD description, which may indicate that the system is relying too heavily on title matching rather than actual content analysis.

4. **Scope mismatch**: The scope of the missing requirements listed in the "missing_requirements" section seems to be broader than what is actually present in the resume. For example, the requirement "Coordinate with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones" is listed as a high-severity issue, but the corresponding quote from the resume only mentions working with cross-functional teams without specifying the exact scope.

5. **Matched/missing contradiction**: The presence of a quote that supports one requirement ("Manage complex IT projects with a budget of $1 million to $5 million, involving multiple stakeholders and vendors") while also containing contra-evidence for another requirement ("In my previous role, I worked closely with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones. However, I did not have direct experience with risk management tools like Riskonn") could be considered as a failure mode.

Proposed regression case:

```json
{
  "job_title": "64. IT Project Managers",
  "case_slug": "64-it-project-managers",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:23.079330",
  "match_score": 43.94,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 37.9,
      "reason": "Found 3 direct, 4 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven IT professional with 5+ years of experience in managing complex projects, including budgeting and resource allocation. Proven track record of delivering projects on time and within budget.",
        "* Utilized MS Project and Asana to develop and maintain project plans, schedules, and resource allocation plans",
        "In my previous role, I worked closely with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones. However, I did not have direct experience with risk management tools like Riskonn",
        "* Conducted regular status updates and progress reports using Tableau and Excel"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 50.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 72.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "manager",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Conducted regular status updates and progress reports using Tableau and Excel",
        "I also did not have the opportunity to work with cloud-based project management tools like Trello or Basecamp, but I am proficient in MS Project and Asana. Furthermore, while I understand cybersecurity principles and practices, I do not hol"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 87.7,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven IT professional with 5+ years of experience in managing complex projects, including budgeting and resource allocation. Proven track record of delivering projects on time and within budget.",
        "* Utilized MS Project and Asana to develop and maintain project plans, schedules, and resource allocation plans",
        "In my previous role, I worked closely with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones. However, I did not have direct experience with risk management tools like Riskonn",
        "* Conducted regular status updates and progress reports using Tableau and Excel"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and maintain project plans, schedules, and resource allocation plans using MS Project and Asana",
      "evidence": [
        "* Utilized MS Project and Asana to develop and maintain project plans, schedules, and resource allocation plans"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct regular status updates and progress reports to senior management and clients using Tableau and Excel",
      "evidence": [
        "* Conducted regular status updates and progress reports using Tableau and Excel"
      ],
      "strength": "high"
    },
    {
      "requirement": "Certification in PMP, PRINCE2, or Agile methodologies",
      "evidence": [
        "I also did not have the opportunity to work with cloud-based project management tools like Trello or Basecamp, but I am proficient in MS Project and Asana. Furthermore, while I understand cybersecurity principles and practices, I do not hol"
      ],
      "strength": "high"
    },
    {
      "requirement": "Manage complex IT projects with a budget of $1 million to $5 million, involving multiple stakeholders and vendors",
      "evidence": [
        "\"Results-driven IT professional with 5+ years of experience in managing complex projects, including budgeting and resource allocation. Proven track record of delivering projects on time and within budget."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Strong knowledge of Agile methodologies, including Scrum and Kanban",
      "evidence": [
        "\"Results-driven IT professional with 5+ years of experience in managing complex projects, including budgeting and resource allocation. Proven track record of delivering projects on time and within budget."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Proficiency in MS Project, Asana, Tableau, Excel, and JIRA",
      "evidence": [
        "Here's a contra-evidence resume snippet for an IT Project Manager position:"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Coordinate with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones",
      "reason": "Resume contains contra-evidence instead of affirmative proof: In my previous role, I worked closely with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones. However, I did not have direct experience with risk management tools like Riskonn",
      "severity": "high"
    },
    {
      "requirement": "Identify and mitigate risks, issues, and dependencies using risk management tools like Riskonnect and JIRA",
      "reason": "Resume contains contra-evidence instead of affirmative proof: In my previous role, I worked closely with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones. However, I did not have direct experience with risk management tools like Riskonn",
      "severity": "high"
    },
    {
      "requirement": "Ensure compliance with industry standards and regulatory requirements using tools like NIST and HIPAA",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: * Conducted regular status updates and progress reports using Tableau and Excel",
      "severity": "high"
