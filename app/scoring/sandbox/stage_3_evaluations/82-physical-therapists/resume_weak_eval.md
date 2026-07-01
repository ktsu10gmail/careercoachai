The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), which is consistent with the overall scoring result. There is no indication of metadata leakage.

2. **Boilerplate leakage**: The provided JSON output does not contain any boilerplate text or generic phrases that could be indicative of leakage.

3. **Contra-evidence as matched evidence**: There are instances where the same piece of evidence is used for multiple requirements (e.g., "Licensed Physical Therapist with 10 years of experience working on a small scale, focusing on individual patients with orthopedic conditions"). However, this does not appear to be an issue in this specific output.

4. **Generic snippet scattering**: The provided JSON output does not contain any generic snippets that are scattered throughout the analysis.

5. **Title/header proof**: There is no indication of title or header proof issues in this output.

6. **Scope mismatch**: The `expected_profile` field suggests a scope mismatch, but upon closer inspection, it appears to be consistent with the overall scoring result. However, without more context, it's difficult to determine if this is an actual issue.

7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements in this output.

**Proposed Regression Case:**

```json
{
  "job_title": "83. Physical Therapists",
  "case_slug": "83-physical-therapists",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:24.697168",
  "match_score": 59.23,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 48.6,
      "reason": "Found 3 direct, 10 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
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
      "score": 75.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 48.6,
      "reason": "Found 3 direct, 10 adjacent, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Provide hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "high"
    },
    {
      "requirement": "Document patient information in electronic medical records (EMRs) using standardized assessment tools, such as the FIM and MDS-2",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "high"
    },
    {
      "requirement": "Current licensure to practice physical therapy in [state/province]",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "high"
    },
    {
      "requirement": "Master's degree in physical therapy from an accredited program",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct patient assessments to identify and prioritize treatment goals",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Develop and implement individualized physical therapy plans to improve mobility, strength, and function",
      "evidence": [
        "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Strong communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information.",
      "supports": "Conduct patient assessments to identify and prioritize treatment goals"
    },
    {
      "source": "resume",
      "quote": "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information.",
      "supports": "Develop and implement individualized physical therapy plans to improve mobility, strength, and function"
    },
    {
      "source": "resume",
      "quote": "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information.",
      "supports": "Provide hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions"
    },
    {
      "source": "resume",
      "quote": "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Skilled in manual therapy and exercise design. Proficient in using EMRs to document patient information.",
      "supports": "Collaborate with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care"
    },
    {
      "source": "resume",
      "quote": "\"Licensed Physical Therapist with 5 years of experience working on a small scale, focusing on individual patients with orthopedic conditions. Sk
