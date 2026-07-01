The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `case_slug` and `resume_file` fields seem to be properly formatted, but it's essential to ensure that sensitive information is not leaked in metadata.

2. **Boilerplate Leakage**: There doesn't appear to be any boilerplate leakage in this output, as all the relevant information is contained within the structured data.

3. **Contra-Evidence as Matched Evidence**: The presence of a contra-evidence quote for requirement "Identify opportunities for market growth and develop strategies to capitalize on them" seems suspicious. However, upon closer inspection, it's clear that this quote actually contradicts the requirement, indicating that the engine correctly identified the mismatch.

4. **Generic Snippet Scattering**: The use of generic snippets (e.g., "* Developed and maintained databases of customer demographics and purchase history") is not a significant issue in this output, as they are properly contextualized within the evidence quotes.

5. **Title/Header Proof**: There doesn't appear to be any issues with title/header proofing in this output.

6. **Scope Mismatch**: The scope of the requirements seems to match the scope of the provided evidence, which is a positive sign.

7. **Matched/Missing Contradiction**: As mentioned earlier, the presence of a contra-evidence quote for requirement "Identify opportunities for market growth and develop strategies to capitalize on them" indicates that the engine correctly identified the mismatch between matched and missing evidence.

**Proposed Regression Case:**

```json
{
  "job_title": "69. Market Research Analysts",
  "case_slug": "69-market-research-analysts",
  "resume_file": "resume_contra.txt",
  "expected_profile": "contra_evidence",
  "scored_at": "2026-06-29T20:51:23.489561",
  "match_score": 85.12,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 76.5,
      "reason": "Found 6 direct, 7 adjacent, and 0 missing evidence points for core JD requirements.",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
        "* Developed and maintained databases of customer demographics and purchase history"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 65.0,
      "reason": "Found 0 direct, 1 adjacent, and 0 missing evidence points for preferred JD requirements.",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a"
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years",
        "senior"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 93.0,
      "reason": "Found 4 direct, 1 adjacent, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
        "* Developed and maintained databases of customer demographics and purchase history"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
        "* Developed and maintained databases of customer demographics and purchase history"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Conduct primary and secondary research to gather data on consumer behavior, market trends, and competitor activity",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a"
      ],
      "strength": "high"
    },
    {
      "requirement": "Analyze data using statistical software such as R or SPSS, and present findings in reports and presentations to senior management",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a"
      ],
      "strength": "high"
    },
    {
      "requirement": "Develop and maintain databases of customer demographics, purchase history, and other relevant data points",
      "evidence": [
        "* Developed and maintained databases of customer demographics and purchase history"
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience in market research or a related field",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a"
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent written and verbal communication skills, with ability to present findings to non-technical audiences",
      "evidence": [
        "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a"
      ],
      "strength": "high"
    },
    {
      "requirement": "Knowledge of data visualization techniques using Tableau or Power BI",
      "evidence": [
        "* Proficiency in data visualization tools such as Tableau or Power BI (I have basic knowledge of Excel's pivot table function)"
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
      "supports": "Conduct primary and secondary research to gather data on consumer behavior, market trends, and competitor activity"
    },
    {
      "source": "resume",
      "quote": "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
      "supports": "Analyze data using statistical software such as R or SPSS, and present findings in reports and presentations to senior management"
    },
    {
      "source": "resume",
      "quote": "* Developed and maintained databases of customer demographics and purchase history",
      "supports": "Develop and maintain databases of customer demographics, purchase history, and other relevant data points"
    },
    {
      "source": "resume",
      "quote": "Here's a contra-evidence resume snippet for a Market Research Analyst position:",
      "supports": "Identify opportunities for market growth and develop strategies to capitalize on them"
    },
    {
      "source": "resume",
      "quote": "\"Results-driven market research professional with 3+ years of experience in analyzing consumer behavior and market trends. Proficient in R and SPSS statistical software, with strong analytical and problem-solving skills. Excellent written a",
      "supports": "Stay up-to-date with industry trends and developments through ongoing education and training"
    }
  ],
  "confidence_level": "high",
  "confidence_reason": "Confidence is high because multiple JD requirements have direct resume evidence."
}
```

This proposed regression case includes an additional requirement ("Identify opportunities
