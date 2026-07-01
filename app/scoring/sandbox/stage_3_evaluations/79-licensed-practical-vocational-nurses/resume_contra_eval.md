The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `resume_file` field contains a specific file name (`resume_contra.txt`) that may indicate potential metadata leakage. However, without further context or information about how this file is used, it's difficult to determine if this is a significant issue.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains several requirements with contra-evidence instead of affirmative proof. However, these are correctly identified as missing requirements and do not appear to be matched evidence.

4. **Generic snippet scattering**: There is no apparent generic snippet scattering in the provided JSON output.

5. **Title/header proof**: The title (`79. Licensed Practical/Vocational Nurses`) appears to be a valid job title, but it's unclear if this is sufficient for header proofing.

6. **Scope mismatch**: The `expected_profile` field matches the `case_slug`, which suggests that there may be some scope mismatch. However, without further context or information about how these fields are used, it's difficult to determine if this is a significant issue.

7. **Matched/missing contradiction**: There appears to be no matched/missing contradiction in the provided JSON output.

Proposed regression case:

```json
{
  "job_title": "123. Software Engineer",
  "case_slug": "123-software-engineer",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "software_engineer",
  "scored_at": "2026-06-29T20:51:24.331147",
  "match_score": 33.43,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 21.4,
      "reason": "Found 3 direct, 0 adjacent, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "* Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
        "* Developed and implemented individualized care plans for patients with complex medical needs, but did not have experience working with patients requiring dialysis or ventilator care.",
        "* Educated patients and families on disease management, self-care techniques, and medication adherence, but was not certified in wound care or other specialized areas of practice.",
        "* Maintained accurate and up-to-date patient records, including progress notes and medication administration records, despite struggling with electronic medical record systems."
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
      "score": 21.4,
      "reason": "Found 3 direct, 0 adjacent, and 4 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
        "* Developed and implemented individualized care plans for patients with complex medical needs, but did not have experience working with patients requiring dialysis or ventilator care.",
        "* Educated patients and families on disease management, self-care techniques, and medication adherence, but was not certified in wound care or other specialized areas of practice.",
        "* Maintained accurate and up-to-date patient records, including progress notes and medication administration records, despite struggling with electronic medical record systems."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 43.6,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
        "* Developed and implemented individualized care plans for patients with complex medical needs, but did not have experience working with patients requiring dialysis or ventilator care.",
        "* Educated patients and families on disease management, self-care techniques, and medication adherence, but was not certified in wound care or other specialized areas of practice.",
        "* Maintained accurate and up-to-date patient records, including progress notes and medication administration records, despite struggling with electronic medical record systems."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Educate patients and families on disease management, self-care techniques, and medication adherence",
      "evidence": [
        "* Educated patients and families on disease management, self-care techniques, and medication adherence, but was not certified in wound care or other specialized areas of practice."
      ],
      "strength": "high"
    },
    {
      "requirement": "Maintain accurate and up-to-date patient records, including progress notes and medication administration records",
      "evidence": [
        "* Maintained accurate and up-to-date patient records, including progress notes and medication administration records, despite struggling with electronic medical record systems."
      ],
      "strength": "high"
    },
    {
      "requirement": "Certification in wound care or other specialized areas of practice",
      "evidence": [
        "* Educated patients and families on disease management, self-care techniques, and medication adherence, but was not certified in wound care or other specialized areas of practice."
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Provide direct patient care under the supervision of a registered nurse, including administering medications, performing vital signs, and providing wound care",
      "reason": "Resume contains boilerplate leakage: * Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement individualized care plans for patients with complex medical needs, such as diabetes, hypertension, or chronic pain management",
      "reason": "Resume contains boilerplate leakage: * Developed and implemented individualized care plans for patients with complex medical needs, but did not have experience working with patients requiring dialysis or ventilator care.",
      "severity": "high"
    },
    {
      "requirement": "Conduct routine assessments to identify changes in patient condition and report findings to the registered nurse",
      "reason": "Resume contains boilerplate leakage: * Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
      "severity": "high"
    },
    {
      "requirement": "Current licensure as a Licensed Practical/Vocational Nurse (LPN) or Licensed Vocational Nurse (LVN)",
      "reason": "Resume contains boilerplate leakage: * Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
      "severity": "high"
    },
    {
      "requirement": "Valid CPR certification",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Basic life support skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Conducted routine assessments to identify changes in patient condition, but was not able to report findings to the registered nurse due to lack of communication skills.",
      "supports": "Provide direct patient care under the supervision of a registered nurse, including administering medications, performing vital signs, and providing wound care"
    },
    {
      "source": "resume",
      "quote": "* Developed and implemented individualized care plans for patients with complex medical needs, but did not have experience working with patients requiring dialysis
