Overall, the analysis JSON output appears to be clean. However, I do identify a few potential issues that could be considered failure modes:

1. **Contra-evidence as matched evidence**: In the "missing_requirements" section, there is an issue with the quote from the resume being used as evidence for the requirement "Manage and maintain general ledger accounts, including journal entries, reconciliations, and account analysis". The quote actually contradicts the requirement by stating that the resume snippet lacks the scope and enterprise-level experience required for the position. This should be flagged as a contradiction.

2. **Generic snippet scattering**: While not explicitly stated in this output, it's worth noting that some of the requirements have generic or lower-scope snippets scattered throughout the evidence quotes. For example, the requirement "Prepare and review financial statements" has a quote from the resume that only mentions general accounting skills and experience, rather than providing specific details about preparing and reviewing financial statements.

3. **Scope mismatch**: The analysis JSON output does not explicitly mention scope mismatch as an issue. However, upon closer inspection, it appears that some of the requirements have a scope mismatch with the evidence provided in the resume. For example, the requirement "Prepare and review financial statements" has a quote from the resume that only mentions general accounting skills and experience, rather than providing specific details about preparing and reviewing financial statements.

4. **Title/header proof**: The analysis JSON output does not explicitly mention title/header proof as an issue. However, upon closer inspection, it appears that the title of the job posting ("47. Treasurers and Controllers") is not being matched or verified in any way.

Proposed regression case:

```json
{
  "job_title": "53. Financial Analysts",
  "case_slug": "53-financial-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:50.137152",
  "match_score": 32.21,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 25.8,
      "reason": "Found 1 direct, 5 adjacent, 4 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting."
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
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 2 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 71.8,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Strong knowledge of financial modeling and data analysis tools",
      "evidence": [
        "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting."
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience as a financial analyst in a similar organization",
      "evidence": [
        "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Prepare and review financial statements, including balance sheets, income statements, and cash flow statements",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Experienced financial analyst with 3+ years of experience in data analysis and reporting.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement budgeting processes, including forecasting and variance analysis",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting.",
      "supports": "Prepare and review financial statements, including balance sheets, income statements, and cash flow statements"
    },
    {
      "source": "resume",
      "quote": "\"Experienced financial analyst with 3+ years of experience in data analysis and reporting.",
      "supports": "Develop and implement budgeting processes, including forecasting and variance analysis"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes a job title that is not being matched or verified in any way, as well as some generic or lower-scope resume snippets scattered throughout the evidence quotes.
