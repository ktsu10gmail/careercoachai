The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `case_slug` field contains sensitive information about the job title, but it does not leak any confidential data.
2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.
3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies a contradiction between the resume evidence and the expected profile. However, it does not flag this as a failure mode. Instead, it provides a reason for the low score in the "Conduct regular business reviews with clients" category.
4. **Generic Snippet Scattering**: There is no apparent generic snippet scattering in the provided JSON output.
5. **Title/Header Proof**: The title and header are not explicitly proven or disproven in the analysis, but this is not a known failure mode.
6. **Scope Mismatch**: There is no apparent scope mismatch between the job description and the resume evidence.
7. **Matched/Missing Contradiction**: The analysis correctly identifies a contradiction between the resume evidence and the expected profile.

Overall, the provided JSON output appears to be clean and free from known failure modes. However, it's essential to note that this analysis is not exhaustive, and further review may be necessary to ensure the accuracy of the results.

**Proposed Regression Case:**

```json
{
  "job_title": "22. Senior Software Engineers",
  "case_slug": "22-senior-software-engineers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "domain_and_tools_fit",
  "scored_at": "2026-06-30T18:20:47.611656",
  "match_score": 40.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 35.0,
      "reason": "Found 2 direct, 1 adjacent, 0 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Proficient in Java and C++"
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
      "score": 60.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "10+ years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 20.0,
      "reason": "Found 2 direct, 1 adjacent, 0 domain/scope gaps, and 3 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in Java and C++"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proficient in Java and C++"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proficient in Java and C++",
      "evidence": [
        "Proficient in Java and C++"
      ],
      "strength": "high"
    },
    {
      "requirement": "10+ years of experience in software development or a related field",
      "evidence": [
        "10+ years"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience with cloud-based technologies (AWS, Azure, Google Cloud)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    },
    {
      "requirement": "Familiarity with Agile development methodologies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proficient in Java and C++",
      "supports": "Proficient in Java and C++"
    },
    {
      "source": "resume",
      "quote": "10+ years",
      "supports": "10+ years of experience in software development or a related field"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because multiple JD requirements have indirect resume evidence."
}
```

This proposed regression case includes a mix of direct and indirect evidence, as well as some missing requirements. It's essential to review this case carefully to ensure that the analysis accurately reflects the strengths and weaknesses of the candidate's application.
