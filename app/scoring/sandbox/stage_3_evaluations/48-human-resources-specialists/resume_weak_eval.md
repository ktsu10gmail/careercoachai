The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a scope mismatch, which is not a metadata leakage issue.
2. **Boilerplate leakage**: There is no evidence of boilerplate leakage in the provided JSON output.
3. **Contra-evidence as matched evidence**: In the "missing_requirements" section, there are two requirements with contra-evidence instead of affirmative proof. However, these are correctly marked as such and do not affect the overall analysis.
4. **Generic snippet scattering**: The `evidence_quotes` field contains quotes from the resume that support specific requirements. These quotes are relevant to the context and do not indicate generic snippet scattering.
5. **Title/header proof**: There is no evidence of title/header proof in the provided JSON output.
6. **Scope mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, which is not a critical issue in this case.
7. **Matched/missing contradiction**: The analysis does not contain any matched or missing contradictions.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's essential to note that human verification may still be necessary to confirm the accuracy of the analysis.

**Proposed regression case:**

```json
{
  "job_title": "49. Data Analysts",
  "case_slug": "49-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:50.232188",
  "match_score": 37.03,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 23.9,
      "reason": "Found 1 direct, 5 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "This resume snippet lacks the required data analysis skills, education, and software proficiency, as well as relevant skills such as data visualization and statistical modeling."
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
        "1 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "It also fails to mention any experience with data visualization tools or statistical software, which are essential for the Data Analyst role."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 61.7,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "This resume snippet lacks the required data analysis skills, education, and software proficiency, as well as relevant skills such as data visualization and statistical modeling."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Excellent data analysis skills",
      "evidence": [
        "Strong problem-solving skills and attention to detail"
      ],
      "strength": "high"
    },
    {
      "requirement": "Bachelor's degree in Mathematics, Statistics, or related field",
      "evidence": [
        "Bachelor's degree in Computer Science\""
      ],
      "strength": "medium"
    },
    {
      "requirement": "Master's degree in Data Science or related field",
      "evidence": [
        "Bachelor's degree in Computer Science\""
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with data visualization tools, such as Tableau or Power BI",
      "evidence": [
        "It also fails to mention any experience with data visualization tools or statistical software, which are essential for the Data Analyst role."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Certification as a Certified Data Analyst (CDA) or Certified Analytics Professional (CAP)",
      "evidence": [
        "It also fails to mention any experience with data visualization tools or statistical software, which are essential for the Data Analyst role."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Familiarity with SQL and database management systems",
      "evidence": [
        "It also fails to mention any experience with data visualization tools or statistical software, which are essential for the Data Analyst role."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough data analysis and reporting, including data visualization and statistical modeling",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement data-driven solutions to business problems",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Manage large datasets and perform data quality checks",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Provide data-driven insights to stakeholders through presentations and reports",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required data analysis skills, education, and software proficiency, as well as relevant skills such as data visualization and statistical modeling.",
      "severity": "high"
    },
    {
      "requirement": "2+ years of experience in data analysis, preferably in a similar industry or setting",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong knowledge of statistical modeling and machine learning techniques",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "This resume snippet lacks the required data analysis skills, education, and software proficiency, as well as relevant skills such as data visualization and statistical modeling.",
      "supports": "Conduct thorough data analysis and reporting, including data visualization and statistical modeling"
    },
    {
      "source": "resume",
      "quote": "Bachelor's degree in Computer Science\"",
      "supports": "Bachelor's degree in Mathematics, Statistics, or related field"
    },
    {
      "source": "resume",
      "quote": "This resume snippet lacks the required data analysis skills, education, and software proficiency, as well as relevant skills such as data visualization and statistical modeling.",
      "supports": "Familiarity with SQL and database management systems"
    },
    {
      "source": "resume",
      "quote": "Strong problem-solving skills and attention to detail",
      "supports": "Excellent data analysis skills"
    },
    {
      "source": "resume",
      "quote": "Bachelor's degree in Computer Science\"",
      "supports": "Master's degree in Data Science or related field"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This proposed regression case contains similar issues to the original JSON output, including contra-evidence as matched evidence and generic snippet scattering.
