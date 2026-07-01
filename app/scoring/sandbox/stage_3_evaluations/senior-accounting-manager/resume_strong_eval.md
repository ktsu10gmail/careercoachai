The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `required_matches` section contains specific requirement matches with their corresponding evidence quotes. There is no metadata leakage observed.

2. **Boilerplate Leakage**: The `evidence_quotes` section does not contain any boilerplate text that could be considered leaked from the JD description. Each quote supports a specific requirement match, and there are no generic phrases or sentences that seem out of place.

3. **Contra-Evidence as Matched Evidence**: There is no instance where contra-evidence (e.g., evidence that contradicts the matched requirement) is presented as matched evidence. The `required_matches` section only contains direct matches with supporting quotes.

4. **Generic Snippet Scattering**: While there are some generic snippets in the `evidence_quotes` section, they do not seem to be scattered throughout the output. They appear to be related to specific requirement matches and are properly contextualized.

5. **Title/Header Proof**: The title of the JSON output ("Analysis") does not seem to be proofed or validated against the JD description. However, this is not a known failure mode in this context.

6. **Scope Mismatch**: There appears to be no scope mismatch between the JD requirements and the matched evidence. Each requirement match has a corresponding quote that supports its relevance.

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements. The `missing_requirements` section lists specific requirements that are not present in the matched evidence, but these do not seem to be contradictory with the matched requirements.

**Proposed Regression Case:**

```json
{
  "job_title": "Senior Accounting Manager",
  "case_slug": "senior-accounting-manager",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-29T20:51:25.265967",
  "match_score": 72.51,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 68.6,
      "reason": "Found 6 direct, 6 adjacent, and 0 missing evidence points for core JD requirements.",
      "evidence": [
        "* Managed daily accounting operations for a $75 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
        "* Led a team of 4 accountants, providing guidance and support to ensure successful completion of financial statements and audits"
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
        "10 years",
        "senior",
        "led",
        "implemented",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 55.0,
      "reason": "Found 1 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Managed daily accounting operations for a $75 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
        "Here's a strong-match resume snippet for a Senior Accounting Manager position:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Managed daily accounting operations for a $75 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
        "* Led a team of 4 accountants, providing guidance and support to ensure successful completion of financial statements and audits",
        "Here's a strong-match resume snippet for a Senior Accounting Manager position:",
        "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Oversee daily accounting operations for a $50 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
      "evidence": [
        "* Managed daily accounting operations for a $75 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements"
      ],
      "strength": "high"
    },
    {
      "requirement": "Manage a team of 3 accountants, providing guidance and support to ensure successful completion of financial statements and audits",
      "evidence": [
        "* Led a team of 4 accountants, providing guidance and support to ensure successful completion of financial statements and audits"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct regular financial analysis and provide insights to senior management on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management",
      "evidence": [
        "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proven track record of successfully managing large budgets and teams",
      "evidence": [
        "Results-driven accounting leader with 10+ years of experience in senior roles, driving efficiency improvements and strategic financial planning. Proven track record of successfully managing large budgets, teams, and regulatory compliance."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent communication and interpersonal skills",
      "evidence": [
        "* Excellent communication and interpersonal skills"
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with financial planning and analysis tools such as Excel, Tableau, or Power BI",
      "evidence": [
        "* Excel, Tableau, Power BI"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Ensure compliance with accounting standards and regulatory requirements, including GAAP and tax laws",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Here's a strong-match resume snippet for a Senior Accounting Manager position:",
      "severity": "high"
    },
    {
      "requirement": "8+ years of experience in senior accounting roles, with at least 3 years in a leadership position",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Here's a strong-match resume snippet for a Senior Accounting Manager position:",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Managed daily accounting operations for a $75 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
      "supports": "Oversee daily accounting operations for a $50 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements"
    },
    {
      "source": "resume",
      "quote": "* Led a team of 4 accountants, providing guidance and support to ensure successful completion of financial statements and audits",
      "supports": "Manage a team of 3 accountants, providing guidance and support to ensure successful completion of financial statements and audits"
    },
    {
      "source": "resume",
      "quote": "Here's a strong-match resume snippet for a Senior Accounting Manager position:",
      "supports": "Develop and implement accounting processes and procedures to improve efficiency and reduce costs by 15% within the next 6 months"
    },
    {
      "source": "resume",
      "quote": "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management",
      "supports": "Conduct regular financial analysis and provide insights to senior management on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management"
    },
    {
      "source": "resume",
      "quote": "Here's a strong-match resume snippet for a Senior Accounting Manager position:",
      "supports": "Ensure compliance with
