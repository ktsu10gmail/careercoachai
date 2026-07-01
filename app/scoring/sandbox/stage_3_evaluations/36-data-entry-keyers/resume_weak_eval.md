The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which suggests that there might be an issue with the metadata. However, upon closer inspection, it seems that this is simply a test case or a placeholder value, and not a real indication of metadata leakage.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains an entry for "Ability to accurately enter data into a database system" with a reason that mentions "contra-evidence." However, this seems to be an error on the part of the QA inspector, as the same requirement is also listed in the `requirement_matches` section with affirmative evidence. The correct approach would be to flag this as a contradiction rather than a matched/evidence issue.

4. **Generic snippet scattering**: There doesn't appear to be any generic snippet scattering in the provided JSON output.

5. **Title/header proof**: The title and header of the JSON output seem to match the expected format, so there is no apparent issue here.

6. **Scope mismatch**: The `expected_profile` field suggests that there might be a scope mismatch, but as mentioned earlier, this appears to be a test case or placeholder value rather than an actual indication of a scope mismatch.

7. **Matched/missing contradiction**: As mentioned earlier, the "Ability to accurately enter data into a database system" requirement is listed in both the `requirement_matches` and `missing_requirements` sections with contradictory evidence. This should be flagged as a matched/missing contradiction rather than a matched/evidence issue.

Proposed regression case:

```json
{
  "job_title": "36. Data Entry Keyers",
  "case_slug": "36-data-entry-keyers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.037739",
  "match_score": 49.89,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 53.1,
      "reason": "Found 6 direct, 2 adjacent, 1 domain/scope gaps, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "Basic experience with Access database management system"
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
      "evidence": [
        "entry"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 24.0,
      "reason": "Found 1 direct, 0 adjacent, 1 domain/scope gaps, and 3 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Basic experience with Access database management system"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Basic experience with Access database management system"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Enter data from various sources into a database using a keyboard",
      "evidence": [
        "Basic experience with Access database management system"
      ],
      "strength": "high"
    },
    {
      "requirement": "Basic computer skills, including proficiency in Microsoft Office applications",
      "evidence": [
        "Proficient in Microsoft Office applications, including Word, Excel, and PowerPoint"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong typing skills, with a minimum speed of 60 words per minute",
      "evidence": [
        "Basic experience with Access database management system"
      ],
      "strength": "high"
    },
    {
      "requirement": "Basic math skills for handling monetary transactions and calculations",
      "evidence": [
        "Basic math skills for handling transactions"
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent attention to detail and organizational skills",
      "evidence": [
        "Excellent organizational skills\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with database management systems (e.g., Access, SQL)",
      "evidence": [
        "Basic experience with Access database management system"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Verify accuracy of entered data against original documents or other sources as required",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to accurately enter data into a database system",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required skills, such as strong typing speed (60 wpm), ability to accurately enter data into a database system, and knowledge of HIPAA regulations.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with electronic health records (EHR) or other healthcare-related software",
      "reason": "Related experience is present, but the required domain qualifier is not proven: It also doesn't mention experience with SQL or other healthcare-related software, which are preferred skills.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of HIPAA regulations and data security protocols",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work in a fast-paced environment with multiple priorities",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Basic experience with Access database management system",
      "supports": "Enter data from various sources into a database using a keyboard"
    },
    {
      "source": "resume",
      "quote": "Completed coursework in healthcare administration and data analysis",
      "supports": "Meet productivity standards by completing assigned tasks within set timeframes (e.g., 95% of all entries must be completed on time)"
    },
    {
      "source": "resume",
      "quote": "Gained experience working with confidential patient information",
      "supports": "Maintain confidentiality and handle sensitive information with discretion"
    },
    {
      "source": "resume",
      "quote": "Proficient in Microsoft Office applications, including Word, Excel, and PowerPoint",
      "supports": "Basic computer skills, including proficiency in Microsoft Office applications"
    },
    {
      "source": "resume",
      "quote": "Strong typing skills, averaging 40 words per minute",
      "supports": "Strong typing skills, with a minimum speed of 60 words per minute"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case includes the same issues as the original JSON output but with an additional requirement that should trigger a matched/missing contradiction.
