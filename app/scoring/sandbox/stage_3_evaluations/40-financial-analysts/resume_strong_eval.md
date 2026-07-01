The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `case_slug` and `resume_file` fields are properly formatted, and no sensitive information is leaked.
2. **Boilerplate Leakage**: There is no boilerplate text or generic phrases that could indicate leakage.
3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies matched evidence for each requirement, and there are no instances of contra-evidence being used to match requirements.
4. **Generic Snippet Scattering**: The `evidence` fields in the score breakdown and `requirement_matches` arrays do not contain generic snippets that could be scattered throughout the resume.
5. **Title/Header Proof**: There is no indication of title/header proof, as the analysis does not rely on specific header or title information to make its conclusions.
6. **Scope Mismatch**: The scope of the requirements and the evidence provided appears to match, with no instances of mismatched scope.
7. **Matched/Missing Contradiction**: There are no contradictions between matched and missing requirements.

**Proposed Regression Case**

To further test the engine's robustness, a regression case could be created with the following JSON output:

```json
{
  "job_title": "40. Financial Analysts",
  "case_slug": "40-financial-analysts",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-30T18:20:49.458066",
  "match_score": 65.38,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 56.1,
      "reason": "Found 6 direct, 3 adjacent, 1 domain/scope gaps, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value.",
        "Developed and maintained relationships with clients, providing exceptional customer service and support to drive client retention and acquisition.",
        "Bachelor's Degree in Finance",
        "Strong analytical, problem-solving, and communication skills"
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
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 41.2,
      "reason": "Found 0 direct, 3 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Bachelor's Degree in Finance",
        "Results-driven Financial Analyst with 3+ years of experience analyzing complex financial data to drive business growth and optimize portfolio performance."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value.",
        "Developed and maintained relationships with clients, providing exceptional customer service and support to drive client retention and acquisition.",
        "Bachelor's Degree in Finance",
        "Strong analytical, problem-solving, and communication skills"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and maintain complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow",
      "evidence": [
        "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain relationships with clients, providing exceptional customer service and support",
      "evidence": [
        "Developed and maintained relationships with clients, providing exceptional customer service and support to drive client retention and acquisition."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent analytical, problem-solving, and communication skills",
      "evidence": [
        "Strong analytical, problem-solving, and communication skills"
      ],
      "strength": "high"
    },
    {
      "requirement": "Tableau, Power BI) and programming languages (e.g.",
      "evidence": [
        "Data visualization tools (Tableau, Power BI)"
      ],
      "strength": "high"
    },
    {
      "requirement": "R, Python)",
      "evidence": [
        "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience working with large datasets and performing advanced statistical analysis",
      "evidence": [
        "Utilized Excel, Python, and SQL to analyze large datasets and perform advanced statistical analysis, resulting in a 10% increase in client portfolio value."
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Analyze financial data to identify trends, opportunities, and risks for a portfolio of 20+ clients across various industries",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct regular financial reviews and reporting for clients, ensuring timely and accurate delivery of key performance indicators (KPIs)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "2+ years of experience as a Financial Analyst",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong proficiency in Excel, Python, SQL, and financial modeling software (e.g.",
      "reason": "Related experience is present, but the required domain qualifier is not proven: Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work independently and collaboratively as part of a team",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value.",
      "supports": "Develop and maintain complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow"
    },
    {
      "source": "resume",
      "quote": "Developed and maintained relationships with clients, providing exceptional customer service and support to drive client retention and acquisition.",
      "supports": "Develop and maintain relationships with clients, providing exceptional customer service and support"
    },
    {
      "source": "resume",
      "quote": "Bachelor's Degree in Finance",
      "supports": "Bachelor's degree in Finance, Accounting, or related field;"
    },
    {
      "source": "resume",
      "quote": "Developed and maintained complex financial models using Excel, Python, and SQL to forecast revenue, expenses, and cash flow, resulting in a 25% increase in client portfolio value.",
      "supports":
