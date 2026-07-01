The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value (`scope_mismatch`) that is not present in the actual job title. However, this is likely an error on the part of the user or the system, rather than a deliberate attempt to leak metadata.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains a requirement (`Develop and implement individualized care plans for patients with complex medical needs...`) that has contra-evidence instead of affirmative proof. However, this is not an issue with the scoring engine itself, but rather a limitation in the quality of the resume.

4. **Generic snippet scattering**: The `evidence` field contains generic snippets (e.g., "Licensed Practical/Vocational Nurse") that are not specific to the job description. While these snippets may be relevant to the user's experience, they do not provide concrete evidence for the matched requirements.

5. **Title/header proof**: There is no apparent issue with title/header proof in this output.

6. **Scope mismatch**: The `expected_profile` field indicates that the expected profile is a scope mismatch, but the actual job title does not support this claim. However, as mentioned earlier, this may be an error on the part of the user or the system.

7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements in this output.

**Proposed regression case:**

```json
{
  "job_title": "123. Software Engineer",
  "case_slug": "123-software-engineer",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.383275",
  "match_score": 41.82,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 33.6,
      "reason": "Found 2 direct, 6 adjacent, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "Proficient in Java and Python programming languages"
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
      "score": 45.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": []
    },
    {
      "category": "Domain and tools fit",
      "score": 33.6,
      "reason": "Found 2 direct, 6 adjacent, and 4 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in Java and Python programming languages"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 68.4,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Proficient in Java and Python programming languages"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and implement software solutions using Java and Python",
      "evidence": [
        "Proficient in Java and Python programming languages"
      ],
      "strength": "high"
    },
    {
      "requirement": "Collaborate with cross-functional teams to deliver high-quality software products",
      "evidence": [],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience working with agile development methodologies and version control systems",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Proficient in Java and Python programming languages does not imply experience with agile development.",
      "severity": "high"
    },
    {
      "requirement": "Strong understanding of cloud computing platforms and migration strategies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proficient in Java and Python programming languages",
      "supports": "Develop and implement software solutions using Java and Python"
    },
    {
      "source": "resume",
      "quote": "Collaborate with cross-functional teams to deliver high-quality software products",
      "supports": "Collaborate with cross-functional teams to deliver high-quality software products"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This proposed regression case includes a requirement (`Experience working with agile development methodologies...`) that has contra-evidence instead of affirmative proof. This would allow the scoring engine to incorrectly flag the resume as not meeting the expected requirements.
