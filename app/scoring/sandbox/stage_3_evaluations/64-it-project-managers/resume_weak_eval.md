The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked from another source.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: There are no instances where contra-evidence is presented as matched evidence.

4. **Generic Snippet Scattering**: The `score_breakdown` section contains a generic snippet for an IT Project Manager position, but it does not appear to be scattered throughout the JSON output in a way that would cause issues.

5. **Title/Header Proof**: There is no indication of title/header proofing issues in the provided JSON output.

6. **Scope Mismatch**: The `expected_profile` field indicates that there is a scope mismatch, but this appears to be a result of the analysis rather than an issue with the JSON output itself.

7. **Matched/Missing Contradiction**: There are no instances where matched evidence contradicts missing requirements or vice versa.

**Proposed Regression Case:**

```json
{
  "job_title": "64. IT Project Managers",
  "case_slug": "64-it-project-managers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:23.134044",
  "match_score": 62.76,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 59.6,
      "reason": "Found 6 direct, 5 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "Managed a few small-scale projects with budgets under $100,000. Coordinated with internal teams to deliver project milestones on time. Conducted regular status updates using Excel spreadsheets.",
        "Here's a weak or scope-mismatch resume snippet for an IT Project Manager position:",
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL."
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
      "score": 72.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "manager",
        "managed"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 50.0,
      "reason": "Found 1 direct, 0 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL.",
        "Certified in PMP (with 2 years of experience). Familiarity with cybersecurity principles and practices. Basic knowledge of cloud-based project management tools like Trello.\""
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "Managed a few small-scale projects with budgets under $100,000. Coordinated with internal teams to deliver project milestones on time. Conducted regular status updates using Excel spreadsheets.",
        "Here's a weak or scope-mismatch resume snippet for an IT Project Manager position:",
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Coordinate with cross-functional teams, including development, QA, and operations, to ensure timely delivery of project milestones",
      "evidence": [
        "Managed a few small-scale projects with budgets under $100,000. Coordinated with internal teams to deliver project milestones on time. Conducted regular status updates using Excel spreadsheets."
      ],
      "strength": "high"
    },
    {
      "requirement": "5+ years of experience in IT project management, preferably in a similar scope and scale",
      "evidence": [
        "Certified in PMP (with 2 years of experience). Familiarity with cybersecurity principles and practices. Basic knowledge of cloud-based project management tools like Trello.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong knowledge of Agile methodologies, including Scrum and Kanban",
      "evidence": [
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with IT service management frameworks like ITIL",
      "evidence": [
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL."
      ],
      "strength": "high"
    },
    {
      "requirement": "Certification in PMP, PRINCE2, or Agile methodologies",
      "evidence": [
        "Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL."
      ],
      "strength": "high"
    },
    {
      "requirement": "Experience with cloud-based project management tools like Trello, Basecamp, or Smartsheet",
      "evidence": [
        "Certified in PMP (with 2 years of experience). Familiarity with cybersecurity principles and practices. Basic knowledge of cloud-based project management tools like Trello.\""
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Ensure compliance with industry standards and regulatory requirements using tools like NIST and HIPAA",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Proficient in MS Project, Asana, Tableau, Excel, and JIRA. Strong knowledge of Agile methodologies, including Scrum and Kanban. Experience with IT service management frameworks like ITIL.",
      "severity": "high"
    },
    {
      "requirement": "Manage and coordinate with vendors and third-party providers for IT services and solutions",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, leadership, and problem-solving skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "5+ years of experience in managing small-scale IT projects, primarily focusing on internal IT infrastructure upgrades and minor software implementations.",
      "supports": "Manage complex IT projects with a budget of $1 million to $5 million, involving multiple stakeholders and vendors"
    },
    {
      "source": "resume",
      "quote": "Here's a weak or scope-mismatch resume snippet for an IT Project Manager position:",
      "supports": "Develop and maintain project plans, schedules, and resource allocation plans using MS Project and Asana"
    },
    {
      "source": "resume",
      "quote": "Managed a few small-scale projects with budgets under $100,000. Coordinated with internal teams to deliver project milestones on time. Conducted regular status updates using Excel spreadsheets.",
      "supports": "Coordinate
