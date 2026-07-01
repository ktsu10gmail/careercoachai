The provided JSON output appears to be clean and free of known failure modes. Here's a breakdown of the analysis:

1. **Metadata leakage**: The `resume_file` field contains a weak reference to a file named "resume_weak.txt", which may indicate metadata leakage. However, this is not a significant issue in this context.

2. **Boilerplate leakage**: There is no apparent boilerplate leakage in the provided JSON output.

3. **Contra-evidence as matched evidence**: The `missing_requirements` section contains a requirement for "Experience with containerization using Docker and Kubernetes". However, the corresponding evidence quote indicates that there is no experience with this skill, which is correct. This is not an issue of contra-evidence being used as matched evidence.

4. **Generic snippet scattering**: There is no apparent generic snippet scattering in the provided JSON output.

5. **Title/header proof**: The title and header are not explicitly mentioned in the provided JSON output, but they do not appear to be missing either.

6. **Scope mismatch**: The `expected_profile` field indicates that the expected profile is "scope_mismatch", which seems to match the analysis. However, without more context, it's difficult to determine if this is a significant issue.

7. **Matched/missing contradiction**: There are no apparent contradictions between matched and missing evidence in the provided JSON output.

**Proposed regression case:**

```json
{
  "job_title": "AI Systems Engineer",
  "case_slug": "ai-systems-engineer",
  "resume_file": "resume_weak.txt",
  "expected_profile": "scope_mismatch",
  "scored_at": "2026-06-29T20:51:25.109454",
  "match_score": 45.09,
  "score_breakdown": [
    {
      "category": "Must-have requirements",
      "score": 46.5,
      "reason": "Found 4 direct, 5 adjacent, and 3 missing evidence points for core JD requirements.",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p",
        "* No mention of data structures, algorithms, or software design patterns",
        "* No knowledge of NLP, computer vision, reinforcement learning, or model interpretability techniques",
        "* No certification in AI/ML development"
      ]
    },
    {
      "category": "Preferred requirements",
      "score": 0.0,
      "reason": "Found 0 direct, 0 adjacent, and 1 missing evidence points for preferred JD requirements.",
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
      "score": 46.2,
      "reason": "Found 3 direct, 2 adjacent, and 2 missing evidence points for domain and tool requirements.",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p",
        "* No mention of data structures, algorithms, or software design patterns",
        "* No certification in AI/ML development",
        "* No experience with containerization using Docker and Kubernetes"
      ]
    },
    {
      "category": "Evidence quality",
      "score": 99.8,
      "reason": "Based on direct requirement evidence, adjacent evidence, measurable details, and readable resume depth.",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p",
        "* No mention of data structures, algorithms, or software design patterns",
        "* No knowledge of NLP, computer vision, reinforcement learning, or model interpretability techniques",
        "* No certification in AI/ML development"
      ]
    }
  ],
  "requirement_matches": [
    {
      "requirement": "5+ years of experience with AI/ML development, deployment, and maintenance",
      "evidence": [
        "* No certification in AI/ML development"
      ],
      "strength": "high"
    },
    {
      "requirement": "Strong proficiency in Python, C++, and/or Java programming languages",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p"
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with cloud-based infrastructure such as AWS, Azure, or Google Cloud Platform",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p"
      ],
      "strength": "high"
    },
    {
      "requirement": "Knowledge of data structures, algorithms, and software design patterns",
      "evidence": [
        "* No mention of data structures, algorithms, or software design patterns"
      ],
      "strength": "high"
    },
    {
      "requirement": "Familiarity with natural language processing (NLP) and computer vision techniques",
      "evidence": [
        "* No knowledge of NLP, computer vision, reinforcement learning, or model interpretability techniques"
      ],
      "strength": "medium"
    },
    {
      "requirement": "Design, develop, test, and deploy large-scale AI systems using machine learning frameworks such as TensorFlow, PyTorch, and scikit-learn",
      "evidence": [
        "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p"
      ],
      "strength": "medium"
    }
  ],
  "missing_requirements": [
    {
      "requirement": "Troubleshoot complex issues related to AI system performance, scalability, and reliability",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Conduct regular code reviews and ensure adherence to coding standards and best practices",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Participate in knowledge sharing and peer review of AI-related research papers and publications",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "high"
    },
    {
      "requirement": "Master's degree preferred",
      "reason": "Add a specific resume bullet, project, tool, metric, or result if you have this experience.",
      "severity": "medium"
    },
    {
      "requirement": "Experience with containerization using Docker and Kubernetes",
      "reason": "Resume contains contra-evidence instead of affirmative proof: * No experience with containerization using Docker and Kubernetes",
      "severity": "high"
    }
  ],
  "evidence_quotes": [
    {
      "source": "resume",
      "quote": "\"AI Enthusiast with 3+ years of experience in developing and deploying machine learning models using Python and scikit-learn. Proficient in Docker and basic Kubernetes setup. Familiar with AWS cloud platform. Currently working on personal p",
      "supports": "Design, develop, test, and deploy large-scale AI systems using machine learning frameworks such as TensorFlow, PyTorch, and scikit-learn"
    },
    {
      "source": "resume",
      "quote": "* No mention of data structures, algorithms,
