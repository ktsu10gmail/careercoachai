The provided JSON output appears to be clean, with no known failure modes detected. Here's a breakdown of the analysis:

1. **Metadata leakage**: No metadata leakage was found in this output.
2. **Boilerplate leakage**: No boilerplate leakage was detected.
3. **Contra-evidence as matched evidence**: The issue mentioned in the "missing_requirements" section is correctly identified as contra-evidence, and it's marked as high severity.
4. **Generic snippet scattering**: No generic snippet scattering was found.
5. **Title/header proof**: The title and header are properly formatted and don't contain any issues.
6. **Scope mismatch**: No scope mismatch was detected.
7. **Matched/missing contradiction**: No contradictions were found.

Proposed regression case:

```json
{
  "job_title": "74. Graphic Designers",
  "case_slug": "74-graphic-designers",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-29T20:51:23.880788",
  "match_score": 60.11,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 55.3,
      "reason": "Found 4 direct, 8 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
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
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 59.3,
      "reason": "Found 4 direct, 8 adjacent, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Create visually appealing designs using Adobe Creative Suite",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Work collaboratively with cross-functional teams",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Adobe Creative Suite",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience as a graphic designer or in a related field",
      "evidence": [
        "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Excellent communication and interpersonal skills",
      "reason": "Resume contains boilerplate text instead of specific experience or achievements.",
      "severity": "high"
    },
    {
      "requirement": "Experience with user interface design",
      "reason": "Resume contains contra-evidence instead of affirmative proof: \"Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques.\" is not enough to prove experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
    },
    {
      "source": "resume",
      "quote": "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
    },
    {
      "source": "resume",
      "quote": "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
    },
    {
      "source": "resume",
      "quote": "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
    },
    {
      "source": "resume",
      "quote": "\"Highly motivated graphic designer with 2+ years of experience in creating visually appealing designs. Proficient in Adobe Creative Suite (Photoshop, Illustrator) and skilled in user interface design techniques. Excellent communication skills, with ability to work collaboratively with cross-functional teams.\""
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case contains boilerplate text instead of specific experience or achievements in the "missing_requirements" section, and it also contains contra-evidence instead of affirmative proof for some requirements.
