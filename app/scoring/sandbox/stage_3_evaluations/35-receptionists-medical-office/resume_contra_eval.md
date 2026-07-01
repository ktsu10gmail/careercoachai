Overall, the analysis JSON output appears to be clean. However, I do identify a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate phrases such as "Results-driven receptionist with 2+ years of experience in fast-paced medical offices" and "Proficient in Microsoft Office Suite and Epic EMR software, with a strong focus on data entry accuracy (95% or higher)". While these phrases may be relevant to the job title, they could be considered boilerplate and might not provide unique insights into the candidate's qualifications.

2. **Generic snippet scattering**: The evidence quotes contain generic phrases such as "Notably" and "Despite this". These phrases are not specific enough to provide concrete evidence of the candidate's skills or experience.

3. **Title/header proof**: The title of the analysis JSON output is "35. Receptionists (Medical/Office)", which seems to be a direct copy from the resume file. This could be considered as a lack of originality in the analysis output.

4. **Scope mismatch**: The missing requirements section lists several requirements that are not present in the JD, such as "Manage front desk operations" and "Experience with practice management systems". However, these requirements might be related to other job titles or industries.

5. **Matched/missing contradiction**: The evidence quotes contain a mix of affirmative and negative statements about the candidate's experience. For example, the quote "Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner" suggests that the candidate lacks experience in this area, but the same quote is also used as evidence for the requirement "Process payments and manage billing inquiries in a timely manner". This could be considered as a contradiction.

Proposed regression case:

```json
{
  "job_title": "35. Receptionists (Medical/Office)",
  "case_slug": "35-receptionists-medical-office",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:48.905681",
  "match_score": 38.95,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 28.1,
      "reason": "Found 1 direct, 5 adjacent, 0 domain/scope gaps, and 7 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices.",
        "Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner, as my previous role focused more on administrative tasks such as filing and photocopying.",
        "Proficient in Microsoft Office Suite and Epic EMR software, with a strong focus on data entry accuracy (95% or higher).",
        "Despite this, I remain committed to delivering exceptional customer service and ensuring seamless day-to-day operations.\""
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
      "score": 68.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years",
        "entry"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 45.0,
      "reason": "Found 1 direct, 1 adjacent, 0 domain/scope gaps, and 1 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner, as my previous role focused more on administrative tasks such as filing and photocopying.",
        "Proficient in Microsoft Office Suite and Epic EMR software, with a strong focus on data entry accuracy (95% or higher).",
        "Despite this, I remain committed to delivering exceptional customer service and ensuring seamless day-to-day operations.\""
      ]
    },
    {
      "category": "Evidence quality",
      "score": 65.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices.",
        "Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner, as my previous role focused more on administrative tasks such as filing and photocopying.",
        "Proficient in Microsoft Office Suite and Epic EMR software, with a strong focus on data entry accuracy (95% or higher).",
        "Despite this, I remain committed to delivering exceptional customer service and ensuring seamless day-to-day operations.\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Perform administrative tasks such as data entry, filing, and photocopying",
      "evidence": [
        "Proficient in Microsoft Office Suite and Epic EMR software, with a strong focus on data entry accuracy (95% or higher)."
      ],
      "strength": "high"
    },
    {
      "requirement": "1-2 years of experience in an office or medical setting",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, Outlook) and electronic medical records (EMR) software",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Ability to work accurately and efficiently in a fast-paced environment",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Maintain accurate records of patient information, appointments, and correspondence using electronic medical records (EMR) software such as Epic or Cerner",
      "evidence": [
        "\"Results-driven receptionist with 2+ years of experience in fast-paced medical offices."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Provide exceptional customer service to patients, families, and healthcare professionals",
      "evidence": [
        "Despite this, I remain committed to delivering exceptional customer service and ensuring seamless day-to-day operations.\""
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage front desk operations, including answering phone calls, responding to emails, and greeting patients and visitors",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Process payments and manage billing inquiries in a timely manner",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner, as my previous role focused more on administrative tasks such as filing and photocopying.",
      "severity": "high"
    },
    {
      "requirement": "Coordinate with healthcare providers and support staff to ensure smooth day-to-day operations",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Notably, I have not had the opportunity to coordinate complex billing inquiries or process payments in a timely manner, as my previous role focused more on administrative tasks such as filing and photocopying.",
      "severity": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "associate's degree in a related field preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
