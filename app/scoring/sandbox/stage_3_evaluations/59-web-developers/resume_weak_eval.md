The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a scope mismatch, but this is not considered a metadata leakage issue as it is explicitly stated.
2. **Boilerplate Leakage**: There is no boilerplate leakage in the provided output.
3. **Contra-Evidence as Matched Evidence**: The system correctly identifies contra-evidence (e.g., "Strong understanding of web security best practices, but no experience with secure coding standards or compliance.") and does not match it with the corresponding requirement.
4. **Generic Snippet Scattering**: There is no generic snippet scattering in the provided output.
5. **Title/Header Proof**: The title/header proof issue is not present in this output.
6. **Scope Mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, but it is explicitly stated and not considered a metadata leakage issue.
7. **Matched/Missing Contradiction**: There are no matched/missing contradictions in the provided output.

No proposed regression case is needed for this output as it appears to be clean and free of known failure modes.

However, if you'd like to simulate a scenario where there is a potential issue, here's an example of a proposed regression case:

```json
{
  "job_title": "59. Web Developers",
  "case_slug": "59-web-developers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:51.566960",
  "match_score": 26.98,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 12.1,
      "reason": "Found 1 direct, 2 adjacent, 0 domain/scope gaps, and 11 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3."
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
      "score": 53.3,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 3 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 45.9,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Experience with version control systems such as Git and SVN",
      "evidence": [
        "\"Familiar with Git version control system."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in HTML5, CSS3, JavaScript (including React, Angular, or Vue.js), and responsive design principles",
      "evidence": [
        "\"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Familiarity with Agile development methodologies and collaboration tools such as Jira, Asana, or Trello",
      "evidence": [
        "\"Experience with Jira project management tool and basic understanding of Agile development methodologies."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Design, develop, test, and maintain multiple web applications using HTML5, CSS3, JavaScript, and responsive design principles",
      "reason": "Resume contains contra-evidence instead of affirmative proof: \"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3.\"",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement secure coding practices, ensuring compliance with industry standards and best practices",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Strong understanding of web security best practices, but no experience with secure coding standards or compliance.",
      "severity": "high"
    },
    {
      "requirement": "Troubleshoot and resolve technical issues, providing timely support to end-users and stakeholders",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Stay up-to-date with the latest web development trends, technologies, and frameworks, applying this knowledge to improve existing applications and develop new ones",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "3+ years of experience in front-end or full-stack web development",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong understanding of web security best practices and ability to implement secure coding standards",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Strong understanding of web security best practices, but no experience with secure coding standards or compliance.",
      "severity": "high"
    },
    {
      "requirement": "Experience with back-end programming languages such as Node.js, Ruby on Rails, or PHP",
      "reason": "Resume contains contra-evidence instead of affirmative proof: No experience with back-end programming languages, database management systems, or testing frameworks.\"",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of database management systems such as MySQL, PostgreSQL, or MongoDB",
      "reason": "Resume contains contra-evidence instead of affirmative proof: No experience with back-end programming languages, database management systems, or testing frameworks.\"",
      "severity": "high"
    },
    {
      "requirement": "Proficiency in testing frameworks such as Jest, Cypress, or Selenium",
      "reason": "Resume contains contra-evidence instead of affirmative proof: No experience with back-end programming languages, database management systems, or testing frameworks.\"",
      "severity": "high"
    },
    {
      "requirement": "Experience with cloud-based platforms such as AWS, Google Cloud, or Microsoft Azure",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Familiarity with AWS cloud platform, but only used it for a single small-scale project.",
      "severity": "high"
    },
    {
      "requirement": "Certification in web development frameworks such as Bootstrap, Material-UI, or Tailwind CSS",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Front-end developer with 2 years of experience building responsive websites using HTML5 and CSS3.",
      "supports": "Proficiency in HTML5, CSS3, JavaScript (including React, Angular, or Vue.js), and responsive design principles"
    },
    {
      "source": "resume",
      "quote": "\"Familiar with Git version control system."
      "supports": "Experience with version control systems such as Git and SVN"
    }
  ],
  "confidence_level": "low",
  "confidence_reason": "Confidence is low because the system found limited direct requirement evidence in the resume."
}
```

In this regression case, the `missing_requirements` section contains a requirement that is matched by a contra-evidence
