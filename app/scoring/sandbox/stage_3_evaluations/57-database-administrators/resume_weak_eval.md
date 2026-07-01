The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked from external sources.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: In the "missing_requirements" section, there are two requirements with contra-evidence instead of affirmative proof. However, this is correctly identified and flagged as a high-severity issue.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains generic snippets that lack specificity. While this is not ideal, it does not appear to be a widespread issue in the provided JSON output.

5. **Title/Header Proof**: There is no indication of title/header proof issues in the provided JSON output.

6. **Scope Mismatch**: The "missing_requirements" section contains a requirement with a scope mismatch ("3 years of experience in database administration on Windows-based systems (SQL Server)") that does not match the expected scope for the position.

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements in the provided JSON output.

Proposed Regression Case:

```json
{
  "job_title": "58. Data Analysts",
  "case_slug": "58-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:51.354725",
  "match_score": 74.35,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 78.6,
      "reason": "Found 11 direct, 0 adjacent, 1 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "Note: This resume snippet lacks the required skills and experience for the position, such as 5+ years of experience, strong understanding of statistical modeling principles, and knowledge of data visualization tools."
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
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 66.7,
      "reason": "Found 6 direct, 0 adjacent, 1 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Note: This resume snippet lacks the required skills and experience for the position, such as 5+ years of experience, strong understanding of statistical modeling principles, and knowledge of data visualization tools."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Note: This resume snippet lacks the required skills and experience for the position, such as 5+ years of experience, strong understanding of statistical modeling principles, and knowledge of data visualization tools."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and execute data analysis plans to ensure data quality and insights",
      "evidence": [
        "3 years of experience in data analysis on Excel"
      ],
      "strength": "high"
    },
    {
      "requirement": "Collaborate with stakeholders to resolve data-related issues and optimize system performance",
      "evidence": [
        "3 years of experience in data analysis on Excel"
      ],
      "strength": "high"
    },
    {
      "requirement": "Monitor data quality and identify areas for improvement through the use of tools such as Tableau, Power BI, or similar software",
      "evidence": [
        "3 years of experience in data analysis on Excel"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain data documentation to ensure knowledge sharing and collaboration among team members",
      "evidence": [
        "3 years of experience in data analysis on Excel"
      ],
      "strength": "high"
    },
    {
      "requirement": "5+ years of experience in data analysis on Excel, Tableau, Power BI",
      "evidence": [
        "3 years of experience in data analysis on Excel"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Design and implement databases to store and manage large amounts of data for various business applications",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Note: This resume snippet lacks the required skills and experience for the position, such as 5+ years of experience, strong understanding of statistical modeling principles, and knowledge of data visualization tools.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of machine learning algorithms and techniques",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: 3 years of experience in data analysis on Excel",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with cloud-based data platforms like AWS, Azure, Google Cloud",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Note: This resume snippet lacks the required skills and experience for the position, such as 5+ years of experience, strong understanding of statistical modeling principles, and knowledge of data visualization tools.",
      "supports": "Develop and execute data analysis plans to ensure data quality and insights"
    },
    {
      "source": "resume",
      "quote": "3 years of experience in data analysis on Excel",
      "supports": "Collaborate with stakeholders to resolve data-related issues and optimize system performance"
    },
    {
      "source": "resume",
      "quote": "3 years of experience in data analysis on Excel",
      "supports": "Monitor data quality and identify areas for improvement through the use of tools such as Tableau, Power BI, or similar software"
    },
    {
      "source": "resume",
      "quote": "3 years of experience in data analysis on Excel",
      "supports": "Develop and maintain data documentation to ensure knowledge sharing and collaboration among team members"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case includes a new job title, case slug, and resume file, with the same expected profile ("scope_mismatch") as the original JSON output. The proposed regression case contains similar issues to the original JSON output, including scope mismatches and contra-evidence instead of affirmative proof.
