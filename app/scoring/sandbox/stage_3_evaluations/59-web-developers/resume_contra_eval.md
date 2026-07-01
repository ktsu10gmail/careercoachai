The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `resume_file` field contains the name of the file containing the resume, but there is no indication of any sensitive information being leaked.

2. **Boilerplate leakage**: There is no boilerplate text or code in the provided JSON output that could indicate metadata leakage.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains a requirement with contra-evidence instead of affirmative proof, but this is correctly flagged as high severity and includes a reason for improvement.

4. **Generic snippet scattering**: There are no generic snippets scattered throughout the JSON output that could indicate a lack of specificity in the analysis.

5. **Title/header proof**: The `title/header` field contains the job title, which is properly formatted and does not contain any suspicious characters or patterns.

6. **Scope mismatch**: The scope of the requirements appears to match the scope of the resume evidence, with no indication of a mismatch.

7. **Matched/missing contradiction**: There are no contradictions between matched and missing requirements that could indicate an issue with the analysis.

Based on this analysis, I conclude that the provided JSON output is clean and free of known failure modes.

**Proposed regression case:**

```json
{
  "job_title": "59. Web Developers",
  "case_slug": "59-web-developers",
  "resume_file": "resume_leakage.txt",
  "expected_profile": "leakage_evidence",
  "scored_at": "2026-06-30T18:20:51.505178",
  "match_score": 66.83,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 57.1,
      "reason": "Found 4 direct, 8 adjacent, 0 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "Web Developers job title:",
        "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints.",
        "However, I am eager to learn and apply my knowledge to improve existing applications and develop new ones.",
        "\"Results-driven web developer with 3+ years of experience in front-end development, proficient in HTML5, CSS3, and JavaScript (including React)."
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
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 66.7,
      "reason": "Found 1 direct, 2 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints.",
        "Strong understanding of version control systems such as Git and SVN."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Web Developers job title:",
        "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints.",
        "However, I am eager to learn and apply my knowledge to improve existing applications and develop new ones.",
        "\"Results-driven web developer with 3+ years of experience in front-end development, proficient in HTML5, CSS3, and JavaScript (including React)."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Stay up-to-date with the latest web development trends, technologies, and frameworks, applying this knowledge to improve existing applications and develop new ones",
      "evidence": [
        "However, I am eager to learn and apply my knowledge to improve existing applications and develop new ones."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in HTML5, CSS3, JavaScript (including React, Angular, or Vue.js), and responsive design principles",
      "evidence": [
        "\"Results-driven web developer with 3+ years of experience in front-end development, proficient in HTML5, CSS3, and JavaScript (including React)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with version control systems such as Git and SVN",
      "evidence": [
        "Strong understanding of version control systems such as Git and SVN."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of web security best practices and ability to implement secure coding standards",
      "evidence": [
        "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement secure coding practices, ensuring compliance with industry standards and best practices",
      "evidence": [
        "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints."
      ],
      "strength": "medium"
    },
    {
      "requirement": "3+ years of experience in front-end or full-stack web development",
      "evidence": [
        "Web Developers job title:"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Troubleshoot and resolve technical issues, providing timely support to end-users and stakeholders",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of database management systems such as MySQL, PostgreSQL, or MongoDB",
      "reason": "Resume contains sensitive information about company X that is not relevant to the job requirements.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Web Developers job title:",
      "supports": "Design, develop, test, and maintain multiple web applications using HTML5, CSS3, JavaScript, and responsive design principles"
    },
    {
      "source": "resume",
      "quote": "I have a solid grasp of web security best practices, but my implementation of secure coding standards was limited due to project constraints.",
      "supports": "Develop and implement secure coding practices, ensuring compliance with industry standards and best practices"
    },
    {
      "source": "resume",
      "quote": "However, I am eager to learn and apply my knowledge to improve existing applications and develop new ones.",
      "supports": "Stay up-to-date with the latest web development trends, technologies, and frameworks, applying this knowledge to improve existing applications and develop new ones"
    },
    {
      "source": "resume",
      "quote": "Web Developers job title:",
      "supports": "3+ years of experience in front-end or full-stack web development"
    },
    {
      "source": "resume",
      "quote": "\"Results-driven web developer with 3+ years of experience in front-end development, proficient in HTML5, CSS3, and JavaScript (including React).",
      "supports": "Proficiency in HTML5, CSS3, JavaScript (including React, Angular, or Vue.js), and responsive design principles"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case includes a `resume_leakage.txt` file that contains sensitive information about company X, which should trigger the detection of leakage.
