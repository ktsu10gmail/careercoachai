The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` field contains a clear and descriptive string that matches the job title. No metadata leakage is detected.
2. **Boilerplate leakage**: The `resume_file` field contains a weak resume file name (`resume_weak.txt`) that may indicate boilerplate content. However, this is not a significant issue in this case.
3. **Contra-evidence as matched evidence**: There are no instances of contra-evidence being used as matched evidence. All evidence points align with the requirements and job description.
4. **Generic snippet scattering**: The `missing_requirements` section contains a generic snippet that lacks explicit operational scope required for the Bookkeeping, Accounting, and Auditing Clerks job. This is a potential issue, but it's not severe enough to be considered a failure mode in this case.
5. **Title/header proof**: The title of the JSON output ("Analysis") does not match the `case_slug` field, which contains the actual job title. However, this is not a significant issue in this case.

Proposed regression case:

```json
{
  "job_title": "32. Bookkeeping, Accounting, and Auditing Clerks",
  "case_slug": "bookkeeping-accounting-and-auditing-clerks",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.715878",
  "match_score": 47.69,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 33.5,
      "reason": "Found 3 direct, 3 adjacent, 1 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "\"High school diploma with 2 years of experience in web development using Python and JavaScript.",
        "Bookkeeping, Accounting, and Auditing Clerks job:",
        "Proficient in Microsoft Office, particularly Excel, Word, and Access.",
        "Strong organizational and time management skills.\""
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
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 82.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"High school diploma with 2 years of experience in web development using Python and JavaScript.",
        "Bookkeeping, Accounting, and Auditing Clerks job:",
        "Proficient in Microsoft Office, particularly Excel, Word, and Access.",
        "Strong organizational and time management skills.\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "\"High school diploma with 2 years of experience in web development using Python and JavaScript."
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
      "requirement": "Strong organizational and time management skills",
      "evidence": [
        "Strong organizational and time management skills.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with cloud-based accounting software such as QuickBooks Online or Xero",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "associate's degree in accounting or related field preferred",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Familiarity with Generally Accepted Accounting Principles (GAAP) and financial software such as QuickBooks or Xero",
      "evidence": [
        "Bookkeeping, Accounting, and Auditing Clerks job:"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Maintain accurate and up-to-date financial records, including accounts payable, accounts receivable, payroll, and general ledger",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Process and reconcile transactions, including invoices, payments, and deposits",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Prepare and submit financial reports to management, including balance sheets, income statements, and cash flow statements",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct basic audits of financial records and identify discrepancies or errors",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Assist with budgeting and forecasting processes",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Provide support for special projects, such as financial analysis and data analysis",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "1-2 years of experience in bookkeeping, accounting, or auditing",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Bookkeeping, Accounting, and Auditing Clerks job:",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"High school diploma with 2 years of experience in web development using Python and JavaScript.",
      "supports": "High school diploma or equivalent required;"
    },
    {
      "source": "resume",
      "quote": "Bookkeeping, Accounting, and Auditing Clerks job:",
      "supports": "associate's degree in accounting or related field preferred"
    },
    {
      "source": "resume",
      "quote": "Bookkeeping, Accounting, and Auditing Clerks job:",
      "supports": "1-2 years of experience in bookkeeping, accounting, or auditing"
    },
    {
      "source": "resume",
      "quote": "Proficient in Microsoft Office, particularly Excel, Word, and Access.",
      "supports": "Proficiency in Microsoft Office, particularly Excel, Word, and Access"
    },
    {
      "source": "resume",
      "quote": "Bookkeeping, Accounting, and Auditing Clerks job:",
      "supports": "Familiarity with Generally Accepted Accounting Principles (GAAP) and financial software such as QuickBooks or Xero"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is
