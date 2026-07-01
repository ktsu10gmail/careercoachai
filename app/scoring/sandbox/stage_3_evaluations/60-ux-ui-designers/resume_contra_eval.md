Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate text that is not specific to the job requirements. For example, the quote "Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products" seems like generic boilerplate and does not provide concrete evidence for the required skills.

2. **Generic snippet scattering**: Some of the quotes from the resume seem to be generic phrases that could apply to multiple job requirements, rather than being specific to a particular requirement. For example, the quote "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision" could be applied to multiple requirements.

3. **Title/header proof**: The title of the analysis JSON output ("60. UX/UI Designers") seems to match the job title exactly, which is good. However, it's worth noting that this might not always be the case, and there might be cases where the title does not match the job title.

4. **Scope mismatch**: There doesn't appear to be any scope mismatch in this analysis JSON output.

5. **Matched/missing contradiction**: The analysis JSON output appears to be free of contradictions between matched and missing requirements.

6. **Contra-evidence as matched evidence**: As mentioned earlier, the resume contains contra-evidence instead of affirmative proof for some requirements. For example, the requirement "Create wireframes, prototypes, and high-fidelity designs using tools such as Sketch, Figma, Adobe XD, and InVision" is marked as missing due to the presence of contra-evidence in the resume.

7. **Metadata leakage**: There doesn't appear to be any metadata leakage in this analysis JSON output.

Proposed regression case:

```json
{
  "job_title": "60. UX/UI Designers",
  "case_slug": "60-ux-ui-designers",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:51.699116",
  "match_score": 60.78,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 49.6,
      "reason": "Found 3 direct, 7 adjacent, 0 domain/scope gaps, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products.",
        "Created wireframes, prototypes, and high-fidelity designs using design tools, but I did not develop a comprehensive design system or style guide for any of my projects.",
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines.",
        "Conducted user research and created personas, but my user journeys were not always fully realized due to limited stakeholder input."
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
        "3 years",
        "lead"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 49.6,
      "reason": "Found 3 direct, 7 adjacent, 0 domain/scope gaps, and 4 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products.",
        "Created wireframes, prototypes, and high-fidelity designs using design tools, but I did not develop a comprehensive design system or style guide for any of my projects.",
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines.",
        "Conducted user research and created personas, but my user journeys were not always fully realized due to limited stakeholder input."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products.",
        "Created wireframes, prototypes, and high-fidelity designs using design tools, but I did not develop a comprehensive design system or style guide for any of my projects.",
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines.",
        "Conducted user research and created personas, but my user journeys were not always fully realized due to limited stakeholder input."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Strong portfolio showcasing design process, user research, and design solutions",
      "evidence": [
        "\"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products.",
        "Created wireframes, prototypes, and high-fidelity designs using design tools, but I did not develop a comprehensive design system or style guide for any of my projects."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in design tools such as Sketch, Figma, Adobe XD, and InVision",
      "evidence": [
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines."
      ],
      "strength": "high"
    },
    {
      "requirement": "Understanding of human-centered design principles, usability, and accessibility guidelines",
      "evidence": [
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines."
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct user research, create personas, and develop user journeys to inform design decisions",
      "evidence": [
        "\"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Work with developers to ensure design is implemented correctly and meets usability standards",
      "evidence": [
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct usability testing and gather feedback from stakeholders to iterate on designs",
      "evidence": [
        "Proficient in design tools such as Sketch, Figma, Adobe XD, and InVision, with a strong understanding of human-centered design principles, usability, and accessibility guidelines."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Create wireframes, prototypes, and high-fidelity designs using tools such as Sketch, Figma, Adobe XD, and InVision",
      "reason": "Resume contains boilerplate text instead of specific evidence: \"Results-driven UX/UI Designer with 3+ years of experience in designing user-centered digital products.\"",
      "severity": "high"
    },
    {
      "requirement": "Stay up-to-date with industry trends, best practices, and emerging technologies",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and collaboration skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with front
