Overall, the provided JSON output appears to be clean. However, I did identify a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate text that seems to be repeated in multiple places, such as "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence." While this is not necessarily an issue, it's worth noting that the engine may flag this as a potential red flag if it detects excessive repetition.

2. **Generic snippet scattering**: The resume contains generic snippets like "Strong communication skills" and "Knowledge of evidence-based practices," which are not specific to occupational therapy. While these phrases are relevant to the profession, they could be considered as generic and might not provide enough context for the engine to accurately assess the candidate's qualifications.

3. **Title/header proof**: The JSON output does not contain any explicit title or header information that would indicate the source of the data. However, based on the content, it appears to be a resume analysis from an occupational therapy job posting.

4. **Scope mismatch**: There is no clear indication of the scope of the analysis in the provided JSON output. It's unclear whether this analysis was conducted for a specific job posting or if it's a general assessment of the candidate's qualifications.

5. **Matched/missing contradiction**: The JSON output contains some contradictions, such as the requirement "Master's degree in occupational therapy from an accredited program" being marked as missing due to contra-evidence, but also having evidence quotes that support this requirement. However, these contradictions are not severe enough to be considered a major issue.

6. **Contra-evidence as matched evidence**: The JSON output contains some requirements with contra-evidence, which is flagged as "missing." However, in some cases, the engine still matches the candidate against these requirements, despite the presence of contra-evidence. This could lead to inaccurate results if not addressed.

7. **Metadata leakage**: There is no apparent metadata leakage in the provided JSON output.

8. **Generic snippet scattering (again)**: The JSON output contains another generic snippet, "Valid CPR certification," which is not specific to occupational therapy.

9. **Scope mismatch (again)**: As mentioned earlier, there is no clear indication of the scope of the analysis in the provided JSON output.

10. **Matched/missing contradiction (again)**: While there are some contradictions in the JSON output, they are not severe enough to be considered a major issue.

Proposed regression case:

```json
{
  "job_title": "Occupational Therapist",
  "case_slug": "occupational-therapist",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:24.723717",
  "match_score": 42.56,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 28.6,
      "reason": "Found 3 direct, 2 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst",
        "\"Results-oriented occupational therapist with 5+ years of experience in providing high-quality patient care. Proven track record of effectively collaborating with multidisciplinary teams to coordinate patient care, although I did not have t",
        "Certified in CPR and possess a strong ability to work with diverse populations, including children, adults, and older adults, although my experience was limited to working primarily with adult populations. Knowledge of evidence-based practi"
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
      "score": 60.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 28.6,
      "reason": "Found 3 direct, 2 adjacent, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst",
        "\"Results-oriented occupational therapist with 5+ years of experience in providing high-quality patient care. Proven track record of effectively collaborating with multidisciplinary teams to coordinate patient care, although I did not have t",
        "Certified in CPR and possess a strong ability to work with diverse populations, including children, adults, and older adults, although my experience was limited to working primarily with adult populations. Knowledge of evidence-based practi"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 73.3,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst",
        "\"Results-oriented occupational therapist with 5+ years of experience in providing high-quality patient care. Proven track record of effectively collaborating with multidisciplinary teams to coordinate patient care, although I did not have t",
        "Certified in CPR and possess a strong ability to work with diverse populations, including children, adults, and older adults, although my experience was limited to working primarily with adult populations. Knowledge of evidence-based practi"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Educate patients, families, and caregivers on proper use of adaptive equipment, home modifications, and daily living skills",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst"
      ],
      "strength": "high"
    },
    {
      "requirement": "Document patient assessments, treatment plans, and outcomes in electronic medical records",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst"
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with electronic medical records systems, such as Epic or Cerner",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement individualized treatment plans to enhance functional abilities and promote independence",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct comprehensive assessments of patients with physical, emotional, or cognitive disabilities to identify areas for improvement",
      "evidence": [
        "Skilled in developing individualized treatment plans that enhance functional abilities and promote independence, but my experience was largely focused on working with patients in outpatient settings. Strong communication skills were demonst"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Provide occupational therapy services in various settings, including hospitals, clinics, schools, and community centers",
      "reason": "Resume contains contra-evidence instead of affirmative proof: \"Results-oriented occupational therapist with 5+ years of experience in providing high-quality patient care. Proven track record of effectively collaborating with multidisciplinary teams to coordinate patient care, although I did not have t",
      "severity": "high"
    },
    {
      "requirement": "Monitor patient progress and adjust treatment plans as needed",
      "reason":
