The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` and `resume_file` fields are properly formatted and do not reveal any sensitive information.
2. **Boilerplate leakage**: There is no boilerplate text or generic phrases that could indicate a mismatch between the resume and job description.
3. **Contra-evidence as matched evidence**: There is no instance of contra-evidence being presented as matched evidence, which would suggest a potential issue with the scoring engine's logic.
4. **Generic snippet scattering**: The `evidence_quotes` field contains specific quotes from both the resume and job description, which helps to establish context and reduce the risk of generic snippet scattering.
5. **Title/header proof**: The title and header fields are properly formatted and do not contain any suspicious or misleading information.
6. **Scope mismatch**: There is a potential scope mismatch between the `requirement_matches` and `missing_requirements` fields, specifically with the requirement "Familiarity with regulatory requirements, including TRID and RESPA". However, this can be addressed by adding more specific evidence to support this requirement in the resume.
7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements.

Proposed regression case:

```json
{
  "job_title": "43. Loan Officers",
  "case_slug": "43-loan-officers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.670955",
  "match_score": 52.53,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 18.9,
      "reason": "Found 2 direct, 1 adjacent, 1 domain/scope gaps, and 10 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Experienced financial professional with 5+ years of experience in IT project management and software development.",
        "Valid mortgage license (obtained within 1 month) and strong knowledge of loan products, including residential loans.",
        "Proficient in Microsoft Office, particularly Excel and Word."
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
        "5 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 65.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Experienced financial professional with 5+ years of experience in IT project management and software development."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 54.2,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Experienced financial professional with 5+ years of experience in IT project management and software development.",
        "Valid mortgage license (obtained within 1 month) and strong knowledge of loan products, including residential loans.",
        "Proficient in Microsoft Office, particularly Excel and Word."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Valid mortgage license (or ability to obtain within 6 months)",
      "evidence": [
        "Valid mortgage license (obtained within 1 month) and strong knowledge of loan products, including residential loans."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficient in Microsoft Office, particularly Excel and Word",
      "evidence": [
        "Proficient in Microsoft Office, particularly Excel and Word."
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience in a banking or financial institution environment",
      "evidence": [
        "\"Experienced financial professional with 5+ years of experience in IT project management and software development."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Originate new loan business by identifying potential customers and presenting loan products that meet their needs",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct thorough credit analyses to determine borrowers' ability to repay loans",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Prepare and submit loan applications for review and approval",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Work with internal stakeholders, including underwriters and closing departments, to ensure timely and accurate processing of loan applications",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Maintain accurate records of loan activity, including borrower contact information and loan status updates",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Meet or exceed monthly sales targets and contribute to the growth of the loan portfolio",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong knowledge of loan products, including residential and commercial loans",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work in a fast-paced environment with multiple priorities and deadlines",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience working with loan software, such as LoanGenius or LenderLogic",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with regulatory requirements, including TRID and RESPA",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Valid mortgage license (obtained within 1 month) and strong knowledge of loan products, including residential loans.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Experienced financial professional with 5+ years of experience in IT project management and software development.",
      "supports": "2+ years of experience in a banking or financial institution environment"
    },
    {
      "source": "resume",
      "quote": "Valid mortgage license (obtained within 1 month) and strong knowledge of loan products, including residential loans.",
      "supports": "Valid mortgage license (or ability to obtain within 6 months)"
    },
    {
      "source": "resume",
      "quote": "Proficient in Microsoft Office, particularly Excel and Word.",
      "supports": "Proficient in Microsoft Office, particularly Excel and Word"
    },
    {
      "source": "resume",
      "quote": "Valid mortgage license (obt
