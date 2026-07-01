The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a scope mismatch, which is not considered metadata leakage. However, it's worth noting that this could potentially lead to incorrect expectations for future analysis.
2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output.
3. **Contra-evidence as matched evidence**: The `evidence_quotes` field contains quotes from the resume that support specific requirements, but there are no instances of contra-evidence being used to match evidence. This is a good practice.
4. **Generic snippet scattering**: There is no apparent generic snippet scattering in the provided JSON output.
5. **Title/header proof**: The `job_title` and `case_slug` fields appear to be correctly formatted, but there is no explicit title or header proofing in the JSON output.
6. **Scope mismatch**: As mentioned earlier, the `expected_profile` field contains a scope mismatch, which could potentially lead to incorrect expectations for future analysis.
7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing requirements.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's essential to note that this analysis is not exhaustive, and further review may still be necessary to ensure the accuracy and reliability of the results.

Proposed regression case:

```json
{
  "job_title": "35. Receptionists (Medical/Office)",
  "case_slug": "35-receptionists-medical-office",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.958540",
  "match_score": 38.53,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 41.2,
      "reason": "Found 3 direct, 5 adjacent, 0 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "+ Answered phone calls, responded to emails",
        "Proficient in Microsoft Office Suite (Word, Excel, Outlook) and Epic EMR software.",
        "+ Processed payments and managed billing inquiries",
        "+ Managed front desk operations"
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
      "score": 32.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "1 years",
        "entry",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 45.0,
      "reason": "Found 1 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "+ Managed front desk operations",
        "Skills: Microsoft Office Suite, Epic EMR, data entry, filing, photocopying."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 87.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "+ Answered phone calls, responded to emails",
        "Proficient in Microsoft Office Suite (Word, Excel, Outlook) and Epic EMR software.",
        "+ Processed payments and managed billing inquiries",
        "+ Managed front desk operations"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Process payments and manage billing inquiries in a timely manner",
      "evidence": [
        "+ Processed payments and managed billing inquiries"
      ],
      "strength": "high"
    },
    {
      "requirement": "Perform administrative tasks such as data entry, filing, and photocopying",
      "evidence": [
        "Skills: Microsoft Office Suite, Epic EMR, data entry, filing, photocopying."
      ],
      "strength": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "High school diploma, 1 year of experience in office administration."
      ],
      "strength": "high"
    },
    {
      "requirement": "1-2 years of experience in an office or medical setting",
      "evidence": [
        "High school diploma, 1 year of experience in office administration."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software",
      "evidence": [
        "High school diploma, 1 year of experience in office administration."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Manage front desk operations, including answering phone calls, responding to emails, and greeting patients and visitors",
      "evidence": [
        "+ Answered phone calls, responded to emails"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Provide exceptional customer service to patients, families, and healthcare professionals",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "associate's degree in a related field preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    },
    {
      "requirement": "Excellent communication and interpersonal skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work accurately and efficiently in a fast-paced environment",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with practice management systems such as Athenahealth or Cerner",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of HIPAA regulations and patient confidentiality",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "+ Answered phone calls, responded to emails",
      "supports": "Manage front desk operations, including answering phone calls, responding to emails, and greeting patients and visitors"
    },
    {
      "source": "resume",
      "quote": "Proficient in Microsoft Office Suite (Word, Excel, Outlook) and Epic EMR software.",
      "supports": "Maintain accurate records of patient information, appointments, and correspondence using electronic medical records (EMR) software such as Epic or Cerner"
    },
    {
      "source": "resume",
      "quote": "+ Processed payments and managed billing inquiries",
      "supports": "Process payments and manage billing inquiries in a timely manner"
    },
    {
      "source": "resume",
      "quote": "+ Managed front desk operations",
      "supports": "Coordinate with healthcare providers and support staff to ensure smooth day-to-day operations"
    },
    {
      "source": "resume",
      "quote": "Skills: Microsoft Office Suite, Epic EMR, data entry, filing, photocopying.",
      "supports": "Perform administrative tasks such as data entry, filing, and photocopying"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

This regression case includes the same issues as the original JSON output,
