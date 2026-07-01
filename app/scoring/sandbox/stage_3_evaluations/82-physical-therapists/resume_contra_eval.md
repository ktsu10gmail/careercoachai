Overall, the analysis JSON output appears to be clean. However, I do identify a few potential issues that could be considered failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate text that seems to be repeated throughout the document. This could indicate a lack of customization or originality in the candidate's experience and skills.

2. **Generic snippet scattering**: The presence of generic snippets, such as "Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program," appears multiple times in the resume. While these snippets may be relevant to the job description, their repetition could indicate a lack of specificity or originality in the candidate's experience and skills.

3. **Title/header proof**: The title of the analysis JSON output ("82. Physical Therapists") seems to match the job title provided in the input data. However, this is not necessarily an issue, as it suggests that the system is correctly extracting relevant information from the input data.

4. **Scope mismatch**: There does not appear to be any obvious scope mismatch between the analysis JSON output and the input data.

5. **Matched/missing contradiction**: The presence of matched evidence for some requirements (e.g., "Master's degree in physical therapy from an accredited program") but missing or contradictory evidence for others (e.g., "Current licensure to practice physical therapy in [state/province]") suggests that there may be some inconsistencies or gaps in the candidate's experience and skills.

6. **Contra-evidence as matched evidence**: The presence of contra-evidence (e.g., "While I am familiar with standardized assessment tools like the FIM and MDS-2, my proficiency in using electronic medical records (EMRs) is limited to basic documentation.") alongside matched evidence for some requirements suggests that there may be some inconsistencies or gaps in the candidate's experience and skills.

7. **Metadata leakage**: There does not appear to be any metadata leakage in this analysis JSON output.

Proposed regression case:

```json
{
  "job_title": "83. Physical Therapists",
  "case_slug": "83-physical-therapists",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:24.647627",
  "match_score": 50.48,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 43.6,
      "reason": "Found 3 direct, 8 adjacent, and 0 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w",
        "Here's a contra-evidence resume snippet for the 83. Physical Therapist job:",
        "While I am familiar with standardized assessment tools like the FIM and MDS-2, my proficiency in using electronic medical records (EMRs) is limited to basic documentation. I also lack certification in orthopedic manual therapy or pain manag",
        "In my previous role, I successfully educated patients on proper exercise techniques and home safety modifications, but have not had the opportunity to work with pediatric or geriatric populations. Despite this, I remain committed to deliver"
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
      "score": 45.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": []
    },
    {
      "category": "Domain and tools fit",
      "score": 43.6,
      "reason": "Found 3 direct, 8 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w",
        "Here's a contra-evidence resume snippet for the 83. Physical Therapist job:",
        "While I am familiar with standardized assessment tools like the FIM and MDS-2, my proficiency in using electronic medical records (EMRs) is limited to basic documentation. I also lack certification in orthopedic manual therapy or pain manag",
        "In my previous role, I successfully educated patients on proper exercise techniques and home safety modifications, but have not had the opportunity to work with pediatric or geriatric populations. Despite this, I remain committed to deliver"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w",
        "Here's a contra-evidence resume snippet for the 83. Physical Therapist job:",
        "While I am familiar with standardized assessment tools like the FIM and MDS-2, my proficiency in using electronic medical records (EMRs) is limited to basic documentation. I also lack certification in orthopedic manual therapy or pain manag",
        "In my previous role, I successfully educated patients on proper exercise techniques and home safety modifications, but have not had the opportunity to work with pediatric or geriatric populations. Despite this, I remain committed to deliver"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Master's degree in physical therapy from an accredited program",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w"
      ],
      "strength": "high"
    },
    {
      "requirement": "Current licensure to practice physical therapy in [state/province]",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong communication and interpersonal skills",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement individualized physical therapy plans to improve mobility, strength, and function",
      "evidence": [
        "Here's a contra-evidence resume snippet for the 83. Physical Therapist job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Conduct patient assessments to identify and prioritize treatment goals",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Provide hands-on interventions, including exercises, stretches, and manual therapies, to patients with various orthopedic and neurological conditions",
      "evidence": [
        "\"Results-oriented physical therapist with a Master's degree in physical therapy from an accredited program, seeking to leverage my strong communication and interpersonal skills to drive patient outcomes. Proven ability to work effectively w"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Document patient information in electronic medical records (EMRs) using standardized assessment tools, such as the FIM and MDS-2",
      "reason": "Resume contains contra-evidence instead of affirmative proof: While I am familiar with standardized assessment tools like the FIM and MDS-2, my proficiency in using electronic medical records (EMRs) is limited to basic documentation. I also lack certification
