The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific scope mismatch, but this is not considered a metadata leakage issue as it is explicitly stated in the job description.

2. **Boilerplate Leakage**: There are no boilerplate snippets scattered throughout the output that could indicate leakage.

3. **Contra-Evidence as Matched Evidence**: The `missing_requirements` section contains a requirement with contra-evidence instead of affirmative proof, but this is correctly identified and flagged as high severity.

4. **Generic Snippet Scattering**: There are no generic or lower-scope resume snippets scattered throughout the output that could indicate scattering.

5. **Title/Header Proof**: The title/header proof issue is not present in this output.

6. **Scope Mismatch**: The `expected_profile` field contains a scope mismatch, but as mentioned earlier, this is explicitly stated in the job description and not considered a metadata leakage issue.

7. **Matched/Missing Contradiction**: There are no matched or missing contradictions present in this output.

**Proposed Regression Case:**

```json
{
  "job_title": "55. Data Analysts",
  "case_slug": "55-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:51.004039",
  "match_score": 65.25,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 45.7,
      "reason": "Found 4 direct, 6 adjacent, 1 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI",
        "Limited focus on machine learning algorithms, statistical modeling, or data mining techniques"
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
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3+ years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 58.8,
      "reason": "Found 2 direct, 1 adjacent, 1 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Strong understanding of statistical modeling techniques",
      "evidence": [
        "Limited focus on machine learning algorithms, statistical modeling, or data mining techniques"
      ],
      "strength": "low"
    },
    {
      "requirement": "Experience with data visualization tools such as Excel, Tableau, or Power BI",
      "evidence": [
        "Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Analyze large datasets to identify trends and patterns",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Limited focus on machine learning algorithms, statistical modeling, or data mining techniques",
      "severity": "high"
    },
    {
      "requirement": "Develop and maintain technical documentation, including user manuals, system diagrams, and technical specifications",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI",
      "severity": "high"
    },
    {
      "requirement": "Bachelor's degree in Computer Science, Information Technology, or related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proficient in data analysis and visualization tools such as Excel, Tableau, or Power BI",
      "supports": "Experience with data visualization tools such as Excel, Tableau, or Power BI"
    },
    {
      "source": "resume",
      "quote": "Limited focus on machine learning algorithms, statistical modeling, or data mining techniques",
      "supports": "Analyze large datasets to identify trends and patterns"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case contains a scope mismatch in the `expected_profile` field, which could lead to incorrect scoring. The `missing_requirements` section contains a requirement with contra-evidence instead of affirmative proof, and another generic or lower-scope resume snippet that lacks the explicit operational scope required.
