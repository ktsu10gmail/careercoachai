Overall, the analysis JSON output appears to be clean. However, I do have some concerns regarding a few potential failure modes.

1. **Metadata Leakage**: The `expected_profile` field contains "contra_evidence", which seems out of place in this context. It's likely that this was an error on the part of the developer or tester. To fix this, consider removing or replacing this field with a more relevant value.
2. **Boilerplate Leakage**: The presence of boilerplate text ("Here's a contra-evidence resume snippet for the 85. Dental Hygienists job:") in multiple places throughout the output suggests that there may be some leakage of generic content into the analysis. To mitigate this, consider using more specific and relevant language throughout the output.
3. **Contra-Evidence as Matched Evidence**: In several cases, the analysis incorrectly matches evidence points with requirements due to the presence of contra-evidence. For example, in the "Develop and implement treatment plans for patients with dental caries, gum disease, and other oral health issues" requirement, the analysis incorrectly matches the requirement with the evidence point "* Developed and implemented treatment plans for patients with dental caries, but often relied on colleagues for guidance". To fix this, consider using more nuanced matching logic that takes into account both affirmative and negative evidence.
4. **Generic Snippet Scattering**: The presence of generic snippets throughout the output (e.g., "Here's a contra-evidence resume snippet for the 85. Dental Hygienists job:") suggests that there may be some scattering of generic content into the analysis. To mitigate this, consider using more specific and relevant language throughout the output.
5. **Title/Header Proof**: The title/header section appears to be well-formatted and free of errors.

6. **Scope Mismatch**: There doesn't appear to be any obvious scope mismatch in this particular output.

7. **Matched/Missing Contradiction**: There doesn't appear to be any obvious matched/missing contradiction in this particular output.

Proposed Regression Case:

```json
{
  "job_title": "86. Dental Hygienists",
  "case_slug": "86-dental-hygienists",
  "resume_file": "resume_contra.txt",
  "expected_profile": "affirmative_evidence",
  "scored_at": "2026-06-29T20:51:24.866503",
  "match_score": 39.02,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 26.4,
      "reason": "Found 2 direct, 4 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "* Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)",
        "* Provided personalized oral hygiene instructions and demonstrations to patients, but did not consistently implement periodontal treatments as needed",
        "* Developed and implemented treatment plans for patients with dental caries, but often relied on colleagues for guidance",
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
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
        "entry",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 26.4,
      "reason": "Found 2 direct, 4 adjacent, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)",
        "* Provided personalized oral hygiene instructions and demonstrations to patients, but did not consistently implement periodontal treatments as needed",
        "* Developed and implemented treatment plans for patients with dental caries, but often relied on colleagues for guidance",
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 72.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)",
        "* Provided personalized oral hygiene instructions and demonstrations to patients, but did not consistently implement periodontal treatments as needed",
        "* Developed and implemented treatment plans for patients with dental caries, but often relied on colleagues for guidance",
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and implement treatment plans for patients with dental caries, gum disease, and other oral health issues",
      "evidence": [
        "* Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)"
      ],
      "strength": "high"
    },
    {
      "requirement": "Maintain accurate and up-to-date patient records, including medical and dental histories",
      "evidence": [
        "* Maintained accurate and up-to-date patient records, but frequently experienced errors in data entry and record-keeping."
      ],
      "strength": "high"
    },
    {
      "requirement": "Educate patients on the importance of regular dental check-ups and preventative care",
      "evidence": [
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Associate's degree in dental hygiene from an accredited program",
      "evidence": [
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Current licensure as a registered dental hygienist (RDH) in the state where you practice",
      "evidence": [
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Knowledge of dental materials and equipment, including ultrasonic scalers and air polisher units",
      "evidence": [
        "Here's an affirmative evidence resume snippet for the 86. Dental Hygienists job:"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases",
      "reason": "Resume contains affirmative evidence instead of negative proof: * Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)",
      "severity": "high"
    },
    {
      "requirement": "Provide personalized oral hygiene instructions and demonstrations to patients, including proper brushing and flossing techniques",
      "reason": "Resume contains affirmative evidence instead of negative proof: * Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed comprehensive treatment plans for patients with complex cases)",
      "severity": "high"
    },
    {
      "requirement": "Administer local anesthetics and perform periodontal treatments as needed",
      "reason": "Resume contains affirmative evidence instead of negative proof: * Provided personalized oral hygiene instructions and demonstrations to patients, but did not consistently implement periodontal treatments as needed",
      "severity": "high"
    },
    {
      "requirement": "Take and develop radiographs (x-rays) of patients' teeth and gums",
      "reason": "Resume contains affirmative evidence instead of negative proof: * Conducted thorough dental examinations, including visual inspections of teeth and gums, to identify signs of oral diseases (Note: Developed
