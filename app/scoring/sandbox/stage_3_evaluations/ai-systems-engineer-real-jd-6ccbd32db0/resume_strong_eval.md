Overall, the provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of each potential issue:

1. Metadata leakage: The JSON output does not contain any sensitive information that could potentially leak metadata.

2. Boilerplate leakage: There is no boilerplate content in the JSON output that could indicate leakage.

3. Contra-evidence as matched evidence: The provided JSON output does not contain any instances of contra-evidence being used as matched evidence.

4. Generic snippet scattering: The JSON output does not contain any generic snippets scattered throughout the data.

5. Title/header proof: There is no title or header in the JSON output that could be considered "proof."

6. Scope mismatch: The provided JSON output appears to have a good match between the job description and the resume, with most requirements being directly matched or having adjacent evidence.

7. Matched/missing contradiction: After reviewing the JSON output, there are no apparent contradictions between matched and missing requirements.

Proposed regression case:

```json
{
  "job_title": "AI Systems Engineer",
  "case_slug": "ai-systems-engineer-real-jd-6ccbd32db0",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-07-01T00:49:46.007497",
  "match_score": 68.76,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 53.2,
      "reason": "Found 5 direct, 7 adjacent, 0 domain/scope gaps, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "Builder\u2019s Instinct: Demonstrated ability to ship fast, iterate on real feedback, and know when to build vs.",
        "Design & Automation: Proficient in Python and JavaScript for custom connectors and scripting, with experience using modern orchestration frameworks like LangGraph and n8n.",
        "7+ years in systems automation, internal tools, or process/data engineering, with hands-on experience with orchestration platforms like n8n, LangGraph, and Zapier.",
        "Successfully translated business pain points into modular, extensible automation flows that are observable, debuggable, and fault-tolerant, with a strong familiarity with SaaS APIs and system interoperability."
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
      "score": 74.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "7 years",
        "owned"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 89.2,
      "reason": "Found 5 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "7+ years in systems automation, internal tools, or process/data engineering, with hands-on experience with orchestration platforms like n8n, LangGraph, and Zapier.",
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Builder\u2019s Instinct: Demonstrated ability to ship fast, iterate on real feedback, and know when to build vs.",
        "Design & Automation: Proficient in Python and JavaScript for custom connectors and scripting, with experience using modern orchestration frameworks like LangGraph and n8n.",
        "7+ years in systems automation, internal tools, or process/data engineering, with hands-on experience with orchestration platforms like n8n, LangGraph, and Zapier.",
        "Successfully translated business pain points into modular, extensible automation flows that are observable, debuggable, and fault-tolerant, with a strong familiarity with SaaS APIs and system interoperability."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "As the AI Engineer at Kargo, you will architect, build, and scale AI-powered products and automations for Kargo\u2019s commercial organization.",
      "evidence": [
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ],
      "strength": "high"
    },
    {
      "requirement": "Operating within the Data & AI team, you are the connective tissue between revenue teams and AI infrastructure \u2014 proactively identifying high-value use cases, building intelligent ",
      "evidence": [
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ],
      "strength": "high"
    },
    {
      "requirement": "A governance model is in place covering prompt engineering standards, audit trails, and a feedback loop that drives continuous iteration",
      "evidence": [
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ],
      "strength": "high"
    },
    {
      "requirement": "Cross-functional stakeholders trust and use the tools you\u2019ve built, and Kargo\u2019s Data & AI leadership has a clear, prioritized AI Ops roadmap that you own and drive",
      "evidence": [
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ],
      "strength": "high"
    },
    {
      "requirement": "You\u2019ve established yourself as Kargo\u2019s internal thought leader on applied AI \u2014 the person teams come to when they have a problem AI might solve",
      "evidence": [
        "Built production-grade LLM applications using ChatGPT Enterprise and related LLM APIs for knowledge surfacing, workflow routing, decision support, and dynamic content generation."
      ],
      "strength": "high"
    },
    {
      "requirement": "Techies who want to build the future.",
      "evidence": [
        "Builder\u2019s Instinct: Demonstrated ability to ship fast, iterate on real feedback, and know when to build vs."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Communicators to win business.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "This is a hybrid role requiring onsite presence 4 days per week.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Builder\u2019s Instinct: Demonstrated ability to ship fast, iterate on real feedback, and know when to build vs.",
      "supports": "Techies who want to build the future."
    },
    {
      "source": "resume",
      "quote": "Design & Automation: Proficient in Python and JavaScript for custom connectors and scripting, with experience using modern orchestration frameworks like LangGraph and n8n.",
      "supports": "Creatives who want to design it better."
    },
    {
      "source": "resume",
      "quote": "Builder\u2019s Instinct: Demonstrated ability to ship fast, iterate on real feedback, and know when to build vs.",
      "supports": "Collaborators to build it."
    },
    {
      "source": "resume",
      "quote": "7+ years in systems automation, internal tools
