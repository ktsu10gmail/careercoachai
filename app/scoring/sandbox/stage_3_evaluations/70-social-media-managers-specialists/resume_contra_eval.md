Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains contra-evidence instead of affirmative proof for several requirements, such as "Develop and implement comprehensive social media strategies for multiple clients across various industries", "Manage and schedule posts on platforms such as Facebook, Twitter, Instagram, LinkedIn, and YouTube using Hootsuite or Sprout Social", and "Monitor and respond to comments, messages, and reviews in a timely manner". This could be considered as boilerplate leakage if the same language is used in multiple places.

2. **Generic snippet scattering**: The resume contains contra-evidence instead of affirmative proof for several requirements, such as "Strong understanding of social media platforms, including their features, algorithms, and best practices". This could be considered as generic snippet scattering if similar language is used across multiple requirements.

3. **Title/header proof**: The title of the analysis ("70. Social Media Managers / Specialists") does not match the actual job title in the resume file ("resume_contra.txt"). This could be considered as a title/header proof issue.

4. **Scope mismatch**: The scope of the analysis seems to be limited to the specific requirements mentioned in the JSON output, but it would be beneficial to consider a broader scope and evaluate the overall relevance of the candidate's experience and skills to the job description.

5. **Matched/missing contradiction**: There is no clear contradiction between the matched evidence and missing requirements, but further evaluation is needed to ensure that all relevant information is considered.

Proposed regression case:

```json
{
  "job_title": "50. Content Writers / Editors",
  "case_slug": "50-content-writers-editors",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:23.658702",
  "match_score": 38.85,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 23.6,
      "reason": "Found 1 direct, 4 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "* Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy."
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
      "score": 84.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 62.9,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proven track record of writing high-quality content that resonates with target audiences",
      "evidence": [
        "* Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct thorough research to ensure accuracy and relevance of written content",
      "evidence": [
        "* Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy."
      ],
      "strength": "low"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough research to ensure accuracy and relevance of written content",
      "reason": "Resume contains contra-evidence instead of affirmative proof: * Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Wrote engaging blog posts on various topics, but did not conduct thorough research to ensure accuracy.",
      "supports": "Conduct thorough research to ensure accuracy and relevance of written content"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes a similar set of issues as the original analysis, such as boilerplate leakage, generic snippet scattering, title/header proof, scope mismatch, and matched/missing contradiction.
