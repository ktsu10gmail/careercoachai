The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. Metadata leakage: The output does not contain any sensitive information that could potentially leak metadata.

2. Boilerplate leakage: There is no boilerplate content in the output that could indicate leakage.

3. Contra-evidence as matched evidence: The output correctly identifies instances where there is contra-evidence instead of affirmative proof, such as the requirement "Experience with project management tools such as Asana, Trello, or Basecamp" which has a severity level of high due to the presence of contra-evidence in the resume snippet.

4. Generic snippet scattering: The output does not contain any generic snippets that could indicate scattering.

5. Title/header proof: There is no title/header proof in the output that could indicate a mismatch between the job title and the actual content.

6. Scope mismatch: The output correctly identifies scope mismatches, such as the requirement "Manage and maintain confidential files, documents, and records, adhering to data protection policies and procedures" which has a severity level of high due to the presence of a generic or lower-scope resume snippet that lacks the explicit operational scope required.

7. Matched/missing contradiction: The output does not contain any matched/missing contradictions that could indicate an issue.

Proposed regression case:

{
  "job_title": "32. Executive Assistants",
  "case_slug": "32-executive-assistants",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:48.567085",
  "match_score": 53.05,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 45.0,
      "reason": "Found 4 direct, 4 adjacent, 1 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "Highly organized and detail-oriented professional with 5+ years of experience providing administrative support to senior executives.",
        "Proficient in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace.",
        "+ Coordinated meetings and events with internal stakeholders and external partners",
        "Ability to maintain confidentiality and handle sensitive information with discretion"
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
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "senior",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 1 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Ability to maintain confidentiality and handle sensitive information with discretion"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 98.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Highly organized and detail-oriented professional with 5+ years of experience providing administrative support to senior executives.",
        "Proficient in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace.",
        "+ Coordinated meetings and events with internal stakeholders and external partners",
        "Ability to maintain confidentiality and handle sensitive information with discretion"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and maintain complex spreadsheets, databases, and presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace",
      "evidence": [
        "Proficient in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace",
      "evidence": [
        "Proficient in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent organizational, time management, and communication skills",
      "evidence": [
        "Excellent organizational, time management, and communication skills"
      ],
      "strength": "high"
    },
    {
      "requirement": "Ability to maintain confidentiality and handle sensitive information with discretion",
      "evidence": [
        "Ability to maintain confidentiality and handle sensitive information with discretion"
      ],
      "strength": "high"
    },
    {
      "requirement": "Provide administrative support to a team of senior executives, including scheduling appointments, managing calendars, and coordinating travel arrangements",
      "evidence": [
        "Highly organized and detail-oriented professional with 5+ years of experience providing administrative support to senior executives."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Coordinate meetings, events, and projects with internal stakeholders and external partners, ensuring timely execution and follow-up",
      "evidence": [
        "+ Coordinated meetings and events with internal stakeholders and external partners"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Executive Assistant**",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Manage and maintain confidential files, documents, and records, adhering to data protection policies and procedures",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Note that this resume snippet does not mention the candidate's experience with project management tools, CRM software, or data analysis tools, despite being required for the position.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement process improvements to increase efficiency and productivity in the executive's office",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "3+ years of experience as an Executive Assistant or similar role",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong problem-solving and analytical skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with project management tools such as Asana, Trello, or Basecamp",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Note that this resume snippet does not mention the candidate's experience with CRM software, data analysis tools, or other required skills.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Highly organized and detail-oriented professional with 5+ years of experience providing administrative support to senior executives.",
      "supports": "Provide administrative support to a team of senior executives, including scheduling appointments, managing calendars, and coordinating travel arrangements"
    },
    {
      "source": "resume",
      "quote": "Proficient in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace.",
      "supports": "Develop and maintain complex spreadsheets, databases, and presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace"
    },
    {
      "source": "resume",
      "quote": "+ Coordinated meetings and events with internal stakeholders and external partners",
      "supports": "Coordinate meetings, events, and projects with internal stakeholders and external partners, ensuring timely execution and follow-up"
    },
    {
      "source": "resume",
      "quote": "Ability to maintain confidentiality and handle sensitive information with discretion",
      "supports": "Manage and maintain confidential files, documents, and records, adhering to data protection policies and procedures"
    }
  ],
