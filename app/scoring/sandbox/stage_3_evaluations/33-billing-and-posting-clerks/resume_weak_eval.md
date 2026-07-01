The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a scope mismatch, which is expected. However, it's worth noting that this could potentially lead to incorrect scoring if not properly addressed.
2. **Boilerplate Leakage**: There are no obvious examples of boilerplate leakage in the provided output.
3. **Contra-Evidence as Matched Evidence**: The analysis does not contain any instances of contra-evidence being matched with evidence.
4. **Generic Snippet Scattering**: The `evidence_quotes` field contains specific quotes that support specific requirements, which is a good practice to avoid generic snippet scattering.
5. **Title/Header Proof**: There is no title or header proof in the provided output.
6. **Scope Mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, but this is expected and not considered a failure mode.
7. **Matched/Missing Contradiction**: The analysis does not contain any instances of matched or missing contradictions.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's essential to note that human verification may still be necessary to ensure accuracy and depth in the scoring process.

**Proposed Regression Case:**

```json
{
  "job_title": "22. Data Entry Clerks",
  "case_slug": "22-data-entry-clerks",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.800142",
  "match_score": 42.32,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 25.8,
      "reason": "Found 2 direct, 3 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "\"High school diploma, 1 year of experience in data entry with expertise in Microsoft Office Suite."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Process and post customer payments accurately and efficiently",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Reconcile and resolve discrepancies in accounts payable and accounts receivable",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"High school diploma, 1 year of experience in data entry with expertise in Microsoft Office Suite.",
      "supports": "Process and post customer payments accurately and efficiently"
    },
    {
      "source": "resume",
      "quote": "\"High school diploma, 1 year of experience in data entry with expertise in Microsoft Office Suite.",
      "supports": "Reconcile and resolve discrepancies in accounts payable and accounts receivable"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case contains a scope mismatch in the `expected_profile` field and has missing requirements that require specific resume bullets or projects to support. This can help identify potential issues with the scoring engine's ability to handle scope mismatches and missing requirements.
