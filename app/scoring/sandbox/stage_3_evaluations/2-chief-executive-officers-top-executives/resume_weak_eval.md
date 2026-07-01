The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` and `resume_file` fields seem to be correctly formatted, but without more context, it's difficult to determine if this is a potential issue.
2. **Boilerplate leakage**: There doesn't appear to be any boilerplate text or phrases that could indicate metadata leakage.
3. **Contra-evidence as matched evidence**: The system has identified instances where the resume contains contra-evidence (e.g., "The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.") that is being matched against the requirements. This is a known failure mode, but it's not clear if this is an isolated issue or a systemic problem.
4. **Generic snippet scattering**: The system doesn't appear to have any issues with generic snippets scattered throughout the resume.
5. **Title/header proof**: The title and header seem to be correctly formatted, but without more context, it's difficult to determine if this is a potential issue.
6. **Scope mismatch**: There doesn't appear to be any scope mismatches between the requirements and the evidence provided in the resume.
7. **Matched/missing contradiction**: The system has identified several instances where there are contradictions between the matched evidence and the missing requirements. However, it's not clear if these are isolated issues or a systemic problem.

Proposed regression case:

```json
{
  "job_title": "1. Software Engineers / Developers",
  "case_slug": "1-software-engineers-developers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:47.477589",
  "match_score": 29.73,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 15.8,
      "reason": "Found 1 direct, 3 adjacent, 0 domain/scope gaps, and 9 missing evidence points for core JD requirements.",
      "evidence": [
        "The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.",
        "+ Collaborated with cross-functional teams to integrate third-party APIs",
        "Proven track record of delivering high-quality software solutions on time and within budget.",
        "Education: Bachelor's degree in Computer Science from XYZ University."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 76.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "10 years",
        "senior",
        "implemented",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 17.5,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Education: Bachelor's degree in Computer Science from XYZ University."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 55.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.",
        "+ Collaborated with cross-functional teams to integrate third-party APIs",
        "Proven track record of delivering high-quality software solutions on time and within budget.",
        "Education: Bachelor's degree in Computer Science from XYZ University."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proven track record of driving business growth and profitability through strategic planning and execution",
      "evidence": [
        "Proven track record of delivering high-quality software solutions on time and within budget."
      ],
      "strength": "high"
    },
    {
      "requirement": "Lead cross-functional teams to achieve organizational goals and objectives",
      "evidence": [
        "+ Collaborated with cross-functional teams to integrate third-party APIs"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Foster a culture of innovation, collaboration, and accountability within the organization",
      "evidence": [
        "Proven track record of delivering high-quality software solutions on time and within budget."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Bachelor's degree in Business Administration, Finance, or related field;",
      "evidence": [
        "Education: Bachelor's degree in Computer Science from XYZ University."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop and implement strategic plans to drive business growth and profitability",
      "reason": "Resume contains contra-evidence instead of affirmative proof: The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.",
      "severity": "high"
    },
    {
      "requirement": "Build and maintain strong relationships with key stakeholders, including investors, customers, and partners",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Oversee financial planning, budgeting, and forecasting to ensure alignment with business objectives",
      "reason": "Resume contains contra-evidence instead of affirmative proof: The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.",
      "severity": "high"
    },
    {
      "requirement": "Make informed decisions on major investments, acquisitions, and divestitures",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ensure compliance with regulatory requirements and industry standards",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "MBA preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    },
    {
      "requirement": "Minimum 10 years of experience as a CEO, Top Executive, or equivalent senior leadership role",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong understanding of financial management, including budgeting, forecasting, and financial analysis",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, negotiation, and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to build and maintain strong relationships with key stakeholders",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "The skills listed are also more focused on software development rather than leadership and business acumen, which is not suitable for the position of Chief Executive Officer / Top Executive.",
      "supports": "Develop and implement strategic plans to drive business growth and profitability"
