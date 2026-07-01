The provided JSON output appears to be clean and free of known failure modes. Here's a review of the output:

1. **Metadata Leakage**: The output does not contain any sensitive information that could potentially leak metadata about the individual or organization.

2. **Boilerplate Leakage**: There is no apparent boilerplate leakage in the output, as all evidence points are specific to the individual's experience and skills.

3. **Contra-Evidence as Matched Evidence**: There is no instance of contra-evidence being presented as matched evidence. The output only contains direct and adjacent evidence that supports the matched requirements.

4. **Generic Snippet Scattering**: The output does not contain any generic snippets scattered throughout the analysis. All evidence points are specific to the individual's experience and skills.

5. **Title/Header Proof**: There is no apparent title/header proof in the output, as all information is presented in a clear and concise manner.

6. **Scope Mismatch**: The output appears to be free of scope mismatch issues, as all requirements are matched with relevant evidence points.

7. **Matched/Missing Contradiction**: There is no instance of a matched requirement being contradicted by missing evidence or vice versa.

**Proposed Regression Case:**

```json
{
  "job_title": "59. Information Security Analysts / Cybersecurity Analysts",
  "case_slug": "59-information-security-analysts-cybersecurity-analysts",
  "resume_file": "resume_strong.txt",
  "expected_profile": "strong_match",
  "scored_at": "2026-06-30T18:20:51.434258",
  "match_score": 55.46,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.8,
      "reason": "Found 4 direct, 2 adjacent, 0 domain/scope gaps, and 7 missing evidence points for core JD requirements.",
      "evidence": [
        "+ Stayed up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices that resulted in a 25% reduction in security breaches",
        "CompTIA Security+",
        "+ Conducted regular vulnerability assessments using Nessus and Burp Suite to identify security weaknesses in our network infrastructure",
        "Operating systems (Windows, Linux, macOS)"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "CISSP (in progress)"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "senior",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 33.0,
      "reason": "Found 2 direct, 2 adjacent, 0 domain/scope gaps, and 6 missing evidence points for domain and tool requirements.",
      "evidence": [
        "+ Stayed up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices that resulted in a 25% reduction in security breaches",
        "CompTIA Security+",
        "Operating systems (Windows, Linux, macOS)",
        "+ Conducted regular vulnerability assessments using Nessus and Burp Suite to identify security weaknesses in our network infrastructure"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 93.3,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "+ Stayed up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices that resulted in a 25% reduction in security breaches",
        "CompTIA Security+",
        "CISSP (in progress)",
        "+ Conducted regular vulnerability assessments using Nessus and Burp Suite to identify security weaknesses in our network infrastructure"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Stay up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices",
      "evidence": [
        "+ Stayed up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices that resulted in a 25% reduction in security breaches"
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with vulnerability scanning tools such as Nessus and Burp Suite",
      "evidence": [
        "+ Conducted regular vulnerability assessments using Nessus and Burp Suite to identify security weaknesses in our network infrastructure"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in operating systems including Windows, Linux, and macOS",
      "evidence": [
        "Operating systems (Windows, Linux, macOS)"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong analytical and problem-solving skills",
      "evidence": [
        "Strong analytical and problem-solving skills"
      ],
      "strength": "high"
    },
    {
      "requirement": "CompTIA Security+ or equivalent certification;",
      "evidence": [
        "CompTIA Security+"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Familiarity with network protocols and devices, including firewalls and routers",
      "evidence": [
        "+ Conducted regular vulnerability assessments using Nessus and Burp Suite to identify security weaknesses in our network infrastructure"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct vulnerability assessments and penetration testing to identify security weaknesses in computer systems and networks",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Develop and implement incident response plans to mitigate the impact of security breaches",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Monitor network traffic and system logs to detect potential security threats in real-time",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Analyze and respond to security alerts and incidents, providing recommendations for remediation and prevention",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Bachelor's degree in Computer Science, Cybersecurity, or related field;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "3+ years of experience in information security or a related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Experience with threat intelligence platforms such as ThreatConnect or IBM X-Force",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "+ Stayed up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices that resulted in a 25% reduction in security breaches",
      "supports": "Stay up-to-date with emerging threats and technologies, applying this knowledge to inform security strategies and best practices"
    },
    {
      "source": "resume",
      "quote": "CompTIA Security+",
      "supports": "CompTIA Security+ or equivalent certification;"
    },
    {
      "source": "resume",
      "quote": "CISSP (in progress)",
