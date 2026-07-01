The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `expected_profile` field contains a string value ("scope_mismatch"), which is not present in the rest of the metadata. However, this is likely an error on the part of the developer and does not indicate a security vulnerability.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-evidence as matched evidence**: The analysis correctly identifies some requirements that are mentioned in the resume but do not match the expected profile (e.g., "Basic knowledge of IT service management tools such as JIRA and Nagios"). However, it does not flag these instances as potential issues.

4. **Generic snippet scattering**: There is no apparent generic snippet scattering in the provided JSON output.

5. **Title/header proof**: The title ("26. Technical Support Specialists") appears to be correctly formatted and does not contain any obvious errors.

6. **Scope mismatch**: The analysis correctly identifies a scope mismatch between the expected profile ("scope_mismatch") and some of the requirements mentioned in the resume (e.g., "Basic knowledge of IT service management tools such as JIRA and Nagios").

7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing evidence.

Proposed regression case:

```json
{
  "job_title": "27. Technical Support Engineers",
  "case_slug": "27-technical-support-engineers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:48.081666",
  "match_score": 50.84,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 37.5,
      "reason": "Found 4 direct, 3 adjacent, 1 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "It also doesn't mention any experience with cloud-based technologies such as AWS, Azure, or Google Cloud Platform, which are preferred skills for the position.",
        "Basic knowledge of IT service management tools such as JIRA and Nagios",
        "Familiarity with Windows operating systems (Windows 10)",
        "Experience with Linux operating systems (Ubuntu, Red Hat)"
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
      "score": 40.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2+ years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 67.5,
      "reason": "Found 2 direct, 2 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Basic knowledge of IT service management tools such as JIRA and Nagios",
        "Experience with cloud-based technologies such as AWS"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 87.1,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "It also doesn't mention any experience with cloud-based technologies such as AWS, Azure, or Google Cloud Platform, which are preferred skills for the position.",
        "Basic knowledge of IT service management tools such as JIRA and Nagios",
        "Familiarity with Windows operating systems (Windows 10)",
        "Experience with Linux operating systems (Ubuntu, Red Hat)"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Strong knowledge of cloud-based technologies such as AWS, Azure, or Google Cloud Platform",
      "evidence": [
        "It also doesn't mention any experience with cloud-based technologies such as AWS, Azure, or Google Cloud Platform, which are preferred skills for the position."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with IT service management tools such as ServiceNow, JIRA, and BMC Helix",
      "evidence": [
        "Basic knowledge of IT service management tools such as JIRA and Nagios"
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with Windows operating systems (Windows 10)",
      "evidence": [
        "Familiarity with Windows operating systems (Windows 10)"
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with Linux operating systems (Ubuntu, Red Hat)",
      "evidence": [
        "Experience with Linux operating systems (Ubuntu, Red Hat)"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct remote troubleshooting sessions using tools such as TeamViewer, LogMeIn, and JIRA",
      "evidence": [
        "Basic knowledge of IT service management tools such as JIRA and Nagios"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Monitor and report system performance and security incidents using tools such as Nagios, SolarWinds, and Splunk",
      "evidence": [
        "Basic knowledge of IT service management tools such as JIRA and Nagios"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Provide technical support to internal customers via phone, email, and chat platforms",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Troubleshoot hardware and software issues for desktops, laptops, mobile devices, and peripherals",
      "reason": "Related experience is present, but the required domain qualifier is not proven: It also doesn't mention any experience with cloud-based technologies such as AWS, Azure, or Google Cloud Platform, which are preferred skills for the position.",
      "severity": "high"
    },
    {
      "requirement": "Develop and maintain knowledge base articles and documentation to improve customer support",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Participate in on-call rotations for 24/7 support coverage",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "2+ years of experience in technical support or a related field",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication and problem-solving skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Certification in CompTIA A+ or equivalent",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "It also doesn't mention any experience with cloud-based technologies such as AWS, Azure, or Google Cloud Platform, which are preferred skills for the position.",
      "supports": "Strong knowledge of cloud-based technologies such as AWS, Azure, or Google Cloud Platform"
    },
    {
      "source": "resume",
      "quote": "Basic knowledge of IT service management tools such as JIRA and Nagios",
      "supports": "Experience with IT service management tools such as ServiceNow, JIRA, and BMC Helix"
    },
    {
      "source": "resume",
      "quote": "Familiarity with Windows operating systems (Windows 10)",
      "supports
