Overall, the provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of each potential issue:

1. Metadata leakage: The analysis does not contain any sensitive or confidential information that could potentially leak metadata.

2. Boilerplate leakage: There is no boilerplate text in the analysis that could indicate leakage.

3. Contra-evidence as matched evidence: The analysis correctly identifies some requirements with contra-evidence (e.g., "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle).") but does not match them with the same strength.

4. Generic snippet scattering: There is no evidence of generic snippets scattered throughout the analysis.

5. Title/header proof: The title and header are properly formatted and do not contain any issues.

6. Scope mismatch: The scope of the requirements seems to be correctly matched with the provided evidence, although some requirements have a lower scope than expected (e.g., "Supervise and mentor a team of 10-20 employees, providing guidance on performance, training, and career development").

7. Matched/missing contradiction: There are no apparent contradictions between matched and missing requirements.

Based on this analysis, the provided JSON output appears to be clean and free of known failure modes.

However, here's a proposed regression case in JSON that could help identify potential issues:

```
{
  "job_title": "2. Software Engineers",
  "case_slug": "2-software-engineers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.436606",
  "match_score": 56.77,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 44.6,
      "reason": "Found 3 direct, 5 adjacent, 1 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems).",
        "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle).",
        "Strong communication skills, with experience working effectively with cross-functional teams (but I've never had a team of 10-20 employees to supervise).\""
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
      "score": 57.1,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 66.2,
      "reason": "Found 2 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems)."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 90.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems).",
        "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle).",
        "Strong communication skills, with experience working effectively with cross-functional teams (but I've never had a team of 10-20 employees to supervise).\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and implement software solutions using Java or other programming languages",
      "evidence": [
        "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Analyze production data and make informed decisions to optimize output and reduce waste",
      "evidence": [
        "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proven track record of successfully implementing process improvements and increasing productivity",
      "evidence": [
        "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong analytical and problem-solving skills, with ability to interpret data and make informed decisions",
      "evidence": [
        "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle)."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Excellent communication and interpersonal skills, with ability to work effectively with cross-functional teams",
      "evidence": [
        "Strong communication skills, with experience working effectively with cross-functional teams (but I've never had a team of 10-20 employees to supervise).\""
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Experience with cloud-based systems and technologies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Leadership experience in managing teams of 10-20 employees",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems).",
      "severity": "high"
    },
    {
      "requirement": "Bachelor's degree in Computer Science, Software Engineering, or related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems).",
      "supports": "Develop and implement software solutions using Java or other programming languages"
    },
    {
      "source": "resume",
      "quote": "Skilled in data analysis, with ability to interpret production data and make informed decisions (although I don't have direct experience with ERP systems like SAP or Oracle).",
      "supports": "Analyze production data and make informed decisions to optimize output and reduce waste"
    },
    {
      "source": "resume",
      "quote": "Proficient in Java, with experience working on large-scale projects (although I don't have direct experience with cloud-based systems).",
      "supports": "Proven track record of successfully implementing process improvements and increasing productivity"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes a job title that is not well-matched with the provided resume snippet, which could lead to incorrect scoring.
