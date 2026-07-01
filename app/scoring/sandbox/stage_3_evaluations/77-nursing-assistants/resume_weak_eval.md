The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is not leaked from any other part of the JSON. This suggests that there is no metadata leakage.

2. **Boilerplate leakage**: There is no boilerplate content in the provided JSON output, and all relevant information is contained within the `score_breakdown`, `requirement_matches`, and `missing_requirements` fields.

3. **Contra-evidence as matched evidence**: The analysis does not contain any instances of contra-evidence being used as matched evidence. All matches are based on direct or adjacent evidence points.

4. **Generic snippet scattering**: There is no generic snippet scattering in the provided JSON output, and all relevant information is contained within specific fields (e.g., `score_breakdown`, `requirement_matches`).

5. **Title/header proof**: The title ("77. Nursing Assistants") does not appear to be proofed or validated against any external sources.

6. **Scope mismatch**: The analysis indicates a scope mismatch between the expected profile ("scope_mismatch") and the actual requirements of the job posting. This is correctly identified as an issue.

7. **Matched/missing contradiction**: There are no contradictions between matched and missing evidence points in the provided JSON output.

**Proposed regression case:**

```json
{
  "job_title": "123. Data Analyst",
  "case_slug": "123-data-analyst",
  "resume_file": "resume_strict.txt",
  "expected_profile": "none",
  "scored_at": "2026-06-29T20:51:24.230645",
  "match_score": 50.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 80.0,
      "reason": "Found 2 direct, 3 adjacent, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI. Skilled in machine learning using scikit-learn and TensorFlow."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 60.0,
      "reason": "Found 1 direct, 2 adjacent, and 3 missing evidence points for preferred JD requirements.",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI."
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
      "score": 10.0,
      "reason": "Found 1 direct, 2 adjacent, and 3 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 70.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Bachelor's degree in Computer Science or related field required;",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficient in Python, R, and SQL",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experienced in data visualization",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Skilled in machine learning",
      "evidence": [
        "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI. Skilled in machine learning using scikit-learn and TensorFlow."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience working with big data sets",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with cloud-based technologies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI.",
      "supports": "Bachelor's degree in Computer Science or related field required;"
    },
    {
      "source": "resume",
      "quote": "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI.",
      "supports": "Proficient in Python, R, and SQL"
    },
    {
      "source": "resume",
      "quote": "\"Bachelor's degree in Computer Science or related field required. Proficient in Python, R, and SQL. Experienced in data visualization with tools like Tableau and Power BI.",
      "supports": "Experienced in data visualization"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because there is strong evidence supporting all matches."
}
```

This regression case includes a job posting for a Data Analyst position with more stringent requirements and a stricter resume file. The analysis should correctly identify the scope mismatch between the expected profile ("none") and the actual requirements of the job posting.
