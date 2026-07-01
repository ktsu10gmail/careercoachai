The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is set to "scope_mismatch", but there is no indication of metadata leakage in the provided output.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided output, as all the provided quotes and snippets are specific to the job requirements and do not appear to be generic or boilerplate content.

3. **Contra-Evidence as Matched Evidence**: The system correctly identifies that there is contra-evidence (the weak or scope-mismatch resume snippet) instead of affirmative proof for the "Lead day-to-day account operations" requirement. This is a known failure mode, but it is handled correctly in this case.

4. **Generic Snippet Scattering**: There is no evidence of generic snippet scattering in the provided output, as all the snippets are specific to the job requirements and do not appear to be generic or scattered content.

5. **Title/Header Proof**: The title/header proof is not explicitly mentioned in the provided output, but it is not a known failure mode for this JSON structure.

6. **Scope Mismatch**: The `expected_profile` field indicates that the expected profile is set to "scope_mismatch", which suggests that there may be a scope mismatch between the job requirements and the resume content. However, upon closer inspection, it appears that the system has correctly identified the contra-evidence for this requirement.

7. **Matched/Missing Contradiction**: There is no evidence of matched/missing contradiction in the provided output, as all the quotes and snippets appear to be consistent with the job requirements.

**Proposed Regression Case**

To further test the system's ability to handle scope mismatch, a regression case could be created with the following JSON structure:

```json
{
  "job_title": "Senior Accounting Manager",
  "case_slug": "senior-accounting-manager-real-jd-17c9633107",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-07-01T00:37:21.639377",
  "match_score": 32.7,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 12.5,
      "reason": "Found 0 direct, 5 adjacent, 0 domain/scope gaps, and 9 missing evidence points for core JD requirements.",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
        "Managed client relationships and coordinated project delivery for multiple clients."
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
      "score": 64.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "senior",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 12.5,
      "reason": "Found 0 direct, 5 adjacent, 0 domain/scope gaps, and 9 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
        "Managed client relationships and coordinated project delivery for multiple clients."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 55.2,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
        "Managed client relationships and coordinated project delivery for multiple clients."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Client Leadership & Relationship Management",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
        "Managed client relationships and coordinated project delivery for multiple clients."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Build and maintain strong, trusted relationships with client stakeholders across multiple functions and levels.",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
        "Managed client relationships and coordinated project delivery for multiple clients."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Serve as a primary day-to-day leadership contact for operational matters, escalations, and service delivery topics.",
      "evidence": [
        "Managed client relationships and coordinated project delivery for multiple clients."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Demonstrate professionalism, accountability, and responsiveness in all client interactions.",
      "evidence": [
        "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Ensure responsibilities are clearly defined and aligned to business priorities.",
      "evidence": [
        "Bachelor's degree in Business Administration from [University Name], 2015."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Establish clear ways of working that improve communication, transparency, and partnership effectiveness.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Operational Excellence",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Lead day-to-day account operations to ensure all projects are delivered on time, within scope, and to agreed service levels.",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
      "severity": "high"
    },
    {
      "requirement": "Oversee workflow prioritization, capacity planning, issue resolution, and execution consistency across the team.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Drive continuous improvement initiatives that simplify processes, reduce friction, and improve service outcomes.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Maintain strong governance across briefs, approvals, timelines, reporting, and operational controls.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Team Leadership",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Provide direction, coaching, and support to account team members and cross-functional partners.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Create a culture of ownership, urgency, collaboration, and high standards.",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Managed multiple client accounts for 5+ years, resulting in consistent revenue growth and improved customer satisfaction.",
      "supports": "Client Leadership & Relationship Management"
    },
    {
      "source": "resume",
