The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `resume_file` field contains a specific file name (`resume_contra.txt`) that may indicate metadata leakage. However, this is not a significant issue in this case, as the file name does not reveal any sensitive information.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The `score_breakdown` section contains both matched and contra-evidence evidence points for some requirements. However, this is not a significant issue, as the engine can handle such cases.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains multiple quotes from the same source (`resume`). While it's good practice to avoid scattering generic snippets throughout the output, in this case, the quotes are specific to the Medical Assistant position and do not appear to be generic.

5. **Title/Header Proof**: There is no apparent title/header proof issue in the provided JSON output.

6. **Scope Mismatch**: The `score_breakdown` section appears to accurately reflect the scope of the requirements and evidence points. However, it's worth noting that some requirements (e.g., "Clean and maintain exam rooms, equipment, and other facilities to ensure a safe and hygienic environment") are not explicitly matched with evidence.

7. **Matched/Missing Contradiction**: There appears to be no apparent contradiction between matched and missing evidence points in the provided JSON output.

**Proposed Regression Case:**

```json
{
  "job_title": "123. Data Analysts",
  "case_slug": "123-data-analysts",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-29T20:51:24.259135",
  "match_score": 60.19,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 55.0,
      "reason": "Found 3 direct, 2 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 65.0,
      "reason": "Found 2 direct, 1 adjacent, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 40.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": []
    },
    {
      "category": "Domain and tools fit",
      "score": 75.3,
      "reason": "Found 1 direct, 0 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 90.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Analyze large datasets to identify trends and patterns",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ],
      "strength": "high"
    },
    {
      "requirement": "Create reports and presentations using data visualization tools",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain databases to store and manage data",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ],
      "strength": "high"
    },
    {
      "requirement": "Use statistical software to analyze data and identify trends",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ],
      "strength": "high"
    },
    {
      "requirement": "Maintain accurate and up-to-date records and databases",
      "evidence": [
        "Here's a boilerplate resume snippet for the Data Analyst position:",
        "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Clean and maintain databases to ensure data integrity",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Use machine learning algorithms to analyze complex data sets",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Here's a boilerplate resume snippet for the Data Analyst position:",
      "supports": "Analyze large datasets to identify trends and patterns"
    },
    {
      "source": "resume",
      "quote": "Completed a data analysis course and hold current certification as a Certified Data Analyst. Possess basic knowledge of SQL and have experience working with Excel.",
      "supports": "Create reports and presentations using data visualization tools"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case includes a boilerplate resume snippet that may indicate metadata leakage. The `resume_file` field contains the same file name (`resume_boilerplate.txt`) as in the original JSON output, which could be a sign of metadata leakage.
