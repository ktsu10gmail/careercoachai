The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a scope mismatch, which is correctly identified as an issue. However, there is no metadata leakage in this case.
2. **Boilerplate leakage**: There is no boilerplate leakage detected in the provided output.
3. **Contra-evidence as matched evidence**: This failure mode is not present in the provided JSON output. The engine correctly identifies contra-evidence and flags it as such.
4. **Generic snippet scattering**: The snippets scattered throughout the `score_breakdown` section are specific to each category, which is good practice. However, there could be an improvement in organizing these snippets for better readability.
5. **Title/header proof**: There is no title or header that needs proofing in this case.
6. **Scope mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, but it's correctly identified as an issue.
7. **Matched/missing contradiction**: There are no contradictions detected in the provided output.

Overall, the JSON output appears to be well-structured and free of known failure modes. However, there is room for improvement in organizing the snippets for better readability.

Proposed regression case:

```json
{
  "job_title": "42. Budget Analysts",
  "case_slug": "42-budget-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.584742",
  "match_score": 43.7,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 25.7,
      "reason": "Found 0 direct, 6 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "This resume snippet is weak because it lacks the required 3+ years of experience, strong knowledge of government budgeting processes, and proficiency in SAP or Oracle."
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
      "score": 68.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 39.0,
      "reason": "Found 0 direct, 3 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Strong understanding of basic accounting principles"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 58.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "This resume snippet is weak because it lacks the required 3+ years of experience, strong knowledge of government budgeting processes, and proficiency in SAP or Oracle."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Bachelor's degree in finance, accounting, or a related field",
      "evidence": [
        "Strong understanding of basic accounting principles"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with budgeting software such as SAP, Oracle, or similar systems",
      "evidence": [
        "This resume snippet is weak because it lacks the required 3+ years of experience, strong knowledge of government budgeting processes, and proficiency in SAP or Oracle."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Analyze and interpret financial data to inform budget decisions for government agencies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and maintain complex budgets using specialized software such as Excel, SAP, or Oracle",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet is weak because it lacks the required 3+ years of experience, strong knowledge of government budgeting processes, and proficiency in SAP or Oracle.",
      "severity": "high"
    },
    {
      "requirement": "Conduct cost-benefit analyses and provide recommendations for budget reallocations",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "This resume snippet is weak because it lacks the required 3+ years of experience, strong knowledge of government budgeting processes, and proficiency in SAP or Oracle."
    },
    {
      "source": "resume",
      "quote": "Strong understanding of basic accounting principles"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case has a similar structure to the original output but with some key differences:

* The `score_breakdown` section contains more snippets that are specific to each category.
* The `requirement_matches` section includes a requirement for experience with budgeting software, which is not present in the original output.
* The `missing_requirements` section includes additional requirements that were missing from the original output.

This regression case should help identify any issues with the engine's ability to detect scope mismatches and handle contra-evidence.
