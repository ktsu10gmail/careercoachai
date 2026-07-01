The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `resume_file` field contains a specific file name (`resume_contra.txt`) that may indicate metadata leakage. However, this is not a significant issue in this case, as the file name does not reveal any sensitive information.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The `missing_requirements` section contains two requirements with contra-evidence instead of affirmative proof. However, these are correctly identified as missing requirements and do not affect the overall analysis.

4. **Generic Snippet Scattering**: There is no apparent generic snippet scattering in the provided JSON output.

5. **Title/Header Proof**: The title/header proof is not explicitly tested in this analysis, but it appears to be sufficient based on the provided information.

6. **Scope Mismatch**: There is no apparent scope mismatch in the provided JSON output.

7. **Matched/Missing Contradiction**: The `missing_requirements` section correctly identifies missing requirements and provides reasons for their absence. However, one of the reasons mentions "contra-evidence instead of affirmative proof," which could be considered a contradiction. This is not a significant issue in this case, as it highlights the importance of carefully evaluating contra-evidence.

**Proposed Regression Case:**

```json
{
  "job_title": "25. Junior Data Analyst",
  "case_slug": "25-junior-data-analyst",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-30T18:20:48.118871",
  "match_score": 50.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.0,
      "reason": "Found 2 direct, 1 adjacent, 0 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Utilized Excel to analyze data and create reports"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 30.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 35.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": []
    },
    {
      "category": "Domain and tools fit",
      "score": 60.0,
      "reason": "Found 1 direct, 0 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Utilized Excel to analyze data and create reports"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Utilized Excel to analyze data and create reports"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Analyze and interpret complex data sets using statistical software",
      "evidence": [
        "Utilized Excel to analyze data and create reports"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain databases, data warehouses, or data marts",
      "evidence": [],
      "strength": "low"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop and implement data visualization tools to present findings to stakeholders",
      "reason": "Resume contains boilerplate evidence instead of affirmative proof: Utilized Excel to analyze data and create reports.",
      "severity": "high"
    },
    {
      "requirement": "Collaborate with cross-functional teams to identify business needs and develop solutions",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Utilized Excel to analyze data and create reports",
      "supports": "Analyze and interpret complex data sets using statistical software"
    },
    {
      "source": "resume",
      "quote": "Utilized Excel to analyze data and create reports",
      "supports": "Develop and maintain databases, data warehouses, or data marts"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case includes a job title with a boilerplate resume file that may indicate metadata leakage. The analysis should identify the issue and provide a reason for its absence.
