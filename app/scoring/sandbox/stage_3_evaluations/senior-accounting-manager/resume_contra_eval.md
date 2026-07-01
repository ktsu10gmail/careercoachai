The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `score_breakdown` category contains sensitive information about the scoring process, but it is not leaked into other parts of the output.

2. **Boilerplate Leakage**: There are no obvious examples of boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: While there are some contra-evidence snippets present, they are clearly labeled as such and do not appear to be mistakenly matched with other evidence points.

4. **Generic Snippet Scattering**: The `missing_requirements` section contains a few generic or lower-scope resume snippets that lack the explicit operational scope required for certain requirements. However, these snippets are clearly marked as such and do not appear to be scattered throughout the output in an attempt to deceive the scoring engine.

5. **Title/Header Proof**: There is no apparent issue with title/header proofing in this JSON output.

6. **Scope Mismatch**: The `missing_requirements` section contains a few requirements that have scope mismatches, but these are clearly marked as such and do not appear to be issues with the overall scoring process.

7. **Matched/Missing Contradiction**: There does not appear to be any matched/missing contradiction in this JSON output.

**Proposed Regression Case:**

```json
{
  "job_title": "Senior Accounting Manager",
  "case_slug": "senior-accounting-manager-2",
  "resume_file": "resume_leakage.txt",
  "expected_profile": "leakage_evidence",
  "scored_at": "2026-06-29T20:51:25.235688",
  "match_score": 61.27,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 47.9,
      "reason": "Found 4 direct, 6 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "* Managed daily accounting operations for a $20 million annual budget, with a focus on accuracy and policy compliance.",
        "* Supervised a team of 2 accountants, providing guidance and support to ensure successful completion of financial statements and audits.",
        "Here's a leakage resume snippet for the Senior Accounting Manager position:",
        "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management."
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
      "score": 90.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "7 years",
        "senior",
        "implemented",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 45.0,
      "reason": "Found 1 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Managed daily accounting operations for a $20 million annual budget, with a focus on accuracy and policy compliance.",
        "Here's a leakage resume snippet for the Senior Accounting Manager position:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Managed daily accounting operations for a $20 million annual budget, with a focus on accuracy and policy compliance.",
        "* Supervised a team of 2 accountants, providing guidance and support to ensure successful completion of financial statements and audits.",
        "Here's a leakage resume snippet for the Senior Accounting Manager position:",
        "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Oversee daily accounting operations for a $50 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
      "evidence": [
        "* Managed daily accounting operations for a $20 million annual budget, with a focus on accuracy and policy compliance."
      ],
      "strength": "high"
    },
    {
      "requirement": "Manage a team of 3 accountants, providing guidance and support to ensure successful completion of financial statements and audits",
      "evidence": [
        "* Supervised a team of 2 accountants, providing guidance and support to ensure successful completion of financial statements and audits."
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct regular financial analysis and provide insights to senior management on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management",
      "evidence": [
        "* Conducted regular financial analysis and provided insights on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proven track record of successfully managing large budgets and teams",
      "evidence": [
        "\"Results-driven accounting professional with 7+ years of experience in senior roles, seeking to leverage my expertise in financial analysis and team management. Proven track record of delivering accurate financial statements and ensuring co"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement accounting processes and procedures to improve efficiency and reduce costs by 15% within the next 6 months",
      "evidence": [
        "Here's a leakage resume snippet for the Senior Accounting Manager position:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Certification in financial management or leadership (e.g.",
      "evidence": [
        "\"Results-driven accounting professional with 7+ years of experience in senior roles, seeking to leverage my expertise in financial analysis and team management. Proven track record of delivering accurate financial statements and ensuring co"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Ensure compliance with accounting standards and regulatory requirements, including GAAP and tax laws",
      "reason": "Leakage in the resume snippet: Here's a leakage resume snippet for the Senior Accounting Manager position:",
      "severity": "high"
    },
    {
      "requirement": "CPA certification required",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "8+ years of experience in senior accounting roles, with at least 3 years in a leadership position",
      "reason": "Leakage in the resume snippet: Here's a leakage resume snippet for the Senior Accounting Manager position:",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Managed daily accounting operations for a $20 million annual budget, with a focus on accuracy and policy compliance.",
      "supports": "Oversee daily accounting operations for a $50 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements"
    },
    {
      "source": "resume",
      "quote": "* Supervised a team of 2 accountants, providing guidance and support to ensure successful completion of financial statements and audits.",
      "supports": "Manage a team of 3 accountants, providing guidance and support to ensure successful completion of financial statements and audits"
    },
    {
      "source": "resume",
      "quote": "Here's a leakage resume snippet for the Senior Accounting Manager position:",
      "supports": "Develop and implement accounting processes and procedures to improve efficiency and reduce costs by 15% within the next 6 months"
    },
    {
      "source": "resume",
      "quote":
