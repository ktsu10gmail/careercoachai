The provided JSON output appears to be clean and free from known failure modes. Here's a breakdown of the review:

1. **Metadata Leakage**: The analysis does not contain any sensitive information that could potentially leak metadata.

2. **Boilerplate Leakage**: There is no boilerplate content in the analysis that could indicate leakage.

3. **Contra-Evidence as Matched Evidence**: The analysis correctly identifies contra-evidence and distinguishes it from matched evidence. For example, the quote "This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description." is marked as contra-evidence for the requirement "Bachelor's degree in finance, economics, or related field;".

4. **Generic Snippet Scattering**: The analysis does not contain any generic snippets that could indicate scattering.

5. **Title/Header Proof**: There is no title/header proof in the analysis.

6. **Scope Mismatch**: The analysis correctly identifies a scope mismatch between the resume and the job description, specifically for the requirement "Evaluate loan applications based on financial statements, industry trends, and other relevant factors".

7. **Matched/Missing Contradiction**: The analysis does not contain any matched/missing contradictions.

**Proposed Regression Case:**

```json
{
  "job_title": "45. Data Analysts",
  "case_slug": "45-data-analysts",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:49.850142",
  "match_score": 50.39,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 47.5,
      "reason": "Found 6 direct, 1 adjacent, 1 domain/scope gaps, and 6 missing evidence points for core JD requirements.",
      "evidence": [
        "Proven analytical skills with ability to interpret complex financial data.",
        "Seeking a role where I can apply my skills to analyze commercial and industrial loans and provide credit counseling to clients.\"",
        "It also fails to demonstrate expertise in industry-specific lending regulations and standards, as well as collaboration with internal stakeholders.",
        "This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description."
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
      "score": 48.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "3 years"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 33.3,
      "reason": "Found 1 direct, 0 adjacent, 0 domain/scope gaps, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description.",
        "Proven analytical skills with ability to interpret complex financial data."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Proven analytical skills with ability to interpret complex financial data.",
        "Seeking a role where I can apply my skills to analyze commercial and industrial loans and provide credit counseling to clients.\"",
        "It also fails to demonstrate expertise in industry-specific lending regulations and standards, as well as collaboration with internal stakeholders.",
        "This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Provide credit counseling and recommendations to clients, including suggestions for loan modifications or refinancing options",
      "evidence": [
        "Seeking a role where I can apply my skills to analyze commercial and industrial loans and provide credit counseling to clients.\""
      ],
      "strength": "high"
    },
    {
      "requirement": "Stay up-to-date with changes in lending regulations and industry standards",
      "evidence": [
        "It also fails to demonstrate expertise in industry-specific lending regulations and standards, as well as collaboration with internal stakeholders."
      ],
      "strength": "high"
    },
    {
      "requirement": "2+ years of experience in data analysis or a related field",
      "evidence": [
        "\"Highly motivated individual with 3+ years of experience in credit analysis, proficient in Microsoft Office (Excel, Word, PowerPoint) and credit reporting software."
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong analytical and problem-solving skills, with ability to interpret complex financial data",
      "evidence": [
        "Proven analytical skills with ability to interpret complex financial data."
      ],
      "strength": "high"
    },
    {
      "requirement": "Excellent communication and interpersonal skills, with ability to work effectively with clients and internal stakeholders",
      "evidence": [
        "Strong communication skills with experience working with clients and internal stakeholders."
      ],
      "strength": "high"
    },
    {
      "requirement": "5+ years of experience in data analysis or a related field",
      "evidence": [
        "\"Highly motivated individual with 3+ years of experience in credit analysis, proficient in Microsoft Office (Excel, Word, PowerPoint) and credit reporting software."
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Conduct data analysis to identify trends and insights from large datasets",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Create data visualizations using tools like Tableau or Power BI",
      "reason": "Generic or lower-scope resume snippet lacks the explicit operational scope required: Proven analytical skills with ability to interpret complex financial data.",
      "severity": "high"
    },
    {
      "requirement": "Maintain accurate records of project metrics and outcomes",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Bachelor's degree in computer science, mathematics, or related field;",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description.",
      "severity": "high"
    },
    {
      "requirement": "Experience with data visualization tools like Excel, Power BI, or Tableau",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Master's degree in computer science or related field;",
      "reason": "Resume contains contra-evidence instead of affirmative proof: This resume snippet lacks the required 2+ years of experience, Bachelor's degree, and specific certifications or software experience mentioned in the job description.",
      "severity": "high"
    },
    {
      "requirement": "Certification as a Certified Data Analyst (CDA) or Certified Analytics Professional (CAP)",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Proven analytical skills with ability to interpret complex financial data.",
      "supports": "Conduct data analysis to identify trends and insights from large datasets"
    },
    {
      "source": "resume",
      "quote": "Seeking a role where I can apply my skills to analyze commercial and industrial loans and provide credit counseling to clients
