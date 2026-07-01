Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate text that is repeated throughout the document. This could potentially dilute the impact of specific experience and skills mentioned in the resume.

2. **Generic snippet scattering**: Some of the evidence quotes seem to be generic phrases that are not specific to the job requirements or industry. For example, "Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles" is a generic statement that could apply to many different jobs.

3. **Title/header proof**: The title of the analysis ("65. Marketing Specialists / Coordinators") seems to be a boilerplate value that is not specific to this particular job or industry.

4. **Scope mismatch**: The scope of some of the missing requirements seems to be too broad. For example, "Manage and optimize email marketing campaigns using tools such as Mailchimp and Constant Contact" could potentially include tasks that are outside the scope of a typical marketing specialist role.

5. **Matched/missing contradiction**: There is a potential contradiction between the matched requirement "Experience with social media management tools such as Hootsuite or Sprout Social" and the missing requirement "Experience with project management tools such as Asana or Trello". The resume does not mention any experience with project management tools, but it does mention experience with social media management tools.

Proposed regression case:

```json
{
  "job_title": "Marketing Specialist",
  "case_slug": "marketing-specialist",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:23.165847",
  "match_score": 50.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 30.0,
      "reason": "Found 1 direct, 2 adjacent, and 1 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 40.0,
      "reason": "No specific preferred JD requirements were detected in the job description, so this category uses a neutral baseline.",
      "evidence": []
    },
    {
      "category": "Experience and seniority",
      "score": 70.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 50.0,
      "reason": "Found 1 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 80.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and implement targeted social media campaigns to increase brand awareness and engagement across multiple platforms (Facebook, Twitter, Instagram, LinkedIn)",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong understanding of email marketing best practices and campaign analytics",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "high"
    },
    {
      "requirement": "Conduct market research and analyze data to inform marketing decisions and track campaign performance",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "medium"
    },
    {
      "requirement": "2+ years of experience in marketing or a related field",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Proficiency in Adobe Creative Suite (Photoshop, InDesign, Illustrator)",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Experience with social media management tools such as Hootsuite or Sprout Social",
      "evidence": [
        "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Manage and optimize email marketing campaigns using tools such as Mailchimp and Constant Contact",
      "reason": "Resume contains boilerplate text instead of specific experience or skills.",
      "severity": "high"
    },
    {
      "requirement": "Coordinate trade show appearances and product demonstrations with internal stakeholders and external partners",
      "reason": "Resume does not mention any experience with project management tools such as Asana or Trello.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\",
      "supports": "Develop and implement targeted social media campaigns to increase brand awareness and engagement across multiple platforms (Facebook, Twitter, Instagram, LinkedIn)"
    },
    {
      "source": "resume",
      "quote": "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\",
      "supports": "Strong understanding of email marketing best practices and campaign analytics"
    },
    {
      "source": "resume",
      "quote": "\"Marketing Specialist with 2+ years of experience in developing and implementing targeted social media campaigns across multiple platforms (Facebook, Twitter, Instagram). Proficient in Adobe Creative Suite (Photoshop, InDesign) and has a strong understanding of marketing principles.\"\",
      "supports": "Conduct market research and analyze data to inform marketing decisions and track campaign performance"
    },
    {
      "source": "resume",
