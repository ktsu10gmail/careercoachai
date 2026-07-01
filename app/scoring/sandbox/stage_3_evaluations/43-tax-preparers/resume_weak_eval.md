The provided JSON output contains several known failure modes:

1. **Boilerplate leakage**: The resume snippet contains boilerplate text that is not specific to the job requirements. This can be improved by removing generic phrases and focusing on relevant experience and skills.

2. **Contra-evidence as matched evidence**: In some cases, the resume snippet contains contra-evidence (e.g., "This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field") that is also listed as matched evidence for specific job requirements. This should be corrected to ensure that only affirmative proof is used.

3. **Generic snippet scattering**: The resume snippet contains generic phrases (e.g., "Strong analytical skills, excellent communication skills.") that are not specific to the job requirements. These phrases can be removed or rephrased to focus on relevant experience and skills.

4. **Title/header proof**: The title of the analysis ("43. Tax Preparers") does not match the actual job title provided in the JSON output. This should be corrected to ensure that the title accurately reflects the job requirements.

5. **Scope mismatch**: The expected profile ("scope_mismatch") does not match the actual scope of the job requirements. This should be corrected to ensure that the expected profile accurately reflects the job requirements.

6. **Matched/missing contradiction**: In some cases, there are contradictions between matched and missing evidence points. For example, the resume snippet contains contra-evidence for the requirement "1-2 years of experience as a tax preparer or in a related field", but also lists it as a missing evidence point. This should be corrected to ensure that only affirmative proof is used.

Here's an updated JSON output with proposed regression cases:

```json
{
  "job_title": "Tax Preparer",
  "case_slug": "43-tax-preparers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.752034",
  "match_score": 24.62,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 13.8,
      "reason": "Found 1 direct, 1 adjacent, 0 domain/scope gaps, and 10 missing evidence points for core JD requirements.",
      "evidence": [
        "This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
        "\"High school diploma, 2 years of experience with TurboTax, proficient in Excel and QuickBooks."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 2 missing evidence points for preferred JD requirements.",
      "evidence": [
        "This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block."
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
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": []
    },
    {
      "category": "Evidence quality",
      "score": 37.9,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
        "\"High school diploma, 2 years of experience with TurboTax, proficient in Excel and QuickBooks."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "\"High school diploma, 2 years of experience with TurboTax, proficient in Excel and QuickBooks."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong analytical and problem-solving skills",
      "evidence": [
        "Strong analytical skills, excellent communication skills."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Prepare tax returns for individuals and small businesses using tax preparation software (e.g., TurboTax, H&R Block)",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
      "severity": "high"
    },
    {
      "requirement": "Conduct interviews with clients to gather necessary information for tax preparation",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
      "severity": "high"
    },
    {
      "requirement": "Review and analyze client financial data to identify deductions and credits",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Complete and submit tax returns electronically or by mail",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Respond to client inquiries and resolve tax-related issues in a timely manner",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Maintain accurate records of client information and tax return submissions",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "associate's degree in accounting or related field preferred",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
      "severity": "medium"
    },
    {
      "requirement": "1-2 years of experience as a tax preparer or in a related field (e.g., bookkeeping, accounting)",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
      "severity": "high"
    },
    {
      "requirement": "Proficiency in tax preparation software (e.g., TurboTax, H&R Block)",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 1-2 years of experience as a tax preparer or in a related field, and does not mention proficiency in other tax preparation software such as H&R Block.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and customer service skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Certification as a Certified Public Accountant (CPA) or Enrolled Agent (EA) preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium
