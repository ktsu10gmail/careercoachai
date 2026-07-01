The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `resume_file` field contains a specific file name (`resume_contra.txt`) that may indicate metadata leakage, but it does not appear to be an issue in this case.
2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output.
3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains a requirement with contra-evidence instead of affirmative proof. However, this is correctly identified and flagged as a high-severity issue.
4. **Generic snippet scattering**: The `evidence_quotes` section appears to be properly formatted and does not exhibit generic snippet scattering.
5. **Title/header proof**: There is no apparent title/header proof in the provided output.
6. **Scope mismatch**: The scope of the matched requirements seems to align with the JD requirements, but a more thorough analysis would be necessary to confirm this.
7. **Matched/missing contradiction**: There are no apparent contradictions between the matched and missing requirements.

Proposed regression case:

```json
{
  "job_title": "22. Data Entry Clerks",
  "case_slug": "22-data-entry-clerks",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-30T18:20:48.749063",
  "match_score": 50.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.0,
      "reason": "Found 3 direct, 2 adjacent, 1 domain/scope gap, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "I have experience in data entry and maintenance tasks using SAP software."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 60.0,
      "reason": "Found 1 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "I am proficient in data entry and maintenance tasks using SAP software."
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "staff"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 20.0,
      "reason": "Found 1 direct, 1 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "I am proficient in data entry and maintenance tasks using SAP software."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "I have experience in data entry and maintenance tasks using SAP software."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Perform data entry and maintenance tasks using software such as SAP or Oracle",
      "evidence": [
        "I have experience in data entry and maintenance tasks using SAP software."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in data entry and maintenance tasks using software such as SAP or Oracle",
      "evidence": [
        "I am proficient in data entry and maintenance tasks using SAP software."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Knowledge of Generally Accepted Accounting Principles (GAAP) or Generally Accepted Auditing Standards (GAAS)",
      "reason": "Resume contains boilerplate instead of affirmative proof: I have experience in data entry and maintenance tasks using SAP software.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "I have experience in data entry and maintenance tasks using SAP software.",
      "supports": "Perform data entry and maintenance tasks using software such as SAP or Oracle"
    },
    {
      "source": "resume",
      "quote": "I am proficient in data entry and maintenance tasks using SAP software.",
      "supports": "Proficiency in data entry and maintenance tasks using software such as SAP or Oracle"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case includes a `resume_boilerplate.txt` file that contains boilerplate text, which may indicate metadata leakage. The `expected_profile` field has been changed to `boilerplate_evidence`, and the `scored_at` timestamp remains the same.
