from app.services.ai_service import (
    INTENTIONAL_JD_HARD_QUESTION_COUNT,
    INTENTIONAL_RESUME_HARD_QUESTION_COUNT,
    INTENTIONAL_SOFT_QUESTION_COUNT,
    generate_fast_intentional_assessment_questions,
)


NOISE_TERMS = (
    "about us",
    "who we are",
    "benefits",
    "equal opportunity",
    "eeo",
    "apply now",
    "save job",
    "share job",
    "similar jobs",
    "recommended jobs",
    "company rating",
    "401(k)",
)


CASES = [
    {
        "name": "boilerplate_noise_is_not_question_source",
        "job_description": """
About Us
Acme builds delightful tools for ambitious teams.

Who We Are
We are kind, curious, inclusive, and customer obsessed.

Benefits
Medical, dental, vision, 401(k), wellness stipend, and team events.

Equal Opportunity Employer
We welcome applicants from all backgrounds.

Responsibilities
- Build real-time multimodal AI pipelines connecting ASR, LLMs, TTS, and avatar rendering.
- Develop observability, metrics, tracing, and performance instrumentation.

Required Skills
- Python, Kubernetes, streaming systems, low-latency architecture, and production model serving.
""",
        "resume": """
AI Systems Engineer with Python, Kubernetes, Docker, observability, model-serving, and streaming pipeline experience.
Built production services with metrics, tracing, and incident response workflows.
""",
        "profile": {
            "skills": ["Python", "Kubernetes", "Observability", "Streaming systems"],
            "experience": ["Built production AI services with tracing and metrics."],
        },
    },
    {
        "name": "scraped_job_board_noise_is_not_question_source",
        "job_description": """
Apply now | Save job | Share job | Similar jobs | Company rating 4.6

About the company
Acme is a leading platform used by thousands of customers.

Recommended jobs near you
Operations Analyst, Support Specialist, Product Manager

Job Description
- Own B2B software sales discovery, demos, pipeline forecasting, and enterprise account plans.
- Partner with technical teams to translate buyer requirements into SaaS solution proposals.

Qualifications
- Experience selling B2B software or SaaS products to enterprise customers.
- Strong CRM hygiene, forecasting discipline, and objection handling.
""",
        "resume": """
Account executive with enterprise sales experience, CRM forecasting, discovery calls, demos, and objection handling.
Sold SaaS workflow software to mid-market and enterprise accounts.
""",
        "profile": {
            "skills": ["SaaS sales", "CRM forecasting", "Enterprise accounts"],
            "experience": ["Sold SaaS workflow software to enterprise accounts."],
        },
    },
]


def main() -> None:
    failures: list[str] = []
    for case in CASES:
        questions = generate_fast_intentional_assessment_questions(
            case["profile"],
            case["resume"],
            case["job_description"],
            "Mid-level",
        )
        if len(questions) != 10:
            failures.append(f"{case['name']}: expected 10 questions, got {len(questions)}")

        jd_hard = [q for q in questions if q.get("type") == "JD-Based" and q.get("skill_type") == "Hard"]
        resume_hard = [q for q in questions if q.get("type") == "Resume-Based" and q.get("skill_type") == "Hard"]
        soft = [q for q in questions if q.get("skill_type") == "Soft"]
        if len(jd_hard) != INTENTIONAL_JD_HARD_QUESTION_COUNT:
            failures.append(f"{case['name']}: expected 4 JD hard questions, got {len(jd_hard)}")
        if len(resume_hard) != INTENTIONAL_RESUME_HARD_QUESTION_COUNT:
            failures.append(f"{case['name']}: expected 3 resume hard questions, got {len(resume_hard)}")
        if len(soft) != INTENTIONAL_SOFT_QUESTION_COUNT:
            failures.append(f"{case['name']}: expected 3 soft questions, got {len(soft)}")

        for question in questions:
            text = str(question.get("text") or "").lower()
            for term in NOISE_TERMS:
                if term in text:
                    failures.append(f"{case['name']}: noisy term {term!r} appeared in question: {question['text']}")

    if failures:
        raise SystemExit("\n".join(failures))
    print(f"Passed {len(CASES)} hiring-manager question guardrail cases.")


if __name__ == "__main__":
    main()
