The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata Leakage**: The output does not contain any sensitive information that could potentially leak metadata.

2. **Boilerplate Leakage**: There is no boilerplate content in the output that could indicate leakage.

3. **Contra-Evidence as Matched Evidence**: The output correctly distinguishes between matched and contra-evidence, with each requirement having a clear evidence source.

4. **Generic Snippet Scattering**: The output does not contain generic snippets scattered throughout the analysis. Each piece of evidence is clearly tied to a specific requirement or category.

5. **Title/Header Proof**: The title and header are correctly formatted and do not appear to be proofed.

6. **Scope Mismatch**: There appears to be no scope mismatch between the JD requirements and the matched evidence.

7. **Matched/Missing Contradiction**: The output does not contain any contradictions between matched and missing requirements.

**Proposed Regression Case:**

```json
{
  "job_title": "35. Receptionists (Medical/Office)",
  "case_slug": "35-receptionists-medical-office",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-30T18:20:48.933875",
  "match_score": 87.13,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 63.8,
      "reason": "Found 6 direct, 4 adjacent, 0 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Highly organized and detail-oriented receptionist with 2+ years of experience in managing front desk operations, ensuring seamless patient flow, and providing exceptional customer service.",
        "Demonstrated proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software, streamlining administrative tasks such as data entry, filing, and photocopying."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 100.0,
      "reason": "Found 1 direct, 0 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Associate's degree in Business Administration, XYZ College (20XX-20XX)"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 99.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years",
        "staff",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 100.0,
      "reason": "Found 3 direct, 0 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Coordinated with healthcare providers and support staff to ensure smooth day-to-day operations, improving overall efficiency by 25%."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Highly organized and detail-oriented receptionist with 2+ years of experience in managing front desk operations, ensuring seamless patient flow, and providing exceptional customer service."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Maintain accurate records of patient information, appointments, and correspondence using electronic medical records (EMR) software such as Epic or Cerner",
      "evidence": [
        "Demonstrated proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software, streamlining administrative tasks such as data entry, filing, and photocopying."
      ],
      "strength": "high"
    },
    {
      "requirement": "Process payments and manage billing inquiries in a timely manner",
      "evidence": [
        "Processed payments and resolved billing inquiries in a timely manner, resulting in a 95% satisfaction rate from patients and families."
      ],
      "strength": "high"
    },
    {
      "requirement": "Coordinate with healthcare providers and support staff to ensure smooth day-to-day operations",
      "evidence": [
        "Coordinated with healthcare providers and support staff to ensure smooth day-to-day operations, improving overall efficiency by 25%."
      ],
      "strength": "high"
    },
    {
      "requirement": "Perform administrative tasks such as data entry, filing, and photocopying",
      "evidence": [
        "Demonstrated proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software, streamlining administrative tasks such as data entry, filing, and photocopying."
      ],
      "strength": "high"
    },
    {
      "requirement": "Provide exceptional customer service to patients, families, and healthcare professionals",
      "evidence": [
        "Provided exceptional customer service to patients, families, and healthcare professionals, resulting in a 4.5-star rating on patient satisfaction surveys."
      ],
      "strength": "high"
    },
    {
      "requirement": "Associate's degree in a related field preferred",
      "evidence": [
        "Associate's degree in Business Administration, XYZ College (20XX-20XX)"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "High school diploma or equivalent required;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
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
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Highly organized and detail-oriented receptionist with 2+ years of experience in managing front desk operations, ensuring seamless patient flow, and providing exceptional customer service.",
      "supports": "Manage front desk operations, including answering phone calls, responding to emails, and greeting patients and visitors"
    },
    {
      "source": "resume",
      "quote": "Demonstrated proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software, streamlining administrative tasks such as data entry, filing, and photocopying.",
      "supports": "Maintain accurate records of patient information, appointments, and correspondence using electronic medical records (EMR) software such as Epic or Cerner"
    },
    {
      "source": "resume",
      "quote": "Processed payments and resolved billing inquiries in a timely manner, resulting in a 95% satisfaction rate from patients and families.",
      "supports": "Process payments and manage billing inquiries in a timely manner"
    },
    {
      "source": "resume",
      "quote": "Coordinated with healthcare providers and support staff to ensure smooth day-to-day operations, improving overall efficiency by 25%.",
      "supports": "Coordinate with healthcare providers and support staff to ensure smooth day-to-day operations"
    },
    {
      "source": "resume",
      "quote": "Demonstrated proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software, streamlining administrative tasks such as data entry, filing, and photocopying.",
      "supports": "Perform administrative tasks such as data entry, filing, and photocopying"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

The proposed regression case introduces a new requirement ("High school diploma or equivalent required") that is missing from the original output. This requirement should be added to the analysis, along with specific evidence and
