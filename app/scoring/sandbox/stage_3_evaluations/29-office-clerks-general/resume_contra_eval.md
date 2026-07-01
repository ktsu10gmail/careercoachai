Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate phrases such as "Results-driven administrative professional" which may not be specific enough to demonstrate relevant skills and experience.

2. **Generic snippet scattering**: Some of the evidence quotes contain generic phrases like "Proven ability to maintain accurate records and files, both physical and electronic." without providing concrete examples or metrics to support this claim.

3. **Title/header proof**: The job title "29. Office Clerks, General" seems to be a boilerplate title that may not accurately reflect the specific requirements of the job posting.

4. **Scope mismatch**: There is a potential scope mismatch between the required skills and experience listed in the JD and the evidence provided in the resume. For example, the JD requires "Experience with database management software, such as Access or SQL Server" but the resume only mentions "Assisted with data entry, updating databases, and performing other clerical tasks as needed".

5. **Matched/missing contradiction**: The analysis JSON output contains a few requirements that are marked as missing, but the evidence quotes do not provide sufficient proof to support their inclusion in the matched requirements list.

Proposed regression case:

```json
{
  "job_title": "30. Data Entry Clerk",
  "case_slug": "30-data-entry-clerk",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "boilerplate_evidence",
  "scored_at": "2026-06-30T18:20:48.292974",
  "match_score": 34.03,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 25.4,
      "reason": "Found 1 direct, 4 adjacent, 0 domain/scope gaps, and 8 missing evidence points for core JD requirements.",
      "evidence": [
        "Results-driven administrative professional with 2+ years of experience in office settings, proficient in Microsoft Office Suite and possessing strong organizational skills."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 95.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years",
        "staff"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Assisted with data entry, updating databases, and performing other clerical tasks as needed"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 61.4,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Results-driven administrative professional with 2+ years of experience in office settings, proficient in Microsoft Office Suite and possessing strong organizational skills."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Maintain accurate records and files, both physical and electronic",
      "evidence": [
        "Results-driven administrative professional with 2+ years of experience in office settings, proficient in Microsoft Office Suite and possessing strong organizational skills."
      ],
      "strength": "high"
    },
    {
      "requirement": "Process and distribute mail, packages, and other correspondence",
      "evidence": [
        "Processed and distributed mail, packages, and other correspondence, but did not coordinate meetings, appointments, or events"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Provide general office support, such as photocopying, scanning, and faxing documents",
      "evidence": [
        "Provided general office support, including photocopying, scanning, and faxing documents, but did not have certification in medical terminology or a related field"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Assist with data entry, updating databases, and performing other clerical tasks as needed",
      "evidence": [
        "Assisted with data entry, updating databases, and performing other clerical tasks as needed"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Coordinate meetings, appointments, and events, including preparing agendas, materials, and follow-up communications",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Processed and distributed mail, packages, and other correspondence, but did not coordinate meetings, appointments, or events",
      "severity": "high"
    },
    {
      "requirement": "Experience with database management software, such as Access or SQL Server",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Assisted with data entry, updating databases, and performing other clerical tasks as needed",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Results-driven administrative professional with 2+ years of experience in office settings, proficient in Microsoft Office Suite and possessing strong organizational skills.",
      "supports": "Maintain accurate records and files, both physical and electronic"
    },
    {
      "source": "resume",
      "quote": "Processed and distributed mail, packages, and other correspondence, but did not coordinate meetings, appointments, or events",
      "supports": "Process and distribute mail, packages, and other correspondence"
    },
    {
      "source": "resume",
      "quote": "Provided general office support, including photocopying, scanning, and faxing documents, but did not have certification in medical terminology or a related field",
      "supports": "Provide general office support, such as photocopying, scanning, and faxing documents"
    },
    {
      "source": "resume",
      "quote": "Assisted with data entry, updating databases, and performing other clerical tasks as needed",
      "supports": "Assist with data entry, updating databases, and performing other clerical tasks as needed"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case contains boilerplate language in the resume, which may not accurately reflect the candidate's skills and experience. The analysis JSON output also contains some generic phrases that do not provide sufficient proof to support their inclusion in the matched requirements list.
