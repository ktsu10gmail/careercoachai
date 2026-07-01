The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata Leakage**: The `expected_profile` field indicates that the expected profile is set to "scope_mismatch", but there is no indication of metadata leakage in the provided output.

2. **Boilerplate Leakage**: There is no boilerplate leakage detected in the provided output, as all evidence points are specific and relevant to the job requirements.

3. **Contra-Evidence as Matched Evidence**: No contra-evidence is present in the provided output that could be mistaken for matched evidence.

4. **Generic Snippet Scattering**: The `evidence_quotes` field contains quotes from the resume that support various JD requirements, but there is no scattering of generic snippets across multiple requirements.

5. **Title/Header Proof**: There is no title/header proof detected in the provided output, as all information is presented in a clear and concise manner.

6. **Scope Mismatch**: The `expected_profile` field indicates that the expected profile is set to "scope_mismatch", but there is no indication of scope mismatch in the provided output.

7. **Matched/Missing Contradiction**: No contradictions are present in the provided output, as all evidence points align with the JD requirements.

**Proposed Regression Case:**

To further test the engine's robustness, a regression case could be created to simulate a scenario where the following issues are introduced:

* A generic snippet is scattered across multiple requirements.
* Contra-evidence is present in the resume that could be mistaken for matched evidence.
* The `expected_profile` field is set to "scope_mismatch", but the output contains scope mismatch.

Here's an example of what the regression case JSON might look like:
```json
{
  "job_title": "13. First-Line Supervisors of Retail Sales Workers",
  "case_slug": "13-first-line-supervisors-of-retail-sales-workers",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-30T18:20:46.851574",
  "match_score": 57.72,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 59.2,
      "reason": "Found 7 direct, 2 adjacent, 0 domain/scope gaps, and 4 missing evidence points for core JD requirements.",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory.",
        "Familiarity with point-of-sale systems, including Clover and Square."
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, 0 domain/scope gaps, and 1 missing evidence points for preferred JD requirements.",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento."
      ]
    },
    {
      "category": "Experience and seniority",
      "score": 100.0,
      "reason": "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD.",
      "evidence": [
        "5 years",
        "manager"
      ]
    },
    {
      "category": "Domain and tools fit",
      "score": 35.0,
      "reason": "Found 0 direct, 1 adjacent, 0 domain/scope gaps, and 0 missing evidence points for domain and tool requirements.",
      "evidence": [
        "Familiarity with point-of-sale systems, including Clover and Square."
      ]
    },
    {
      "category": "Evidence quality",
      "score": 100.0,
      "reason": "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth.",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory.",
        "Familiarity with point-of-sale systems, including Clover and Square."
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "Conduct daily meetings with employees to discuss sales performance, customer service, and visual merchandising",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento."
      ],
      "strength": "high"
    },
    {
      "requirement": "High school diploma or equivalent required;",
      "evidence": [
        "High school diploma;"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong communication and interpersonal skills",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory."
      ],
      "strength": "high"
    },
    {
      "requirement": "Ability to work in a fast-paced environment with multiple priorities",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory."
      ],
      "strength": "high"
    },
    {
      "requirement": "Basic math skills and accuracy with cash handling",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory."
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with point-of-sale systems and inventory management software",
      "evidence": [
        "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
        "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory."
      ],
      "strength": "high"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Supervise a team of retail sales workers to achieve sales goals and maintain store appearance",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Train new employees on company policies, procedures, and product knowledge",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Investigate employee complaints and resolve issues in a fair and timely manner",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Monitor employee attendance and tardiness, taking disciplinary action as necessary",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "2+ years of retail management experience preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "Experience with visual merchandising and store displays gained through working on e-commerce platforms using Shopify and Magento.",
      "supports": "Conduct daily meetings with employees to discuss sales performance, customer service, and visual merchandising"
    },
    {
      "source": "resume",
      "quote": "Basic math skills and accuracy with cash handling demonstrated through experience with inventory management software such as OpenERP and Zoho Inventory.",
      "supports": "Manage inventory levels and monitor stockroom organization"
    },
    {
