Overall, the analysis JSON output appears to be clean. However, I do find a few potential issues that could be considered as failure modes:

1. **Boilerplate leakage**: The resume contains boilerplate phrases such as "Results-driven Real Estate Agent with 2+ years of experience in sales and marketing." which are not specific to the job requirements. This could lead to an inflated score for generic skills.

Proposed regression case:
```json
{
  "job_title": "20. Marketing Manager",
  "case_slug": "20-marketing-manager",
  "resume_file": "resume_boilerplate.txt",
  "expected_profile": "preferred_requirements",
  "scored_at": "2026-06-30T18:20:47.331721",
  "match_score": 80.0,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 40.0,
      "reason": "Found 2 direct, 4 adjacent, 0 domain/scope gaps, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "Results-driven Marketing Manager with 5+ years of experience in digital marketing."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 60.0,
      "reason": "Found 1 direct, 2 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Results-driven Marketing Manager with 5+ years of experience in digital marketing."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Develop and execute comprehensive marketing strategies",
      "evidence": [
        "Results-driven Marketing Manager with 5+ years of experience in digital marketing."
      ],
      "strength": "high"
    },
    {
      "requirement": "Analyze market trends and adjust marketing campaigns accordingly",
      "evidence": [
        "Results-driven Marketing Manager with 5+ years of experience in digital marketing."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Stay up-to-date on industry developments and adjust strategies accordingly",
      "reason": "Resume contains boilerplate phrase instead of specific evidence.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, negotiation, and organizational skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Results-driven Marketing Manager with 5+ years of experience in digital marketing.",
      "supports": "Develop and execute comprehensive marketing strategies"
    },
    {
      "source": "resume",
      "quote": "Results-driven Marketing Manager with 5+ years of experience in digital marketing.",
      "supports": "Analyze market trends and adjust marketing campaigns accordingly"
    }
  ],
  "confidence_level": "medium",
  "confidence_reason": "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
}
```

2. **Contra-evidence as matched evidence**: The resume contains a quote that contradicts the job requirement for staying up-to-date on local market trends.

Proposed regression case:
```json
{
  "job_title": "21. Real Estate Agent",
  "case_slug": "21-real-estate-agent",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-30T18:20:47.331721",
  "match_score": 56.81,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 43.1,
      "reason": "Found 2 direct, 6 adjacent, 0 domain/scope gaps, and 5 missing evidence points for core JD requirements.",
      "evidence": [
        "Conducted numerous property showings and open houses to attract potential buyers"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 65.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "\"Results-driven Real Estate Agent with 2+ years of experience in sales and marketing."
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 80.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "2 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Negotiated purchase agreements and facilitated transactions between buyers and sellers"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 89.8,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Conducted numerous property showings and open houses to attract potential buyers",
        "\"Results-driven Real Estate Agent with 2+ years of experience in sales and marketing.",
        "Negotiated purchase agreements and facilitated transactions between buyers and sellers",
        "Similarly, while I am familiar with local market trends, I do not have formal training in real estate laws.\""
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Conduct property showings and open houses to attract potential buyers",
      "evidence": [
        "Conducted numerous property showings and open houses to attract potential buyers"
      ],
      "strength": "high"
    },
    {
      "requirement": "Proficiency in Microsoft Office Suite (Word, Excel, PowerPoint) and CRM software",
      "evidence": [
        "Skilled in Microsoft Office Suite, CRM software, and property management tools."
      ],
      "strength": "high"
    },
    {
      "requirement": "Prepare and present marketing materials, including listings and sales presentations",
      "evidence": [
        "\"Results-driven Real Estate Agent with 2+ years of experience in sales and marketing."
      ],
      "strength": "medium"
    },
    {
      "requirement": "Negotiate purchase agreements and facilitate transactions between buyers and sellers",
      "evidence": [
        "Conducted numerous property showings and open houses to attract potential buyers"
      ],
      "strength": "medium"
    },
    {
      "requirement": "real estate license a plus",
      "evidence": [
        "\"Results-driven Real Estate Agent with 2+ years of experience in sales and marketing."
      ],
      "strength": "medium"
    },
    {
      "requirement": "1-2 years of experience in real estate sales or related field",
      "evidence": [
        "\"Results-driven Real Estate Agent with 2+ years of experience in sales and marketing."
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Stay up-to-date on local market trends and adjust strategies accordingly",
      "reason": "Resume contains contra-evidence instead of affirmative proof: Similarly, while I am familiar with local market trends, I do not have formal training in real estate laws.\"",
      "severity": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Excellent communication, negotiation, and organizational skills",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Ability to work independently and as part of a team",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity":
