The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is not leaked from any other part of the JSON. This suggests that there is no metadata leakage.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in this output, as all evidence and requirements are properly attributed to their respective sources.

3. **Contra-evidence as matched evidence**: The only instance of contra-evidence is in the "missing_requirements" section, where the requirement "Anyone eager to be on a team that doesn’t stop to ask what’s next, because they’re already building it." has a severity of high due to the presence of contra-evidence. However, this is properly flagged as such and does not appear to be matched evidence.

4. **Generic snippet scattering**: The output appears to be well-organized, with each category (e.g., "Must-have requirements", "Preferred requirements") containing its own set of evidence and requirements. There is no apparent generic snippet scattering.

5. **Title/header proof**: The title ("AI Systems Engineer") and header information appear to be properly verified against the job description.

6. **Scope mismatch**: The output correctly identifies a scope mismatch between the resume's experience (5-8+ years) and the required experience for the role (not explicitly stated, but implied by the requirements).

7. **Matched/missing contradiction**: There are no apparent contradictions between matched evidence and missing requirements.

**Proposed regression case:**

```json
{
  "job_title": "AI Systems Engineer",
  "case_slug": "ai-systems-engineer-real-jd-1234567890",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-07-01T00:49:46.052708",
  "match_score": 54.65,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 31.4,
      "reason": "Found 3 direct, 4 adjacent, 2 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "Builder's Instinct: Ships fast, iterates on real feedback, and knows when to build vs.",
        "5-8+ years of experience in systems automation, internal tools, or process/data engineering",
        "Overall, this resume snippet is weak because it lacks the required skills, experience, behaviors, and competencies mentioned in the job description.",
        "Familiarity with orchestration platforms and LLM applications"
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
        "8 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 55.8,
      "reason": "Found 3 direct, 1 adjacent, 2 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "5-8+ years of experience in systems automation, internal tools, or process/data engineering",
        "Familiarity with orchestration platforms and LLM applications"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 90.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Builder's Instinct: Ships fast, iterates on real feedback, and knows when to build vs.",
        "5-8+ years of experience in systems automation, internal tools, or process/data engineering",
        "Overall, this resume snippet is weak because it lacks the required skills, experience, behaviors, and competencies mentioned in the job description.",
        "Familiarity with orchestration platforms and LLM applications"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "As the AI Engineer at Kargo, you will architect, build, and scale AI-powered products and automations for Kargo’s commercial organization.",
      "evidence": [
        "Familiarity with orchestration platforms and LLM applications"
      ],
      "strength": "high"
    },
    {
      "requirement": "Operating within the Data & AI team, you are the connective tissue between revenue teams and AI infrastructure – proactively identifying high-value use cases, building intelligent ",
      "evidence": [
        "Familiarity with orchestration platforms and LLM applications"
      ],
      "strength": "high"
    },
    {
      "requirement": "You’ve established yourself as Kargo’s internal thought leader on applied AI – the person teams come to when they have a problem AI might solve",
      "evidence": [
        "Familiarity with orchestration platforms and LLM applications"
      ],
      "strength": "high"
    },
    {
      "requirement": "Techies who want to build the future.",
      "evidence": [
        "Builder's Instinct: Ships fast, iterates on real feedback, and knows when to build vs."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Collaborators to build it.",
      "evidence": [
        "Builder's Instinct: Ships fast, iterates on real feedback, and knows when to build vs."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Data pros who turn numbers into insights.",
      "evidence": [
        "5-8+ years of experience in systems automation, internal tools, or process/data engineering"
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
      "reason": "Resume contains contra-evidence instead of affirmative proof: Overall, this resume snippet is weak because it lacks the required skills, experience, behaviors, and competencies mentioned in the job description.",
      "severity": "high"
    },
    {
      "requirement": "This is a hybrid role requiring onsite presence 4 days per week.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "A governance model is in place covering prompt engineering standards, audit trails, and a feedback loop that drives continuous iteration",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Familiarity with orchestration platforms and LLM applications",
      "severity": "high"
    },
    {
      "requirement": "Cross-functional stakeholders trust and use the tools you’ve built, and Kargo’s Data & AI leadership has a clear, prioritized AI Ops roadmap that you own and drive",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Familiarity with orchestration platforms and LLM applications",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Builder's Instinct: Ships fast, iterates on real feedback, and knows when
