Overall, the provided JSON output appears to be clean. However, I did identify a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate text that is not specific to the job requirements. This could lead to an overemphasis on generic skills and experience.

2. **Generic snippet scattering**: Some of the evidence quotes seem to be generic phrases that are not directly related to the specific job requirements. These should be removed or rephrased to better match the required skills.

3. **Title/header proof**: The title "36. Data Entry Keyers" seems to be a boilerplate title and does not provide any additional context about the candidate's experience or qualifications.

4. **Scope mismatch**: There is no clear indication of the scope of the job requirements, which could lead to misunderstandings about what skills and experience are required.

5. **Matched/missing contradiction**: The resume contains some contradictory information that may affect the accuracy of the scoring. For example, the candidate claims to have strong typing skills, but the evidence quote suggests that they struggled with accuracy verification against original documents due to limited experience with database management systems.

Proposed regression case:

```json
{
  "job_title": "36. Data Entry Keyers",
  "case_slug": "36-data-entry-keyers",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:48.987899",
  "match_score": 31.85,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 25.8,
      "reason": "Found 2 direct, 3 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems.",
        "Maintained confidentiality and handled sensitive information with discretion, but did not have formal training on HIPAA regulations and data security protocols.\"",
        "Proficient in Microsoft Office applications and basic computer skills.",
        "\"Results-oriented professional with strong typing skills, achieving an average speed of 55 words per minute (meets basic requirement)."
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
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 5 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems.",
        "Maintained confidentiality and handled sensitive information with discretion, but did not have formal training on HIPAA regulations and data security protocols.\""
      ]
    },
    {
      "category": "Evidence quality",
      "score": 63.2,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems.",
        "Maintained confidentiality and handled sensitive information with discretion, but did not have formal training on HIPAA regulations and data security protocols.\"",
        "Proficient in Microsoft Office applications and basic computer skills.",
        "\"Results-oriented professional with strong typing skills, achieving an average speed of 55 words per minute (meets basic requirement)."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Basic computer skills, including proficiency in Microsoft Office applications",
      "evidence": [
        "Proficient in Microsoft Office applications and basic computer skills."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong typing skills, with a minimum speed of 60 words per minute",
      "evidence": [
        "\"Results-oriented professional with strong typing skills, achieving an average speed of 55 words per minute (meets basic requirement)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent attention to detail and organizational skills",
      "evidence": [
        "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Meet productivity standards by completing assigned tasks within set timeframes (e.g., 95% of all entries must be completed on time)",
      "evidence": [
        "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Basic math skills for handling monetary transactions and calculations",
      "evidence": [
        "\"Results-oriented professional with strong typing skills, achieving an average speed of 55 words per minute (meets basic requirement)."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Enter data from various sources into a database using a keyboard",
      "reason": "Resume contains boilerplate text that is not specific to the job requirements.",
      "severity": "high"
    },
    {
      "requirement": "Verify accuracy of entered data against original documents or other sources as required",
      "reason": "Resume does not provide sufficient evidence to support this requirement.",
      "severity": "high"
    },
    {
      "requirement": "Maintain confidentiality and handle sensitive information with discretion",
      "reason": "Resume contains boilerplate text that is not specific to the job requirements.",
      "severity": "high"
    },
    {
      "requirement": "Ability to accurately enter data into a database system",
      "reason": "Resume does not provide sufficient evidence to support this requirement.",
      "severity": "high"
    },
    {
      "requirement": "Experience with database management systems (e.g., Access, SQL)",
      "reason": "Resume contains boilerplate text that is not specific to the job requirements.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with electronic health records (EHR) or other healthcare-related software",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of HIPAA regulations and data security protocols",
      "reason": "Resume contains boilerplate text that is not specific to the job requirements.",
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
      "quote": "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems.",
      "supports": "Enter data from various sources into a database using a keyboard"
    },
    {
      "source": "resume",
      "quote": "Demonstrated attention to detail in data entry tasks, but occasionally struggled with accuracy verification against original documents due to limited experience with database management systems.",
      "supports": "Meet productivity standards by completing assigned tasks within set timeframes (e.g., 95% of all entries must be completed on time)"
    },
    {
      "source": "resume",
      "quote": "Maintained confidentiality and handled sensitive information with discretion, but did not have formal training on HIP
