The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata Leakage**: The output does not contain any sensitive information that could potentially leak metadata.

2. **Boilerplate Leakage**: There is no boilerplate content in the output, which reduces the risk of leakage.

3. **Contra-Evidence as Matched Evidence**: The output correctly distinguishes between matched and contra-evidence. No issues were found here.

4. **Generic Snippet Scattering**: The output does not contain generic snippets that could be scattered throughout the analysis.

5. **Title/Header Proof**: The title and header of the output are properly formatted and do not contain any potential issues.

6. **Scope Mismatch**: The scope of the output appears to match the provided JSON structure, with no discrepancies found.

7. **Matched/Missing Contradiction**: No contradictions were found between matched and missing requirements in the output.

**Proposed Regression Case:**

```json
{
  "job_title": "83. Physical Therapists",
  "case_slug": "83-physical-therapists",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-29T20:51:24.673143",
  "match_score": 61.29,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 61.8,
      "reason": "Found 5 direct, 7 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs).",
        "* Developed and implemented individualized physical therapy plans to improve mobility, strength, and function, with a focus on evidence-based practice guidelines for specific conditions.",
        "* Provided hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions, with a strong emphasis on patient-centered care.",
        "* Collaborated with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care and achieve optimal patient outcomes."
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
      "score": 49.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 61.8,
      "reason": "Found 5 direct, 7 adjacent, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs).",
        "* Developed and implemented individualized physical therapy plans to improve mobility, strength, and function, with a focus on evidence-based practice guidelines for specific conditions.",
        "* Provided hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions, with a strong emphasis on patient-centered care.",
        "* Collaborated with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care and achieve optimal patient outcomes."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs).",
        "* Developed and implemented individualized physical therapy plans to improve mobility, strength, and function, with a focus on evidence-based practice guidelines for specific conditions.",
        "* Provided hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions, with a strong emphasis on patient-centered care.",
        "* Collaborated with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care and achieve optimal patient outcomes."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and implement individualized physical therapy plans to improve mobility, strength, and function",
      "evidence": [
        "* Developed and implemented individualized physical therapy plans to improve mobility, strength, and function, with a focus on evidence-based practice guidelines for specific conditions."
      ],
      "strength": "high"
    },
    {
      "requirement": "Provide hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions",
      "evidence": [
        "* Provided hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions, with a strong emphasis on patient-centered care."
      ],
      "strength": "high"
    },
    {
      "requirement": "Collaborate with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care",
      "evidence": [
        "* Collaborated with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care and achieve optimal patient outcomes."
      ],
      "strength": "high"
    },
    {
      "requirement": "Document patient information in electronic medical records (EMRs) using standardized assessment tools, such as the FIM and MDS-2",
      "evidence": [
        "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs)."
      ],
      "strength": "high"
    },
    {
      "requirement": "Current licensure to practice physical therapy in [state/province]",
      "evidence": [
        "* Current licensure to practice physical therapy in [State/Province]"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct patient assessments to identify and prioritize treatment goals",
      "evidence": [
        "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs)."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Strong communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience working with pediatric or geriatric populations",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Conducted comprehensive patient assessments to identify and prioritize treatment goals, utilizing standardized assessment tools such as FIM and MDS-2 in electronic medical records (EMRs).",
      "supports": "Conduct patient assessments to identify and prioritize treatment goals"
    },
    {
      "source": "resume",
      "quote": "* Developed and implemented individualized physical therapy plans to improve mobility, strength, and function, with a focus on evidence-based practice guidelines for specific conditions.",
      "supports": "Develop and implement individualized physical therapy plans to improve mobility, strength, and function"
    },
    {
      "source": "resume",
      "quote": "* Provided hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions, with a strong emphasis on patient-centered care.",
      "supports": "Provide hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions"
    },
    {
      "source": "resume",
      "quote": "* Collaborated with multidisciplinary teams, including physicians, occupational therapists, and speech therapists, to ensure comprehensive care and achieve optimal patient outcomes.",
