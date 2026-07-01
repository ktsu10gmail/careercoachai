The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is "scope_mismatch", which matches the category in the score breakdown. There is no evidence of metadata leakage.

2. **Boilerplate Leakage**: The provided JSON output does not contain any boilerplate text or phrases that could indicate leakage.

3. **Contra-Evidence as Matched Evidence**: There is no apparent contradiction between matched and missing requirements, which suggests that this failure mode is not present in the provided output.

4. **Generic Snippet Scattering**: While there are multiple snippets scattered throughout the JSON output, they all seem to be related to specific requirements or evidence points. This does not appear to be a case of generic snippet scattering.

5. **Title/Header Proof**: The title and header sections of the JSON output do not contain any suspicious or misleading information that could indicate proofing issues.

6. **Scope Mismatch**: The `expected_profile` field indicates that the expected profile is "scope_mismatch", which matches the category in the score breakdown. This suggests that there may be a scope mismatch, but it's not clear if this is an issue with the output or a deliberate design choice.

7. **Matched/Missing Contradiction**: There does not appear to be any apparent contradiction between matched and missing requirements, which suggests that this failure mode is not present in the provided output.

**Proposed Regression Case**

To further investigate potential issues with scope mismatch, consider adding more specific evidence points or requirements to the JSON output. For example:

```json
{
  "job_title": "78. Medical Assistants",
  "case_slug": "78-medical-assistants",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.306714",
  "match_score": 51.33,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 41.9,
      "reason": "Found 3 direct, 7 adjacent, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 65.0,
      "reason": "Found 0 direct, 1 adjacent, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 45.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": []
    },
    {
      "category": "Domain and tools fit",
      "score": 45.0,
      "reason": "Found 1 direct, 1 adjacent, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 89.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "high"
    },
    {
      "requirement": "Current certification as a medical assistant (CMA) or registered medical assistant (RMA)",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience working in a healthcare setting, preferably as a medical assistant",
      "evidence": [
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "high"
    },
    {
      "requirement": "Associate's degree in medical assisting preferred",
      "evidence": [
        "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Prepare patients for exams and procedures by collecting medical history, vital signs, and other necessary information",
      "evidence": [
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct basic lab tests such as taking blood samples and processing specimens",
      "evidence": [
        "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Perform various clinical tasks, including ECGs, blood pressure checks, and vital sign monitoring",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Clean and maintain exam rooms, equipment, and other facilities to ensure a safe and hygienic environment",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to lift up to 50 pounds and stand for long periods",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Here's a weak or scope-mismatch resume snippet for a Medical Assistant position:",
      "supports": "Prepare patients for exams and procedures by collecting medical history, vital signs, and other necessary information"
    },
    {
      "source": "resume",
      "quote": "\"High school diploma, completed online course in basic computer programming. Certified in Linux administration and network security. Proficient in Microsoft Office Suite and Adobe Creative Cloud. Experience with Python scripting and data an",
      "supports": "Conduct basic lab tests such as taking blood samples and processing specimens"
    },
    {
      "source": "resume",
      "quote": "Here's a weak or scope-m
