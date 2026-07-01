Overall, the provided JSON output appears to be clean. However, I have identified a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The analysis engine has detected generic or lower-scope resume snippets that lack explicit operational scope required for certain requirements (e.g., "Oversee daily accounting operations for a $50 million annual budget..."). This suggests that the resume may contain boilerplate text that is not tailored to the specific job requirements.

2. **Contra-evidence as matched evidence**: The analysis engine has identified a requirement ("CPA certification required") with contra-evidence ("* Lack of CPA certification") instead of affirmative proof. This indicates that the resume does not provide sufficient evidence to support the claimed requirement.

3. **Generic snippet scattering**: The analysis engine has detected multiple generic or lower-scope resume snippets scattered throughout the resume, which may indicate a lack of specificity and detail in the candidate's experience and skills.

4. **Title/header proof**: The title/header section of the JSON output appears to be missing or not properly formatted, as it does not contain any specific information about the job title or header.

5. **Scope mismatch**: Although the analysis engine has identified some scope mismatches, the overall score breakdown suggests that the candidate's experience and skills are generally aligned with the job requirements.

6. **Matched/missing contradiction**: The analysis engine has detected a few contradictions between matched evidence and missing requirements (e.g., "Manage a team of 3 accountants..."), which may indicate that the resume does not provide sufficient information to support certain claims.

Proposed regression case:

```json
{
  "job_title": "Senior Accounting Manager",
  "case_slug": "senior-accounting-manager-2",
  "resume_file": "resume_weak_2.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:25.294279",
  "match_score": 45.27,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 28.6,
      "reason": "Found 1 direct, 6 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
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
      "score": 82.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "senior"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 21.7,
      "reason": "Found 0 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 70.2,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proven track record of successfully managing large budgets and teams",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong knowledge of financial reporting, budgeting, and forecasting principles",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with cloud-based accounting software such as QuickBooks or Xero",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Familiarity with financial planning and analysis tools such as Excel, Tableau, or Power BI",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Develop and implement accounting processes and procedures to improve efficiency and reduce costs by 15% within the next 6 months",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct regular financial analysis and provide insights to senior management on key performance indicators (KPIs) such as revenue growth, expense control, and cash flow management",
      "evidence": [
        "\"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Oversee daily accounting operations for a $50 million annual budget, ensuring accuracy and compliance with company policies and regulatory requirements",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership\"",
      "severity": "high"
    },
    {
      "requirement": "Manage a team of 3 accountants, providing guidance and support to ensure successful completion of financial statements and audits",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership\"",
      "severity": "high"
    },
    {
      "requirement": "Ensure compliance with accounting standards and regulatory requirements, including GAAP and tax laws",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Highly motivated accounting professional with 5 years of experience in senior roles. Proven track record of accuracy and compliance in daily operations. Skilled in Excel, QuickBooks, and financial reporting principles. Seeking a leadership\"",
      "severity": "high"
    },
    {
      "requirement": "CPA certification required",
      "reason": "Resume contains contra-evidence instead of affirmative proof: * Lack of CPA certification",
      "severity": "high"
    },
    {
      "requirement": "8+ years of experience in senior accounting roles, with at least 3 years in a leadership position",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Highly motivated accounting professional
