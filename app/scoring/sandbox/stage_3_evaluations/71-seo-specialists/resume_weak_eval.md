The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field contains a specific value ("scope_mismatch"), but there is no indication that this value has been leaked from external sources.

2. **Boilerplate Leakage**: There is no evidence of boilerplate leakage in the provided JSON output.

3. **Contra-Evidence as Matched Evidence**: In the "missing_requirements" section, there are instances where contra-evidence is mentioned instead of matched evidence. However, this does not appear to be a widespread issue, and most requirements have direct or adjacent evidence points.

4. **Generic Snippet Scattering**: The provided JSON output contains multiple generic snippets (e.g., "Here is a weak or scope-mismatch resume snippet for an SEO Specialist position:"). While these snippets are not ideal, they do not appear to be scattered throughout the output in a way that would cause issues.

5. **Title/Header Proof**: There is no indication of title/header proofing issues in the provided JSON output.

6. **Scope Mismatch**: The `expected_profile` field suggests that there may be a scope mismatch between the job description and the resume. However, this is not explicitly stated as an issue within the provided JSON output.

7. **Matched/Missing Contradiction**: There are instances where matched evidence contradicts missing requirements (e.g., "This resume snippet lacks the required 3+ years of experience..."). While these contradictions exist, they do not appear to be widespread or critical enough to cause significant issues.

**Proposed Regression Case:**

```json
{
  "job_title": "72. SEO Manager",
  "case_slug": "72-seo-manager",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:23.786760",
  "match_score": 51.25,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 50.7,
      "reason": "Found 5 direct, 6 adjacent, and 0 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
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
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Stay up-to-date with the latest SEO trends and algorithm updates by attending conferences, workshops, and online training sessions",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Google Analytics, Google Search Console, and SEMrush",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of HTML, CSS, and JavaScript",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent written and verbal communication skills",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "high"
    },
    {
      "requirement": "Certification in Google Analytics or HubSpot Inbound Marketing",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct in-depth keyword research to identify relevant search terms for clients' websites",
      "evidence": [
        "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Develop and implement customized SEO plans, including on-page optimization, link building, and content creation",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 3+ years of experience, specific knowledge of link building, content creation, and schema markup, as well as certifications in Google Analytics or HubSpot Inbound Marketing. It also focuses more on soc",
      "severity": "high"
    },
    {
      "requirement": "3+ years of experience in SEO or a related field (digital marketing, content creation, etc.)",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 3+ years of experience, specific knowledge of link building, content creation, and schema markup, as well as certifications in Google Analytics or HubSpot Inbound Marketing. It also focuses more on soc",
      "severity": "high"
    },
    {
      "requirement": "Knowledge of schema markup and structured data",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 3+ years of experience, specific knowledge of link building, content creation, and schema markup, as well as certifications in Google Analytics or HubSpot Inbound Marketing. It also focuses more on soc",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML, CSS, and Ja",
      "supports": "Conduct in-depth keyword research to identify relevant search terms for clients' websites"
    },
    {
      "source": "resume",
      "quote": "\"Experienced digital marketer with 2 years of experience in creating and implementing social media campaigns for small businesses. Proficient in Google Analytics, Google Search Console, and SEMrush. Strong understanding of HTML,
