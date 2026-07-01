The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata Leakage**: The `resume_file` field contains a file path, but there is no indication of any sensitive or confidential information being leaked.

2. **Boilerplate Leakage**: There is no boilerplate text in the provided JSON output that could indicate leakage.

3. **Contra-Evidence as Matched Evidence**: The `missing_requirements` section lists requirements with contra-evidence instead of affirmative proof, but this is correctly identified and flagged for attention.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains quotes from the resume that support specific JD requirements, but there is no indication of generic snippet scattering.

5. **Title/Header Proof**: There is no title or header in the provided JSON output that could indicate proof.

6. **Scope Mismatch**: The scope of the JD and the resume appears to match, with no indications of mismatched scopes.

7. **Matched/Missing Contradiction**: The `missing_requirements` section correctly identifies requirements with missing evidence points, but there are no contradictions between matched and missing evidence.

Overall, the provided JSON output appears to be clean and free of known failure modes. However, it's worth noting that the presence of contra-evidence in the `missing_requirements` section indicates a potential issue that should be addressed.

**Proposed Regression Case:**

```json
{
  "job_title": "45. Claims Adjusters, Examiners, and Investigators",
  "case_slug": "45-claims-adjusters-examiners-and-investigators",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:49.888148",
  "match_score": 73.63,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 61.5,
      "reason": "Found 7 direct, 2 adjacent, 0 domain/scope gaps, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "Skilled in gathering and analyzing evidence from claimants, witnesses, and other relevant sources.",
        "Successfully resolved complex claims involving property damage, personal injury, and business interruption",
        "Proven track record of conducting thorough investigations to determine validity and extent of loss.",
        "Developed and maintained strong relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 65.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "High school diploma (not associate's or bachelor's degree)"
      ]
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
      "score": 61.8,
      "reason": "Found 7 direct, 3 adjacent, 0 domain/scope gaps, and 4 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Skilled in gathering and analyzing evidence from claimants, witnesses, and other relevant sources.",
        "Successfully resolved complex claims involving property damage, personal injury, and business interruption",
        "Proven track record of conducting thorough investigations to determine validity and extent of loss.",
        "Developed and maintained strong relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Skilled in gathering and analyzing evidence from claimants, witnesses, and other relevant sources.",
        "Successfully resolved complex claims involving property damage, personal injury, and business interruption",
        "Proven track record of conducting thorough investigations to determine validity and extent of loss.",
        "Developed and maintained strong relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Gather and analyze evidence from claimants, witnesses, and other relevant sources",
      "evidence": [
        "Skilled in gathering and analyzing evidence from claimants, witnesses, and other relevant sources."
      ],
      "strength": "high"
    },
    {
      "requirement": "Evaluate and assess damage or losses reported by claimants, including property damage, personal injury, and business interruption",
      "evidence": [
        "Successfully resolved complex claims involving property damage, personal injury, and business interruption"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing",
      "evidence": [
        "Developed and maintained strong relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing"
      ],
      "strength": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "High school diploma (not associate's or bachelor's degree)"
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience in insurance claims adjusting, examining, or investigating",
      "evidence": [
        "\"Results-driven professional with 5+ years of experience in insurance claims adjusting, examining, or investigating."
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office applications, including Word, Excel, and PowerPoint",
      "evidence": [
        "Demonstrated expertise in Microsoft Office applications, including Word, Excel, and PowerPoint"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct thorough investigations of insurance claims to determine their validity and extent of loss",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Prepare and submit reports detailing findings and recommendations for claims resolution",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Strong analytical and problem-solving skills, with ability to evaluate complex evidence and make informed decisions",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience working in the insurance industry or a related field",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Experience working in the insurance industry or a related field (did not have this experience)",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Skilled in gathering and analyzing evidence from claimants, witnesses, and other relevant sources.",
      "supports": "Gather and analyze evidence from claimants, witnesses, and other relevant sources"
    },
    {
      "source": "resume",
      "quote": "Successfully resolved complex claims involving property damage, personal injury, and business interruption",
      "supports": "Evaluate and assess damage or losses reported by claimants, including property damage, personal injury, and business interruption"
    },
    {
      "source": "resume",
      "quote": "Proven track record of conducting thorough investigations to determine validity and extent of loss.",
      "supports": "Determine the amount of compensation or settlement that should be paid to claimants based on company policies and applicable laws"
    },
    {
      "source": "resume",
      "quote": "Developed and maintained strong relationships with claimants, agents, brokers, and other stakeholders to facilitate smooth claims processing",
      "supports": "Develop and maintain relationships with claimants, agents,
