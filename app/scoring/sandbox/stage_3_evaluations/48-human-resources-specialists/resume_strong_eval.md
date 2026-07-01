The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata Leakage**: The `case_slug` field contains sensitive information about the job title, which could potentially leak metadata. However, this is not considered a significant issue in this case.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The analysis does not contain any instances of contra-evidence being used as matched evidence.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains specific quotes from the resume that support various JD requirements, which helps to prevent generic snippet scattering.

5. **Title/Header Proof**: There is no apparent title/header proof in the provided JSON output.

6. **Scope Mismatch**: The analysis appears to be accurate and does not contain any scope mismatches.

7. **Matched/Missing Contradiction**: The analysis does not contain any matched/missing contradictions.

**Proposed Regression Case:**

```json
{
  "job_title": "49. Human Resources Generalist",
  "case_slug": "49-human-resources-generalist",
  "resume_file": "resume_weak.txt",
  "expected_profile": "weak_match",
  "scored_at": "2026-06-30T18:20:50.206913",
  "match_score": 40.25,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 35.0,
      "reason": "Found 2 direct, 3 adjacent, 1 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies."
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
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "1 year"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 25.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 70.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Conduct thorough investigations of employee complaints and grievances, gathering evidence and interviewing parties involved",
      "evidence": [
        "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies."
      ],
      "strength": "low"
    },
    {
      "requirement": "Excellent communication, interpersonal, and problem-solving skills",
      "evidence": [
        "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies."
      ],
      "strength": "low"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Bachelor's degree in Human Resources or related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Certification as a Society for Human Resource Management (SHRM) Certified Professional (SHRM-CP) or Professional in Human Resources (PHR)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies.",
      "supports": "Conduct thorough investigations of employee complaints and grievances, gathering evidence and interviewing parties involved"
    },
    {
      "source": "resume",
      "quote": "General HR support with 1 year of experience in conducting investigations, developing corrective action plans, and implementing HR policies.",
      "supports": "Excellent communication, interpersonal, and problem-solving skills"
    }
  ],
  "confidence_level": "low",
  "confidence_reason": "Confidence is low because there are missing JD requirements and limited direct resume evidence."
}
```

This proposed regression case contains a weaker match profile with fewer direct resume matches and more missing JD requirements. This should help identify issues related to metadata leakage, boilerplate leakage, contra-evidence as matched evidence, generic snippet scattering, title/header proof, scope mismatch, and matched/missing contradictions.
