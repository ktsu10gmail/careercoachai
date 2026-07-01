The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is not present in the `job_title`. However, this might be an error on the part of the user or the system, as it doesn't necessarily indicate a failure mode.

2. **Boilerplate Leakage**: There are no obvious examples of boilerplate leakage in the provided output.

3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies that some evidence quotes support multiple requirements (e.g., "Proven track record of driving revenue growth through strategic account development and team leadership." supports both "Identify and pursue new business opportunities through networking and relationship-building" and "Proven track record of success in driving revenue growth and team performance"). However, this is not considered a failure mode.

4. **Generic Snippet Scattering**: The analysis correctly identifies that the generic snippet "Excellent communication, leadership, and problem-solving skills" lacks explicit operational scope required for one of the requirements ("Excellent communication, leadership, and problem-solving skills").

5. **Title/Header Proof**: There is no apparent issue with title/header proof in this output.

6. **Scope Mismatch**: The analysis correctly identifies a scope mismatch between the job description and the resume (specifically, the missing requirement "Manage a team of sales representatives to achieve quarterly sales targets" is not present in the resume).

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements.

**Proposed Regression Case:**

```json
{
  "job_title": "2. Sales Representatives",
  "case_slug": "2-sales-representatives",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.445674",
  "match_score": 34.72,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 16.8,
      "reason": "Found 2 direct, 1 adjacent, 1 domain/scope gaps, and 10 missing evidence points for core JD requirements.",
      "evidence": [
        "Proven track record of driving revenue growth through strategic account development and team leadership.",
        "Strong understanding of cloud-based software solutions and their sales strategies",
        "Excellent communication and problem-solving skills"
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
        "5 years",
        "lead"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 53.4,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proven track record of driving revenue growth through strategic account development and team leadership.",
        "Strong understanding of cloud-based software solutions and their sales strategies",
        "Excellent communication and problem-solving skills"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Proven track record of success in driving revenue growth and team performance",
      "evidence": [
        "Proven track record of driving revenue growth through strategic account development and team leadership."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of the software industry and its current market trends",
      "evidence": [
        "Strong understanding of cloud-based software solutions and their sales strategies"
      ],
      "strength": "high"
    },
    {
      "requirement": "Identify and pursue new business opportunities through networking and relationship-building",
      "evidence": [
        "Proven track record of driving revenue growth through strategic account development and team leadership."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage a team of sales representatives to achieve quarterly sales targets",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement sales strategies to expand customer base and increase revenue",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct regular sales performance reviews with individual team members, providing coaching and feedback to improve results",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Analyze sales data and market trends to identify opportunities for growth and adjust sales tactics accordingly",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Manage a budget of $500,000 for sales-related expenses, including travel and training",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "5+ years of experience in sales management or a related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, leadership, and problem-solving skills",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Excellent communication and problem-solving skills",
      "severity": "high"
    },
    {
      "requirement": "Ability to work effectively in a fast-paced environment with multiple priorities and deadlines",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with CRM software (Salesforce.com) and sales analytics tools (e.g.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of cloud-based software solutions and their sales strategies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Certification in sales or business management (e.g.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proven track record of driving revenue growth through strategic account development and team leadership.",
      "supports": "Identify and pursue new business opportunities through networking and relationship-building"
    },
    {
      "source": "resume",
      "quote": "Proven track record of driving revenue growth through strategic account development and team leadership.",
      "supports": "Proven track record of success in driving revenue growth and team performance"
    },
    {
      "source": "resume",
      "quote": "Strong understanding of cloud-based software solutions and their sales strategies",
      "supports": "Strong understanding of the software industry and its current market trends"
    },
    {
      "source": "resume",
      "quote": "Excellent communication and problem-solving skills",
      "supports": "Excellent communication, leadership, and problem-solving skills"
    },
    {
      "source
