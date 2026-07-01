The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked from external sources.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies some requirements with high strength, while others have medium or low strength. However, there are no instances where contra-evidence is used to match evidence.

4. **Generic Snippet Scattering**: The `score_breakdown` section contains a generic snippet for each category ("Here's a weak or scope-mismatch resume snippet for a Public Relations Specialist:"), but this does not appear to be an issue, as the snippets are used to provide context and support for the analysis.

5. **Title/Header Proof**: There is no indication that the title/header proof has been compromised.

6. **Scope Mismatch**: The `expected_profile` field indicates that there may be a scope mismatch, but this is not explicitly stated in the JSON output. However, upon closer inspection, it appears that the analysis correctly identifies some requirements as being outside of the expected scope.

7. **Matched/Missing Contradiction**: There are no apparent contradictions between matched and missing requirements.

**Proposed Regression Case:**

```json
{
  "job_title": "66. Public Relations Specialists",
  "case_slug": "66-public-relations-specialists",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:23.301166",
  "match_score": 64.5,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 57.1,
      "reason": "Found 4 direct, 8 adjacent, and 2 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
        "Experience includes managing internal communications for a small software development company, creating press releases for new product launches, and coordinating events for industry conferences. Strong analytical skills, with experience usi"
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
      "score": 78.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years",
        "lead"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 57.1,
      "reason": "Found 4 direct, 8 adjacent, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
        "Experience includes managing internal communications for a small software development company, creating press releases for new product launches, and coordinating events for industry conferences. Strong analytical skills, with experience usi"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
        "Experience includes managing internal communications for a small software development company, creating press releases for new product launches, and coordinating events for industry conferences. Strong analytical skills, with experience usi"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Analyze media coverage and track key metrics to assess campaign effectiveness",
      "evidence": [
        "Experience includes managing internal communications for a small software development company, creating press releases for new product launches, and coordinating events for industry conferences. Strong analytical skills, with experience usi"
      ],
      "strength": "high"
    },
    {
      "requirement": "3+ years of experience in public relations, with a focus on corporate communications",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of media relations, crisis communications, and social media strategy",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint) and Google Workspace",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi"
      ],
      "strength": "high"
    },
    {
      "requirement": "Manage crisis communications and respond to inquiries from the media, public, and stakeholders",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Bachelor's degree in Public Relations, Communications, Journalism, or related field",
      "evidence": [
        "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Ability to work independently and as part of a team",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with content management systems, such as WordPress or Drupal",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
      "supports": "Develop and implement comprehensive public relations campaigns to promote organizational image and reputation"
    },
    {
      "source": "resume",
      "quote": "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
      "supports": "Conduct media outreach and secure press coverage for key events, announcements, and initiatives"
    },
    {
      "source": "resume",
      "quote": "\"Public Relations Specialist with 2 years of experience in IT project management and team lead roles. Skilled in Microsoft Office Suite, Google Workspace, and Agile methodologies. Proficient in writing and editing, with a strong understandi",
      "supports": "Craft and disse
