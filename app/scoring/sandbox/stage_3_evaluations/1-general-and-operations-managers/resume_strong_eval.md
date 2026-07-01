The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. Metadata leakage: The output does not contain any sensitive information that could potentially leak metadata.

2. Boilerplate leakage: There is no boilerplate content in the output, which suggests that the analysis was performed on a specific resume file (`resume_strong.txt`) and not on generic or template-based content.

3. Contra-evidence as matched evidence: The output does not contain any instances of contra-evidence being used as matched evidence. All evidence points are supported by direct requirements in the JD.

4. Generic snippet scattering: There is no indication of generic snippets being scattered throughout the analysis. Each piece of evidence is tied to a specific requirement or category.

5. Title/header proof: The output does not contain any issues with title/header proof, as there is no information about the title or header of the resume.

6. Scope mismatch: The scope of the analysis appears to match the requirements in the JD, and there are no indications of scope mismatch.

7. Matched/missing contradiction: There are no contradictions between matched and missing requirements in the output.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's always a good idea to perform additional testing and validation to ensure the accuracy and reliability of the analysis.

Proposed regression case:

```
{
  "job_title": "2. Software Engineers",
  "case_slug": "2-software-engineers",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-30T18:20:46.478490",
  "match_score": 80.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 75.0,
      "reason": "Found 5 direct, 3 adjacent, and 1 domain/scope gap for core JD requirements.",
      "evidence": [
        "Developed scalable backend APIs using Node.js and Express"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 40.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 85.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "4+ years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 60.0,
      "reason": "Found 2 direct, 1 adjacent, and 1 domain/scope gap for domain and tool requirements.",
      "evidence": [
        "Utilized Git for version control and collaboration"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 90.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Developed scalable backend APIs using Node.js and Express"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Design and develop scalable backend APIs",
      "evidence": [
        "Developed scalable backend APIs using Node.js and Express"
      ],
      "strength": "high"
    },
    {
      "requirement": "Collaborate with cross-functional teams to identify and prioritize project requirements",
      "evidence": [],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Familiarity with cloud-based platforms (e.g., AWS, Azure)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Developed scalable backend APIs using Node.js and Express",
      "supports": "Design and develop scalable backend APIs"
    },
    {
      "source": "resume",
      "quote": "Utilized Git for version control and collaboration",
      "supports": "Collaborate with cross-functional teams to identify and prioritize project requirements"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This regression case introduces a new job title, software engineer, and adds some missing requirements related to cloud-based platforms. The analysis should still produce a clean output without any known failure modes.
