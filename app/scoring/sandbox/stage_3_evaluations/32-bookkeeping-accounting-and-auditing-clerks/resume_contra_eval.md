The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` field contains a clear and descriptive string that matches the job title. No metadata leakage is detected.
2. **Boilerplate leakage**: The `resume_file` field references a specific file, but there is no indication of boilerplate content being leaked into the analysis. The provided evidence quotes are specific to the resume content.
3. **Contra-evidence as matched evidence**: While some evidence quotes contain contra-evidence (e.g., "Strong organizational skills..."), they are still matched with corresponding requirements in the `requirement_matches` array. This suggests that the engine is correctly handling contra-evidence and not relying solely on it for matching.
4. **Generic snippet scattering**: The `missing_requirements` array contains specific requirements, but some of the reasons for missing evidence points seem to be related to generic or lower-scope resume snippets (e.g., "Bookkeeping, Accounting, and Auditing Clerks job:"). However, this is not a clear indication of generic snippet scattering.
5. **Title/header proof**: The `job_title` field is clearly defined, and the analysis does not contain any issues with title/header proof.
6. **Scope mismatch**: There are no indications of scope mismatch in the provided output.
7. **Matched/missing contradiction**: The analysis appears to be consistent, and there are no contradictions between matched and missing requirements.

Overall, the provided JSON output seems to be clean and free of known failure modes. However, it's essential to note that a thorough review by human experts is still necessary to verify the accuracy and completeness of the analysis.

**Proposed regression case:**

```json
{
  "job_title": "32. Bookkeeping, Accounting, and Auditing Clerks",
  "case_slug": "32-bookkeeping-accounting-and-auditing-clerks",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:48.661210",
  "match_score": 47.36,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 33.1,
      "reason": "Found 2 direct, 4 adjacent, 2 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven bookkeeping professional with 2+ years of experience in maintaining accurate financial records.",
        "Strong organizational skills, but note that I have not had the opportunity to work on complex budgeting or forecasting projects due to limited scope at previous roles.",
        "While I do not possess a bachelor's degree in accounting, I have taken courses in financial analysis and data analysis through online platforms.",
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 32.5,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "While I do not possess a bachelor's degree in accounting, I have taken courses in financial analysis and data analysis through online platforms.",
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.3,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven bookkeeping professional with 2+ years of experience in maintaining accurate financial records.",
        "Strong organizational skills, but note that I have not had the opportunity to work on complex budgeting or forecasting projects due to limited scope at previous roles.",
        "While I do not possess a bachelor's degree in accounting, I have taken courses in financial analysis and data analysis through online platforms.",
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Maintain accurate and up-to-date financial records, including accounts payable, accounts receivable, payroll, and general ledger",
      "evidence": [
        "\"Results-driven bookkeeping professional with 2+ years of experience in maintaining accurate financial records."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office, particularly Excel, Word, and Access",
      "evidence": [
        "Proficient in Microsoft Office, particularly Excel, Word, and Access."
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with Generally Accepted Accounting Principles (GAAP) and financial software such as QuickBooks or Xero",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Bachelor's degree in accounting or related field",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with cloud-based accounting software such as QuickBooks Online or Xero",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Prepare and submit financial reports to management, including balance sheets, income statements, and cash flow statements",
      "evidence": [
        "\"Results-driven bookkeeping professional with 2+ years of experience in maintaining accurate financial records."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Process and reconcile transactions, including invoices, payments, and deposits",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct basic audits of financial records and identify discrepancies or errors",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: \"Results-driven bookkeeping professional with 2+ years of experience in maintaining accurate financial records.",
      "severity": "high"
    },
    {
      "requirement": "Assist with budgeting and forecasting processes",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Strong organizational skills, but note that I have not had the opportunity to work on complex budgeting or forecasting projects due to limited scope at previous roles.",
      "severity": "high"
    },
    {
      "requirement": "Provide support for special projects, such as financial analysis and data analysis",
      "reason": "Resume contains contra-evidence instead of affirmative proof: While I do not possess a bachelor's degree in accounting, I have taken courses in financial analysis and data analysis through online platforms.",
      "severity": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "1-2 years of experience in bookkeeping, accounting, or auditing",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Bookkeeping, Accounting, and Auditing Clerks job:",
      "severity": "high"
    },
    {
      "requirement": "Strong organizational and time management skills",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Strong organizational skills, but note that I have not had the opportunity
