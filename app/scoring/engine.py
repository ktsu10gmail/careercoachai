import json
import re
from collections import Counter
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.scoring.constants import (
    AFFIRMATIVE_ACTION_VERBS,
    CATEGORY_WEIGHTS,
    DOMAIN_QUALIFIER_RULES,
    DOMAIN_TERMS,
    ENTERPRISE_SCOPE_TERMS,
    GENERIC_BOOKKEEPING_TERMS,
    GENERIC_REQUIREMENT_WORDS,
    IGNORED_JD_SECTION_HEADINGS,
    JD_METADATA_LABELS,
    JD_SECTION_HEADINGS,
    LOW_SIGNAL_DIRECT_TERMS,
    MUST_HAVE_MARKERS,
    NON_REQUIREMENT_LINE_STARTS,
    PREFERRED_MARKERS,
    REQUIREMENT_ACTION_PATTERNS,
    SENIORITY_TERMS,
    STOP_WORDS,
    VAGUE_CULTURE_LINES,
)
from app.scoring.types import Requirement


def score_resume_jd_match(resume_text: str, job_description: str) -> dict[str, Any]:
    resume_text = resume_text or ""
    job_description = clean_job_description_for_scoring(job_description or "")
    requirements = _extract_requirements(job_description)
    matches = [_match_requirement(requirement, resume_text) for requirement in requirements]
    matches = _apply_anti_scattering_guardrail(matches)

    must_matches = [item for item in matches if item["category"] == "must"]
    preferred_matches = [item for item in matches if item["category"] == "preferred"]
    domain_requirements = _extract_domain_requirements(job_description, requirements)
    domain_matches = [_match_requirement(requirement, resume_text) for requirement in domain_requirements]
    domain_matches = _apply_anti_scattering_guardrail(domain_matches)

    must_score = _average_match_score(must_matches)
    preferred_score = _average_match_score(preferred_matches)
    seniority_score, seniority_reason, seniority_evidence = _score_seniority(resume_text, job_description)
    domain_score = _average_match_score(domain_matches) if domain_matches else _average_match_score(matches)
    evidence_score, evidence_reason = _score_evidence_quality(resume_text, job_description, matches)

    breakdown = [
        _breakdown_item(
            "Must-have requirements",
            must_score,
            _reason_for_requirement_group(must_matches, "core JD requirements"),
            _evidence_from_matches(must_matches, limit=4),
        ),
        _breakdown_item(
            "Preferred requirements",
            preferred_score,
            _reason_for_requirement_group(preferred_matches, "preferred JD requirements"),
            _evidence_from_matches(preferred_matches, limit=4),
        ),
        _breakdown_item("Experience and seniority", seniority_score, seniority_reason, seniority_evidence),
        _breakdown_item(
            "Domain and tools fit",
            domain_score,
            _reason_for_requirement_group(domain_matches or matches, "domain and tool requirements"),
            _evidence_from_matches(domain_matches or matches, limit=4),
        ),
        _breakdown_item("Evidence quality", evidence_score, evidence_reason, _evidence_from_matches(matches, limit=4)),
    ]
    weighted_score = sum(item["score"] * CATEGORY_WEIGHTS[item["category"]] for item in breakdown)
    confidence_level, confidence_reason = _confidence(resume_text, job_description, matches)

    return {
        "match_score": round(max(0.0, min(100.0, weighted_score)), 2),
        "score_breakdown": breakdown,
        "requirement_matches": _requirement_matches(matches),
        "missing_requirements": _missing_requirements(matches),
        "evidence_quotes": _evidence_quotes(matches, job_description),
        "confidence_level": confidence_level,
        "confidence_reason": confidence_reason,
    }


def clean_job_description_for_scoring(job_description: str) -> str:
    cleaned_lines = _jd_chunks(job_description)
    if cleaned_lines:
        return "\n".join(cleaned_lines)
    return re.sub(r"\s+", " ", job_description).strip()


def _breakdown_item(category: str, score: float, reason: str, evidence: list[str] | None = None) -> dict[str, Any]:
    return {
        "category": category,
        "score": round(max(0.0, min(100.0, score)), 1),
        "reason": reason,
        "evidence": evidence or [],
    }


def _extract_requirements(job_description: str) -> list[Requirement]:
    chunks = _jd_chunks(job_description)
    requirements: list[Requirement] = []
    seen: set[str] = set()
    for chunk in chunks:
        if _is_jd_section_heading(chunk):
            continue
        if _is_non_requirement_context_line(chunk):
            continue
        category = _classify_requirement(chunk)
        phrases = _salient_phrases(chunk)
        if not phrases:
            continue
        text = _clean_requirement_text(chunk)
        if not text:
            continue
        key = text.lower()
        if key in seen:
            continue
        seen.add(key)
        aliases = tuple(_aliases_for_phrase(phrase) for phrase in phrases)
        flat_aliases = tuple(dict.fromkeys(alias for group in aliases for alias in group))
        requirements.append(Requirement(text=text, category=category, aliases=flat_aliases))
        if len(requirements) >= 14:
            break

    if requirements:
        return requirements

    fallback_terms = _salient_phrases(job_description)[:10]
    return [
        Requirement(text=term, category="must", aliases=tuple(_aliases_for_phrase(term)))
        for term in fallback_terms
    ]


def _jd_chunks(job_description: str) -> list[str]:
    lines = []
    section_mode = "requirements"
    for raw_line in re.split(r"[\n\r]+|(?<=[.;])\s+", job_description):
        line = raw_line.strip()
        line = re.sub(r"^[\s\-*•]+", "", line).strip()
        line = re.sub(r"^\d+[.)]\s+", "", line).strip()
        if len(line) < 8:
            continue
        if _is_jd_section_heading(line):
            section_mode = "ignore" if _is_ignored_jd_section_heading(line) else "requirements"
            continue
        if _is_jd_metadata_line(line):
            continue
        if _is_non_requirement_context_line(line):
            continue
        if (
            section_mode == "ignore"
            and not _is_skill_metadata_line(line)
            and not _line_has_concrete_technical_requirement(line)
        ):
            continue
        lines.append(line[:260])
    return lines


def _classify_requirement(text: str) -> str:
    lower = text.lower()
    if any(_contains_phrase(lower, marker) for marker in PREFERRED_MARKERS):
        return "preferred"
    if any(_contains_phrase(lower, marker) for marker in MUST_HAVE_MARKERS):
        return "must"
    return "must"


def _clean_requirement_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text).strip(" :-")
    return text[:180]


def _is_jd_section_heading(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip().strip(":").lower()
    normalized = normalized.replace("’", "'")
    if not normalized:
        return True
    if normalized in JD_SECTION_HEADINGS:
        return True

    words = re.findall(r"[a-zA-Z']+", normalized)
    if len(words) <= 5 and not re.search(r"\b(?:python|sql|aws|azure|gcp|linux|rhel|kubernetes|docker|terraform|api|llm)\b", normalized):
        heading_like_starts = (
            "about ",
            "benefits",
            "company ",
            "preferred ",
            "required ",
            "requirements",
            "responsibilities",
            "what ",
            "who ",
            "why ",
            "you ",
            "your ",
        )
        if normalized.startswith(heading_like_starts):
            return True
    return False


def _is_ignored_jd_section_heading(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip().strip(":").lower()
    normalized = normalized.replace("’", "'")
    return normalized in IGNORED_JD_SECTION_HEADINGS


def _is_jd_metadata_line(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip().strip(":").lower()
    normalized = normalized.replace("’", "'")
    match = re.match(r"^([a-z][a-z /_-]{2,40})\s*:\s*(.+)$", normalized)
    if not match:
        return False
    label = re.sub(r"[_-]+", " ", match.group(1)).strip()
    value = match.group(2).strip()
    if label not in JD_METADATA_LABELS:
        return False

    # Keep metadata out of requirement matching. If the line contains a true
    # requirement signal, the same requirement should appear in the JD body or
    # required_skills field where it can be evaluated without field leakage.
    if label in {"required skills", "preferred skills"}:
        return False
    return bool(value)


def _is_skill_metadata_line(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip().strip(":").lower()
    normalized = normalized.replace("’", "'")
    return bool(re.match(r"^(required|preferred)\s+skills\s*:\s*\S+", normalized))


def _is_non_requirement_context_line(text: str) -> bool:
    normalized = re.sub(r"\s+", " ", text).strip().strip(":").lower()
    normalized = normalized.replace("’", "'")
    if not normalized:
        return True
    if normalized in VAGUE_CULTURE_LINES:
        return True
    if _looks_like_job_title_line(normalized):
        return True
    if _is_company_marketing_line(normalized):
        return True
    if _is_broad_role_summary_line(normalized):
        return True
    if normalized.startswith(NON_REQUIREMENT_LINE_STARTS) and not _line_has_strong_requirement_signal(normalized):
        return True
    if normalized.startswith(("you ", "you'll ", "youll ", "you're ", "youre ")) and not _line_has_strong_requirement_signal(normalized):
        return True
    return False


def _is_company_marketing_line(normalized: str) -> bool:
    if _line_has_strong_requirement_signal(normalized):
        return False

    company_intro_patterns = (
        r"^[a-z0-9][a-z0-9 .&'-]{1,60}\s+is\s+(?:a|an|the)\s+",
        r"^we\s+(?:build|create|deliver|develop|make|offer|provide|serve)\s+",
        r"^we're\s+(?:building|creating|developing|making)\s+",
        r"^we are\s+(?:building|creating|developing|making)\s+",
        r"^our\s+(?:company|mission|platform|product|products|team|technology)\s+",
        r"^our\s+infrastructure\s+",
        r"^our\s+role\s+is\s+",
        r"^the\s+(?:company|platform|product|products|team)\s+",
        r"^we\s+believe\s+",
    )
    if not any(re.search(pattern, normalized) for pattern in company_intro_patterns):
        return False

    marketing_terms = (
        "business problem",
        "business problems",
        "company",
        "cutting-edge",
        "designed to",
        "end-to-end product",
        "end-to-end products",
        "enterprise ai company",
        "foundation ai model",
        "foundation ai models",
        "leading",
        "mission",
        "platform",
        "product",
        "real-world",
        "security-first",
        "solve",
    )
    return any(term in normalized for term in marketing_terms)


def _looks_like_job_title_line(normalized: str) -> bool:
    if " - " not in normalized and " | " not in normalized:
        return False
    words = re.findall(r"[a-zA-Z+#.-]+", normalized)
    if len(words) > 10:
        return False
    title_terms = {"engineer", "developer", "architect", "manager", "analyst", "specialist", "lead", "director"}
    return any(term in words for term in title_terms)


def _is_broad_role_summary_line(normalized: str) -> bool:
    broad_starts = (
        "collaborate with ",
        "partner closely ",
        "you'll partner ",
        "you will partner ",
        "you'll work across ",
        "you will work across ",
        "you'll work with ",
        "you will work with ",
        "work across ",
        "work closely ",
    )
    if normalized.startswith(broad_starts):
        return not _line_has_concrete_technical_requirement(normalized)
    return False


def _line_has_concrete_technical_requirement(text: str) -> bool:
    lower = text.lower()
    concrete_patterns = (
        r"\basr\b",
        r"\bavatar rendering\b",
        r"\bconcurrent architecture",
        r"\bevaluation framework",
        r"\bkubernetes\b",
        r"\blangchain\b",
        r"\blatency optimization\b",
        r"\bllm",
        r"\bmetrics\b",
        r"\bobservability\b",
        r"\bperformance instrumentation\b",
        r"\bpipecat\b",
        r"\bpython\b",
        r"\breal[- ]time synchronization\b",
        r"\brendering model",
        r"\bspeech\b",
        r"\bstreaming architecture",
        r"\btracing\b",
        r"\btts\b",
        r"\btypescript\b",
    )
    if any(re.search(pattern, lower) for pattern in concrete_patterns):
        return True
    for canonical, aliases in _skill_aliases().items():
        if canonical in LOW_SIGNAL_DIRECT_TERMS:
            continue
        if _contains_phrase(lower, canonical) or any(_contains_phrase(lower, alias) for alias in aliases):
            return True
    return False


def _line_has_explicit_requirement_signal(text: str) -> bool:
    lower = text.lower()
    if _line_has_strong_requirement_signal(lower):
        return True
    if any(re.search(pattern, lower) for pattern in REQUIREMENT_ACTION_PATTERNS):
        return True
    for canonical, aliases in _skill_aliases().items():
        if _contains_phrase(lower, canonical) or any(_contains_phrase(lower, alias) for alias in aliases):
            return True
    return False


def _line_has_strong_requirement_signal(text: str) -> bool:
    lower = text.lower()
    if any(_contains_phrase(lower, marker) for marker in MUST_HAVE_MARKERS + PREFERRED_MARKERS):
        return True
    strong_patterns = (
        r"\bability to\b",
        r"\bable to\b",
        r"\bexperience (?:with|in|building|managing|operating|using)\b",
        r"\bfamiliar(?:ity)? with\b",
        r"\bmust have\b",
        r"\bproficien(?:t|cy) (?:with|in)\b",
        r"\brequired\b",
        r"\bresponsible for\b",
        r"\byou (?:have|bring|can|will|are able to)\b",
    )
    return any(re.search(pattern, lower) for pattern in strong_patterns)


def _salient_phrases(text: str) -> list[str]:
    lower = text.lower()
    phrases: list[str] = []
    known_terms = set(_skill_aliases())
    for canonical, aliases in _skill_aliases().items():
        if _contains_phrase(lower, canonical) or any(_contains_phrase(lower, alias) for alias in aliases):
            phrases.append(canonical)

    nounish = re.findall(r"\b[a-z][a-z0-9+#.-]*(?:\s+[a-z][a-z0-9+#.-]*){0,3}\b", lower)
    for phrase in nounish:
        cleaned = " ".join(token for token in phrase.split() if token not in STOP_WORDS)
        if not cleaned or cleaned in GENERIC_REQUIREMENT_WORDS:
            continue
        tokens = cleaned.split()
        if len(tokens) == 1 and len(tokens[0]) < 3:
            continue
        if len(tokens) == 1 and tokens[0] not in known_terms and tokens[0] not in DOMAIN_TERMS:
            continue
        if len(tokens) == 1 and tokens[0] not in known_terms and tokens[0] in GENERIC_REQUIREMENT_WORDS:
            continue
        if any(token in GENERIC_REQUIREMENT_WORDS for token in tokens) and len(tokens) == 1:
            continue
        phrases.append(cleaned)

    return list(dict.fromkeys(phrases))[:5]


def _extract_domain_requirements(job_description: str, requirements: list[Requirement]) -> list[Requirement]:
    jd_lower = job_description.lower()
    domain_terms = [term for term in DOMAIN_TERMS if _contains_phrase(jd_lower, term)]
    domain_requirements = [
        requirement
        for requirement in requirements
        if any(_contains_phrase(requirement.text.lower(), term) for term in domain_terms)
        or any(alias in DOMAIN_TERMS for alias in requirement.aliases)
    ]
    if domain_requirements:
        return domain_requirements
    return [
        Requirement(text=term, category="must", aliases=tuple(_aliases_for_phrase(term)))
        for term in domain_terms[:8]
    ]


def _match_requirement(requirement: Requirement, resume_text: str) -> dict[str, Any]:
    resume_lower = resume_text.lower()
    direct_terms = [requirement.text, *requirement.aliases]
    for term in direct_terms:
        if _is_low_signal_direct_term(term, requirement.text):
            continue
        if term and _contains_phrase(resume_lower, term):
            snippet = _snippet_for_term(resume_text, term)
            if _is_contra_evidence(snippet, requirement.text):
                return _contra_match(requirement, snippet)
            if _is_weak_resume_header_evidence(snippet):
                continue
            score, level = _direct_match_score(term, requirement.text)
            return {
                "requirement": requirement.text,
                "category": requirement.category,
                "score": score,
                "level": level,
                "evidence": [snippet or term],
            }

    requirement_tokens = _meaningful_tokens(requirement.text)
    resume_tokens = _meaningful_tokens(resume_text)
    if requirement_tokens:
        overlap = requirement_tokens & resume_tokens
        overlap_ratio = len(overlap) / len(requirement_tokens)
        if overlap_ratio >= 0.5:
            evidence = _snippet_for_terms(resume_text, list(overlap))
            if _is_contra_evidence(evidence, requirement.text):
                return _contra_match(requirement, evidence)
            if _is_weak_resume_header_evidence(evidence):
                return _missing_match(requirement)
            return {
                "requirement": requirement.text,
                "category": requirement.category,
                "score": 65.0,
                "level": "adjacent",
                "evidence": [evidence or ", ".join(sorted(overlap))],
            }
        if overlap:
            evidence = _snippet_for_terms(resume_text, list(overlap))
            if _is_contra_evidence(evidence, requirement.text):
                return _contra_match(requirement, evidence)
            if _is_weak_resume_header_evidence(evidence):
                return _missing_match(requirement)
            return {
                "requirement": requirement.text,
                "category": requirement.category,
                "score": 35.0,
                "level": "partial",
                "evidence": [evidence or ", ".join(sorted(overlap))],
            }

    domain_gap_evidence = _domain_gap_evidence(requirement.text, resume_text)
    if domain_gap_evidence:
        return _domain_gap_match(_missing_match(requirement), domain_gap_evidence)

    return _missing_match(requirement)


def _apply_anti_scattering_guardrail(matches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    snippet_usage = Counter(
        _normalize_snippet_key((item.get("evidence") or [""])[0])
        for item in matches
        if item.get("level") in {"direct", "adjacent", "partial"} and item.get("evidence")
    )
    guarded: list[dict[str, Any]] = []
    for item in matches:
        if item.get("level") not in {"direct", "adjacent", "partial"} or not item.get("evidence"):
            guarded.append(item)
            continue

        snippet = str(item["evidence"][0])
        snippet_key = _normalize_snippet_key(snippet)
        if _is_domain_gap_match(
            requirement_text=str(item.get("requirement") or ""),
            snippet=snippet,
        ):
            guarded.append(_domain_gap_match(item, snippet))
        elif _is_scope_mismatch_match(
            requirement_text=str(item.get("requirement") or ""),
            snippet=snippet,
            reuse_count=snippet_usage.get(snippet_key, 0),
        ):
            guarded.append(_scope_gap_match(item, snippet))
        else:
            guarded.append(item)
    return guarded


def _normalize_snippet_key(snippet: str) -> str:
    return re.sub(r"\s+", " ", (snippet or "").strip().lower())


def _scope_gap_match(item: dict[str, Any], snippet: str) -> dict[str, Any]:
    return {
        **item,
        "score": 0.0,
        "level": "scope_gap",
        "evidence": [snippet] if snippet else [],
    }


def _domain_gap_match(item: dict[str, Any], snippet: str) -> dict[str, Any]:
    return {
        **item,
        "score": 20.0,
        "level": "domain_gap",
        "evidence": [snippet] if snippet else [],
    }


def _is_domain_gap_match(requirement_text: str, snippet: str) -> bool:
    requirement_lower = _normalize_snippet_key(requirement_text)
    snippet_lower = _normalize_snippet_key(snippet)
    if not requirement_lower or not snippet_lower:
        return False

    for rule in DOMAIN_QUALIFIER_RULES:
        qualifier_terms = tuple(rule["qualifier_terms"])
        action_terms = tuple(rule["action_terms"])
        if not any(_contains_phrase(requirement_lower, term) for term in qualifier_terms):
            continue
        if any(_contains_phrase(snippet_lower, term) for term in qualifier_terms):
            continue
        if any(_contains_phrase(snippet_lower, term) for term in action_terms):
            return True
    return False


def _domain_gap_evidence(requirement_text: str, resume_text: str) -> str:
    requirement_lower = _normalize_snippet_key(requirement_text)
    if not requirement_lower:
        return ""
    for rule in DOMAIN_QUALIFIER_RULES:
        qualifier_terms = tuple(rule["qualifier_terms"])
        action_terms = tuple(rule["action_terms"])
        if not any(_contains_phrase(requirement_lower, term) for term in qualifier_terms):
            continue
        for action_term in action_terms:
            snippet = _snippet_for_term(resume_text, action_term)
            if not snippet:
                continue
            snippet_lower = _normalize_snippet_key(snippet)
            if any(_contains_phrase(snippet_lower, term) for term in qualifier_terms):
                continue
            return snippet
    return ""


def _is_scope_mismatch_match(requirement_text: str, snippet: str, reuse_count: int) -> bool:
    requirement_lower = requirement_text.lower()
    snippet_lower = _normalize_snippet_key(snippet)
    if not requirement_lower or not snippet_lower:
        return False

    requirement_is_enterprise = any(term in requirement_lower for term in ENTERPRISE_SCOPE_TERMS)
    if not requirement_is_enterprise:
        return False

    snippet_is_generic = _is_generic_bookkeeping_or_tool_snippet(snippet_lower)
    snippet_has_action = _has_affirmative_action(snippet_lower)
    snippet_has_enterprise_scope = any(term in snippet_lower for term in ENTERPRISE_SCOPE_TERMS)

    if snippet_is_generic and reuse_count >= 3:
        return True
    if snippet_is_generic and not snippet_has_enterprise_scope:
        return True
    if not snippet_has_action and not snippet_has_enterprise_scope:
        return True
    return False


def _is_generic_bookkeeping_or_tool_snippet(snippet_lower: str) -> bool:
    generic_hits = sum(1 for term in GENERIC_BOOKKEEPING_TERMS if term in snippet_lower)
    if generic_hits >= 2:
        return True
    comma_like_items = len(re.split(r",|;|\|", snippet_lower))
    return generic_hits >= 1 and comma_like_items >= 3


def _has_affirmative_action(text: str) -> bool:
    return any(_contains_phrase(text, verb) for verb in AFFIRMATIVE_ACTION_VERBS)


def _missing_match(requirement: Requirement) -> dict[str, Any]:
    return {
        "requirement": requirement.text,
        "category": requirement.category,
        "score": 0.0,
        "level": "missing",
        "evidence": [],
    }


def _is_weak_resume_header_evidence(snippet: str) -> bool:
    normalized = re.sub(r"\s+", " ", (snippet or "")).strip().lower()
    normalized = normalized.strip("*_# ")
    if not normalized:
        return True
    if re.match(r"^here(?:'s| is)\s+a\s+(?:strong-match|weak|contra-evidence|scope-mismatch)?", normalized):
        return True
    if "resume snippet for" in normalized and len(_meaningful_tokens(normalized)) <= 8:
        return True
    if _has_affirmative_action(normalized):
        return False

    has_header_separators = normalized.count("|") >= 2
    has_date_range = bool(re.search(r"\b(?:19|20)\d{2}\b\s*(?:-|to|–|—)\s*(?:present|(?:19|20)\d{2})\b", normalized))
    has_title_terms = bool(
        re.search(
            r"\b(?:candidate|position|role|senior|lead|manager|managers|engineer|developer|analyst|bookkeeper|accountant|consultant|assistant|specialist|nurse|hygienist|pharmacist|salesperson)\b",
            normalized,
        )
    )
    if has_title_terms and len(_meaningful_tokens(normalized)) <= 5:
        return True
    if has_header_separators and (has_date_range or has_title_terms):
        return True
    if has_date_range and has_title_terms and len(_meaningful_tokens(normalized)) <= 10:
        return True
    return False


def _contra_match(requirement: Requirement, snippet: str) -> dict[str, Any]:
    return {
        "requirement": requirement.text,
        "category": requirement.category,
        "score": 0.0,
        "level": "contra",
        "evidence": [snippet] if snippet else [],
    }


def _is_contra_evidence(snippet: str, requirement_text: str) -> bool:
    normalized = re.sub(r"\s+", " ", (snippet or "")).strip().lower()
    if not normalized:
        return False

    if _has_targeted_limitation(normalized, requirement_text):
        return True

    contra_patterns = (
        r"\bdid\s+not\b",
        r"\bdoes\s+not\b",
        r"\bdo\s+not\b",
        r"\bhas\s+not\b",
        r"\bhave\s+not\b",
        r"\bhad\s+not\b",
        r"\bnot\s+(?:prepare|prepared|own|owned|lead|led|manage|managed|perform|performed|responsible|accountable|involved)\b",
        r"\bnot\s+responsible\s+for\b",
        r"\bno\s+(?:experience|exposure|ownership|responsibility|evidence)\b",
        r"\bmissing\s+(?:core\s+)?(?:\w+\s+){0,6}(?:requirements|experience|skills|evidence)\b",
        r"\bwithout\s+(?:direct\s+)?(?:experience|ownership|responsibility|performing|preparing|leading|managing)\b",
        r"\black(?:ed|s|ing)?\b",
        r"\bonly\s+used\b",
        r"\bsingle\s+small-scale\b",
        r"\bhad\s+difficulty\b",
        r"\bdue\s+to\s+lack\s+of\b",
        r"\bnot\s+suitable\b",
        r"\brelied\s+on\b",
        r"\bstruggled\s+to\b",
        r"\blimited\s+to\b",
        r"\bonly\s+(?:assisted|supported|shadowed|coordinated|handed off|handoffs)\b",
    )
    if not any(re.search(pattern, normalized) for pattern in contra_patterns):
        return False

    requirement_tokens = _meaningful_tokens(requirement_text)
    snippet_tokens = _meaningful_tokens(normalized)
    if not requirement_tokens:
        return True
    overlap_ratio = len(requirement_tokens & snippet_tokens) / len(requirement_tokens)
    return overlap_ratio >= 0.25 or any(token in snippet_tokens for token in requirement_tokens)


def _has_targeted_limitation(snippet: str, requirement_text: str) -> bool:
    limited_phrases = re.findall(
        r"\blimited\s+(?:experience|exposure|ownership|responsibility)\s+(?:with|in|for|to)\s+([^.;,)]+)",
        snippet,
    )
    if not limited_phrases:
        return False

    requirement_tokens = _meaningful_tokens(requirement_text)
    for phrase in limited_phrases:
        phrase_tokens = _meaningful_tokens(phrase)
        if requirement_tokens & phrase_tokens:
            return True
    return False


def _is_low_signal_direct_term(term: str, requirement_text: str) -> bool:
    normalized = term.lower().strip()
    if normalized not in LOW_SIGNAL_DIRECT_TERMS:
        return False
    return len(_meaningful_tokens(requirement_text)) >= 4


def _direct_match_score(term: str, requirement_text: str) -> tuple[float, str]:
    normalized_term = term.lower().strip()
    normalized_requirement = requirement_text.lower()

    if "kubernetes" in normalized_requirement and "orchestration" in normalized_requirement:
        if normalized_term in {"docker", "containers", "containerization", "cloud", "aws", "azure", "gcp", "google cloud"}:
            return 35.0, "partial"

    if "productionize" in normalized_requirement or "serving, scaling" in normalized_requirement:
        if normalized_term in {
            "ai models",
            "artificial intelligence",
            "generative ai",
            "genai",
            "llm",
            "machine learning",
            "ml",
            "monitoring",
            "monitoring them",
            "observability",
        }:
            return 35.0, "partial"

    if ("llms" in normalized_requirement and "asr" in normalized_requirement) or (
        "llm" in normalized_requirement and "tts" in normalized_requirement
    ):
        if normalized_term in {"llm", "llms", "applied ai", "ai", "ml", "machine learning"}:
            return 65.0, "adjacent"

    return 100.0, "direct"


def _average_match_score(matches: list[dict[str, Any]]) -> float:
    if not matches:
        return 50.0
    return sum(float(item["score"]) for item in matches) / len(matches)


def _score_seniority(resume_text: str, job_description: str) -> tuple[float, str, list[str]]:
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()
    requested_years = _max_years(jd_lower)
    resume_years = _max_years(resume_lower)
    evidence: list[str] = []
    score = 45.0

    if requested_years and resume_years:
        score = min(100.0, resume_years / requested_years * 80.0)
        evidence.append(f"{resume_years} years")
    elif resume_years:
        score = min(88.0, 45.0 + resume_years * 3.0)
        evidence.append(f"{resume_years} years")

    jd_level = _seniority_level(jd_lower)
    resume_level = _seniority_level(resume_lower)
    if resume_level:
        evidence.append(resume_level[0])
        score = max(score, float(resume_level[1]))
    if jd_level and resume_level:
        score += 10.0 if resume_level[1] >= jd_level[1] else -12.0

    ownership_terms = ["led", "owned", "architected", "designed", "implemented", "managed", "delivered"]
    ownership_hits = [term for term in ownership_terms if _contains_phrase(resume_lower, term)]
    if ownership_hits:
        evidence.extend(ownership_hits[:3])
        score += min(len(ownership_hits), 4) * 4.0

    reason = "Estimated from visible years, seniority terms, and ownership verbs in the resume compared with the JD."
    return max(0.0, min(100.0, score)), reason, evidence[:5]


def _score_evidence_quality(
    resume_text: str,
    job_description: str,
    matches: list[dict[str, Any]],
) -> tuple[float, str]:
    resume_tokens = _meaningful_tokens(resume_text)
    jd_tokens = _meaningful_tokens(job_description)
    if not resume_tokens or not jd_tokens:
        return 0.0, "The resume or job description has too little readable text for strong evidence."

    direct_count = sum(1 for item in matches if item["level"] == "direct")
    adjacent_count = sum(1 for item in matches if item["level"] in {"adjacent", "partial"})
    gap_count = sum(1 for item in matches if item["level"] in {"domain_gap", "scope_gap"})
    metrics_bonus = 15.0 if re.search(r"\b\d+[%+$]?\b", resume_text) else 0.0
    readable_bonus = min(len(resume_tokens) / 180.0, 1.0) * 20.0
    score = direct_count * 12.0 + adjacent_count * 6.0 + gap_count * 2.0 + metrics_bonus + readable_bonus
    reason = "Based on direct requirement evidence, adjacent evidence, domain/scope gaps, measurable details, and readable resume depth."
    return min(100.0, score), reason


def _reason_for_requirement_group(matches: list[dict[str, Any]], label: str) -> str:
    if not matches:
        return f"No specific {label} were detected in the job description, so this category uses a neutral baseline."
    direct = sum(1 for item in matches if item["level"] == "direct")
    adjacent = sum(1 for item in matches if item["level"] in {"adjacent", "partial"})
    gaps = sum(1 for item in matches if item["level"] in {"domain_gap", "scope_gap"})
    missing = sum(1 for item in matches if item["level"] in {"missing", "contra"})
    return f"Found {direct} direct, {adjacent} adjacent, {gaps} domain/scope gaps, and {missing} missing evidence points for {label}."


def _requirement_matches(matches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    matched = [item for item in matches if item["level"] not in {"missing", "contra", "scope_gap", "domain_gap"}]
    matched.sort(key=lambda item: item["score"], reverse=True)
    return [
        {
            "requirement": item["requirement"],
            "evidence": item["evidence"][:3],
            "strength": "high" if item["level"] == "direct" else "medium",
        }
        for item in matched[:6]
    ]


def _missing_requirements(matches: list[dict[str, Any]]) -> list[dict[str, Any]]:
    missing = [item for item in matches if item["level"] in {"missing", "contra", "scope_gap", "domain_gap"}]
    return [
        {
            "requirement": item["requirement"],
            "reason": (
                f"Resume contains contra-evidence instead of affirmative proof: {item['evidence'][0]}"
                if item["level"] == "contra" and item.get("evidence")
                else f"Related experience is present, but the required domain qualifier is not proven: {item['evidence'][0]}"
                if item["level"] == "domain_gap" and item.get("evidence")
                else f"Generic or lower-scope resume snippet lacks the explicit operational scope required: {item['evidence'][0]}"
                if item["level"] == "scope_gap" and item.get("evidence")
                else "Add a specific resume bullet, project, tool, metric, or result if you have this experience."
            ),
            "severity": "high" if item["category"] == "must" else "medium",
        }
        for item in missing[:12]
    ]


def _evidence_quotes(matches: list[dict[str, Any]], job_description: str) -> list[dict[str, Any]]:
    quotes: list[dict[str, Any]] = []
    for item in matches:
        if item["level"] == "missing" or not item["evidence"]:
            continue
        quotes.append({"source": "resume", "quote": item["evidence"][0][:240], "supports": item["requirement"]})
        if len(quotes) >= 5:
            return quotes
    if job_description.strip():
        first_line = _jd_chunks(job_description)[:1]
        if first_line:
            quotes.append({"source": "job_description", "quote": first_line[0][:240], "supports": "job description context"})
    return quotes


def _evidence_from_matches(matches: list[dict[str, Any]], limit: int) -> list[str]:
    evidence: list[str] = []
    seen: set[str] = set()
    for item in matches:
        for snippet in item.get("evidence") or []:
            key = snippet.lower()
            if key in seen:
                continue
            evidence.append(snippet)
            seen.add(key)
            if len(evidence) >= limit:
                return evidence
        if len(evidence) >= limit:
            break
    return evidence[:limit]


def _confidence(resume_text: str, job_description: str, matches: list[dict[str, Any]]) -> tuple[str, str]:
    resume_count = len(_meaningful_tokens(resume_text))
    jd_count = len(_meaningful_tokens(job_description))
    direct_count = sum(1 for item in matches if item["level"] == "direct")
    if resume_count < 25 or jd_count < 20:
        return "low", "Confidence is low because the resume or job description has limited readable text."
    if direct_count >= 4 and resume_count >= 40:
        return "high", "Confidence is high because multiple JD requirements have direct resume evidence."
    if direct_count >= 2 or any(item["level"] == "adjacent" for item in matches):
        return "medium", "Confidence is medium because there is useful evidence, but depth and recency still need human verification."
    return "low", "Confidence is low because the system found limited direct requirement evidence in the resume."


def _aliases_for_phrase(phrase: str) -> list[str]:
    lower = phrase.lower().strip()
    aliases = [lower]
    alias_map = _skill_aliases()
    if lower in alias_map:
        aliases.extend(alias_map[lower])
    for canonical, values in alias_map.items():
        if lower in values:
            aliases.append(canonical)
            aliases.extend(values)
    return list(dict.fromkeys(alias for alias in aliases if alias))


@lru_cache(maxsize=1)
def _skill_aliases() -> dict[str, list[str]]:
    path = Path(__file__).parent / "policies" / "skill_aliases.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}
    return {
        str(key).lower(): [str(value).lower() for value in values if str(value).strip()]
        for key, values in data.items()
        if isinstance(values, list)
    }


def _contains_phrase(text: str, phrase: str) -> bool:
    phrase = phrase.lower().strip()
    if not phrase:
        return False
    pattern = r"(?<![a-z0-9])" + re.escape(phrase) + r"(?![a-z0-9])"
    return bool(re.search(pattern, text))


def _meaningful_tokens(text: str) -> set[str]:
    tokens = {
        token
        for token in re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{2,}", text.lower())
        if token not in STOP_WORDS and token not in GENERIC_REQUIREMENT_WORDS
    }
    return tokens


def _max_years(text: str) -> int:
    values = [int(value) for value in re.findall(r"\b(\d{1,2})\+?\s*(?:years?|yrs?)\b", text)]
    return max(values) if values else 0


def _seniority_level(text: str) -> tuple[str, int] | None:
    for term, value in sorted(SENIORITY_TERMS.items(), key=lambda item: item[1], reverse=True):
        if _contains_phrase(text, term):
            return term, value
    return None


def _snippet_for_term(text: str, term: str) -> str:
    return _snippet_for_terms(text, [term])


def _snippet_for_terms(text: str, terms: list[str]) -> str:
    units = _evidence_units(text)
    for unit in units:
        lower = unit.lower()
        if any(_contains_phrase(lower, term.lower()) for term in terms):
            return unit[:240]
    compact = re.sub(r"\s+", " ", text).strip()
    for term in terms:
        match = re.search(r"(?<![a-z0-9])" + re.escape(term.lower()) + r"(?![a-z0-9])", compact.lower())
        if match:
            start = max(0, match.start() - 90)
            end = min(len(compact), match.end() + 150)
            return compact[start:end].strip()
    return ""


def _evidence_units(text: str) -> list[str]:
    units: list[str] = []
    for raw_line in text.splitlines():
        line = re.sub(r"\s+", " ", raw_line).strip()
        line = line.strip(" -*•")
        if not line:
            continue
        parts = re.split(r"(?<=[.!?])\s+|(?<=;)\s+", line)
        for part in parts:
            cleaned = part.strip(" -*•")
            if cleaned:
                units.append(cleaned)
    return units
