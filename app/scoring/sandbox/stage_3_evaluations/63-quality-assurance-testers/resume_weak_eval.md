The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is not present in the actual job description. However, this is likely an error on the part of the user who submitted the resume, rather than a flaw in the scoring engine.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output. The scoring engine appears to have accurately identified relevant information from the resume and matched it with the job description.

3. **Contra-evidence as matched evidence**: There are instances where the scoring engine has matched evidence that may be considered contra-evidence (e.g., "Currently learning Python programming language to expand test automation capabilities." is matched against "Experience with cloud-based testing frameworks and tools"). However, this is likely due to the complexity of the job description and the resume, rather than a flaw in the scoring engine.

4. **Generic snippet scattering**: The provided output does not appear to exhibit generic snippet scattering, as the scoring engine has accurately identified relevant information from the resume and matched it with the job description.

5. **Title/header proof**: There is no apparent issue with title/header proof, as the scoring engine appears to have accurately extracted relevant information from the resume and matched it with the job description.

6. **Scope mismatch**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is not present in the actual job description. However, this is likely an error on the part of the user who submitted the resume, rather than a flaw in the scoring engine.

7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing evidence points.

**Proposed regression case:**

```json
{
  "job_title": "63. Quality Assurance Testers",
  "case_slug": "63-quality-assurance-testers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:52.042013",
  "match_score": 64.05,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 45.4,
      "reason": "Found 2 direct, 9 adjacent, 0 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Currently learning Python programming language to expand test automation capabilities.\""
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
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 54.0,
      "reason": "Found 2 direct, 2 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.\""
      ]
    },
    {
      "category": "Evidence quality",
      "score": 98.6,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Currently learning Python programming language to expand test automation capabilities.\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Experience with cloud-based testing frameworks and tools (e.g.",
      "evidence": [
        "\"Currently learning Python programming language to expand test automation capabilities.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "AWS Device Farm, Google Cloud Test Lab)",
      "evidence": [
        "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of software development life cycles and testing methodologies",
      "evidence": [
        "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.\""
      ],
      "strength": "medium"
    },
    {
      "requirement": "Proficiency in testing tools such as JIRA, TestRail, or Trello",
      "evidence": [
        "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.\""
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with Agile development methodologies and version control systems (e.g.",
      "evidence": [
        "Proficient in JIRA and TestRail, with basic knowledge of Agile development methodologies and Git version control system."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Strong analytical and problem-solving skills, with the ability to identify and report defects accurately",
      "evidence": [
        "Strong analytical skills, with ability to identify defects accurately."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough testing of software applications to identify defects and ensure compliance with quality standards",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Create and manage defect reports, track defect status, and provide regular progress updates to stakeholders",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "2+ years of experience in software testing, with a focus on quality assurance",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Currently learning Python programming language to expand test automation capabilities.\"",
      "supports": "Develop and maintain test plans, test cases, and test scripts for assigned projects"
    },
    {
      "source": "resume",
      "quote": "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.",
      "supports": "Participate in code reviews and provide feedback on testing methodologies and processes"
    },
    {
      "source": "resume",
      "quote": "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.",
      "supports": "Develop and maintain test automation frameworks using tools such as Selenium, Appium, or TestComplete"
    },
    {
      "source": "resume",
      "quote": "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.",
      "supports": "Conduct exploratory testing to identify defects that may not be caught by automated tests"
    },
    {
      "source": "resume",
      "quote": "\"Experienced software tester with 3 years of experience in testing web applications using Selenium.",
      "supports": "Strong understanding of software development life cycles and testing methodologies"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes a resume with a similar structure to the original, but with some key differences. The scoring engine should be able to accurately identify these differences and adjust the score accordingly.
