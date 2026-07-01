Overall, the analysis JSON output appears to be clean. However, I do identify a few potential issues that could be considered failure modes:

1. **Boilerplate leakage**: The presence of boilerplate language in the resume quotes, such as "Here's a contra-evidence resume snippet for the 66. Public Relations Specialists job title:", suggests that the candidate may be using generic phrases rather than providing specific examples.

2. **Generic snippet scattering**: The use of similar phrases and sentence structures throughout the evidence quotes, such as "* Developed and implemented comprehensive PR campaigns...", suggests that the candidate may not be providing unique or specific examples to support their claims.

3. **Title/header proof**: The title "66. Public Relations Specialists" appears to be a boilerplate job title rather than a specific job title for the resume. This could indicate that the candidate is not tailoring their application materials to the specific job requirements.

4. **Scope mismatch**: The requirement "Manage crisis communications and respond to inquiries from the media, public, and stakeholders" seems to have a scope that is broader than what is present in the evidence quotes. Specifically, the quote "* In terms of crisis communications software, I have used [similar tool]..." suggests that the candidate has experience with specific tools rather than general crisis communications management.

5. **Matched/missing contradiction**: The requirement "Manage crisis communications and respond to inquiries from the media, public, and stakeholders" is matched by an evidence quote "* In terms of crisis communications software, I have used [similar tool]..." which suggests that the candidate does not have experience with Crisis Communications Management specifically. This could be considered a mismatch or contradiction.

Proposed regression case:

```json
{
  "job_title": "66. Public Relations Specialists",
  "case_slug": "66-public-relations-specialists",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:23.248569",
  "match_score": 63.62,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 47.5,
      "reason": "Found 5 direct, 3 adjacent, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness."
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
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "implemented"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 47.5,
      "reason": "Found 5 direct, 3 adjacent, and 4 missing evidence points for domain and tool requirements.",
      "evidence": [
        "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Conduct media outreach and secure press coverage for key events, announcements, and initiatives",
      "evidence": [
        "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness."
      ],
      "strength": "high"
    },
    {
      "requirement": "Craft and disseminate press releases, media advisories, and other written materials to support PR efforts",
      "evidence": [
        "* Crafted and disseminated press releases, media advisories, and other written materials to support PR efforts, with a focus on [specific industry or topic]."
      ],
      "strength": "high"
    },
    {
      "requirement": "3+ years of experience in public relations, with a focus on corporate communications",
      "evidence": [
        "5 years",
        "implemented"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of media relations, crisis communications, and social media strategy",
      "evidence": [
        "\"Results-driven public relations professional with 5+ years of experience in corporate communications, seeking to leverage my expertise in media relations and crisis communications to drive organizational success."
      ],
      "strength": "high"
    },
    {
      "requirement": "Knowledge of social media management platforms, including Hootsuite, Sprout Social, or similar tools",
      "evidence": [
        "* While I have experience with social media strategy, my primary focus has been on traditional media relations and crisis communications, rather than social media management platforms."
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and implement comprehensive public relations campaigns to promote organizational image and reputation",
      "evidence": [
        "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage crisis communications and respond to inquiries from the media, public, and stakeholders",
      "reason": "Resume contains boilerplate language rather than specific examples.",
      "severity": "high"
    },
    {
      "requirement": "Bachelor's degree in Public Relations, Communications, Journalism, or related field",
      "reason": "Resume does not contain a specific degree or certification.",
      "severity": "high"
    },
    {
      "requirement": "Excellent writing, editing, and verbal communication skills",
      "reason": "Resume quotes lack specific examples of these skills.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work independently and as part of a team",
      "reason": "Resume does not contain specific examples of teamwork or independent work.",
      "severity": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint) and Google Workspace",
      "reason": "Resume quotes lack specific examples of proficiency in these tools.",
      "severity": "high"
    },
    {
      "requirement": "Familiarity with content management systems, such as WordPress or Drupal",
      "reason": "Resume does not contain specific examples of familiarity with these systems.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "* Developed and implemented comprehensive PR campaigns that secured press coverage for key events and announcements, resulting in [X] media impressions and [Y]% increase in brand awareness.",
      "supports": "Conduct media outreach and secure press coverage for key events, announcements, and initiatives"
    },
    {
      "source": "resume",
      "quote": "* Crafted and disseminated press releases, media advisories, and other written materials to support PR efforts, with a focus on [specific industry or topic].",
      "supports": "Craft and disseminate press releases, media advisories, and other written materials to support PR efforts"
    },
    {
      "source": "resume",
      "quote": "* In terms of crisis communications software, I have used [similar tool] to manage crisis communications efforts, but I do not have experience with Crisis Communications Management specifically.",
      "supports": "Manage crisis communications and respond to inquiries from the media, public, and stakeholders"
    },
    {
      "source": "resume",
      "quote": "\"Results-driven public relations professional with 5+ years of experience in corporate communications, seeking to leverage my expertise in media relations and crisis communications to drive
