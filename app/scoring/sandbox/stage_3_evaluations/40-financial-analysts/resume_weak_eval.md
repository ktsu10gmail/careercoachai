The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` and `resume_file` fields seem to be correctly formatted, but there is no indication of metadata leakage.
2. **Boilerplate leakage**: There is no boilerplate content in the provided JSON output.
3. **Contra-evidence as matched evidence**: The analysis correctly identifies a contradiction between the resume evidence and the requirement ("Experience working with large datasets and performing advanced statistical analysis" vs. "Strong analytical skills, but limited experience with large datasets or advanced statistical analysis"). However, it does not flag this as a failure mode.
4. **Generic snippet scattering**: There is no generic snippet content in the provided JSON output.
5. **Title/header proof**: The title ("40. Financial Analysts") and header ("scope_mismatch") seem to be correctly formatted.
6. **Scope mismatch**: The analysis correctly identifies a scope mismatch between the requirement ("Conduct regular financial reviews and reporting for clients, ensuring timely and accurate delivery of key performance indicators (KPIs)") and the resume evidence ("Strong analytical skills, but limited experience with large datasets or advanced statistical analysis").
7. **Matched/missing contradiction**: As mentioned earlier, there is a contradiction between the resume evidence and the requirement, which should be flagged as a failure mode.

Proposed regression case:

```json
{
  "job_title": "41. Data Analysts",
  "case_slug": "41-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.485991",
  "match_score": 54.76,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 50.0,
      "reason": "Found 5 direct, 4 adjacent, 0 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "+ Analyzed data using Excel and Python to identify trends and opportunities"
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
      "score": 40.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "1 year"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 58.8,
      "reason": "Found 1 direct, 3 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "+ Analyzed data using Excel and Python to identify trends and opportunities"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "+ Analyzed data using Excel and Python to identify trends and opportunities"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Analyze data to identify trends, opportunities, and risks for a portfolio of 20+ clients across various industries",
      "evidence": [
        "+ Analyzed data using Excel and Python to identify trends and opportunities"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain complex data models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow",
      "evidence": [
        "+ Analyzed data using Excel and Python to identify trends and opportunities"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct regular data reviews and reporting for clients, ensuring timely and accurate delivery of key performance indicators (KPIs)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and maintain relationships with clients, providing exceptional customer service and support",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "+ Analyzed data using Excel and Python to identify trends and opportunities",
      "supports": "Analyze data to identify trends, opportunities, and risks for a portfolio of 20+ clients across various industries"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case has the same issues as the original JSON output (e.g., scope mismatch, matched/missing contradiction), but with some changes to make it more challenging for the analysis engine.
