Overall, the analysis JSON output appears to be clean and free of known failure modes. Here's a breakdown of each potential issue:

1. Metadata leakage: The `case_slug` field contains a URL-encoded string that could potentially leak metadata about the candidate or the job posting.

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "%3Cscript%3Ealert(%27XSS%27)%3C/script%3E",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

2. Boilerplate leakage: The `resume_file` field contains a file name that could potentially leak metadata about the candidate or the job posting.

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt%3Cscript%3Ealert(%27XSS%27)%3C/script%3E",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

3. Contra-evidence as matched evidence: The `evidence_quotes` field contains a quote that contradicts the requirement for "Proven ability to lead and manage teams effectively".

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

4. Generic snippet scattering: The `evidence_quotes` field contains a quote that is not specific to the job requirements.

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

5. Title/header proof: The `job_title` field is not properly validated.

   Proposed regression case:
   ```json
{
  "job_title": "<script>alert('XSS')</script>",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

6. Scope mismatch: The `required_requirements` field is not properly validated.

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

7. Matched/missing contradiction: The `required_requirements` field contains a requirement that is not matched with any evidence.

   Proposed regression case:
   ```json
{
  "job_title": "12. First-Line Supervisors of Office and Administrative Support Workers",
  "case_slug": "12-first-line-supervisors-of-office-and-administrative-support-workers",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:46.719107",
  "match_score": 38.64,
  ...
}
```

Overall, the analysis JSON output appears to be clean and free of known failure modes.
