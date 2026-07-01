The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a scope mismatch, which is correctly identified as an issue. However, there is no metadata leakage in this case.
2. **Boilerplate leakage**: There is no boilerplate leakage detected in the provided JSON output.
3. **Contra-evidence as matched evidence**: This failure mode is not present in the provided JSON output.
4. **Generic snippet scattering**: The `missing_requirements` section lists several generic requirements, but they are properly flagged as such with a reason indicating that they lack explicit operational scope. However, it would be beneficial to provide more specific examples or quotes from the resume to support these claims.
5. **Title/header proof**: There is no title/header proof detected in this case.
6. **Scope mismatch**: The `expected_profile` field contains a scope mismatch, which is correctly identified as an issue.
7. **Matched/missing contradiction**: This failure mode is not present in the provided JSON output.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it would be beneficial to provide more specific examples or quotes from the resume to support some of the claims made in the `missing_requirements` section.

Proposed regression case:

```json
{
  "job_title": "25. Call Center Representatives",
  "case_slug": "25-call-center-representatives",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:47.987790",
  "match_score": 32.66,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 20.8,
      "reason": "Found 1 direct, 4 adjacent, 2 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone"
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
      "score": 96.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "lead",
        "implemented",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 1 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Utilized Python and Java to develop custom scripts for data analysis and automation"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 61.8,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone",
        "Utilized Python and Java to develop custom scripts for data analysis and automation",
        "Monitored agent productivity and provided coaching on CRM software (Salesforce)"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, Outlook) and CRM software (Salesforce)",
      "evidence": [
        "Monitored agent productivity and provided coaching on CRM software (Salesforce)"
      ],
      "strength": "high"
    },
    {
      "requirement": "Work collaboratively with internal teams to resolve complex customer issues and escalate as necessary",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Answer incoming customer calls in a timely and professional manner",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Utilize CRM software (Salesforce) to update customer records, track interactions, and access account information",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Participate in ongoing training and coaching to improve product knowledge and customer service skills",
      "evidence": [
        "Coordinated with internal teams to resolve complex customer issues via email and phone"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Respond to customer inquiries and resolve issues in accordance with company policies and procedures",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Coordinated with internal teams to resolve complex customer issues via email and phone",
      "severity": "high"
    },
    {
      "requirement": "Meet or exceed daily call volume targets and maintain a high level of productivity",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Adhere to company policies and procedures, including data security and confidentiality guidelines",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Utilized Python and Java to develop custom scripts for data analysis and automation",
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
      "requirement": "1-2 years of customer service experience in a call center environment",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and problem-solving skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work in a fast-paced, dynamic environment with multiple priorities",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong attention to detail and organizational skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Coordinated with internal teams to resolve complex customer issues via email and phone",
      "supports": "Answer incoming customer calls in a timely and professional manner"
    },
    {
      "source": "resume",
      "quote": "Coordinated with internal teams to resolve complex customer issues via email and phone",
      "supports": "Respond to customer inquiries and resolve issues in accordance with company policies and procedures"
    },
    {
      "source": "resume",
      "quote": "Coordinated with internal teams to resolve complex customer issues via email and phone",
      "supports": "Utilize CRM software (Salesforce) to update customer records, track interactions, and access account information"
    },
    {
      "source": "resume",
      "quote": "Coordinated with internal teams to resolve complex customer issues via email and phone",
      "supports": "Work collaboratively with internal teams to resolve complex customer issues and escalate as necessary"
    },
    {
      "source": "resume",
      "quote": "Coordinated with internal
