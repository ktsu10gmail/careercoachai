The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `resume_file` field contains a specific file name (`resume_contra.txt`) that may indicate metadata leakage, but it is not a clear indication of an issue.
2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output.
3. **Contra-evidence as matched evidence**: The system correctly identifies contra-evidence (e.g., "Managed a budget of $500,000 with some success, but frequently overspent on travel and training due to lack of planning and prioritization.") as not matching the expected affirmative proof for certain requirements (e.g., "Manage a budget of $500,000 for sales-related expenses, including travel and training").
4. **Generic snippet scattering**: The system correctly identifies generic or lower-scope resume snippets that lack the explicit operational scope required for certain requirements (e.g., "Excellent communication skills, but had difficulty articulating a clear vision for the sales team.").
5. **Title/header proof**: There is no apparent issue with title/header proof.
6. **Scope mismatch**: The system correctly identifies scope mismatches between the resume and the job description (e.g., "Manage a budget of $500,000 for sales-related expenses, including travel and training" vs. "Managed a budget of $500,000 with some success, but frequently overspent on travel and training due to lack of planning and prioritization.").
7. **Matched/missing contradiction**: The system correctly identifies contradictions between matched evidence and missing requirements (e.g., the requirement "Manage a team of sales representatives to achieve quarterly sales targets" is not supported by any evidence).

Overall, the provided JSON output appears to be clean and free of known failure modes.

**Proposed regression case:**

```json
{
  "job_title": "2. Sales Representatives",
  "case_slug": "2-sales-representatives",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-30T18:20:48.379979",
  "match_score": 50.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 7.1,
      "reason": "Found 1 direct, 0 adjacent, 1 domain/scope gaps, and 12 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management and leadership."
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
      "score": 84.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 35.7,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management and leadership."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "5+ years of experience in sales management or a related field",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management and leadership."
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage a team of sales representatives to achieve quarterly sales targets",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement sales strategies to expand customer base and increase revenue",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct regular sales performance reviews with individual team members, providing coaching and feedback to improve results",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Analyze sales data and market trends to identify opportunities for growth and adjust sales tactics accordingly",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Identify and pursue new business opportunities through networking and relationship-building",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Manage a budget of $500,000 for sales-related expenses, including travel and training",
      "reason": "Resume contains boilerplate text instead of specific evidence: \"Results-driven sales professional with 5+ years of experience in sales management and leadership.\"",
      "severity": "high"
    },
    {
      "requirement": "Proven track record of success in driving revenue growth and team performance",
      "reason": "Resume contains boilerplate text instead of specific evidence: \"Results-driven sales professional with 5+ years of experience in sales management and leadership.\"",
      "severity": "high"
    },
    {
      "requirement": "Strong understanding of the software industry and its current market trends",
      "reason": "Resume contains boilerplate text instead of specific evidence: \"Results-driven sales professional with 5+ years of experience in sales management and leadership.\"",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, leadership, and problem-solving skills",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Excellent communication skills, but had difficulty articulating a clear vision for the sales team.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work effectively in a fast-paced environment with multiple priorities and deadlines",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with CRM software (Salesforce.com) and sales analytics tools (e.g.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of cloud-based software solutions and their sales strategies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Results-driven sales professional with 5+ years of experience in sales management and leadership.",
      "supports": "5+ years of experience in sales management or a related field"
    },
    {
      "source": "resume",
      "quote": "Excellent communication skills, but had difficulty articulating a clear vision for the sales team.",
      "supports": "Excellent communication, leadership, and problem-solving skills"
    }
  ],
  "confidence_level": "low",
  "confidence_reason": "Confidence is low because the system found limited direct requirement evidence in the resume."
}
```

This proposed regression case contains boilerplate text instead of specific evidence for certain requirements, which may indicate a failure mode.
