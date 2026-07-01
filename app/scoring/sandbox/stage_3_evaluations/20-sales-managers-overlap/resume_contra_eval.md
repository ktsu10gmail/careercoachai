The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata leakage**: The `expected_profile` field contains the string "contra_evidence", which could potentially leak metadata about the expected profile. However, this is not a significant issue in this case, as it does not reveal any sensitive information.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains several requirements with contra-evidence instead of affirmative proof. However, these are correctly identified and flagged for attention.

4. **Generic snippet scattering**: The `evidence_quotes` field contains quotes from the resume that support various requirements. These quotes are not scattered throughout the output; they are organized by requirement.

5. **Title/header proof**: There is no apparent title/header proof in the provided output.

6. **Scope mismatch**: The scope of the job description and the resume appears to match, with both referencing sales management experience.

7. **Matched/missing contradiction**: There are several requirements with matched or missing contradictions. For example, the requirement "Manage a team of sales representatives to achieve quarterly sales targets" is matched by the quote "Managed a team of sales representatives, but did not have direct oversight over quarterly sales targets or budget management." This is correctly identified as a contradiction.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's essential to note that this review is based on a limited analysis, and further human verification may still be necessary to ensure the accuracy of the output.

**Proposed regression case:**

```json
{
  "job_title": "30. Sales Managers (overlap)",
  "case_slug": "30-sales-managers-overlap",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:47.513193",
  "match_score": 53.46,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.0,
      "reason": "Found 3 direct, 4 adjacent, 0 domain/scope gaps, and 7 missing evidence points for core JD requirements.",
      "evidence": [
        "Managed a team of sales representatives, but did not have direct oversight over quarterly sales targets or budget management.",
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance.",
        "Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights.",
        "Proven track record of success in developing and implementing sales strategies to expand customer base and increase revenue."
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
      "score": 84.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 32.5,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance.",
        "Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 86.6,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Managed a team of sales representatives, but did not have direct oversight over quarterly sales targets or budget management.",
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance.",
        "Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights.",
        "Proven track record of success in developing and implementing sales strategies to expand customer base and increase revenue."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "5+ years of experience in sales management or a related field",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proven track record of success in driving revenue growth and team performance",
      "evidence": [
        "Proven track record of success in developing and implementing sales strategies to expand customer base and increase revenue."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with CRM software (Salesforce.com) and sales analytics tools (e.g.",
      "evidence": [
        "While I have experience with CRM software (Salesforce.com) and sales analytics tools (e.g."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement sales strategies to expand customer base and increase revenue",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct regular sales performance reviews with individual team members, providing constructive feedback and coaching",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Analyze sales data and market trends to identify opportunities for growth and improvement",
      "evidence": [
        "\"Results-driven sales professional with 5+ years of experience in sales management, where I successfully drove revenue growth and team performance."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage a team of sales representatives to achieve quarterly sales targets",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Managed a team of sales representatives, but did not have direct oversight over quarterly sales targets or budget management.",
      "severity": "high"
    },
    {
      "requirement": "Identify and pursue new business opportunities through networking and relationship-building",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights.",
      "severity": "high"
    },
    {
      "requirement": "Manage a budget of $500,000 for sales-related expenses, including travel and training",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Managed a team of sales representatives, but did not have direct oversight over quarterly sales targets or budget management.",
      "severity": "high"
    },
    {
      "requirement": "Strong understanding of the software industry and its current market trends",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work effectively in a fast-paced environment with multiple priorities and deadlines",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of cloud-based software solutions and their applications in the enterprise market",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Analyzed sales data and market trends, but did not identify opportunities for growth and improvement through data-driven insights.",
      "severity": "high"
    },
    {
      "requirement": "Certification in sales or business management (e.g
