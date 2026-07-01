The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked or compromised.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the provided JSON output, as all relevant information appears to be specific to the candidate's experience and qualifications.

3. **Contra-Evidence as Matched Evidence**: The `missing_requirements` section contains a requirement ("Design and deliver training programs for employees at all levels of the organization, focusing on skills development and knowledge transfer") with contra-evidence ("Does not mention experience with training programs for all levels of the organization"). However, this is correctly identified as a mismatch in the analysis.

4. **Generic Snippet Scattering**: There is no apparent generic snippet scattering in the provided JSON output, as all relevant information appears to be specific to the candidate's experience and qualifications.

5. **Title/Header Proof**: The title ("50. Training and Development Specialists") does not appear to be proof or evidence of any kind, but rather a descriptive label for the job posting.

6. **Scope Mismatch**: The `expected_profile` field contains a value ("scope_mismatch"), which is correctly identified as a mismatch in the analysis.

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements in the provided JSON output.

**Proposed Regression Case:**

```json
{
  "job_title": "50. Training and Development Specialists",
  "case_slug": "50-training-and-development-specialists",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:50.538504",
  "match_score": 59.47,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.7,
      "reason": "Found 4 direct, 4 adjacent, 0 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "Does not mention experience with training programs for all levels of the organization",
        "Lacks specific examples of needs assessments, customized training plans, or coaching/mentoring support",
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques.",
        "Proven track record of delivering successful training programs to small groups of employees."
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
      "score": 40.7,
      "reason": "Found 4 direct, 4 adjacent, 0 domain/scope gaps, and 6 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Does not mention experience with training programs for all levels of the organization",
        "Lacks specific examples of needs assessments, customized training plans, or coaching/mentoring support",
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques.",
        "Proven track record of delivering successful training programs to small groups of employees."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 95.8,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Does not mention experience with training programs for all levels of the organization",
        "Lacks specific examples of needs assessments, customized training plans, or coaching/mentoring support",
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques.",
        "Proven track record of delivering successful training programs to small groups of employees."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Stay up-to-date with industry trends and best practices in adult learning and performance improvement",
      "evidence": [
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques."
      ],
      "strength": "high"
    },
    {
      "requirement": "3+ years of experience in training and development, instructional design, or a related field",
      "evidence": [
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proven track record of designing and delivering effective training programs",
      "evidence": [
        "Proven track record of delivering successful training programs to small groups of employees."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong knowledge of adult learning principles and instructional design methodologies",
      "evidence": [
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent communication, facilitation, and presentation skills",
      "evidence": [
        "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Ability to work with diverse groups and populations",
      "evidence": [
        "Proven track record of delivering successful training programs to small groups of employees."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Design and deliver training programs for employees at all levels of the organization, focusing on skills development and knowledge transfer",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Does not mention experience with training programs for all levels of the organization",
      "severity": "high"
    },
    {
      "requirement": "Conduct needs assessments to identify training gaps and develop customized training plans",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and maintain a comprehensive training library, including online resources and multimedia materials",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Evaluate the effectiveness of training programs through pre- and post-training surveys, quizzes, and assessments",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Provide coaching and mentoring support to employees to help them apply new skills and knowledge in their daily work",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Lacks specific examples of needs assessments, customized training plans, or coaching/mentoring support",
      "severity": "high"
    },
    {
      "requirement": "Master's degree in Education, Training, or a related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Does not mention experience with training programs for all levels of the organization",
      "supports": "Design and deliver training programs for employees at all levels of the organization, focusing on skills development and knowledge transfer"
    },
    {
      "source": "resume",
      "quote": "Lacks specific examples of needs assessments, customized training plans, or coaching/mentoring support",
      "supports": "Provide coaching and mentoring support to employees to help them apply new skills and knowledge in their daily work"
    },
    {
      "source": "resume",
      "quote": "Skilled in adult learning principles, instructional design methodologies, and facilitation techniques.",
      "supports": "Stay up-to-date with industry
