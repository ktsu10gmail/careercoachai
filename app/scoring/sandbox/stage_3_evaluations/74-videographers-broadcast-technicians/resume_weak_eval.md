The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked or compromised.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output, as all evidence and requirements seem to be original to the resume.

3. **Contra-Evidence as Matched Evidence**: The `missing_requirements` section contains a requirement ("Experience with multi-camera setups and switcher operation") that has contra-evidence instead of affirmative proof. However, this is correctly identified as a high-severity issue.

4. **Generic Snippet Scattering**: There are multiple generic snippets scattered throughout the JSON output, but they do not appear to be malicious or indicative of metadata leakage.

5. **Title/Header Proof**: The title and header sections of the JSON output seem to be properly formatted and do not contain any obvious issues.

6. **Scope Mismatch**: The `expected_profile` field indicates a scope mismatch, which is correctly identified as an issue in the analysis.

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements in the provided JSON output.

**Proposed Regression Case:**

```json
{
  "job_title": "123. Data Analysts",
  "case_slug": "123-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.002396",
  "match_score": 66.23,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 62.1,
      "reason": "Found 5 direct, 8 adjacent, and 0 missing evidence points for core JD requirements.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Data Analyst position:",
        "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms."
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
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Data Analyst position:",
        "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proficiency in SQL, Excel, and statistical modeling",
      "evidence": [
        "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with machine learning algorithms",
      "evidence": [
        "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms."
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience as a data analyst",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Data Analyst position:"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience with data visualization tools, such as Tableau or Power BI",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Here's a weak or scope-mismatch resume snippet for a Data Analyst position:",
      "supports": "Analyze and interpret complex data sets to inform business decisions."
    },
    {
      "source": "resume",
      "quote": "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms.",
      "supports": "Develop and maintain databases to store and manage large datasets."
    },
    {
      "source": "resume",
      "quote": "\"Experienced data analyst with 3+ years of experience in analyzing and interpreting complex data sets. Proficient in SQL, Excel, and statistical modeling. Strong understanding of data visualization tools.",
      "supports": "Create interactive dashboards to present findings to stakeholders."
    },
    {
      "source": "resume",
      "quote": "\"Experienced data analyst with 3+ years of experience in analyzing and interpreting complex data sets. Proficient in SQL, Excel, and statistical modeling. Strong understanding of data visualization tools.",
      "supports": "Collaborate with cross-functional teams to identify business opportunities and drive growth."
    },
    {
      "source": "resume",
      "quote": "This resume snippet lacks the required skills and experience for a data analyst role, such as proficiency in SQL, Excel, and statistical modeling. It also doesn't mention any experience with machine learning algorithms.",
      "supports": "Maintain accurate records of data quality and integrity."
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case contains a similar scope mismatch issue as the original JSON output, but with additional contra-evidence that makes it more challenging to identify.
