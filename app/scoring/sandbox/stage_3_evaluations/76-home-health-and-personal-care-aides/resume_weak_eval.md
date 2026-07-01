The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is "scope_mismatch", which suggests that there might be some mismatch between the job title and the actual requirements. However, this is not necessarily a metadata leakage issue, as it could be due to the complexity of the JD.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The analysis does not contain any instances of contra-evidence being used as matched evidence.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains quotes from the resume that support various requirements, but there is no scattering of generic snippets.

5. **Title/Header Proof**: There is no apparent title/header proof in the provided JSON output.

6. **Scope Mismatch**: As mentioned earlier, the `expected_profile` field indicates a potential scope mismatch between the job title and the actual requirements.

7. **Matched/Missing Contradiction**: The analysis does not contain any instances of matched or missing contradictions.

Proposed Regression Case:

```json
{
  "job_title": "123. Data Analyst",
  "case_slug": "123-data-analyst",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.161904",
  "match_score": 36.4,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 28.5,
      "reason": "Found 3 direct, 2 adjacent, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "Familiarity with data visualization tools such as Tableau or Power BI"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, and 1 missing evidence points for preferred JD requirements.",
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
      "score": 17.5,
      "reason": "Found 0 direct, 1 adjacent, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Familiarity with data visualization tools such as Tableau or Power BI"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 69.2,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Familiarity with data visualization tools such as Tableau or Power BI"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proficiency in data analysis software such as Excel, SQL, or Python",
      "evidence": [
        "Familiarity with data visualization tools such as Tableau or Power BI"
      ],
      "strength": "high"
    },
    {
      "requirement": "Ability to work with large datasets and perform data cleaning and processing",
      "evidence": [
        "2 years"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience with machine learning algorithms or statistical modeling techniques",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with cloud-based data storage solutions such as AWS S3 or Google Cloud Storage",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Familiarity with data visualization tools such as Tableau or Power BI",
      "supports": "Proficiency in data analysis software such as Excel, SQL, or Python"
    },
    {
      "source": "resume",
      "quote": "2 years",
      "supports": "Ability to work with large datasets and perform data cleaning and processing"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes a job title that is not directly related to the requirements, which should trigger a scope mismatch. The `expected_profile` field is set to "scope_mismatch" to reflect this issue.
