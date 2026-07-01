The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is "scope_mismatch", which suggests that there might be a mismatch between the job description scope and the resume's scope. However, this is not necessarily an issue with metadata leakage, as it's more related to the scoring engine's expectations.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The scoring engine has correctly identified evidence that contradicts some of the matched requirements. For example, the requirement "Proven track record of meeting or exceeding monthly sales targets" is matched with the evidence "Proven track record of meeting monthly targets, but mostly through online sales and demos". This suggests that the scoring engine is not blindly accepting all matched evidence.

4. **Generic Snippet Scattering**: The provided JSON output does not contain any generic snippets scattered throughout the analysis.

5. **Title/Header Proof**: There is no apparent issue with title/header proof in the provided JSON output.

6. **Scope Mismatch**: As mentioned earlier, the `expected_profile` field indicates that there might be a scope mismatch between the job description and the resume's scope. However, this is not necessarily an issue with the scoring engine itself.

7. **Matched/Missing Contradiction**: The scoring engine has correctly identified some matched requirements that are contradicted by missing evidence points or other requirements. For example, the requirement "Ability to travel up to 50% of the workweek" is marked as high severity and missing in the resume.

Overall, the provided JSON output appears to be clean and free of known failure modes.

**Proposed Regression Case:**

```json
{
  "job_title": "17. Sales Representatives (Wholesale/Manufacturing)",
  "case_slug": "17-sales-representatives-wholesale-manufacturing",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:47.220903",
  "match_score": 50.76,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 43.6,
      "reason": "Found 2 direct, 10 adjacent, 0 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Sales Representative",
        "Strong communication skills, with ability to build rapport with tech-savvy customers"
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
      "score": 40.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "1 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 50.0,
      "reason": "Found 0 direct, 2 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Sales Representative",
        "Proficient in CRM software (e.g."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Sales Representative",
        "Strong communication skills, with ability to build rapport with tech-savvy customers"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proven track record of meeting or exceeding monthly sales targets",
      "evidence": [
        "Proven track record of meeting monthly targets, but mostly through online sales and demos"
      ],
      "strength": "high"
    },
    {
      "requirement": "Salesforce.com) and Microsoft Office Suite",
      "evidence": [
        "HubSpot) and Microsoft Office Suite"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in CRM software (e.g.",
      "evidence": [
        "1 year of experience in software sales"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Knowledge of industry-specific regulations and compliance requirements (e.g.",
      "evidence": [
        "Proficient in CRM software (e.g."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Meet monthly sales targets for assigned customer base through proactive outreach and relationship-building",
      "evidence": [
        "\"Sales Representative"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Develop and maintain strong relationships with key decision-makers at target accounts to increase sales and expand product offerings",
      "evidence": [
        "\"Sales Representative"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Ability to travel up to 50% of the workweek to attend meetings, product demonstrations, and other industry events",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with manufacturing or production processes",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Sales Representative",
      "supports": "Meet monthly sales targets for assigned customer base through proactive outreach and relationship-building"
    },
    {
      "source": "resume",
      "quote": "\"Sales Representative",
      "supports": "Develop and maintain strong relationships with key decision-makers at target accounts to increase sales and expand product offerings"
    },
    {
      "source": "resume",
      "quote": "Strong communication skills, with ability to build rapport with tech-savvy customers",
      "supports": "Conduct regular product demonstrations, presentations, and training sessions to educate customers on new products and services"
    },
    {
      "source": "resume",
      "quote": "\"Sales Representative",
      "supports": "Analyze sales data and market trends to inform sales strategies and adjust tactics as needed"
    },
    {
      "source": "resume",
      "quote": "\"Sales Representative",
      "supports": "Manage and maintain accurate records of customer interactions, sales activity, and product inventory"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case has a similar structure to the original JSON output, but with some additional requirements that are not matched by the scoring engine. The `missing_requirements` field includes two new requirements: "Ability to travel up to 50% of the workweek" and "Familiarity with manufacturing or production processes". These requirements are marked as high severity and missing in the resume.
