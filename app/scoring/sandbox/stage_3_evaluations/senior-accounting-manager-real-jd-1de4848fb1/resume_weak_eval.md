The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is set to "scope_mismatch", but there is no indication of metadata leakage in the provided output.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided output, as all the quotes and references are specific to the job description or resume content.

3. **Contra-Evidence as Matched Evidence**: The system correctly identifies that there is contra-evidence instead of affirmative proof for some requirements, such as "Become the person our clients call when they need to think something through, not just get a status update." This is correctly flagged as a high-severity issue.

4. **Generic Snippet Scattering**: There is no evidence of generic snippet scattering in the provided output, as all the quotes and references are specific to the job description or resume content.

5. **Title/Header Proof**: The title/header proof is not explicitly mentioned in the provided output, but it's not a known failure mode for this JSON structure.

6. **Scope Mismatch**: The system correctly identifies that there is a scope mismatch between the expected profile and the actual requirements, which is indicated by the "scope_mismatch" value in the `expected_profile` field.

7. **Matched/Missing Contradiction**: There are no indications of matched or missing contradictions in the provided output.

**Proposed Regression Case**

To further test the system's robustness, a regression case could be created with the following JSON structure:

```json
{
  "job_title": "Senior Software Engineer",
  "case_slug": "senior-software-engineer-real-jd-1234567890",
  "resume_file": "resume_clean.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T20:56:45.776445",
  "match_score": 22.23,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 8.1,
      "reason": "Found 0 direct, 3 adjacent, 0 domain/scope gaps, and 10 missing evidence points for core JD requirements.",
      "evidence": []
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop a scalable backend architecture using Node.js and Express.",
      "evidence": [],
      "strength": "medium"
    },
    {
      "requirement": "Collaborate with cross-functional teams to identify and prioritize project requirements.",
      "evidence": [],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop a machine learning model using Python and TensorFlow.",
      "reason": "Resume contains boilerplate leakage: The resume snippet lacks the scope-mismatch by not highlighting any experience or skills directly related to machine learning, deep learning, or AI.",
      "severity": "high"
    },
    {
      "requirement": "Work on a team of 10+ people to deliver a large-scale project within 6 months.",
      "reason": "Resume contains generic snippet scattering: The resume snippet lacks the scope-mismatch by not highlighting any experience or skills directly related to team management, leadership, or project coordination.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Developed and implemented a scalable backend architecture using Node.js and Express.",
      "supports": "Develop a scalable backend architecture using Node.js and Express."
    },
    {
      "source": "job_description",
      "quote": "Collaborate with cross-functional teams to identify and prioritize project requirements.",
      "supports": "job description context"
    }
  ],
  "confidence_level": "low",
  "confidence_reason": "Confidence is low because the system found limited direct requirement evidence in the resume."
}
```

This regression case includes a clean resume file, but with boilerplate leakage and generic snippet scattering. The system should correctly identify these issues as high-severity problems.
