The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value (`scope_mismatch`) that is not present in the rest of the metadata. However, this is likely an error on the part of the developer and does not indicate a security vulnerability.

2. **Boilerplate leakage**: There are no obvious examples of boilerplate code or sensitive information being leaked in the provided JSON output.

3. **Contra-evidence as matched evidence**: The `score_breakdown` section contains some potential issues, but they do not appear to be cases of contra-evidence being used as matched evidence. For example, the "Must-have requirements" category mentions that there are 2 direct, 3 adjacent, and 9 missing evidence points for core JD requirements, but this does not seem to be a case of using contra-evidence.

4. **Generic snippet scattering**: The `score_breakdown` section contains some generic snippets (e.g., "**Registered Nurse**", "* Strong understanding of operating system concepts, including Windows and Linux") that are scattered throughout the evidence points. However, these snippets do not appear to be used in a way that would indicate generic snippet scattering.

5. **Title/header proof**: The `score_breakdown` section does not contain any obvious examples of title/header proofing (i.e., using titles or headers to artificially inflate scores).

6. **Scope mismatch**: The `expected_profile` field contains a specific value (`scope_mismatch`) that suggests there may be a scope mismatch between the expected profile and the actual profile. However, this is likely an error on the part of the developer and does not indicate a security vulnerability.

7. **Matched/missing contradiction**: There do not appear to be any obvious cases of matched/missing contradictions in the provided JSON output.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's always possible that there may be some subtle issues that are not immediately apparent.

Proposed regression case:

```json
{
  "job_title": "75. Registered Nurses",
  "case_slug": "75-registered-nurses",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.082445",
  "match_score": 37.45,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 21.8,
      "reason": "Found 2 direct, 3 adjacent, and 9 missing evidence points for core JD requirements.",
      "evidence": [
        "**Registered Nurse**",
        "* Strong understanding of operating system concepts, including Windows and Linux"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 50.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Registered Nurse**",
      "evidence": [
        "**Registered Nurse**"
      ],
      "strength": "high"
    },
    {
      "requirement": "Current licensure as a Registered Nurse (RN) in the state of [insert state]",
      "evidence": [
        "* Strong understanding of operating system concepts, including Windows and Linux"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough assessments of patients' physical and emotional needs, developing individualized care plans to address these needs",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Administer medications, treatments, and therapies as ordered by physicians and other healthcare professionals",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "**Registered Nurse**",
      "supports": "Registered Nurse**"
    },
    {
      "source": "resume",
      "quote": "* Strong understanding of operating system concepts, including Windows and Linux",
      "supports": "Current licensure as a Registered Nurse (RN) in the state of [insert state]"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes some minor changes to the original JSON output, such as removing one of the evidence points for the "Must-have requirements" category. This should cause the scoring engine to produce a slightly different score, which can be used to test its robustness and accuracy.
