The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a scope mismatch, which is not a metadata leakage issue. It indicates that the expected profile does not match the actual job title.
2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output. Boilerplate leakage occurs when generic or template-like content is present in the resume, which can negatively impact scoring.
3. **Contra-Evidence as Matched Evidence**: The analysis does not contain any instances of contra-evidence being used as matched evidence. Contra-evidence refers to information that contradicts a requirement, while matched evidence supports a requirement.
4. **Generic Snippet Scattering**: There is no apparent generic snippet scattering in the provided JSON output. Generic snippets are phrases or sentences that appear throughout multiple resumes and can negatively impact scoring.
5. **Title/Header Proof**: The title/header proof issue is not present in this analysis. Title/header proof refers to the presence of a title or header that does not accurately reflect the content of the resume.
6. **Scope Mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, which indicates that the expected profile does not match the actual job title.
7. **Matched/Missing Contradiction**: There is no apparent matched/missing contradiction in the provided JSON output.

Overall, the analysis appears to be clean and free from known failure modes. However, it's essential to note that this analysis only examines a single resume and may not capture all potential issues.

**Proposed Regression Case:**

```json
{
  "job_title": "30. Secretaries and Administrative Assistants",
  "case_slug": "30-secretaries-and-administrative-assistants",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.529773",
  "match_score": 38.66,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 31.2,
      "reason": "Found 2 direct, 5 adjacent, 0 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls.",
        "Proficient in Microsoft Office Suite (Word, Excel, PowerPoint) and have basic knowledge of Google Workspace."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Does not mention database management, data analysis, or certification in medical terminology or secretarial procedures"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 77.4,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls.",
        "Proficient in Microsoft Office Suite (Word, Excel, PowerPoint) and have basic knowledge of Google Workspace."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Prepare and edit documents, reports, and presentations using Microsoft Office Suite (Word, Excel, PowerPoint)",
      "evidence": [
        "Proficient in Microsoft Office Suite (Word, Excel, PowerPoint) and have basic knowledge of Google Workspace."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent communication, organizational, and time management skills",
      "evidence": [
        "Possess excellent communication skills and ability to work independently."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint)",
      "evidence": [
        "Proficient in Microsoft Office Suite (Word, Excel, PowerPoint) and have basic knowledge of Google Workspace."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Manage calendars, schedules, and appointments for multiple executives and staff members",
      "evidence": [
        "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Coordinate travel arrangements, meetings, and events, including booking flights, hotels, and rental cars",
      "evidence": [
        "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Develop and maintain accurate and up-to-date databases and spreadsheets to track project progress and employee information",
      "evidence": [
        "Experience with project management tools such as Asana and Trello."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Provide administrative support to a team of 10 employees in a fast-paced office environment",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Order supplies, materials, and equipment as needed",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Maintain confidentiality and handle sensitive information with discretion",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "associate's degree preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    },
    {
      "requirement": "2+ years of experience in an administrative role",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work independently and as part of a team",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls.",
      "supports": "Manage calendars, schedules, and appointments for multiple executives and staff members"
    },
    {
      "source": "resume",
      "quote": "\"Administrative Assistant with 3 years of experience providing general administrative support to small business owners, including managing calendars, preparing documents, and responding to phone calls.",
      "supports": "Coordinate travel arrangements, meetings, and events, including booking flights, hotels, and rental cars"
    },
    {
      "source": "resume",
      "quote": "Prof
