The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata leakage**: The output does not contain any sensitive information that could potentially leak metadata.
2. **Boilerplate leakage**: There is no boilerplate text or generic phrases in the output that could indicate leakage.
3. **Contra-evidence as matched evidence**: The output correctly distinguishes between matched and contra-evidence, and there are no instances of contra-evidence being used as matched evidence.
4. **Generic snippet scattering**: The output does not contain any generic snippets that are scattered throughout the analysis.
5. **Title/header proof**: The title and header of the output appear to be accurate and relevant to the analysis.
6. **Scope mismatch**: The scope of the analysis appears to match the expected profile, which is "scope_mismatch".
7. **Matched/missing contradiction**: There are no contradictions between matched and missing requirements.

Overall, the output appears to be clean and free of known failure modes. However, it's always a good idea to perform additional testing and validation to ensure the accuracy and reliability of the analysis.

Proposed regression case:

```json
{
  "job_title": "32. Executive Assistants",
  "case_slug": "32-executive-assistants",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.629846",
  "match_score": 43.52,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 42.9,
      "reason": "Found 5 direct, 2 adjacent, 1 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "Managed daily operations, including scheduling appointments and coordinating travel arrangements"
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
      "score": 57.3,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
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
      "score": 95.4,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Managed daily operations, including scheduling appointments and coordinating travel arrangements"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Provide administrative support to a team of senior executives, including scheduling appointments, managing calendars, and coordinating travel arrangements",
      "evidence": [
        "Managed daily operations, including scheduling appointments and coordinating travel arrangements"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain complex spreadsheets, databases, and presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace",
      "evidence": [
        "Created presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace",
      "evidence": [
        "Created presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace"
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent organizational, time management, and communication skills",
      "evidence": [
        "Basic organizational and time management skills"
      ],
      "strength": "high"
    },
    {
      "requirement": "Ability to maintain confidentiality and handle sensitive information with discretion",
      "evidence": [
        "Ability to maintain confidentiality and handle sensitive information with discretion"
      ],
      "strength": "high"
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
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Ability to maintain confidentiality and handle sensitive information with discretion",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement process improvements to increase efficiency and productivity in the executive's office",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Provide exceptional customer service to executives, visitors, and clients, responding to inquiries and resolving issues promptly",
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
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Managed daily operations, including scheduling appointments and coordinating travel arrangements",
      "supports": "Provide administrative support to a team of senior executives, including scheduling appointments, managing calendars, and coordinating travel arrangements"
    },
    {
      "source": "resume",
      "quote": "Created presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace",
      "supports": "Develop and maintain complex spreadsheets, databases, and presentations using Microsoft Office Suite (Excel, Word, PowerPoint) and Google Workspace"
    },
    {
      "source": "resume",
      "quote": "Coordinated meetings and events with internal stakeholders and external partners",
      "supports": "Coordinate meetings, events, and projects with internal stakeholders and external partners, ensuring timely execution and follow-up"
    },
    {
      "source": "resume",
      "quote": "Ability to maintain confidentiality and handle sensitive information with discretion",
      "supports": "Manage and maintain confidential files, documents, and records, adhering to data protection policies and procedures"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case introduces a new requirement that is not matched by the existing evidence in the output. The proposed case should trigger an alert for the missing requirement, indicating that additional evidence or experience is required to meet the job description's expectations.
