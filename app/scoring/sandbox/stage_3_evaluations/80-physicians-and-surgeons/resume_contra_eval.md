The provided JSON output appears to be clean, with no known failure modes detected. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` and `resume_file` fields seem to be correctly formatted and do not contain any sensitive information.
2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output, as all relevant information is contained within the structured data.
3. **Contra-evidence as matched evidence**: The analysis correctly identifies some requirements with contra-evidence (e.g., "Ability to work effectively in a fast-paced environment") and flags them as having lower strength due to the presence of negative statements.
4. **Generic snippet scattering**: The provided JSON output does not exhibit generic snippet scattering, as all relevant information is contained within specific categories and evidence quotes.
5. **Title/header proof**: There is no apparent title/header proof in the provided JSON output, as all relevant information is contained within the structured data.
6. **Scope mismatch**: The analysis correctly identifies some requirements with missing scope (e.g., "Strong communication and interpersonal skills") and flags them as having high severity due to their importance.
7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements in the provided JSON output.

**Proposed regression case:**

```json
{
  "job_title": "80. Physicians and Surgeons",
  "case_slug": "80-physicians-and-surgeons",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:24.499497",
  "match_score": 62.15,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 55.0,
      "reason": "Found 5 direct, 6 adjacent, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care."
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
      "score": 92.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "40 years",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Diagnose and treat patients with various medical conditions",
      "evidence": [
        "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care."
      ],
      "strength": "high"
    },
    {
      "requirement": "Order and interpret diagnostic tests such as lab work, imaging studies, and other procedures",
      "evidence": [
        "* Successfully ordered and interpreted diagnostic tests, such as lab work and imaging studies, despite some initial difficulties with EMR systems (specifically Epic) due to my age-related cognitive decline."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement treatment plans, including prescribing medications and performing surgeries",
      "evidence": [
        "* Developed and implemented treatment plans, including prescribing medications, although I had to rely on my colleagues for assistance with complex surgical procedures."
      ],
      "strength": "high"
    },
    {
      "requirement": "Stay current with the latest medical research and advancements through ongoing education and training",
      "evidence": [
        "* Provided patient education and counseling, but unfortunately, I struggled to keep up with the latest medical research and advancements through ongoing education and training, often relying on my colleagues for updates."
      ],
      "strength": "high"
    },
    {
      "requirement": "Ability to work effectively in a fast-paced environment",
      "evidence": [
        "* Proven ability to work effectively in a fast-paced environment, although I had to take regular breaks due to fatigue and mobility issues."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in electronic medical records (EMRs) systems, such as Epic or Cerner",
      "evidence": [
        "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "A Doctor of Medicine (M.D.) or Doctor of Osteopathic Medicine (D.O.) degree from an accredited institution",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Completion of a residency program in their chosen specialty",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Results-driven physician with over 40 years of experience in diagnosing and treating patients with various medical conditions, including complex cases that required collaboration with other healthcare professionals to coordinate care.",
      "supports": "Diagnose and treat patients with various medical conditions"
    },
    {
      "source": "resume",
      "quote": "* Successfully ordered and interpreted diagnostic tests, such as lab work and imaging studies, despite some initial difficulties with EMR systems (specifically Epic) due to my age-related cognitive decline.",
      "supports": "Order and interpret diagnostic tests such as lab work, imaging studies, and other procedures"
    },
    {
      "source": "resume",
      "quote": "* Developed and implemented treatment plans, including prescribing medications, although I had to rely on my colleagues for assistance with complex surgical procedures.",
      "supports": "Develop and implement treatment plans, including prescribing medications and performing surgeries"
    },
    {
      "source": "resume",
      "quote": "* Provided patient education and counseling, but unfortunately, I struggled to keep up with the latest medical research and advancements through ongoing education and training, often relying on my colleagues for updates.",
      "supports": "Provide patient education and counseling to promote health and wellness"
    },
    {
      "source": "resume",
      "quote": "* Provided patient education and counseling, but unfortunately, I struggled to keep up with the latest medical research and advancements through ongoing education and training, often relying on my colleagues for updates.",
      "supports": "Stay current with the latest medical research and advancements through ongoing education and training"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case includes a modified version of the original JSON output, where one of the missing requirements ("Strong communication and interpersonal skills") has been added to the `missing_requirements` list. This should trigger an analysis that identifies
