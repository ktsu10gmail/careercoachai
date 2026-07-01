The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is consistent with the overall scoring and feedback provided in the output.
2. **Boilerplate leakage**: There are no obvious examples of boilerplate text or generic phrases that could be considered as leakage.
3. **Contra-evidence as matched evidence**: The `missing_requirements` section highlights a few instances where the resume contains contra-evidence instead of affirmative proof, which is correctly flagged as an issue.
4. **Generic snippet scattering**: There are no obvious examples of generic or lower-scope resume snippets that could be considered as scattering.
5. **Title/header proof**: The title and header sections appear to be well-formatted and free of issues.
6. **Scope mismatch**: The `expected_profile` field suggests a scope mismatch, but this is consistent with the overall scoring and feedback provided in the output.
7. **Matched/missing contradiction**: There are no obvious examples of matched or missing contradictions that could be considered as an issue.

Overall, the JSON output appears to be clean and free of known failure modes. However, it's worth noting that the confidence level is medium due to the presence of useful evidence but also some depth and recency issues that require human verification.

Proposed regression case:

```json
{
  "job_title": "8. Operations Coordinators",
  "case_slug": "8-operations-coordinators",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:25.007742",
  "match_score": 53.74,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.4,
      "reason": "Found 2 direct, 7 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "- Assisted with data entry and filing tasks as part of a team effort."
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
      "score": 64.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "1 year"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 50.0,
      "reason": "Found 0 direct, 2 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 93.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "- Assisted with data entry and filing tasks as part of a team effort."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Assist with data entry and filing tasks as part of a team effort",
      "evidence": [
        "- Assisted with data entry and filing tasks as part of a team effort."
      ],
      "strength": "high"
    },
    {
      "requirement": "Manage inventory levels and ordering processes to minimize stockouts and overstocking",
      "evidence": [],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop and implement process improvements to increase productivity and reduce costs by 15% within the first six months",
      "reason": "Resume contains contra-evidence instead of affirmative proof: - Assisted with data entry and filing tasks as part of a team effort.",
      "severity": "high"
    },
    {
      "requirement": "Proven track record of implementing process improvements and reducing costs",
      "reason": "Resume contains contra-evidence instead of affirmative proof: - Assisted with data entry and filing tasks as part of a team effort.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "- Assisted with data entry and filing tasks as part of a team effort.",
      "supports": "Assist with data entry and filing tasks as part of a team effort"
    },
    {
      "source": "resume",
      "quote": "- Assisted with data entry and filing tasks as part of a team effort.",
      "supports": "Manage inventory levels and ordering processes to minimize stockouts and overstocking"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case has a similar structure to the original output but with some key differences that could lead to issues. The `missing_requirements` section highlights two instances where the resume contains contra-evidence instead of affirmative proof, which could be considered as an issue.
