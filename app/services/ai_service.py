import json
import logging
import re
from typing import Any, Dict, List

import requests

from app.core.config import get_settings
from app.scoring import clean_job_description_for_scoring, score_resume_jd_match

settings = get_settings()
logger = logging.getLogger(__name__)

INTENTIONAL_JD_HARD_QUESTION_COUNT = 4
INTENTIONAL_RESUME_HARD_QUESTION_COUNT = 3
INTENTIONAL_SOFT_QUESTION_COUNT = 3
INTENTIONAL_QUESTION_COUNT = (
    INTENTIONAL_JD_HARD_QUESTION_COUNT
    + INTENTIONAL_RESUME_HARD_QUESTION_COUNT
    + INTENTIONAL_SOFT_QUESTION_COUNT
)
JOB_HARD_QUESTION_COUNT = 7
JOB_SOFT_QUESTION_COUNT = 3
JOB_QUESTION_COUNT = JOB_HARD_QUESTION_COUNT + JOB_SOFT_QUESTION_COUNT

STOP_WORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "for",
    "in",
    "is",
    "of",
    "on",
    "or",
    "the",
    "to",
    "with",
}


def _ollama_request(prompt: str, num_predict: int = 1000, timeout: int = 180) -> str:
    base_url = settings.OLLAMA_URL.rstrip("/")
    generate_payload = {
        "model": settings.OLLAMA_MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0,
            "top_k": 1,
            "top_p": 0.1,
            "seed": 42,
            "num_predict": num_predict,
        },
    }
    response = requests.post(f"{base_url}/api/generate", json=generate_payload, timeout=timeout)
    if response.status_code == 404:
        response = requests.post(
            f"{base_url}/completions",
            json={
                "model": settings.OLLAMA_MODEL_NAME,
                "prompt": prompt,
                "max_tokens": num_predict,
                "temperature": 0,
            },
            timeout=timeout,
        )
    response.raise_for_status()
    data = response.json()
    if isinstance(data, dict) and "response" in data:
        return data["response"]
    if isinstance(data, dict) and "completion" in data:
        return data["completion"]
    return data.get("choices", [{}])[0].get("text", "")


def _ollama_request_or_empty(prompt: str, num_predict: int = 1000, timeout: int = 180) -> str:
    try:
        return _ollama_request(prompt, num_predict=num_predict, timeout=timeout)
    except requests.RequestException:
        return ""


def _gemini_request(
    prompt: str,
    num_predict: int = 1000,
    timeout: int = 180,
) -> str:
    if not settings.GEMINI_API_KEY:
        raise requests.RequestException("GEMINI_API_KEY is not configured")

    base_url = settings.GEMINI_API_URL.rstrip("/")
    url = f"{base_url}/models/{settings.GEMINI_MODEL_NAME}:generateContent"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}],
            }
        ],
        "generationConfig": {
            "temperature": 0,
            "topK": 1,
            "topP": 0.1,
            "maxOutputTokens": num_predict,
        },
    }
    response = requests.post(
        url,
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": settings.GEMINI_API_KEY,
        },
        json=payload,
        timeout=timeout,
    )
    response.raise_for_status()
    data = response.json()
    parts = (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [])
    )
    return "".join(str(part.get("text", "")) for part in parts).strip()


def _providers_from_csv(value: str) -> list[str]:
    providers: list[str] = []
    for provider in value.split(","):
        normalized = provider.strip().lower()
        if normalized and normalized not in {"none", "off", "disabled"} and normalized not in providers:
            providers.append(normalized)
    return providers


def _provider_order() -> list[str]:
    providers: list[str] = []
    for provider in (settings.AI_PRIMARY_PROVIDER, settings.AI_FALLBACK_PROVIDER):
        for normalized in _providers_from_csv(provider):
            if normalized not in providers:
                providers.append(normalized)
    return providers or ["ollama"]


def _heavy_provider_order() -> list[str]:
    return _providers_from_csv(settings.AI_HEAVY_PROVIDERS) or _provider_order()


def _ai_request(
    prompt: str,
    num_predict: int = 1000,
    timeout: int = 180,
    providers: list[str] | None = None,
) -> str:
    last_error: requests.RequestException | None = None
    for provider in providers or _provider_order():
        try:
            if provider == "gemini":
                result = _gemini_request(
                    prompt,
                    num_predict=num_predict,
                    timeout=timeout,
                )
            elif provider == "ollama":
                result = _ollama_request(prompt, num_predict=num_predict, timeout=timeout)
            else:
                continue
            if result:
                logger.info("AI request completed with provider=%s", provider)
                return result
        except requests.RequestException as exc:
            logger.warning("AI provider %s failed: %s", provider, exc)
            last_error = exc
    if last_error:
        raise last_error
    return ""


def _ai_request_or_empty(
    prompt: str,
    num_predict: int = 1000,
    timeout: int = 180,
    providers: list[str] | None = None,
) -> str:
    try:
        return _ai_request(
            prompt,
            num_predict=num_predict,
            timeout=timeout,
            providers=providers,
        )
    except requests.RequestException:
        return ""


def _heavy_ai_request_or_empty(prompt: str, num_predict: int = 1000, timeout: int = 180) -> str:
    return _ai_request_or_empty(
        prompt,
        num_predict=num_predict,
        timeout=timeout,
        providers=_heavy_provider_order(),
    )


def _extract_json_array(text: str) -> List[Dict[str, Any]] | None:
    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, list) else None
    except json.JSONDecodeError:
        pass

    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        parsed = json.loads(text[start : end + 1])
        return parsed if isinstance(parsed, list) else None
    except json.JSONDecodeError:
        return None


def _extract_json_object(text: str) -> Dict[str, Any] | None:
    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        parsed = json.loads(text[start : end + 1])
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        return None


def _fallback_questions() -> List[Dict[str, str]]:
    hard = [
        "Which technical skills from your background are most relevant to this role?",
        "Describe a project where you solved a difficult technical problem.",
        "How do you validate the quality of your work before shipping it?",
        "What tools or frameworks have you used that match this position?",
        "Explain how you would approach learning an unfamiliar part of this job.",
        "Describe your experience working with production systems or real users.",
        "How do you troubleshoot a problem when the root cause is unclear?",
        "What metrics or signals do you use to know a solution is working?",
        "Tell us about a time you improved an existing process or system.",
        "How do you document technical decisions for teammates?",
    ]
    soft = [
        "Describe a time you handled conflicting priorities.",
        "How do you communicate progress when work is blocked?",
        "Tell us about feedback you received and how you responded.",
        "How do you collaborate with people outside your direct function?",
        "Describe a time you disagreed with a teammate and resolved it well.",
        "What helps you stay organized during a complex project?",
        "How do you adapt when requirements change late in the process?",
        "Tell us about a time you took ownership of a mistake.",
        "How do you build trust with a new team?",
        "What kind of work environment helps you do your best work?",
    ]
    return [{"text": text, "category": "Hard Skill"} for text in hard] + [
        {"text": text, "category": "Soft Skill"} for text in soft
    ]


def normalize_question_set(questions: List[Dict[str, str]]) -> List[Dict[str, str]]:
    fallback = _fallback_questions()
    hard: list[Dict[str, str]] = []
    soft: list[Dict[str, str]] = []

    for index, question in enumerate(questions):
        text = _clean_text(str(question.get("text", "")))
        if not text:
            continue
        category = _clean_text(str(question.get("category", "")))
        normalized = {"text": text, "category": "Hard Skill" if index < JOB_HARD_QUESTION_COUNT else "Soft Skill"}
        if "soft" in category.lower():
            normalized["category"] = "Soft Skill"
        elif "hard" in category.lower() or "technical" in category.lower():
            normalized["category"] = "Hard Skill"

        if normalized["category"] == "Soft Skill":
            soft.append(normalized)
        else:
            hard.append(normalized)

    existing_texts = {question["text"].lower() for question in hard + soft}
    for question in fallback:
        if len(hard) >= JOB_HARD_QUESTION_COUNT and len(soft) >= JOB_SOFT_QUESTION_COUNT:
            break
        text_key = question["text"].lower()
        if text_key in existing_texts:
            continue
        if question["category"] == "Hard Skill" and len(hard) < JOB_HARD_QUESTION_COUNT:
            hard.append(question)
            existing_texts.add(text_key)
        elif question["category"] == "Soft Skill" and len(soft) < JOB_SOFT_QUESTION_COUNT:
            soft.append(question)
            existing_texts.add(text_key)

    return hard[:JOB_HARD_QUESTION_COUNT] + soft[:JOB_SOFT_QUESTION_COUNT]


QUESTION_CATEGORIES = {
    "Technical Depth",
    "Troubleshooting",
    "Architecture",
    "Communication",
    "Ownership",
    "Prioritization",
}

LOW_VALUE_TERMS = {
    "applying",
    "build",
    "built",
    "candidate",
    "create",
    "created",
    "develop",
    "developed",
    "engineer",
    "experienced",
    "experience",
    "job",
    "role",
    "senior",
    "junior",
    "mid",
    "level",
    "team",
    "teams",
    "work",
    "working",
}

QUESTION_NOISE_PATTERNS = (
    r"\babout\s+us\b",
    r"\bwho\s+we\s+are\b",
    r"\bcompany\s+(?:overview|rating|mission|traction)\b",
    r"\bbenefits?\b",
    r"\bperks?\b",
    r"\bequal\s+opportunity\b",
    r"\beeo\b",
    r"\bapply\s+now\b",
    r"\bsave\s+job\b",
    r"\bshare\s+job\b",
    r"\bsimilar\s+jobs?\b",
    r"\brecommended\s+jobs?\b",
    r"\bwhy\s+join\s+us\b",
    r"\b401\(k\)\b",
    r"\bmedical\s+coverage\b",
    r"\bdental\b",
    r"\bvision\b",
)

GENERIC_SKILL_TERMS = LOW_VALUE_TERMS | {
    "accelerate",
    "accelerated",
    "accelerates",
    "achievements",
    "across",
    "actionable",
    "actions",
    "actions.",
    "active",
    "activities",
    "activity",
    "adoption",
    "agencies",
    "ai-assisted",
    "applications",
    "background",
    "business",
    "career",
    "clients",
    "company",
    "complex",
    "delivery",
    "environment",
    "enterprise",
    "focused",
    "hands",
    "impact",
    "including",
    "managed",
    "modern",
    "operations",
    "process",
    "professional",
    "projects",
    "relevant",
    "requirements",
    "responsibilities",
    "result",
    "results",
    "resume",
    "solutions",
    "stakeholders",
    "systems",
    "technical",
    "using",
    "value",
    "years",
}

KNOWN_SKILL_TERMS = [
    "Python",
    "SQL",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "FastAPI",
    "Flask",
    "Django",
    "PostgreSQL",
    "MySQL",
    "SQL Server",
    "MongoDB",
    "Redis",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Git",
    "GitHub",
    "GitLab",
    "CI/CD",
    "DevOps",
    "Azure",
    "AWS",
    "GCP",
    "VMware",
    "Veeam",
    "Linux",
    "Windows Server",
    "PowerShell",
    "Bash",
    "REST API",
    "GraphQL",
    "Microservices",
    "LLM",
    "LLMs",
    "RAG",
    "Vector Search",
    "Vector Database",
    "Qdrant",
    "LangChain",
    "Ollama",
    "OpenAI",
    "Gemini",
    "Machine Learning",
    "MLOps",
    "AI Agents",
    "AI Agent",
    "Automation",
    "Monitoring",
    "Observability",
    "Cloud Infrastructure",
    "Infrastructure Architecture",
    "Disaster Recovery",
    "Access Control",
    "Identity Management",
    "Cybersecurity",
    "Networking",
    "Load Balancing",
]


def _default_rubric(question_type: str) -> Dict[str, str]:
    if question_type == "Resume-Based":
        return {
            "1": "Vague answer with little connection to the resume item, no clear role, actions, or outcome.",
            "3": "Explains the situation and actions with some detail, but limited depth on trade-offs or measurable impact.",
            "5": "Clear story with context, specific actions, decisions, challenges, measurable outcome, and reflection.",
        }
    return {
        "1": "Generic or incorrect answer that does not address the job requirement or practical scenario.",
        "3": "Partially correct answer with some relevant steps, but missing depth, trade-offs, or production detail.",
        "5": "Strong answer showing correct reasoning, practical execution, trade-offs, risks, and success criteria.",
    }


def _normalize_intentional_question(item: Any, index: int) -> Dict[str, Any] | None:
    if not isinstance(item, dict):
        return None
    text = _clean_text(str(item.get("text") or item.get("question") or ""))
    if not text:
        return None

    question_type = _clean_text(str(item.get("type") or ""))
    if question_type not in {"Resume-Based", "JD-Based"}:
        question_type = "JD-Based" if index < INTENTIONAL_JD_HARD_QUESTION_COUNT else "Resume-Based"

    category = _clean_text(str(item.get("category") or ""))
    if category not in QUESTION_CATEGORIES:
        category = (
            "Ownership"
            if question_type == "Resume-Based" and index % 3 == 0
            else "Communication"
            if question_type == "Resume-Based"
            else "Technical Depth"
            if index % 3 == 1
            else "Troubleshooting"
            if index % 3 == 2
            else "Architecture"
        )

    skill_type = _clean_text(str(item.get("skill_type") or ""))
    if skill_type not in {"Hard", "Soft"}:
        skill_type = "Soft" if index >= INTENTIONAL_JD_HARD_QUESTION_COUNT + INTENTIONAL_RESUME_HARD_QUESTION_COUNT else "Hard"

    raw_rubric = item.get("rubric") if isinstance(item.get("rubric"), dict) else {}
    fallback_rubric = _default_rubric(question_type)
    rubric = {
        "1": _clean_text(str(raw_rubric.get("1") or raw_rubric.get(1) or fallback_rubric["1"])),
        "3": _clean_text(str(raw_rubric.get("3") or raw_rubric.get(3) or fallback_rubric["3"])),
        "5": _clean_text(str(raw_rubric.get("5") or raw_rubric.get(5) or fallback_rubric["5"])),
    }

    source = _clean_text(str(item.get("source") or ("resume_profile" if question_type == "Resume-Based" else "jd_gap")))
    return {
        "id": index + 1,
        "text": text,
        "category": category,
        "type": question_type,
        "skill_type": skill_type,
        "weight": 0.7 if skill_type == "Hard" else 0.3,
        "source": source,
        "rubric": rubric,
    }


def _question_key(question: Dict[str, Any]) -> str:
    return str(question.get("text", "")).strip().lower()


def _append_unique_questions(
    target: list[Dict[str, Any]],
    candidates: list[Dict[str, Any]],
    limit: int,
    seen: set[str],
) -> None:
    for question in candidates:
        if len(target) >= limit:
            break
        key = _question_key(question)
        if not key or key in seen:
            continue
        target.append(question)
        seen.add(key)


def _with_question_traits(
    question: Dict[str, Any],
    *,
    question_type: str,
    skill_type: str,
    category: str | None = None,
    source: str | None = None,
) -> Dict[str, Any]:
    normalized = {**question}
    normalized["type"] = question_type
    normalized["skill_type"] = skill_type
    normalized["weight"] = 0.7 if skill_type == "Hard" else 0.3
    if category:
        normalized["category"] = category
    elif normalized.get("category") not in QUESTION_CATEGORIES:
        normalized["category"] = "Technical Depth" if skill_type == "Hard" else "Communication"
    if source:
        normalized["source"] = source
    normalized["rubric"] = normalized.get("rubric") or _default_rubric(question_type)
    return normalized


def _balanced_intentional_questions(questions: list[Dict[str, Any]]) -> list[Dict[str, Any]]:
    seen: set[str] = set()
    selected: list[Dict[str, Any]] = []

    jd_hard = [
        _with_question_traits(question, question_type="JD-Based", skill_type="Hard", source="jd_gap")
        for question in questions
        if question.get("type") == "JD-Based" and question.get("skill_type") == "Hard"
    ]
    resume_hard = [
        _with_question_traits(question, question_type="Resume-Based", skill_type="Hard", source="resume_profile")
        for question in questions
        if question.get("type") == "Resume-Based" and question.get("skill_type") == "Hard"
    ]
    soft = [
        _with_question_traits(question, question_type=str(question.get("type") or "Resume-Based"), skill_type="Soft")
        for question in questions
        if question.get("skill_type") == "Soft"
    ]

    _append_unique_questions(selected, jd_hard, INTENTIONAL_JD_HARD_QUESTION_COUNT, seen)
    _append_unique_questions(selected, resume_hard, INTENTIONAL_JD_HARD_QUESTION_COUNT + INTENTIONAL_RESUME_HARD_QUESTION_COUNT, seen)
    _append_unique_questions(selected, soft, INTENTIONAL_QUESTION_COUNT, seen)

    remaining = [
        _with_question_traits(question, question_type=str(question.get("type") or "JD-Based"), skill_type=str(question.get("skill_type") or "Hard"))
        for question in questions
    ]
    _append_unique_questions(selected, remaining, INTENTIONAL_QUESTION_COUNT, seen)

    for index, question in enumerate(selected[:INTENTIONAL_QUESTION_COUNT]):
        question["id"] = index + 1
    return selected[:INTENTIONAL_QUESTION_COUNT]


def _contains_question_noise(text: str) -> bool:
    normalized = _clean_text(text).lower()
    return any(re.search(pattern, normalized) for pattern in QUESTION_NOISE_PATTERNS)


def _question_overlaps_source(text: str, source_text: str) -> bool:
    question_tokens = _tokens(text) - LOW_VALUE_TERMS - GENERIC_SKILL_TERMS
    source_tokens = _tokens(source_text) - LOW_VALUE_TERMS - GENERIC_SKILL_TERMS
    if not question_tokens or not source_tokens:
        return True
    return bool(question_tokens & source_tokens)


def _sanitize_intentional_questions(
    questions: list[Dict[str, Any]],
    cleaned_job_description: str,
    *,
    require_jd_overlap: bool = True,
) -> list[Dict[str, Any]]:
    sanitized: list[Dict[str, Any]] = []
    seen: set[str] = set()
    for question in questions:
        text = _clean_text(str(question.get("text") or ""))
        if not text or _contains_question_noise(text):
            continue
        question_type = str(question.get("type") or "")
        skill_type = str(question.get("skill_type") or "")
        if (
            require_jd_overlap
            and question_type == "JD-Based"
            and skill_type == "Hard"
            and not _question_overlaps_source(text, cleaned_job_description)
        ):
            continue
        key = text.lower()
        if key in seen:
            continue
        sanitized.append({**question, "text": text})
        seen.add(key)
    return sanitized


def _sanitize_job_questions(
    questions: list[Dict[str, str]],
    cleaned_job_description: str,
) -> list[Dict[str, str]]:
    sanitized: list[Dict[str, str]] = []
    seen: set[str] = set()
    for question in questions:
        text = _clean_text(str(question.get("text") or ""))
        if not text or _contains_question_noise(text):
            continue
        category = _clean_text(str(question.get("category") or "Hard Skill"))
        if "soft" not in category.lower() and not _question_overlaps_source(text, cleaned_job_description):
            continue
        key = text.lower()
        if key in seen:
            continue
        sanitized.append({"text": text, "category": category})
        seen.add(key)
    return sanitized


def _unique_clean_items(items: list[Any], limit: int = 10) -> list[str]:
    cleaned: list[str] = []
    seen: set[str] = set()
    for item in items:
        text = _clean_text(str(item))
        if not text:
            continue
        if text.lower() in LOW_VALUE_TERMS:
            continue
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(text[:220])
        if len(cleaned) >= limit:
            break
    return cleaned


def _extract_requirement_phrases(job_description: str, skills: list[str], limit: int = 10) -> list[str]:
    phrases: list[str] = []
    for skill in skills:
        skill_text = _clean_text(skill)
        if skill_text and skill_text.lower() in job_description.lower():
            phrases.append(skill_text)

    tech_like = re.findall(
        r"\b[A-Z][A-Za-z0-9+#.-]{2,}(?:\s+[A-Z][A-Za-z0-9+#.-]{2,}){0,2}\b",
        job_description,
    )
    phrases.extend(
        [
            phrase
            for phrase in tech_like
            if phrase.lower() not in LOW_VALUE_TERMS
            and not any(term in phrase.lower().split() for term in {"engineer", "candidate", "role"})
        ]
    )

    lowered = job_description.lower()
    scenario_keywords = [
        "api architecture",
        "distributed systems",
        "production ownership",
        "incident response",
        "troubleshooting",
        "communication with product teams",
        "service integrations",
        "database performance",
        "system design",
        "technical trade-offs",
        "prioritization",
        "scalability",
        "reliability",
        "observability",
        "security",
    ]
    phrases.extend([keyword for keyword in scenario_keywords if keyword in lowered])

    token_phrases = [
        token
        for token in sorted(_tokens(job_description))
        if token not in LOW_VALUE_TERMS and len(token) > 3
    ]
    phrases.extend(token_phrases)
    return _unique_clean_items(phrases, limit=limit)


def _fallback_intentional_questions(
    parsed_profile_json: Dict[str, Any] | None,
    job_description: str,
    experience_level: str,
) -> List[Dict[str, Any]]:
    profile = parsed_profile_json or {}
    skills = _normalize_string_list(
        profile.get("skills"),
        [
            term
            for term in _shared_terms(str(profile), job_description, limit=12)
            if term not in LOW_VALUE_TERMS
        ],
    )
    experience_items = profile.get("experience") if isinstance(profile.get("experience"), list) else []
    resume_sources = _unique_clean_items(
        [item for item in experience_items if _clean_text(str(item))] + skills,
        limit=10,
    ) or ["your most relevant resume project"]
    jd_terms = _extract_requirement_phrases(job_description, skills, limit=10)
    if not jd_terms:
        jd_terms = ["the most important technical requirement", "a production issue", "a cross-functional delivery risk"]

    resume_templates = [
        "Tell me about {source}. What problem were you solving, what was your role, and what changed because of your work?",
        "Walk me through a specific decision you made while working with {source}. What alternatives did you consider?",
        "Describe the hardest challenge connected to {source}. How did you diagnose it and what did you learn?",
        "Explain the process you used to deliver or improve {source}. What signals told you it was working?",
        "What part of {source} are you most proud of, and what would you improve if you did it again?",
        "Describe a trade-off you faced around {source}. How did you decide what mattered most?",
        "If we asked a teammate about your contribution to {source}, what evidence would they point to?",
    ]

    jd_templates = [
        ("Technical Depth", "For a {level} role, explain how you would design or implement work involving {term}. What details would you verify before starting?"),
        ("Troubleshooting", "Imagine {term} is failing in production. How would you isolate the root cause and decide whether to roll back, patch, or monitor?"),
        ("Architecture", "What architecture trade-offs would you consider for {term}, and how would you explain the recommendation to the team?"),
        ("Technical Depth", "What risks do you see in a project centered on {term}, and what engineering practices would reduce those risks?"),
        ("Troubleshooting", "If performance or reliability degraded around {term}, what metrics, logs, or user signals would you inspect first?"),
        ("Architecture", "How would your approach to {term} change as usage, data volume, or team size grows?"),
        ("Technical Depth", "What would an excellent implementation of {term} look like, and what shortcuts would concern you?"),
        ("Troubleshooting", "Tell me how you would handle an ambiguous bug report related to {term} when the business impact is unclear."),
        ("Architecture", "How would you balance speed, maintainability, and correctness when making a decision about {term}?"),
        ("Technical Depth", "What questions would you ask before accepting ownership of {term}, and what would you expect to document?"),
    ]

    soft_templates = [
        ("Communication", "Tell me about a time you had to explain technical work or project status to someone less familiar with the details. How did you make it clear?"),
        ("Ownership", "Describe a time a task, project, or deadline changed unexpectedly. How did you take ownership and keep the work moving?"),
        ("Prioritization", "When several important requests compete for your time, how do you decide what to do first and what to communicate?"),
        ("Communication", "Tell me about a disagreement or unclear expectation you had to resolve with a teammate, manager, or stakeholder."),
        ("Ownership", "Describe a mistake, delay, or surprise you experienced. What did you do next, and what changed afterward?"),
        ("Prioritization", "How do you balance speed, quality, and collaboration when you are under pressure?"),
    ]

    resume_questions = []
    for index, template in enumerate(resume_templates):
        source = resume_sources[index % len(resume_sources)]
        resume_questions.append(
            {
                "id": index + 1,
                "text": template.format(source=source),
                "category": "Ownership",
                "type": "Resume-Based",
                "skill_type": "Hard",
                "weight": 0.7,
                "source": "resume_profile",
                "rubric": _default_rubric("Resume-Based"),
            }
        )

    jd_questions = []
    for offset, (category, template) in enumerate(jd_templates):
        index = offset + 10
        term = jd_terms[offset % len(jd_terms)] if jd_terms else "a core job requirement"
        if "junior" in experience_level.lower() and category == "Architecture":
            category = "Troubleshooting"
        jd_questions.append(
            {
                "id": index + 1,
                "text": template.format(level=experience_level or "target", term=term),
                "category": category,
                "type": "JD-Based",
                "skill_type": "Hard",
                "weight": 0.7,
                "source": "jd_gap",
                "rubric": _default_rubric("JD-Based"),
            }
        )

    soft_questions = []
    for offset, (category, template) in enumerate(soft_templates):
        soft_questions.append(
            {
                "id": offset + 1,
                "text": template,
                "category": category,
                "type": "Resume-Based",
                "skill_type": "Soft",
                "weight": 0.3,
                "source": "soft_skill",
                "rubric": _default_rubric("Resume-Based"),
            }
        )
    return _balanced_intentional_questions(jd_questions + resume_questions + soft_questions)


def generate_intentional_assessment_questions(
    parsed_profile_json: Dict[str, Any] | None,
    resume_text: str,
    job_description: str,
    experience_level: str = "Mid-level",
) -> List[Dict[str, Any]]:
    job_description = clean_job_description_for_scoring(job_description)
    profile_payload = json.dumps(parsed_profile_json or {}, ensure_ascii=True)[:6000]
    prompt = (
        "You are Career Coaching AI creating an intentional private practice interview. "
        "Generate exactly 10 questions based on BOTH the applicant resume/profile and the target job description. "
        "Return only a JSON array of 10 objects. Each object must have: "
        "id, text, category, type, skill_type, weight, source, rubric. "
        "Allowed category values: Technical Depth, Troubleshooting, Architecture, Communication, Ownership, Prioritization. "
        "Allowed type values: Resume-Based or JD-Based. Allowed skill_type values: Hard or Soft. "
        "Rubric must be an object with keys '1', '3', and '5'. "
        "Create exactly 4 JD-Based Hard questions drawn from job requirements or gaps not clearly represented "
        "in the resume. Create exactly 3 Resume-Based Hard storytelling questions drawn exclusively from the applicant's "
        "past projects, skills, experience, achievements, or resume evidence. Create exactly 3 Soft questions covering "
        "communication, ownership, or prioritization; mark them skill_type Soft and weight 0.3. "
        "Mark all Hard questions weight 0.7. Use practical technical depth, troubleshooting, and architecture scenarios "
        "appropriate to the experience level. "
        "Prepare the set for weighted scoring: Hard questions weight 0.7, Soft questions weight 0.3. "
        "Do not invent resume projects or employment history. If resume detail is thin, ask about the most relevant stated skill or experience. "
        "Do not create questions from company boilerplate, About Us, Who We Are, benefits, EEO, apply-now text, similar jobs, compensation, location, or job-board navigation. "
        "JD-Based Hard questions must come only from the cleaned job requirements. Resume-Based Hard questions must come only from resume evidence.\n\n"
        f"Experience level: {experience_level or 'Mid-level'}\n\n"
        f"Parsed resume profile JSON:\n{profile_payload}\n\n"
        "--- START OF CANDIDATE RESUME ---\n"
        f"{resume_text.strip()[:6000]}\n"
        "--- END OF CANDIDATE RESUME ---\n\n"
        "--- START OF CLEANED JOB DESCRIPTION ---\n"
        f"{job_description.strip()[:8000]}\n"
        "--- END OF CLEANED JOB DESCRIPTION ---"
    )
    raw = _ai_request_or_empty(prompt, num_predict=2200, timeout=240)
    parsed_questions = _extract_json_array(raw) if raw else None
    questions: List[Dict[str, Any]] = []
    if parsed_questions is not None:
        for index, item in enumerate(parsed_questions[:INTENTIONAL_QUESTION_COUNT]):
            question = _normalize_intentional_question(item, index)
            if question:
                questions.append(question)

    fallback = _sanitize_intentional_questions(
        _fallback_intentional_questions(parsed_profile_json, job_description, experience_level),
        job_description,
        require_jd_overlap=False,
    )
    questions = _sanitize_intentional_questions(questions, job_description)
    existing = {question["text"].lower() for question in questions}
    for question in fallback:
        if len(questions) >= INTENTIONAL_QUESTION_COUNT:
            break
        if question["text"].lower() not in existing:
            questions.append(question)
            existing.add(question["text"].lower())

    return _balanced_intentional_questions(questions + fallback)


def generate_fast_intentional_assessment_questions(
    parsed_profile_json: Dict[str, Any] | None,
    resume_text: str,
    job_description: str,
    experience_level: str = "Mid-level",
) -> List[Dict[str, Any]]:
    profile = parsed_profile_json or _fallback_profile(resume_text)
    job_description = clean_job_description_for_scoring(job_description)
    return _balanced_intentional_questions(
        _sanitize_intentional_questions(
            _fallback_intentional_questions(profile, job_description, experience_level),
            job_description,
            require_jd_overlap=False,
        )
    )


def _parse_score(raw: str, default: float = 0.0) -> float:
    match = re.search(r"[-+]?\d+(?:\.\d+)?", raw.replace(",", ""))
    if match:
        return float(match.group(0))
    return default


def _score_prompt(scale: str, criteria: str, content: str) -> str:
    return (
        "You are a deterministic recruiting evaluator. "
        "Use the rubric exactly and do not reward style, verbosity, or confidence. "
        f"Score on this scale: {scale}. "
        f"Criteria: {criteria}. "
        "Return exactly one number. No words, no percent sign, no explanation.\n\n"
        f"{content.strip()}"
    )


def _tokens(text: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{2,}", text.lower())
        if token not in STOP_WORDS
    }


def _resume_fallback_score(resume_text: str, job_description: str) -> float:
    return float(score_resume_jd_match(resume_text, job_description)["match_score"])


ANALYSIS_BREAKDOWN_CATEGORIES = [
    "Must-have requirements",
    "Preferred requirements",
    "Experience and seniority",
    "Domain and tools fit",
    "Evidence quality",
]

def _score_from_overlap(resume_text: str, terms: list[str]) -> float:
    if not terms:
        return 50.0
    resume_lower = resume_text.lower()
    matched = sum(1 for term in terms if term.lower() in resume_lower)
    return round(max(0.0, min(100.0, matched / len(terms) * 100.0)), 1)


def _calibrate_resume_match_score(
    model_score: Any,
    resume_text: str,
    job_description: str,
    breakdown: list[Dict[str, Any]] | None = None,
) -> float:
    fallback_score = _resume_fallback_score(resume_text, job_description)
    breakdown_score: float | None = None
    if breakdown:
        weights = {
            "Must-have requirements": 0.35,
            "Preferred requirements": 0.15,
            "Experience and seniority": 0.20,
            "Domain and tools fit": 0.20,
            "Evidence quality": 0.10,
        }
        weighted_score = 0.0
        total_weight = 0.0
        for item in breakdown:
            if not isinstance(item, dict) or not isinstance(item.get("score"), (int, float)):
                continue
            weight = weights.get(str(item.get("category")), 0.0)
            if weight <= 0:
                continue
            weighted_score += float(item["score"]) * weight
            total_weight += weight
        if total_weight > 0:
            breakdown_score = max(0.0, min(100.0, weighted_score / total_weight))

    if breakdown_score is not None:
        return round(breakdown_score, 2)

    return round(max(0.0, min(100.0, fallback_score)), 2)


def _resume_text_quality_issue(resume_text: str) -> str:
    tokens = _tokens(resume_text)
    if len(tokens) < 80:
        return "limited readable resume text"

    raw_words = re.findall(r"\S+", resume_text)
    if not raw_words:
        return "limited readable resume text"

    single_char_ratio = sum(1 for word in raw_words if len(word.strip(".,:;|/")) <= 1) / len(raw_words)
    long_token_ratio = sum(1 for word in raw_words if len(word) > 35) / len(raw_words)
    if single_char_ratio > 0.18:
        return "resume text appears fragmented after parsing"
    if long_token_ratio > 0.08:
        return "resume text contains unusually long parsed tokens"
    return ""


def _resume_evidence_snippets(resume_text: str, terms: list[str], limit: int = 5) -> list[str]:
    lines = [_clean_text(line) for line in resume_text.splitlines() if _clean_text(line)]
    snippets: list[str] = []
    seen: set[str] = set()
    for term in terms:
        term_lower = term.lower()
        for line in lines:
            if term_lower in line.lower() and line.lower() not in seen:
                snippets.append(line[:220])
                seen.add(line.lower())
                break
        if len(snippets) >= limit:
            break
    return snippets


def _confidence_level(resume_text: str, job_description: str, evidence_count: int) -> tuple[str, str]:
    resume_len = len(_tokens(resume_text))
    jd_len = len(_tokens(job_description))
    quality_issue = _resume_text_quality_issue(resume_text)
    if quality_issue:
        return (
            "low",
            f"Confidence is low because the extracted resume text has a quality issue: {quality_issue}. Try a DOCX or text-based PDF for a more reliable rating.",
        )
    if resume_len < 80 or jd_len < 40:
        return (
            "low",
            "Confidence is low because the resume or job description has limited readable detail.",
        )
    if evidence_count < 2:
        return (
            "low",
            "Confidence is low because only limited direct resume evidence matched the job requirements.",
        )
    if resume_len >= 180 and jd_len >= 80 and evidence_count >= 4:
        return (
            "high",
            "Confidence is high because the resume and job description have enough readable detail and multiple evidence matches.",
        )
    return (
        "medium",
        "Confidence is medium because the comparison has useful evidence, but a human should verify depth, recency, and context.",
    )


def _experience_seniority_score(resume_text: str, job_description: str) -> tuple[float, str, list[str]]:
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()
    evidence: list[str] = []
    score = 45.0

    years = [int(value) for value in re.findall(r"\b(\d{1,2})\+?\s*(?:years?|yrs?)\b", resume_lower)]
    if years:
        max_years = max(years)
        score += min(max_years, 15) * 2.2
        evidence.append(f"{max_years}+ years" if f"{max_years}+" in resume_lower else f"{max_years} years")

    senior_terms = [
        ("principal", 18.0),
        ("staff", 16.0),
        ("lead", 14.0),
        ("senior", 12.0),
        ("architect", 12.0),
        ("manager", 8.0),
    ]
    for term, boost in senior_terms:
        if re.search(rf"\b{re.escape(term)}\b", resume_lower):
            score += boost
            evidence.append(term.title())
            break

    scope_terms = [
        "owned",
        "led",
        "architected",
        "designed",
        "implemented",
        "production",
        "enterprise",
        "platform",
        "migration",
        "disaster recovery",
    ]
    scope_hits = [term for term in scope_terms if term in resume_lower]
    score += min(len(scope_hits), 5) * 4.0
    evidence.extend(scope_hits[:3])

    if any(term in jd_lower for term in ["principal", "staff", "lead", "senior", "architect", "manager"]):
        if not any(term in resume_lower for term in ["principal", "staff", "lead", "senior", "architect", "manager"]):
            score -= 15.0
    if any(term in jd_lower for term in ["junior", "entry level", "associate"]) and any(
        term in resume_lower for term in ["principal", "staff", "lead", "senior", "architect"]
    ):
        score -= 8.0

    reason = (
        "Estimated from visible years of experience, seniority keywords, ownership scope, "
        "and whether the resume level appears aligned with the target role."
    )
    return round(max(0.0, min(100.0, score)), 1), reason, evidence[:5]


def _normalize_breakdown_item(item: Any, fallback: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(item, dict):
        item = {}
    category = _clean_text(str(item.get("category") or fallback["category"]))
    if category not in ANALYSIS_BREAKDOWN_CATEGORIES:
        category = fallback["category"]
    score = item.get("score", fallback["score"])
    if not isinstance(score, (int, float)):
        score = fallback["score"]
    return {
        "category": category,
        "score": max(0.0, min(100.0, float(score))),
        "reason": _clean_text(str(item.get("reason") or fallback.get("reason") or "")),
        "evidence": _drop_metadata_leakage(
            _normalize_string_list(item.get("evidence"), fallback.get("evidence") or [])
        )[:4],
    }


def _normalize_requirement_match(item: Any, fallback: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(item, dict):
        item = {}
    strength = _clean_text(str(item.get("strength") or fallback.get("strength") or "medium")).lower()
    if strength not in {"high", "medium", "low"}:
        strength = "medium"
    return {
        "requirement": _clean_text(str(item.get("requirement") or fallback.get("requirement") or ""))[:180],
        "evidence": _drop_metadata_leakage(
            _normalize_string_list(item.get("evidence"), fallback.get("evidence") or [])
        )[:4],
        "strength": strength,
    }


def _normalize_missing_requirement(item: Any, fallback: Dict[str, Any]) -> Dict[str, Any]:
    if not isinstance(item, dict):
        item = {}
    severity = _clean_text(str(item.get("severity") or fallback.get("severity") or "medium")).lower()
    if severity not in {"high", "medium", "low"}:
        severity = "medium"
    return {
        "requirement": _clean_text(str(item.get("requirement") or fallback.get("requirement") or ""))[:180],
        "reason": _clean_text(str(item.get("reason") or fallback.get("reason") or "")),
        "severity": severity,
    }


def _normalize_evidence_quote(
    item: Any,
    fallback: Dict[str, Any],
    resume_text: str,
    job_description: str,
) -> Dict[str, Any]:
    if not isinstance(item, dict):
        item = {}
    source = _clean_text(str(item.get("source") or fallback.get("source") or "resume")).lower()
    if source not in {"resume", "job_description"}:
        source = "resume"
    quote = _clean_text(str(item.get("quote") or ""))
    source_text = resume_text if source == "resume" else job_description
    if not quote or quote.lower() not in source_text.lower():
        source = _clean_text(str(fallback.get("source") or "resume")).lower()
        if source not in {"resume", "job_description"}:
            source = "resume"
        quote = _clean_text(str(fallback.get("quote") or ""))
    return {
        "source": source,
        "quote": quote[:240],
        "supports": _clean_text(str(item.get("supports") or fallback.get("supports") or ""))[:180],
    }


def _looks_like_metadata_leakage(text: str) -> bool:
    normalized = _clean_text(text).lower()
    if not normalized:
        return True
    metadata_prefixes = (
        "application deadline:",
        "apply by:",
        "compensation:",
        "department:",
        "employment type:",
        "job attributes:",
        "job level:",
        "location:",
        "number of openings:",
        "openings:",
        "salary range:",
        "salary:",
        "start date:",
        "target start date:",
        "work mode:",
    )
    if normalized.startswith(metadata_prefixes):
        return True
    if re.search(r"\b(?:salary range|target start date|application deadline|number of openings)\s*:", normalized):
        return True
    return False


def _drop_metadata_leakage(items: list[str]) -> list[str]:
    return [item for item in items if not _looks_like_metadata_leakage(item)]


def _ground_resume_evidence(
    evidence: list[str],
    fallback_evidence: list[str],
    resume_text: str,
) -> list[str]:
    resume_lower = resume_text.lower()
    grounded = [
        item
        for item in evidence
        if item and item.lower() in resume_lower and not _looks_like_metadata_leakage(item)
    ]
    if grounded:
        return grounded[:4]
    return [
        item
        for item in fallback_evidence
        if item and item.lower() in resume_lower and not _looks_like_metadata_leakage(item)
    ][:4]


def _fallback_enhanced_analysis(
    resume_text: str,
    job_description: str,
    score: float,
    strengths: list[str] | None = None,
    weaknesses: list[str] | None = None,
) -> Dict[str, Any]:
    return score_resume_jd_match(resume_text, job_description)


def _normalize_enhanced_analysis(
    parsed: Dict[str, Any] | None,
    resume_text: str,
    job_description: str,
    score: float,
    strengths: list[str],
    weaknesses: list[str],
) -> Dict[str, Any]:
    fallback = _fallback_enhanced_analysis(resume_text, job_description, score, strengths, weaknesses)
    parsed = parsed if isinstance(parsed, dict) else {}

    raw_breakdown = parsed.get("score_breakdown") if isinstance(parsed.get("score_breakdown"), list) else []
    breakdown = []
    for index, fallback_item in enumerate(fallback["score_breakdown"]):
        source_item = raw_breakdown[index] if index < len(raw_breakdown) else {}
        source_evidence = (
            _normalize_string_list(source_item.get("evidence"), [])
            if isinstance(source_item, dict)
            else []
        )
        grounded_evidence = _ground_resume_evidence(
            source_evidence,
            fallback_item.get("evidence") or [],
            resume_text,
        )
        deterministic_item = {
            **fallback_item,
            "evidence": grounded_evidence or fallback_item.get("evidence") or [],
        }
        breakdown.append(_normalize_breakdown_item(deterministic_item, fallback_item))

    matches = [
        _normalize_requirement_match(fallback_item, fallback_item)
        for fallback_item in fallback["requirement_matches"][:6]
    ]
    for index, item in enumerate(matches):
        fallback_item = fallback["requirement_matches"][index] if index < len(fallback["requirement_matches"]) else {}
        item["evidence"] = _ground_resume_evidence(
            item.get("evidence") or [],
            fallback_item.get("evidence") or [],
            resume_text,
        )

    missing = [
        _normalize_missing_requirement(fallback_item, fallback_item)
        for fallback_item in fallback["missing_requirements"][:6]
    ]

    quotes = [
        _normalize_evidence_quote(
            fallback_item,
            fallback_item,
            resume_text,
            job_description,
        )
        for fallback_item in fallback["evidence_quotes"][:5]
    ]

    confidence = fallback["confidence_level"]

    return {
        "score_breakdown": breakdown,
        "requirement_matches": [
            item
            for item in matches
            if item["requirement"] and not _looks_like_metadata_leakage(item["requirement"])
        ],
        "missing_requirements": [
            item
            for item in missing
            if item["requirement"] and not _looks_like_metadata_leakage(item["requirement"])
        ],
        "evidence_quotes": [
            item
            for item in quotes
            if item["quote"] and not _looks_like_metadata_leakage(item["quote"])
        ],
        "confidence_level": confidence,
        "confidence_reason": fallback["confidence_reason"],
    }


def _evidence_based_strengths(enhanced: Dict[str, Any], fallback: list[str]) -> list[str]:
    strengths: list[str] = []
    for item in enhanced.get("requirement_matches", [])[:4]:
        requirement = _clean_text(str(item.get("requirement") or ""))
        evidence = _normalize_string_list(item.get("evidence"), [])
        if not requirement or not evidence:
            continue
        strengths.append(
            f"Documented evidence for {requirement}: {evidence[0]}"
        )
    if strengths:
        return strengths
    return [
        "No affirmative requirement matches passed the scope and contra-evidence guardrails."
    ]


def _evidence_based_weaknesses(enhanced: Dict[str, Any], fallback: list[str]) -> list[str]:
    weaknesses: list[str] = []
    for item in enhanced.get("missing_requirements", [])[:4]:
        requirement = _clean_text(str(item.get("requirement") or ""))
        reason = _clean_text(str(item.get("reason") or "Add a brief example or accomplishment that supports this requirement."))
        reason = re.sub(
            r"(?i)\bno clear resume evidence (?:was )?found(?: for this JD requirement)?\.?",
            "Add a specific resume bullet or project example if you have this experience.",
            reason,
        ).strip()
        if not requirement:
            continue
        weaknesses.append(
            f"Clarify evidence for {requirement}. {reason}"
        )
    return weaknesses or fallback[:4] or [
        "Some requirements may need human verification because the resume evidence is limited or indirect."
    ]


def _safe_resume_comment_from_analysis(
    resume_text: str,
    job_description: str,
    score: float,
) -> str:
    enhanced = _fallback_enhanced_analysis(resume_text, job_description, score)
    confidence = enhanced["confidence_level"]
    lines = [
        f"- AI evidence summary: resume/JD match is {score:.2f}/100 with {confidence} confidence.",
        f"- {enhanced['confidence_reason']}",
    ]
    matches = enhanced.get("requirement_matches", [])
    if matches:
        match = matches[0]
        evidence = _normalize_string_list(match.get("evidence"), [])
        evidence_text = f" Evidence: {evidence[0]}" if evidence else ""
        lines.append(
            f"- Documented match: {match.get('requirement', 'a JD requirement')}.{evidence_text}"
        )
    else:
        lines.append(
            "- Documented match: no strong direct resume evidence was found by the automated check."
        )

    missing = enhanced.get("missing_requirements", [])
    if missing:
        requirement = missing[0].get("requirement", "a JD requirement")
        lines.append(
            f"- Interview probe: no clear resume evidence was found for {requirement}; verify depth, recency, and transferability with the candidate."
        )
    else:
        lines.append(
            "- Interview probe: verify depth, recency, and business impact before making a hiring decision."
        )
    return "\n".join(lines)


def _answer_fallback_score(answer_text: str, question_text: str) -> float:
    answer_tokens = _tokens(answer_text)
    question_tokens = _tokens(question_text)
    if not answer_tokens:
        return 0.0
    relevance = len(answer_tokens & question_tokens) / max(len(question_tokens), 1)
    completeness = min(len(answer_tokens) / 35.0, 1.0)
    return round(max(0.0, min(10.0, relevance * 4.0 + completeness * 6.0)), 2)


def _answer_score_guardrail(answer_text: str, question_text: str, model_score: float | None = None) -> float:
    answer_tokens = _tokens(answer_text)
    question_tokens = _tokens(question_text)
    if not answer_tokens:
        return 0.0

    fallback_score = _answer_fallback_score(answer_text, question_text)
    relevance = len(answer_tokens & question_tokens) / max(len(question_tokens), 1)
    word_count = len(re.findall(r"\b\w+\b", answer_text))
    has_specifics = bool(re.search(r"\b\d+[%+$]?\b", answer_text)) or any(
        term in answer_text.lower()
        for term in [
            "because",
            "for example",
            "implemented",
            "designed",
            "measured",
            "reduced",
            "improved",
            "resolved",
            "trade-off",
            "root cause",
        ]
    )

    cap = 10.0
    if relevance == 0 and word_count < 80:
        cap = 3.0
    elif relevance < 0.08:
        cap = 5.0
    if word_count < 12:
        cap = min(cap, 3.0)
    elif word_count < 25:
        cap = min(cap, 5.0)
    if not has_specifics:
        cap = min(cap, 7.0)

    if model_score is None:
        return round(min(fallback_score, cap), 2)

    bounded_model_score = max(0.0, min(10.0, float(model_score)))
    if abs(bounded_model_score - fallback_score) >= 4.0:
        blended = (bounded_model_score * 0.55) + (fallback_score * 0.45)
    else:
        blended = (bounded_model_score * 0.75) + (fallback_score * 0.25)
    return round(max(0.0, min(cap, blended)), 2)


def _shared_terms(left: str, right: str, limit: int = 8) -> list[str]:
    return sorted(_tokens(left) & _tokens(right))[:limit]


def _first_match(pattern: str, text: str) -> str:
    match = re.search(pattern, text, flags=re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else ""


def _fallback_profile(resume_text: str) -> Dict[str, Any]:
    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    email = _first_match(r"([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})", resume_text)
    phone = _first_match(r"(\+?\d[\d\s().-]{7,}\d)", resume_text)
    skills = _extract_resume_skills(resume_text)
    return {
        "name": lines[0][:120] if lines else "",
        "email": email,
        "phone": phone,
        "address": "",
        "experience": [],
        "skills": skills,
        "education": [],
    }


def _normalize_string_list(value: Any, fallback: list[str] | None = None) -> list[str]:
    if isinstance(value, list):
        return [_clean_text(str(item)) for item in value if _clean_text(str(item))][:8]
    if isinstance(value, str) and value.strip():
        return [_clean_text(value)]
    return fallback or []


def _normalize_skill_name(value: str) -> str:
    cleaned = _clean_text(value).strip(".,:;|/\\()[]{}")
    cleaned = re.sub(r"\s+", " ", cleaned)
    comparable = cleaned.replace("-", " ").lower()
    known_by_lower = {skill.lower(): skill for skill in KNOWN_SKILL_TERMS}
    return known_by_lower.get(cleaned.lower()) or known_by_lower.get(comparable) or cleaned


def _is_useful_skill(value: str) -> bool:
    cleaned = _normalize_skill_name(value)
    lowered = cleaned.lower()
    if not cleaned or lowered in STOP_WORDS or lowered in GENERIC_SKILL_TERMS:
        return False
    if len(cleaned) < 2:
        return False
    if any(char.isdigit() for char in cleaned) or any(char in cleaned for char in ["+", "#", "/", "."]):
        return True
    if lowered in {skill.lower() for skill in KNOWN_SKILL_TERMS}:
        return True
    if len(cleaned.split()) > 1:
        return not all(part.lower() in GENERIC_SKILL_TERMS for part in cleaned.split())
    return cleaned[0].isupper() and len(cleaned) >= 3


def _normalize_skill_list(value: Any, fallback: list[str] | None = None) -> list[str]:
    raw_items: list[str] = []
    if isinstance(value, list):
        raw_items = [str(item) for item in value]
    elif isinstance(value, str) and value.strip():
        raw_items = re.split(r"[,;\n|]+", value)
    else:
        raw_items = fallback or []

    skills: list[str] = []
    seen: set[str] = set()
    for item in raw_items:
        skill = _normalize_skill_name(str(item))
        key = skill.lower()
        if key in seen or not _is_useful_skill(skill):
            continue
        skills.append(skill)
        seen.add(key)
        if len(skills) >= 14:
            break
    return skills


def _extract_resume_skills(resume_text: str, limit: int = 14) -> list[str]:
    text_lower = resume_text.lower()
    skills: list[str] = []
    seen: set[str] = set()
    for skill in KNOWN_SKILL_TERMS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill.lower()).replace(r"\ ", r"[\s-]+") + r"(?![a-z0-9])"
        if re.search(pattern, text_lower):
            normalized = _normalize_skill_name(skill)
            key = normalized.lower()
            if key not in seen:
                skills.append(normalized)
                seen.add(key)
        if len(skills) >= limit:
            return skills

    # If no curated tools are found, fall back only to technical-looking tokens.
    for token in sorted(_tokens(resume_text)):
        normalized = _normalize_skill_name(token)
        key = normalized.lower()
        if key in seen or not _is_useful_skill(normalized):
            continue
        skills.append(normalized)
        seen.add(key)
        if len(skills) >= limit:
            break
    return skills


def _normalize_profile(value: Any, resume_text: str) -> Dict[str, Any]:
    fallback = _fallback_profile(resume_text)
    if not isinstance(value, dict):
        return fallback
    return {
        "name": _clean_text(str(value.get("name") or fallback["name"])),
        "email": _clean_text(str(value.get("email") or fallback["email"])),
        "phone": _clean_text(str(value.get("phone") or fallback["phone"])),
        "address": _clean_text(str(value.get("address") or fallback["address"])),
        "experience": value.get("experience") if isinstance(value.get("experience"), list) else fallback["experience"],
        "skills": _normalize_skill_list(value.get("skills"), fallback["skills"]),
        "education": value.get("education") if isinstance(value.get("education"), list) else fallback["education"],
    }


def clean_resume_text_for_scoring(resume_text: str) -> str:
    cleaned_lines = []
    for line in resume_text.splitlines():
        if re.search(r"\bmatch\s+score\s*:\s*\d+(?:\.\d+)?\s*/\s*100\b", line, re.IGNORECASE):
            continue
        if re.search(r"\bcalibrated\b.*\b(?:requested|fit\s+level|match)\b", line, re.IGNORECASE):
            continue
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines).strip()


def analyze_resume_for_public_tool(resume_text: str, job_description: str) -> Dict[str, Any]:
    resume_text = clean_resume_text_for_scoring(resume_text)
    cleaned_job_description = clean_job_description_for_scoring(job_description)
    score = score_resume_against_job(resume_text, job_description)
    prompt = (
        "You are a deterministic, zero-bias ATS parsing and resume/JD evaluation engine. "
        "Return only valid JSON. Do not include markdown, commentary, or prose outside JSON. "
        "CRITICAL DATA ISOLATION RULES: "
        "1. Do not mix document sources. Requirements must come only from the JOB DESCRIPTION block. "
        "Resume evidence must come only from the CANDIDATE RESUME block. "
        "2. Metadata fields such as salary, compensation, target_start_date, application_deadline, location, "
        "work_mode, employment_type, department, openings, and job_level are not skills or evidence. "
        "Never place metadata alignment commentary inside requirement, evidence, or quote fields. "
        "3. All qualitative evaluation, mismatch explanation, and gap analysis must live only in strengths, "
        "weaknesses, score_breakdown.reason, missing_requirements.reason, confidence_reason, or supports. "
        "4. evidence_quotes with source=resume must be exact short snippets from the CANDIDATE RESUME block. "
        "evidence_quotes with source=job_description must be exact short snippets from the JOB DESCRIPTION block. "
        "5. If a value is missing, use an empty array or concise gap reason. Do not invent filler text. "
        "EVALUATION STRENGTH DEFINITIONS: "
        "STRONG EVIDENCE means explicit, affirmative proof that the candidate personally performed the exact requirement. "
        "MISSING OR UNCLEAR means the resume omits the requirement, shows only adjacent/lower-scope work, or contains "
        "explicit non-performance such as 'did not prepare', 'not responsible for', 'without experience', 'lacked', "
        "or 'assisted another team that owned the work'. CRITICAL: If a snippet proves the candidate did not do "
        "the requirement or lacked the required scope, never classify it as strength or requirement_match; put it "
        "under missing_requirements and weaknesses. "
        "CRITICAL MATCHING CONSTRAINT: SCOPE ALIGNMENT. Do not match generic, entry-level task lists to advanced, "
        "specialized enterprise requirements. A candidate listing 'basic GAAP', 'QuickBooks', 'AP/AR', tax preparation, "
        "or small-business bookkeeping is not evidence for ASC 606, IFRS, consolidated financial statements, "
        "international subsidiaries, statutory reporting, technical accounting memos, cross-functional enterprise "
        "ownership, or accounting policy ownership unless the resume also shows explicit execution at that scope. "
        "If a resume snippet is only a passive skill/tool list without an active execution verb, do not use it as "
        "evidence for strategic requirements such as partnering cross-functionally, maintaining policies, leading teams, "
        "or building scalable frameworks. If scope does not align, classify the requirement as missing_or_unclear. "
        "Return JSON with this shape: "
        '{"match_score": number, "strengths": string[], "weaknesses": string[], '
        '"score_breakdown": [{"category": string, "score": number, "reason": string, "evidence": string[]}], '
        '"requirement_matches": [{"requirement": string, "evidence": string[], "strength": "high|medium|low"}], '
        '"missing_requirements": [{"requirement": string, "reason": string, "severity": "high|medium|low"}], '
        '"evidence_quotes": [{"source": "resume|job_description", "quote": string, "supports": string}], '
        '"confidence_level": "high|medium|low", "confidence_reason": string, '
        '"extracted_profile": {"name": string, "email": string, "phone": string, "address": string, '
        '"experience": string[], "skills": string[], "education": string[]}}. '
        "Use only evidence from the resume and job description. Do not invent facts. "
        "Every strength must be supported by direct resume evidence. Every weakness must be framed as "
        "a resume clarification opportunity, such as adding a specific bullet, project, tool, metric, or result. "
        "Do not imply the resume was not uploaded, and do not present missing evidence as proof that the candidate cannot do it. "
        "Do not make a hiring decision, do not call the candidate qualified or unqualified, and do not mention "
        "protected characteristics. If the resume or JD is thin, lower confidence instead of overstating the result. "
        "The score_breakdown must cover: Must-have requirements, Preferred requirements, Experience and seniority, "
        "Domain and tools fit, and Evidence quality. Evidence quotes must be short exact snippets copied from "
        "the resume or job description. Keep strengths and weaknesses concise.\n\n"
        f"Resume/JD score baseline: {score:.2f}/100\n\n"
        "### INPUT DATA TO EVALUATE\n\n"
        "--- START OF JOB DESCRIPTION ---\n"
        f"{cleaned_job_description.strip()}\n"
        "--- END OF JOB DESCRIPTION ---\n\n"
        "--- START OF CANDIDATE RESUME ---\n"
        f"{resume_text.strip()}\n"
        "--- END OF CANDIDATE RESUME ---\n\n"
        "Execute the matching workflow now and return the strictly typed JSON object."
    )
    raw = _heavy_ai_request_or_empty(prompt, num_predict=1600, timeout=160)
    parsed = _extract_json_object(raw) if raw else None
    shared = _shared_terms(resume_text, cleaned_job_description, limit=8)

    if parsed is None:
        fallback_strengths = (
            [f"Resume language overlaps with the role around: {', '.join(shared)}."]
            if shared
            else ["Readable resume text was extracted for comparison."]
        )
        fallback_weaknesses = [
            "The automated fallback found limited direct evidence; a recruiter should verify depth and recency."
        ]
        enhanced = _fallback_enhanced_analysis(
            resume_text,
            cleaned_job_description,
            score,
            fallback_strengths,
            fallback_weaknesses,
        )
        strengths = _evidence_based_strengths(enhanced, fallback_strengths)
        weaknesses = _evidence_based_weaknesses(enhanced, fallback_weaknesses)
        return {
            "match_score": score,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "extracted_profile": _fallback_profile(resume_text),
            **enhanced,
        }

    model_strengths = _normalize_string_list(parsed.get("strengths"), shared)
    model_weaknesses = _normalize_string_list(parsed.get("weaknesses"), [])
    enhanced = _normalize_enhanced_analysis(
        parsed,
        resume_text,
        cleaned_job_description,
        score,
        model_strengths,
        model_weaknesses,
    )
    normalized_score = _calibrate_resume_match_score(
        parsed.get("match_score"),
        resume_text,
        cleaned_job_description,
        enhanced.get("score_breakdown"),
    )
    strengths = _evidence_based_strengths(enhanced, model_strengths)
    weaknesses = _evidence_based_weaknesses(enhanced, model_weaknesses)

    return {
        "match_score": normalized_score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "extracted_profile": _normalize_profile(parsed.get("extracted_profile"), resume_text),
        **enhanced,
    }


def summarize_resume_match_analysis(analysis: Dict[str, Any]) -> str:
    confidence = str(analysis.get("confidence_level") or "medium").strip().capitalize()
    confidence_reason = str(analysis.get("confidence_reason") or "").strip()
    strengths = [
        str(item).strip()
        for item in analysis.get("strengths", [])
        if str(item).strip()
    ][:2]
    weaknesses = [
        str(item).strip()
        for item in analysis.get("weaknesses", [])
        if str(item).strip()
    ][:2]
    parts = [f"Resume/JD analysis confidence: {confidence}."]
    if confidence_reason:
        parts.append(confidence_reason)
    if strengths:
        parts.append("Matched evidence: " + " ".join(strengths))
    if weaknesses:
        parts.append("Review gaps: " + " ".join(weaknesses))
    return " ".join(parts)


def _resume_readiness_score(resume_text: str, profile: Dict[str, Any]) -> float:
    text = resume_text.lower()
    if not resume_text.strip():
        return 0.0

    skills = _normalize_string_list(profile.get("skills"), [])
    experience = profile.get("experience") or []
    education = profile.get("education") or []
    word_count = len(_tokens(resume_text))
    action_hits = len(
        re.findall(
            r"\b(led|built|designed|developed|implemented|automated|improved|reduced|increased|managed|"
            r"migrated|restored|optimized|launched|architected|created|supported|delivered)\b",
            text,
        )
    )
    quantified_hits = len(
        re.findall(
            r"(\b\d+[,.]?\d*\s*(?:%|percent|k|m|million|hours?|days?|weeks?|months?|years?|users?|"
            r"servers?|vms?|applications?|workloads?|tickets?|incidents?|dollars?|\$)\b|\$\s*\d+)",
            text,
        )
    )
    project_markers = len(
        re.findall(
            r"\b(projects?|portfolio|platform|dashboard|workflow|pipeline|automation|rag|llm|saas|"
            r"microservice|monitor|marketplace)\b",
            text,
        )
    )
    outcome_markers = len(
        re.findall(
            r"\b(cost savings?|saved|reduced|increased|improved|accelerated|standardized|enabled|"
            r"modernized|optimized|resiliency|efficiency|visibility|rollback|zero downtime|business continuity)\b",
            text,
        )
    )
    target_terms = len(
        re.findall(
            r"\b(engineer|architect|devops|infrastructure|ai|cloud|platform|automation|security|"
            r"reliability|full-stack|systems)\b",
            text,
        )
    )

    score = 10.0
    score += 4.0 if profile.get("name") else 0.0
    score += 4.0 if profile.get("email") else 0.0
    score += 4.0 if profile.get("phone") else 0.0
    score += min(len(skills), 16) * 0.75
    score += min(len(experience), 5) * 4.0
    score += 6.0 if education else 0.0
    score += min(action_hits, 18) * 0.75
    score += min(quantified_hits, 12) * 1.35
    score += min(project_markers, 12) * 0.8
    score += min(outcome_markers, 10) * 1.1
    score += min(target_terms, 20) * 0.45
    score += min(word_count / 220.0, 8.0)

    # Very long resumes can be strong but may need tighter targeting.
    if word_count > 1800:
        score -= min((word_count - 1800) / 250.0, 5.0)

    return round(max(0.0, min(100.0, score)), 1)


def _resume_score_label(score: float) -> str:
    if score >= 80:
        return "Strong signal"
    if score >= 60:
        return "Good foundation"
    if score >= 35:
        return "Needs polish"
    return "Needs more evidence"


def _resume_score_explanation() -> str:
    return (
        "Private coaching score from 0-100 based only on resume evidence we can extract: "
        "contact details, target clarity, skills, experience, education, measurable results, "
        "and action-oriented accomplishments. It is not a job-fit score or a measure of your career value."
    )


def _fallback_resume_review(resume_text: str, profile: Dict[str, Any]) -> Dict[str, Any]:
    skills = _normalize_string_list(profile.get("skills"), [])
    score = _resume_readiness_score(resume_text, profile)
    strengths = []
    gaps = []
    next_steps = []

    if skills:
        strengths.append(f"Your resume surfaces searchable skills such as {', '.join(skills[:5])}.")
    else:
        gaps.append("Add a clear skills section with tools, methods, and role-specific keywords.")

    if profile.get("email") and profile.get("phone"):
        strengths.append("Your contact information appears to be present.")
    else:
        gaps.append("Make sure recruiters can find your email and phone quickly.")

    if any(char.isdigit() for char in resume_text):
        strengths.append("The resume includes numbers, which can help show scale or results.")
    else:
        gaps.append("Add measurable outcomes such as dollars, percentages, users, tickets, or time saved.")

    text = resume_text.lower()
    if not any(word in text for word in ["led", "built", "improved", "reduced", "increased", "managed", "launched"]):
        gaps.append("Use stronger action verbs at the start of experience bullets.")

    if len(resume_text.strip()) < 1200:
        next_steps.append("Add 2-4 accomplishment bullets under your most recent role.")
    next_steps.extend(
        [
            "Create a short target-title line that matches the roles you want next.",
            "Keep one master resume here, then tailor copies for each job before applying.",
        ]
    )

    return {
        "headline": "Your resume is ready for a focused polish.",
        "readiness_score": score,
        "score_label": _resume_score_label(score),
        "score_explanation": _resume_score_explanation(),
        "strengths": strengths[:4] or ["Readable resume text was extracted successfully."],
        "gaps": gaps[:4] or ["Add more role-specific accomplishments to make the resume easier to evaluate."],
        "next_steps": next_steps[:4],
        "keywords": skills[:10],
    }


def analyze_resume_for_applicant(resume_text: str) -> Dict[str, Any]:
    profile = _fallback_profile(resume_text)
    prompt = (
        "You are a practical career coach. Review this resume for the applicant. Return only valid JSON "
        "with this exact shape: "
        '{"headline": string, "readiness_score": number, "strengths": string[], "gaps": string[], '
        '"next_steps": string[], "keywords": string[], "extracted_profile": '
        '{"name": string, "email": string, "phone": string, "address": string, '
        '"experience": string[], "skills": string[], "education": string[]}}. '
        "The readiness_score is a private resume-coaching score from 0 to 100. Score only the resume evidence, "
        "not the applicant's career value. Consider contact details, target clarity, skills, experience, education, "
        "measurable results, and action-oriented accomplishments. Treat PROJECTS, SELECTED ACHIEVEMENTS, "
        "portfolio entries, labs, and shipped products as relevant experience evidence when they show what the "
        "applicant built, led, operated, automated, restored, migrated, or improved. Do not dismiss a technical "
        "skill as unsupported if the resume demonstrates it in a project, portfolio item, achievement section, "
        "or experience bullet. If a project is strong but not tied to a business result, frame the gap as "
        "quantifying outcomes or connecting the project to target-role impact, not as missing experience. "
        "Be honest, specific, and useful. Do not invent employment history. Keep each item concise.\n\n"
        f"Resume:\n{resume_text.strip()}"
    )
    raw = _heavy_ai_request_or_empty(prompt, num_predict=1000, timeout=120)
    parsed = _extract_json_object(raw) if raw else None
    if not isinstance(parsed, dict):
        review = _fallback_resume_review(resume_text, profile)
        review["extracted_profile"] = profile
        return review

    extracted_profile = _normalize_profile(parsed.get("extracted_profile"), resume_text)
    fallback_review = _fallback_resume_review(resume_text, extracted_profile)
    score = _resume_readiness_score(resume_text, _fallback_profile(resume_text))

    return {
        "headline": _clean_text(str(parsed.get("headline") or fallback_review["headline"])),
        "readiness_score": score,
        "score_label": _resume_score_label(float(score)),
        "score_explanation": _resume_score_explanation(),
        "strengths": _normalize_string_list(parsed.get("strengths"), fallback_review["strengths"]),
        "gaps": _normalize_string_list(parsed.get("gaps"), fallback_review["gaps"]),
        "next_steps": _normalize_string_list(parsed.get("next_steps"), fallback_review["next_steps"]),
        "keywords": _normalize_skill_list(parsed.get("keywords"), extracted_profile.get("skills") or []),
        "extracted_profile": extracted_profile,
    }


def _fallback_resume_comment(resume_text: str, job_description: str, score: float) -> str:
    shared = _shared_terms(resume_text, job_description)
    if not resume_text.strip():
        return "No readable resume text was available, so the match is based on very limited evidence."
    if not shared:
        return (
            f"Resume/JD match scored {score:.2f}/100. The fallback evaluator found little direct "
            "language overlap with the job description; HR should manually review transferable experience."
        )
    return (
        f"Resume/JD match scored {score:.2f}/100. The resume appears aligned around: "
        f"{', '.join(shared)}. Review the resume for depth, recency, and measurable project outcomes."
    )


def _fallback_answer_comment(
    answers: List[Dict[str, str]],
    questions: List[Dict[str, str]],
    score: float,
) -> str:
    answered = [answer for answer in answers if answer.get("answer_text", "").strip()]
    if not answered:
        return "No substantive answers were provided, so the assessment score is based on missing evidence."
    categories = {str(question.get("category", "General")) for question in questions}
    return (
        f"Q&A assessment averaged {score:.2f}/10 across {len(answered)} answered question(s). "
        f"The responses should be reviewed for specificity, correctness, examples, and coverage of "
        f"{', '.join(sorted(categories)) or 'the role criteria'}."
    )


def _clean_question(item: Any, index: int) -> Dict[str, str] | None:
    if isinstance(item, dict):
        text = item.get("text") or item.get("question")
        category = item.get("category") or ("Hard Skill" if index < JOB_HARD_QUESTION_COUNT else "Soft Skill")
    else:
        text = str(item)
        category = "Hard Skill" if index < JOB_HARD_QUESTION_COUNT else "Soft Skill"
    if not text:
        return None
    return {"text": _clean_text(str(text)), "category": _clean_text(str(category))}


def _clean_text(text: str) -> str:
    return " ".join(text.strip().split())


def generate_job_questions(description: str) -> List[Dict[str, str]]:
    description = clean_job_description_for_scoring(description)
    prompt = (
        "Generate 10 interview questions for the following job description. "
        "Return a JSON array of objects with keys 'text' and 'category'. "
        "Use exactly 7 hard skill questions based on the job requirements and 3 soft skill questions. "
        "Do not create questions from About Us, Who We Are, benefits, EEO, compensation, apply-now text, similar jobs, or job-board navigation. "
        "Use only the cleaned job requirements for hard skill questions.\n\n"
        "--- START OF CLEANED JOB DESCRIPTION ---\n"
        f"{description.strip()}\n"
        "--- END OF CLEANED JOB DESCRIPTION ---"
    )
    raw = _ai_request_or_empty(prompt, num_predict=1000, timeout=180)
    parsed_questions = _extract_json_array(raw) if raw else None
    questions: List[Dict[str, str]] = []
    if parsed_questions is not None:
        for i, item in enumerate(parsed_questions[:JOB_QUESTION_COUNT]):
            question = _clean_question(item, i)
            if question:
                questions.append(question)
    else:
        lines = [line.strip() for line in raw.splitlines() if line.strip()]
        for i, line in enumerate(lines):
            if i >= JOB_QUESTION_COUNT:
                break
            questions.append(
                {"text": _clean_text(line), "category": "Hard Skill" if i < JOB_HARD_QUESTION_COUNT else "Soft Skill"}
            )
    return normalize_question_set(_sanitize_job_questions(questions, description))


def score_resume_against_job(resume_text: str, job_description: str) -> float:
    return _resume_fallback_score(clean_resume_text_for_scoring(resume_text), job_description)


def comment_resume_against_job(
    resume_text: str,
    job_description: str,
    score: float,
) -> str:
    if not resume_text.strip():
        return _fallback_resume_comment(resume_text, job_description, score)
    return _safe_resume_comment_from_analysis(resume_text, job_description, score)


def score_answer(answer_text: str, question_text: str) -> float:
    prompt = _score_prompt(
        "0 to 10, where 0 is blank/irrelevant, 5 is acceptable but shallow, 8 is strong, and 10 is exceptional",
        "directness, correctness, specificity, evidence/examples, and completeness",
        f"Question:\n{question_text.strip()}\n\nAnswer:\n{answer_text.strip()}",
    )
    raw = _heavy_ai_request_or_empty(prompt, num_predict=32, timeout=180)
    if not raw:
        return _answer_score_guardrail(answer_text, question_text)
    return _answer_score_guardrail(answer_text, question_text, _parse_score(raw))


def _matched_answer_questions(
    answers: List[Dict[str, str]],
    questions: List[Dict[str, str]],
) -> List[Dict[str, Any]]:
    matched: List[Dict[str, Any]] = []
    for index, answer in enumerate(answers):
        question = next(
            (
                q
                for q in questions
                if q.get("id") == answer.get("question_id")
                or q.get("text") == answer.get("question_text")
            ),
            None,
        )
        if question is None:
            continue
        skill_type = str(question.get("skill_type") or answer.get("skill_type") or "")
        if not skill_type:
            category = str(question.get("category") or "").lower()
            if "soft" in category:
                skill_type = "Soft"
            elif "hard" in category or category:
                skill_type = "Hard"
        matched.append(
            {
                "index": index + 1,
                "question_id": answer.get("question_id") or question.get("id") or index + 1,
                "question_text": str(question.get("text", "")),
                "answer_text": str(answer.get("answer_text", "")),
                "skill_type": skill_type,
                "weight": question.get("weight") or answer.get("weight"),
            }
        )
    return matched


def _parse_batched_answer_scores(raw: str) -> Dict[int, float]:
    parsed = _extract_json_array(raw) or _extract_json_object(raw)
    if isinstance(parsed, dict):
        for key in ("scores", "results", "answers"):
            if isinstance(parsed.get(key), list):
                parsed = parsed[key]
                break
    if not isinstance(parsed, list):
        return {}

    scores: Dict[int, float] = {}
    for item in parsed:
        if not isinstance(item, dict):
            continue
        raw_index = item.get("index") or item.get("question_id") or item.get("id")
        raw_score = item.get("score")
        if raw_index is None or raw_score is None:
            continue
        try:
            index = int(raw_index)
            score = float(raw_score)
        except (TypeError, ValueError):
            continue
        scores[index] = max(0.0, min(10.0, score))
    return scores


def _score_answers_individually(matched_answers: List[Dict[str, Any]]) -> float:
    scored_items: List[Dict[str, Any]] = []
    for item in matched_answers:
        scored_items.append({**item, "score": score_answer(item["answer_text"], item["question_text"])})
    return _weighted_answer_average(scored_items)


def _weighted_answer_average(scored_items: List[Dict[str, Any]]) -> float:
    hard_scores: list[float] = []
    soft_scores: list[float] = []
    untyped_scores: list[float] = []

    for item in scored_items:
        score = float(item.get("score") or 0.0)
        skill_type = str(item.get("skill_type") or "").strip().lower()
        if skill_type == "hard":
            hard_scores.append(score)
        elif skill_type == "soft":
            soft_scores.append(score)
        else:
            untyped_scores.append(score)

    if hard_scores and soft_scores:
        return (sum(hard_scores) / len(hard_scores) * 0.7) + (
            sum(soft_scores) / len(soft_scores) * 0.3
        )
    if hard_scores:
        return sum(hard_scores) / len(hard_scores)
    if soft_scores:
        return sum(soft_scores) / len(soft_scores)
    return sum(untyped_scores) / len(untyped_scores) if untyped_scores else 0.0


def score_answers(answers: List[Dict[str, str]], questions: List[Dict[str, str]]) -> float:
    matched_answers = _matched_answer_questions(answers, questions)
    if not matched_answers:
        return 0.0

    prompt_payload = [
        {
            "index": item["index"],
            "question_id": item["question_id"],
            "question": item["question_text"],
            "answer": item["answer_text"],
        }
        for item in matched_answers
    ]
    prompt = (
        "You are a deterministic recruiting evaluator. Score each candidate answer independently "
        "on a 0 to 10 scale, where 0 is blank/irrelevant, 5 is acceptable but shallow, 8 is strong, "
        "and 10 is exceptional. Criteria: directness, correctness, specificity, evidence/examples, "
        "and completeness. Do not reward style, verbosity, or confidence. "
        "Return only valid JSON as an array of objects with exactly these keys: "
        '"index" and "score". Do not include explanations.\n\n'
        f"Question and answer payload:\n{json.dumps(prompt_payload, ensure_ascii=False)}"
    )
    raw = _heavy_ai_request_or_empty(prompt, num_predict=max(160, len(matched_answers) * 32), timeout=240)
    scores = _parse_batched_answer_scores(raw) if raw else {}
    if not scores:
        return _score_answers_individually(matched_answers)

    scored_items: List[Dict[str, Any]] = []
    for item in matched_answers:
        score = scores.get(item["index"]) or scores.get(item["question_id"])
        if score is None:
            score = score_answer(item["answer_text"], item["question_text"])
        else:
            score = _answer_score_guardrail(
                item["answer_text"],
                item["question_text"],
                float(score),
            )
        scored_items.append({**item, "score": score})
    return _weighted_answer_average(scored_items)


def comment_answers(
    answers: List[Dict[str, str]],
    questions: List[Dict[str, str]],
    score: float,
) -> str:
    qa_blocks = []
    for answer in answers:
        question = next(
            (
                q
                for q in questions
                if q["id"] == answer["question_id"]
                or q["text"] == answer.get("question_text")
            ),
            None,
        )
        if question is None:
            continue
        qa_blocks.append(
            "Question: "
            f"{question['text']}\n"
            f"Category: {question.get('category', 'General')}\n"
            f"Answer: {answer['answer_text']}"
        )
    prompt = (
        "You are a recruiting evaluator writing an assessment note for HR and a hiring manager. "
        "Review the candidate's question-and-answer assessment. Highlight strong evidence, weak "
        "or generic responses, and follow-up areas for interview. Do not invent facts. "
        "Return 2-4 concise bullet points in plain Markdown.\n\n"
        f"Average Q&A score: {score:.2f}/10\n\n"
        + "\n\n---\n\n".join(qa_blocks)
    )
    raw = _heavy_ai_request_or_empty(prompt, num_predict=450, timeout=180)
    if raw:
        return raw.strip()
    return _fallback_answer_comment(answers, questions, score)
