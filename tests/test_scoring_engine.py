from app.scoring import clean_job_description_for_scoring, score_resume_jd_match
from app.services.ai_service import (
    _answer_score_guardrail,
    _balanced_intentional_questions,
    _normalize_enhanced_analysis,
    _normalize_intentional_question,
)


def test_scoring_engine_rewards_direct_evidence() -> None:
    resume = """
    AI Infrastructure Architect with 15+ years of enterprise infrastructure experience.
    Built Python and SQL automation for cloud cost optimization, idle resource monitoring,
    GitHub Actions workflows, and AI-powered platforms.
    """
    jd = """
    Must have strong proficiency in Python and SQL.
    Required expertise in cloud cost optimization and idle resource monitoring.
    Preferred familiarity with GitHub and modern software engineering workflows.
    Need 10+ years enterprise infrastructure experience.
    """

    result = score_resume_jd_match(resume, jd)

    assert result["match_score"] >= 80
    assert result["requirement_matches"]
    assert not result["missing_requirements"]
    assert all(0 <= item["score"] <= 100 for item in result["score_breakdown"])


def test_scoring_engine_penalizes_missing_specialized_evidence() -> None:
    resume = """
    Systems engineer with Windows Server, Active Directory, help desk support,
    and PowerShell scripting experience.
    """
    jd = """
    Required expertise tuning x86 Linux servers for low latency deterministic performance.
    Experience with RHEL.
    Required high precision clock synchronization technologies.
    Automating system builds and configuration management tools in a low-latency trading environment.
    """

    result = score_resume_jd_match(resume, jd)

    assert result["match_score"] < 35
    assert not result["requirement_matches"]
    assert len(result["missing_requirements"]) >= 3
    assert result["confidence_level"] in {"low", "medium"}


def test_scoring_engine_ignores_job_description_section_headings() -> None:
    resume = """
    Backend engineer with Python, SQL, FastAPI, and PostgreSQL experience.
    Built API services and automated reporting workflows.
    """
    jd = """
    Who We Are
    We are building workflow software for recruiting teams.

    What We're Looking For
    Must have Python and SQL experience.
    Experience building APIs is required.

    Benefits
    Health insurance and flexible work.
    """

    result = score_resume_jd_match(resume, jd)
    missing_text = " ".join(item["requirement"] for item in result["missing_requirements"]).lower()
    matched_text = " ".join(item["requirement"] for item in result["requirement_matches"]).lower()

    assert "who we are" not in missing_text
    assert "what we're looking for" not in missing_text
    assert "benefits" not in missing_text
    assert "workflow software" not in missing_text
    assert "health insurance" not in missing_text
    assert "python" in matched_text
    assert "sql" in matched_text


def test_scoring_engine_ignores_company_intro_title_and_culture_lines() -> None:
    resume = """
    AI Infrastructure Architect and Senior Infrastructure Engineer.
    Built resume-to-job matching, interview question generation, candidate scoring,
    and Talent Network workflows using FastAPI, Next.js, PostgreSQL, Docker, and local LLMs.
    Managed and consolidated more than 1,000 physical and virtual servers across multiple data centers.
    """
    jd = """
    Roboflow - Infrastructure Engineer

    Who We Are
    At Roboflow, we're building the tools, community, and resources needed to make the world
    programmable with artificial intelligence.
    Today, over 1M+ developers use Roboflow's machine learning open source and hosted tools.

    What We're Looking For
    You're motivated by the question, "How can I improve this?" and have a track record of doing so,
    even in ways adjacent to your role.
    You show more than you tell.
    Primarily, you like to make great things with passionate colleagues.
    Cohere is the leading security-first enterprise AI company.
    We build cutting-edge foundation AI models and end-to-end products that are designed to solve real-world business problems.
    Experience operating Linux infrastructure is required.
    Familiarity with Docker and PostgreSQL is preferred.
    """

    result = score_resume_jd_match(resume, jd)
    combined_requirements = " ".join(
        item["requirement"]
        for item in result["requirement_matches"] + result["missing_requirements"]
    ).lower()

    assert "roboflow - infrastructure engineer" not in combined_requirements
    assert "at roboflow" not in combined_requirements
    assert "1m+ developers" not in combined_requirements
    assert "how can i improve this" not in combined_requirements
    assert "you show more than you tell" not in combined_requirements
    assert "passionate colleagues" not in combined_requirements
    assert "cohere is the leading" not in combined_requirements
    assert "foundation ai models" not in combined_requirements
    assert "real-world business problems" not in combined_requirements
    assert "linux infrastructure" in combined_requirements
    assert "docker" in combined_requirements


def test_job_description_cleaner_keeps_valuable_sections_and_drops_noise() -> None:
    raw_jd = """
    Roboflow - Infrastructure Engineer

    Who We Are
    At Roboflow, we're building tools, community, and resources for AI.
    Today, over 1M+ developers use our tools.
    Cohere is the leading security-first enterprise AI company.
    We build cutting-edge foundation AI models and end-to-end products that are designed to solve real-world business problems.

    About the Role
    You will operate production infrastructure for machine learning workloads.

    Responsibilities
    Build and maintain Linux infrastructure.
    Troubleshoot production incidents and improve observability.

    Requirements
    Must have Docker and PostgreSQL experience.
    Experience with Terraform is preferred.

    Benefits
    Health insurance and flexible work.

    Equal Opportunity Employer
    We value diversity.
    """

    cleaned = clean_job_description_for_scoring(raw_jd).lower()

    assert "roboflow - infrastructure engineer" not in cleaned
    assert "at roboflow" not in cleaned
    assert "1m+ developers" not in cleaned
    assert "cohere is the leading" not in cleaned
    assert "foundation ai models" not in cleaned
    assert "real-world business problems" not in cleaned
    assert "health insurance" not in cleaned
    assert "equal opportunity" not in cleaned
    assert "operate production infrastructure" in cleaned
    assert "build and maintain linux infrastructure" in cleaned
    assert "docker and postgresql" in cleaned
    assert "terraform" in cleaned


def test_scoring_engine_ignores_broad_role_summary_and_name_evidence_false_positive() -> None:
    resume = """
    PRIYA NAIR
    Backend and DevOps engineer transitioning into applied AI systems.
    Built LLM-based workflow prototypes using Python and FastAPI.
    Managed Docker deployments, PostgreSQL databases, and observability dashboards.
    """
    jd = """
    About the job
    About Us
    1mind is a platform that deploys multimodal Superhumans for revenue teams.

    Job Description
    We're looking for an AI Systems Engineer to design and build the technical foundation.
    You'll work across pipelines, infrastructure, and orchestration layers to make Superhumans responsive,
    expressive, and reliable in production environments.

    Key Responsbilities
    Collaborate with product and AI teams to enable Superhumans to drive presentations, play media,
    share information, and be trained on knowledge bases for deeper contextual understanding.
    Develop the observability layer for the pipeline, metrics, tracing, and performance instrumentation.

    Qualifications
    Experience in ML systems or applied AI, particularly in LLMs, ASR, or TTS pipelines.
    Proven ability to productionize AI models, serving, scaling, and monitoring them in live environments.
    Proficiency in Python; experience deploying systems on Kubernetes or similar orchestration frameworks.
    """

    result = score_resume_jd_match(resume, jd)
    combined_requirements = " ".join(
        item["requirement"]
        for item in result["requirement_matches"] + result["missing_requirements"]
    ).lower()
    combined_evidence = " ".join(
        " ".join(item.get("evidence", []))
        for item in result["requirement_matches"]
    ).lower()
    strengths_by_requirement = {
        item["requirement"].lower(): item["strength"]
        for item in result["requirement_matches"]
    }

    assert "you'll work across" not in combined_requirements
    assert "collaborate with product" not in combined_requirements
    assert "priya nair" not in combined_evidence
    assert "observability layer" in combined_requirements
    assert "ml systems" in combined_requirements
    assert "python" in combined_requirements
    assert not any(
        "productionize ai models" in requirement and strength == "high"
        for requirement, strength in strengths_by_requirement.items()
    )
    assert not any(
        "kubernetes or similar orchestration" in requirement and strength == "high"
        for requirement, strength in strengths_by_requirement.items()
    )


def test_analysis_normalization_does_not_allow_llm_requirement_override() -> None:
    resume = """
    Senior infrastructure engineer with Linux operations, Docker, PostgreSQL,
    and production reliability experience.
    """
    jd = """
    Roboflow - Infrastructure Engineer
    Who We Are
    At Roboflow, we're building tools for artificial intelligence.
    What We're Looking For
    Experience operating Linux infrastructure is required.
    Familiarity with Docker and PostgreSQL is preferred.
    """
    parsed = {
        "requirement_matches": [
            {
                "requirement": "At Roboflow, we're building tools for artificial intelligence.",
                "evidence": ["Senior infrastructure engineer"],
                "strength": "high",
            }
        ],
        "missing_requirements": [
            {
                "requirement": "Roboflow - Infrastructure Engineer",
                "reason": "No evidence",
                "severity": "high",
            }
        ],
        "confidence_level": "high",
        "confidence_reason": "Model says everything is certain.",
    }

    enhanced = _normalize_enhanced_analysis(parsed, resume, jd, 50.0, [], [])
    combined_requirements = " ".join(
        item["requirement"]
        for item in enhanced["requirement_matches"] + enhanced["missing_requirements"]
    ).lower()

    assert "at roboflow" not in combined_requirements
    assert "roboflow - infrastructure engineer" not in combined_requirements
    assert "linux infrastructure" in combined_requirements
    assert enhanced["confidence_reason"] != "Model says everything is certain."


def test_answer_score_guardrail_caps_short_or_irrelevant_answers() -> None:
    question = "Explain how you would troubleshoot high latency on a Linux server."

    assert _answer_score_guardrail("", question, 10.0) == 0.0
    assert _answer_score_guardrail("I am a hard worker.", question, 10.0) <= 3.0
    assert _answer_score_guardrail("I would check logs and fix it.", question, 10.0) <= 5.0


def test_intentional_question_guardrail_keeps_4_3_3_split() -> None:
    raw_questions = [
        {"text": f"Question {index + 1}?"}
        for index in range(10)
    ]
    normalized = [
        _normalize_intentional_question(item, index)
        for index, item in enumerate(raw_questions)
    ]
    questions = _balanced_intentional_questions([item for item in normalized if item])

    jd_hard = [item for item in questions if item["type"] == "JD-Based" and item["skill_type"] == "Hard"]
    resume_hard = [item for item in questions if item["type"] == "Resume-Based" and item["skill_type"] == "Hard"]
    soft = [item for item in questions if item["skill_type"] == "Soft"]

    assert len(questions) == 10
    assert len(jd_hard) == 4
    assert len(resume_hard) == 3
    assert len(soft) == 3
