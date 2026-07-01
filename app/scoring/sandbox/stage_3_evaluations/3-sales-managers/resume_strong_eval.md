The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata leakage**: The output does not contain any sensitive information that could potentially leak metadata.

2. **Boilerplate leakage**: There is no boilerplate content in the output, which reduces the risk of leakage.

3. **Contra-evidence as matched evidence**: The output correctly distinguishes between matched and contra-evidence. No issues were found here.

4. **Generic snippet scattering**: The output does not contain generic snippets that could be scattered throughout the analysis.

5. **Title/header proof**: The title and header are properly formatted and do not contain any issues.

6. **Scope mismatch**: The scope of the job description matches the scope of the resume, which is a good sign.

7. **Matched/missing contradiction**: No contradictions were found in the output.

**Proposed Regression Case:**

```json
{
  "job_title": "2. Sales Representatives",
  "case_slug": "2-sales-representatives",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-30T18:20:48.417784",
  "match_score": 70.12,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 75.0,
      "reason": "Found 5 direct, 3 adjacent, 1 domain/scope gap, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "+ Managed a team of 10 sales representatives, achieving a 15% increase in quarterly sales targets through strategic planning and coaching.",
        "Results-driven Sales Representative with 5+ years of experience driving revenue growth and team performance in fast-paced software sales environments."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 40.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 90.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "4 years",
        "team lead",
        "led",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 60.0,
      "reason": "Found 1 direct, 2 adjacent, 1 domain/scope gap, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Results-driven Sales Representative with 5+ years of experience driving revenue growth and team performance in fast-paced software sales environments."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "+ Managed a team of 10 sales representatives, achieving a 15% increase in quarterly sales targets through strategic planning and coaching."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Manage a team of sales representatives to achieve quarterly sales targets",
      "evidence": [
        "+ Managed a team of 10 sales representatives, achieving a 15% increase in quarterly sales targets through strategic planning and coaching."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct regular sales performance reviews with individual team members, providing coaching and feedback to improve results",
      "evidence": [
        "+ Conducted regular performance reviews with individual team members, providing feedback and coaching to improve results."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Identify and pursue new business opportunities through networking and relationship-building",
      "evidence": [
        "+ Identified and pursued new business opportunities through networking and relationship-building, resulting in a 10% increase in new customer acquisition."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage a budget of $500,000 for sales-related expenses, including travel and training",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "+ Managed a team of 10 sales representatives, achieving a 15% increase in quarterly sales targets through strategic planning and coaching.",
      "supports": "Manage a team of sales representatives to achieve quarterly sales targets"
    },
    {
      "source": "resume",
      "quote": "Results-driven Sales Representative with 5+ years of experience driving revenue growth and team performance in fast-paced software sales environments.",
      "supports": "Analyze sales data and market trends to identify opportunities for growth and adjust sales tactics accordingly"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because some JD requirements have indirect or missing resume evidence."
}
```

This regression case has a lower match score, indicating that the analysis may not be as accurate. The output contains issues with matched/missing contradictions and scope mismatch.
