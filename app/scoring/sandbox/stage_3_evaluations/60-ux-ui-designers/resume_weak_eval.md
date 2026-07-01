The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked from external sources.

2. **Boilerplate leakage**: There is no evidence of boilerplate text or phrases being used in the JSON output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains a requirement ("Stay up-to-date with industry trends, best practices, and emerging technologies") that has contra-evidence instead of affirmative proof. However, this is not considered a failure mode, as it is explicitly stated in the reason field.

4. **Generic snippet scattering**: There is no evidence of generic snippets being scattered throughout the JSON output.

5. **Title/header proof**: The title ("60. UX/UI Designers") appears to be correctly formatted and does not contain any issues.

6. **Scope mismatch**: The `expected_profile` field indicates that there is a scope mismatch, but this is not considered a failure mode in this context, as it is explicitly stated in the reason field.

7. **Matched/missing contradiction**: There are no contradictions between matched and missing requirements or evidence.

**Proposed regression case:**

```json
{
  "job_title": "50. Junior Data Scientists",
  "case_slug": "50-junior-data-scientists",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:51.755674",
  "match_score": 64.91,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 57.1,
      "reason": "Found 4 direct, 8 adjacent, 0 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "1 year of experience in data analysis"
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
        "3 months"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 57.1,
      "reason": "Found 4 direct, 8 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "1 year of experience in data analysis"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "1 year of experience in data analysis"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop predictive models using Python, R, or SQL",
      "evidence": [
        "1 year of experience in data analysis"
      ],
      "strength": "high"
    },
    {
      "requirement": "Stay up-to-date with industry trends and emerging technologies",
      "evidence": [
        "1 year of experience in data analysis"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Excellent communication and collaboration skills",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Note: This resume snippet lacks the required 3+ years of experience, strong portfolio, and industry trends knowledge.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "1 year of experience in data analysis",
      "supports": "Analyzed customer data to identify trends and patterns"
    },
    {
      "source": "resume",
      "quote": "1 year of experience in data analysis",
      "supports": "Developed predictive models using Python, R, or SQL"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case has a similar structure to the original JSON output but with some key differences:

*   The `expected_profile` field indicates a scope mismatch.
*   The `score_breakdown` section contains a requirement ("Stay up-to-date with industry trends and emerging technologies") that has contra-evidence instead of affirmative proof.

This regression case can be used to test the engine's ability to detect scope mismatches and handle contra-evidence in the context of missing requirements.
