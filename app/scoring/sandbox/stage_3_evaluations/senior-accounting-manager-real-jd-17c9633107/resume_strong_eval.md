The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `case_slug` field contains sensitive information about the job title and JD ID. However, this is not considered metadata leakage since it's publicly available and intended for identification purposes.

2. **Boilerplate Leakage**: There are no obvious examples of boilerplate leakage in the provided JSON output. Boilerplate refers to generic or template-like content that may be present in resumes. The analysis does not detect any such instances.

3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies some requirements with contra-evidence (e.g., "Client Leadership & Relationship Management") and flags them as missing. However, it also incorrectly matches other requirements with the same evidence (e.g., "Operational Excellence"). This is not a failure mode in this case.

4. **Generic Snippet Scattering**: The analysis detects generic snippets in the resume that lack explicit operational scope required for certain requirements (e.g., "Client Leadership & Relationship Management" and "Serve as a primary day-to-day leadership contact for operational matters, escalations, and service delivery topics."). This is considered a failure mode.

5. **Title/Header Proof**: The title/header section of the JSON output appears to be correctly formatted and does not contain any obvious issues.

6. **Scope Mismatch**: There are no apparent scope mismatches in the provided JSON output.

7. **Matched/Missing Contradiction**: The analysis correctly identifies some requirements as missing or mismatched (e.g., "Client Leadership & Relationship Management" and "Serve as a primary day-to-day leadership contact for operational matters, escalations, and service delivery topics."). This is not a failure mode in this case.

Proposed Regression Case:

```json
{
  "job_title": "Junior Software Developer",
  "case_slug": "junior-software-developer-real-jd-17c9633107",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-07-01T00:37:21.602736",
  "match_score": 57.52,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 36.4,
      "reason": "Found 1 direct, 10 adjacent, 2 domain/scope gaps, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing."
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
        "1 year"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 36.4,
      "reason": "Found 1 direct, 10 adjacent, 2 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Software Development",
      "evidence": [
        "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing."
      ],
      "strength": "high"
    },
    {
      "requirement": "Team Collaboration",
      "evidence": [],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Agile Methodologies",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing.",
      "severity": "high"
    },
    {
      "requirement": "Version Control Systems",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing.",
      "supports": "Software Development"
    },
    {
      "source": "resume",
      "quote": "Proficient in multiple programming languages (Java, Python, C++) with experience in software development and testing.",
      "supports": "Team Collaboration"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case contains a junior software developer resume with generic snippets that lack explicit operational scope required for certain requirements (e.g., "Agile Methodologies" and "Version Control Systems."). This should trigger the failure mode of Generic Snippet Scattering.
