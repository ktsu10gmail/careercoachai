Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Metadata Leakage**: The `evidence_quotes` section contains quotes from the resume that are not directly related to the job requirements. While these quotes may support some of the requirement matches, they also introduce metadata leakage by providing extraneous information.

2. **Boilerplate Leakage**: The presence of boilerplate phrases in the resume, such as "Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering," could be considered a form of boilerplate leakage. These phrases may not provide specific evidence for the job requirements but rather serve as generic descriptions.

3. **Contra-Evidence**: The analysis engine seems to have matched some requirement quotes that are actually contra-evidence, such as "Build production-grade LLM applications using ChatGPT Enterprise and related LLM APIs, as our organization's focus was on internal tools and process/data engineering rather than AI agent deployment." This could potentially lead to incorrect scoring.

4. **Generic Snippet Scattering**: The `missing_requirements` section contains generic requirements that are not explicitly matched with evidence from the resume. For example, "Creatives who want to design it better," is a requirement that does not have any corresponding evidence in the resume.

5. **Title/Header Proof**: There is no explicit proof or evidence provided for the title/header of the job posting ("AI Systems Engineer") being relevant to the requirements.

6. **Scope Mismatch**: The analysis engine seems to have matched some requirement quotes that are related to internal tools and process/data engineering, which may not be directly applicable to an AI systems engineer role.

7. **Matched/Missing Contradiction**: There is a potential contradiction between the matched requirement "As the AI Engineer at Kargo, you will architect, build, and scale AI-powered products and automations for Kargo’s commercial organization" and the missing requirement "This is a hybrid role requiring onsite presence 4 days per week." The analysis engine seems to have matched the former but not the latter.

Proposed Regression Case:

```json
{
  "job_title": "AI Systems Engineer",
  "case_slug": "ai-systems-engineer-real-jd-1234567890",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-07-01T00:49:45.955902",
  "match_score": 48.87,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 28.9,
      "reason": "Found 3 direct, 3 adjacent, 2 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
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
      "score": 58.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "designed",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 55.8,
      "reason": "Found 3 direct, 1 adjacent, 2 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 84.9,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "As the AI Engineer at Kargo, you will architect, build, and scale AI-powered products and automations for Kargo’s commercial organization.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "high"
    },
    {
      "requirement": "Operating within the Data & AI team, you are the connective tissue between revenue teams and AI infrastructure – proactively identifying high-value use cases, building intelligent ",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "high"
    },
    {
      "requirement": "You’ve established yourself as Kargo’s internal thought leader on applied AI – the person teams come to when they have a problem AI might solve",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "high"
    },
    {
      "requirement": "Techies who want to build the future.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Collaborators to build it.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Data pros who turn numbers into insights.",
      "evidence": [
        "\"Results-driven AI engineer with 5+ years of experience in systems automation and process/data engineering."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Creatives who want to design it better.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Communicators to win business.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Product builders who turn ideas into innovations.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Anyone eager to be on a team that doesn’t stop to ask what’s next, because they’re already building it.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "This is a hybrid role requiring onsite presence 4 days per week.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Outcomes – What Success Looks Like in 6-12 Months",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "A governance model is in place covering prompt engineering standards, audit trails, and a feedback loop that drives continuous iteration",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Build production-grade LLM applications using ChatGPT Enterprise and related LLM APIs, as our organization's focus was on internal tools and process/data engineering rather than AI agent deployment.",
      "severity": "high"
    },
    {
      "requirement": "Cross-functional stakeholders trust and use the tools you’ve built, and Kargo’s Data & AI leadership has a clear, prioritized AI Ops roadmap that you own and drive",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Build production-grade LLM applications using ChatG
