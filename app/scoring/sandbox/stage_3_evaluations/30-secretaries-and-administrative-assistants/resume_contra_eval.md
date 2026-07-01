The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `case_slug` field contains a URL-encoded version of the job title, which is not a concern in this case.
2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided output.
3. **Contra-evidence as matched evidence**: While there are some instances of contra-evidence (e.g., "Managed calendars for multiple executives, but did not coordinate travel arrangements due to limited resources."), they are correctly flagged as such and do not appear to be mistakenly used as matched evidence.
4. **Generic snippet scattering**: The `evidence_quotes` field contains specific quotes from the resume that support certain requirements, which is a good practice.
5. **Title/header proof**: There is no apparent issue with title/header proof in this output.
6. **Scope mismatch**: The scope of the job title and the matched requirements appears to be consistent.
7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements.

Overall, the provided JSON output seems to be well-structured and free of known failure modes. However, it's essential to note that human verification is still necessary to ensure the accuracy and completeness of the analysis.

**Proposed regression case:**

```json
{
  "job_title": "31. Data Analysts",
  "case_slug": "31-data-analysts",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:48.475007",
  "match_score": 37.08,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 30.4,
      "reason": "Found 2 direct, 3 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Data Analyst with 2+ years of experience analyzing large datasets to inform business decisions."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop and maintain accurate and up-to-date databases and spreadsheets to track project progress and employee information",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Developed and maintained databases to track project progress, but relied on existing spreadsheets rather than creating new ones from scratch.",
      "severity": "high"
    },
    {
      "requirement": "Respond to phone calls, emails, and letters on behalf of executives and staff members",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Managed calendars for multiple executives, but did not coordinate travel arrangements due to limited resources.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Data Analyst with 2+ years of experience analyzing large datasets to inform business decisions.",
      "supports": "Prepare and edit documents, reports, and presentations using Microsoft Office Suite (Word, Excel, PowerPoint)"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This proposed regression case includes a job title with a similar scope to the original output, but with some missing requirements that are flagged as such. The `evidence_quotes` field contains a quote from the resume that supports one of the matched requirements, while another requirement is missing evidence points due to contra-evidence.
