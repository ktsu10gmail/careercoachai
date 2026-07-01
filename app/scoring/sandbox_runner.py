import json
import re
from hashlib import sha1
from datetime import datetime
from pathlib import Path
from typing import Any

from app.scoring import score_resume_jd_match
from app.services.ai_service import _ollama_request_or_empty


BASE_DIR = Path(__file__).parent / "sandbox"
JOB_TITLES_PATH = BASE_DIR / "job_titles.txt"
INPUT_DIR = BASE_DIR / "stage_1_inputs"
OUTPUT_DIR = BASE_DIR / "stage_2_outputs"
EVAL_DIR = BASE_DIR / "stage_3_evaluations"
PROMOTED_DIR = BASE_DIR / "promoted_cases"
IGNORED_CANDIDATES_PATH = BASE_DIR / "ignored_promotion_candidates.json"
CALIBRATION_LESSONS_PATH = BASE_DIR / "calibration_lessons.json"
REGRESSION_CASES_PATH = Path(__file__).parent / "regression_cases" / "resume_jd_guardrails.json"
LESSON_TYPES = {"regression_bug", "adjacent_partial", "correct_match"}
JD_SCENARIOS = (
    "clean_baseline",
    "boilerplate_heavy",
    "metadata_heavy",
    "scraped_job_board",
    "compound_skill_list",
    "domain_scope_trap",
)


def ensure_sandbox_dirs() -> None:
    for directory in [BASE_DIR, INPUT_DIR, OUTPUT_DIR, EVAL_DIR, PROMOTED_DIR]:
        directory.mkdir(parents=True, exist_ok=True)
    if not JOB_TITLES_PATH.exists():
        JOB_TITLES_PATH.write_text(
            "Senior Accounting Manager\nAI Systems Engineer\nInfrastructure Architect\n",
            encoding="utf-8",
        )


def read_job_titles() -> list[str]:
    ensure_sandbox_dirs()
    return [
        line.strip()
        for line in JOB_TITLES_PATH.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]


def write_job_titles(titles: list[str]) -> list[str]:
    ensure_sandbox_dirs()
    cleaned = []
    seen = set()
    for title in titles:
        normalized = re.sub(r"\s+", " ", title).strip()
        normalized = re.sub(r"^(?:[-*]\s*|\d+[\.)]\s*)", "", normalized).strip()
        if not normalized or normalized.lower() in seen:
            continue
        cleaned.append(normalized[:160])
        seen.add(normalized.lower())
    JOB_TITLES_PATH.write_text("\n".join(cleaned) + ("\n" if cleaned else ""), encoding="utf-8")
    return cleaned


def sandbox_status() -> dict[str, Any]:
    ensure_sandbox_dirs()
    active_cases = 0
    planned_cases = 0
    if REGRESSION_CASES_PATH.exists():
        try:
            cases = json.loads(REGRESSION_CASES_PATH.read_text(encoding="utf-8"))
            active_cases = sum(1 for case in cases if case.get("status") != "planned")
            planned_cases = sum(1 for case in cases if case.get("status") == "planned")
        except json.JSONDecodeError:
            active_cases = 0
            planned_cases = 0

    return {
        "base_dir": str(BASE_DIR),
        "job_titles": read_job_titles(),
        "input_cases": len([path for path in INPUT_DIR.iterdir() if path.is_dir()]),
        "input_files": len([path for path in INPUT_DIR.glob("**/*") if path.is_file()]),
        "analysis_outputs": len(list(OUTPUT_DIR.glob("**/*_analysis.json"))),
        "evaluation_reports": len(list(EVAL_DIR.glob("**/*_eval.md"))),
        "active_regression_cases": active_cases,
        "planned_regression_cases": planned_cases,
        "recent_inputs": _recent_files(INPUT_DIR),
        "recent_outputs": _recent_files(OUTPUT_DIR),
        "recent_evaluations": _recent_files(EVAL_DIR),
    }


def run_sandbox_stage(stage: str) -> dict[str, Any]:
    ensure_sandbox_dirs()
    generated = 0
    scored = 0
    judged = 0

    if stage in {"generate", "all"}:
        generated = generate_inputs()
    if stage in {"score", "all"}:
        scored = score_inputs()
    if stage in {"judge", "all"}:
        judged = judge_outputs()

    parts = []
    if generated:
        parts.append(f"generated {generated} case(s)")
    if scored:
        parts.append(f"scored {scored} output(s)")
    if judged:
        parts.append(f"judged {judged} report(s)")
    if not parts:
        parts.append("no files changed")

    return {
        "stage": stage,
        "message": f"Sandbox {stage} completed: " + ", ".join(parts) + ".",
        "generated_cases": generated,
        "scored_outputs": scored,
        "judged_reports": judged,
        "status": sandbox_status(),
    }


def import_real_jd_case(job_title: str, job_description: str) -> dict[str, Any]:
    ensure_sandbox_dirs()
    title = re.sub(r"\s+", " ", job_title).strip()[:160]
    jd_text = job_description.strip()
    if not title:
        raise ValueError("Job title is required.")
    if len(jd_text) < 120:
        raise ValueError("Paste a full real job description before importing.")

    digest = sha1(f"{title}|{jd_text[:4000]}".encode("utf-8")).hexdigest()[:10]
    case_slug = _slugify(f"{title}-real-jd-{digest}")
    case_dir = INPUT_DIR / case_slug
    case_dir.mkdir(parents=True, exist_ok=True)

    resumes = {
        "resume_strong.txt": _ollama_or_fallback(
            _resume_prompt(title, jd_text, "strong", "real_jd"),
            _fallback_resume(title, "strong", "real_jd"),
        ),
        "resume_weak.txt": _ollama_or_fallback(
            _resume_prompt(title, jd_text, "weak", "real_jd"),
            _fallback_resume(title, "weak", "real_jd"),
        ),
        "resume_contra.txt": _ollama_or_fallback(
            _resume_prompt(title, jd_text, "contra", "real_jd"),
            _fallback_resume(title, "contra", "real_jd"),
        ),
    }

    (case_dir / "job_description.txt").write_text(jd_text + "\n", encoding="utf-8")
    for filename, content in resumes.items():
        (case_dir / filename).write_text(content.strip() + "\n", encoding="utf-8")

    manifest = {
        "job_title": title,
        "case_slug": case_slug,
        "scenario": "real_jd_paste",
        "generator": "real_jd_paste_plus_ollama_resumes",
        "generated_at": datetime.utcnow().isoformat(),
        "source": "manual_real_jd_paste",
        "resumes": [
            {"file": "resume_strong.txt", "expected_profile": "strong_match"},
            {"file": "resume_weak.txt", "expected_profile": "scope_mismatch"},
            {"file": "resume_contra.txt", "expected_profile": "contra_evidence"},
        ],
    }
    (case_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    scored = score_case_dir(case_dir)
    judged = judge_case_outputs(case_slug)
    return {
        "case_slug": case_slug,
        "message": f"Imported real JD case {case_slug}, scored {scored} resume(s), and judged {judged} report(s).",
        "generated_cases": 1,
        "scored_outputs": scored,
        "judged_reports": judged,
        "status": sandbox_status(),
        "report": pre_promotion_report(),
    }


def pre_promotion_report(limit: int = 80) -> dict[str, Any]:
    ensure_sandbox_dirs()
    ignored_ids = _ignored_candidate_ids()
    saved_lesson_ids = _saved_lesson_ids()
    all_candidates = _promotion_candidates()
    ignored_count = sum(1 for item in all_candidates if item["id"] in ignored_ids)
    saved_count = sum(1 for item in all_candidates if item["id"] in saved_lesson_ids)
    already_promoted_count = sum(1 for item in all_candidates if item["already_promoted"])
    actionable_candidates = [
        item
        for item in all_candidates
        if item["id"] not in ignored_ids and item["id"] not in saved_lesson_ids and not item["already_promoted"]
    ]
    actionable_candidates.sort(key=lambda item: (item["failure_mode"], item["case_slug"]))
    limited = actionable_candidates[: max(1, min(limit, 200))]
    return {
        "raw_candidates": len(all_candidates),
        "total_candidates": len(actionable_candidates),
        "unpromoted_candidates": len(actionable_candidates),
        "ignored_candidates": ignored_count,
        "saved_lesson_candidates": saved_count,
        "already_promoted_candidates": already_promoted_count,
        "shown_candidates": len(limited),
        "candidates": limited,
    }


def promote_regression_candidates(
    candidate_ids: list[str] | None = None,
    lessons: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    ensure_sandbox_dirs()
    selected_lessons = _normalize_lessons(candidate_ids or [], lessons or [])
    candidates = {item["id"]: item for item in _promotion_candidates()}
    existing_cases = _read_json(REGRESSION_CASES_PATH, [])
    if not isinstance(existing_cases, list):
        existing_cases = []
    calibration_lessons = _read_json(CALIBRATION_LESSONS_PATH, [])
    if not isinstance(calibration_lessons, list):
        calibration_lessons = []
    existing_ids = {str(item.get("id")) for item in existing_cases if isinstance(item, dict)}
    existing_signatures = {_case_signature(item) for item in existing_cases if isinstance(item, dict)}
    calibration_ids = {str(item.get("id")) for item in calibration_lessons if isinstance(item, dict)}

    promoted: list[str] = []
    skipped: list[str] = []
    for candidate_id, lesson_type in selected_lessons.items():
        candidate = candidates.get(candidate_id)
        if not candidate:
            skipped.append(candidate_id)
            continue
        proposed_case = candidate.get("proposed_case")
        if not isinstance(proposed_case, dict):
            skipped.append(candidate_id)
            continue
        if lesson_type in {"adjacent_partial", "correct_match"}:
            if candidate_id in calibration_ids:
                skipped.append(candidate_id)
                continue
            calibration_lessons.append(_calibration_lesson_from_candidate(candidate, lesson_type))
            calibration_ids.add(candidate_id)
            promoted.append(candidate_id)
            continue
        if proposed_case["id"] in existing_ids or _case_signature(proposed_case) in existing_signatures:
            skipped.append(candidate_id)
            continue
        if not _valid_regression_case(proposed_case):
            skipped.append(candidate_id)
            continue
        if not _case_passes_current_engine(proposed_case):
            proposed_case = {**proposed_case, "status": "planned"}
        existing_cases.append(proposed_case)
        existing_ids.add(proposed_case["id"])
        existing_signatures.add(_case_signature(proposed_case))
        promoted.append(candidate_id)

    REGRESSION_CASES_PATH.write_text(json.dumps(existing_cases, indent=2) + "\n", encoding="utf-8")
    CALIBRATION_LESSONS_PATH.write_text(json.dumps(calibration_lessons, indent=2) + "\n", encoding="utf-8")
    return {
        "promoted": promoted,
        "skipped": skipped,
        "status": sandbox_status(),
        "report": pre_promotion_report(),
    }


def ignore_regression_candidates(candidate_ids: list[str]) -> dict[str, Any]:
    ensure_sandbox_dirs()
    valid_ids = {item["id"] for item in _promotion_candidates()}
    ignored_ids = _ignored_candidate_ids()
    ignored: list[str] = []
    skipped: list[str] = []
    for candidate_id in set(candidate_ids):
        if candidate_id not in valid_ids:
            skipped.append(candidate_id)
            continue
        ignored_ids.add(candidate_id)
        ignored.append(candidate_id)

    _write_ignored_candidate_ids(ignored_ids)
    return {
        "ignored": ignored,
        "skipped": skipped,
        "report": pre_promotion_report(),
    }


def generate_inputs() -> int:
    titles = read_job_titles()
    generated = 0
    for index, title in enumerate(titles):
        scenario = JD_SCENARIOS[index % len(JD_SCENARIOS)]
        case_slug = _slugify(f"{title}-{scenario}")
        case_dir = INPUT_DIR / case_slug
        case_dir.mkdir(parents=True, exist_ok=True)

        jd_text = _ollama_or_fallback(_jd_prompt(title, scenario), _fallback_jd(title, scenario))
        resumes = {
            "resume_strong.txt": _ollama_or_fallback(
                _resume_prompt(title, jd_text, "strong", scenario),
                _fallback_resume(title, "strong", scenario),
            ),
            "resume_weak.txt": _ollama_or_fallback(
                _resume_prompt(title, jd_text, "weak", scenario),
                _fallback_resume(title, "weak", scenario),
            ),
            "resume_contra.txt": _ollama_or_fallback(
                _resume_prompt(title, jd_text, "contra", scenario),
                _fallback_resume(title, "contra", scenario),
            ),
        }

        (case_dir / "job_description.txt").write_text(jd_text.strip() + "\n", encoding="utf-8")
        for filename, content in resumes.items():
            (case_dir / filename).write_text(content.strip() + "\n", encoding="utf-8")

        manifest = {
            "job_title": title,
            "case_slug": case_slug,
            "scenario": scenario,
            "generator": "ollama",
            "generated_at": datetime.utcnow().isoformat(),
            "resumes": [
                {"file": "resume_strong.txt", "expected_profile": "strong_match"},
                {"file": "resume_weak.txt", "expected_profile": "scope_mismatch"},
                {"file": "resume_contra.txt", "expected_profile": "contra_evidence"},
            ],
        }
        (case_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        generated += 1
    return generated


def score_inputs() -> int:
    ensure_sandbox_dirs()
    scored = 0
    for case_dir in sorted(path for path in INPUT_DIR.iterdir() if path.is_dir()):
        scored += score_case_dir(case_dir)
    return scored


def score_case_dir(case_dir: Path) -> int:
    scored = 0
    if not case_dir.is_dir():
        return 0
    jd_path = case_dir / "job_description.txt"
    manifest_path = case_dir / "manifest.json"
    if not jd_path.exists():
        return 0
    manifest = _read_json(manifest_path, {})
    job_description = jd_path.read_text(encoding="utf-8")
    output_case_dir = OUTPUT_DIR / case_dir.name
    output_case_dir.mkdir(parents=True, exist_ok=True)

    for resume_path in sorted(case_dir.glob("resume_*.txt")):
        resume_text = resume_path.read_text(encoding="utf-8")
        analysis = score_resume_jd_match(resume_text, job_description)
        expected_profile = _expected_profile_for_resume(manifest, resume_path.name)
        payload = {
            "job_title": manifest.get("job_title") or case_dir.name,
            "case_slug": case_dir.name,
            "resume_file": resume_path.name,
            "expected_profile": expected_profile,
            "scored_at": datetime.utcnow().isoformat(),
            **analysis,
        }
        output_path = output_case_dir / f"{resume_path.stem}_analysis.json"
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        scored += 1
    return scored


def judge_outputs() -> int:
    judged = 0
    for analysis_path in sorted(OUTPUT_DIR.glob("**/*_analysis.json")):
        judged += judge_analysis_path(analysis_path)
    return judged


def judge_case_outputs(case_slug: str) -> int:
    judged = 0
    for analysis_path in sorted((OUTPUT_DIR / case_slug).glob("*_analysis.json")):
        judged += judge_analysis_path(analysis_path)
    return judged


def judge_analysis_path(analysis_path: Path) -> int:
    analysis = _read_json(analysis_path, {})
    if not analysis:
        return 0
    report = _ollama_or_fallback(_judge_prompt(analysis), _fallback_judge_report(analysis))
    relative_parent = analysis_path.parent.relative_to(OUTPUT_DIR)
    eval_case_dir = EVAL_DIR / relative_parent
    eval_case_dir.mkdir(parents=True, exist_ok=True)
    eval_path = eval_case_dir / analysis_path.name.replace("_analysis.json", "_eval.md")
    eval_path.write_text(report.strip() + "\n", encoding="utf-8")
    return 1


def _promotion_candidates() -> list[dict[str, Any]]:
    existing_cases = _read_json(REGRESSION_CASES_PATH, [])
    if not isinstance(existing_cases, list):
        existing_cases = []
    existing_ids = {str(item.get("id")) for item in existing_cases if isinstance(item, dict)}
    existing_signatures = {_case_signature(item) for item in existing_cases if isinstance(item, dict)}

    candidates: list[dict[str, Any]] = []
    seen_ids: set[str] = set()
    for analysis_path in sorted(OUTPUT_DIR.glob("**/*_analysis.json")):
        analysis = _read_json(analysis_path, {})
        if not isinstance(analysis, dict):
            continue
        source = _source_texts_for_analysis(analysis)
        if not source:
            continue
        for match in analysis.get("requirement_matches") or []:
            if not isinstance(match, dict):
                continue
            requirement = str(match.get("requirement") or "").strip()
            evidence = " ".join(str(item) for item in match.get("evidence") or [] if item).strip()
            if not requirement or not evidence:
                continue
            detected = _detect_promotion_failure(requirement, evidence, str(match.get("strength") or ""))
            if not detected:
                continue
            candidate = _candidate_from_detection(analysis, source, analysis_path, requirement, evidence, detected)
            if candidate["id"] in seen_ids:
                continue
            proposed_case = candidate["proposed_case"]
            candidate["already_promoted"] = (
                proposed_case["id"] in existing_ids or _case_signature(proposed_case) in existing_signatures
            )
            candidates.append(candidate)
            seen_ids.add(candidate["id"])
    return candidates


def _source_texts_for_analysis(analysis: dict[str, Any]) -> dict[str, str] | None:
    case_slug = str(analysis.get("case_slug") or "").strip()
    resume_file = str(analysis.get("resume_file") or "").strip()
    if not case_slug or not resume_file:
        return None
    case_dir = INPUT_DIR / case_slug
    jd_path = case_dir / "job_description.txt"
    resume_path = case_dir / resume_file.replace("_analysis.json", ".txt")
    if not resume_path.exists():
        resume_path = case_dir / resume_file
    if not jd_path.exists() or not resume_path.exists():
        return None
    return {
        "job_description": jd_path.read_text(encoding="utf-8").strip(),
        "resume": resume_path.read_text(encoding="utf-8").strip(),
    }


def _detect_promotion_failure(requirement: str, evidence: str, strength: str) -> dict[str, Any] | None:
    normalized = re.sub(r"\s+", " ", evidence).strip()
    lower = normalized.lower()
    if re.match(r"^here(?:'s| is)\s+a\s+(?:strong-match|weak|contra-evidence|scope-mismatch)?", lower):
        return {
            "failure_mode": "sandbox_preface_as_evidence",
            "summary": "A generated or pasted preface line was used as matched resume evidence.",
            "must_not": _short_needles(normalized),
            "must_missing": [_short_requirement(requirement)],
        }
    if "resume snippet for" in lower:
        return {
            "failure_mode": "sandbox_preface_as_evidence",
            "summary": "A resume-snippet preface was used as matched evidence.",
            "must_not": _short_needles(normalized),
            "must_missing": [_short_requirement(requirement)],
        }
    contra_patterns = (
        r"\bdid\s+not\b",
        r"\bno\s+experience\b",
        r"\bnot\s+responsible\b",
        r"\blimited\s+(?:experience|exposure|ownership|responsibility)\b",
        r"\brelied\s+on\b",
        r"\bstruggled\s+to\b",
        r"\black(?:ed|s|ing)?\b",
        r"\bonly\s+used\b",
        r"\bsingle\s+small-scale\b",
    )
    if any(re.search(pattern, lower) for pattern in contra_patterns):
        return {
            "failure_mode": "contra_or_scope_evidence_matched",
            "summary": "Evidence containing an explicit limitation or non-performance was matched positively.",
            "must_not": _short_needles(normalized),
            "must_missing": _short_needles(normalized),
        }
    meaningful = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{2,}", lower)
    title_like = bool(
        re.search(
            r"\b(?:assistant|candidate|engineer|developer|hygienist|manager|nurse|pharmacist|specialist|salesperson)\b",
            lower,
        )
    )
    if title_like and len(meaningful) <= 5 and strength.lower() == "high":
        return {
            "failure_mode": "title_or_header_as_proof",
            "summary": "A bare title/header line was treated as strong requirement proof.",
            "must_not": _short_needles(normalized),
            "must_missing": [_short_requirement(requirement)],
        }
    return None


def _candidate_from_detection(
    analysis: dict[str, Any],
    source: dict[str, str],
    analysis_path: Path,
    requirement: str,
    evidence: str,
    detected: dict[str, Any],
) -> dict[str, Any]:
    case_slug = str(analysis.get("case_slug") or analysis_path.parent.name)
    resume_file = str(analysis.get("resume_file") or analysis_path.name)
    seed = "|".join([detected["failure_mode"], case_slug, resume_file, requirement, evidence[:160]])
    digest = sha1(seed.encode("utf-8")).hexdigest()[:10]
    proposed_case = {
        "id": f"FM-AUTO-{digest}",
        "description": f"{detected['summary']} Source: {case_slug}/{resume_file}.",
        "job_description": _compact_text(source["job_description"], 1800),
        "resume": _compact_text(source["resume"], 1800),
        "must_not_match_text": detected["must_not"],
        "must_missing_text": detected["must_missing"],
    }
    if detected["failure_mode"] == "sandbox_preface_as_evidence":
        proposed_case["must_match_text"] = _positive_terms_from_requirement(requirement)
    return {
        "id": proposed_case["id"],
        "failure_mode": detected["failure_mode"],
        "case_slug": case_slug,
        "resume_file": resume_file,
        "requirement": requirement,
        "evidence": evidence[:500],
        "reason": detected["summary"],
        "analysis_path": str(analysis_path.relative_to(BASE_DIR)),
        "proposed_case": proposed_case,
        "already_promoted": False,
    }


def _short_needles(text: str) -> list[str]:
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= 120:
        return [compact]
    phrase_patterns = (
        r"did not [^.;]+",
        r"no experience [^.;]+",
        r"limited (?:experience|exposure|ownership|responsibility) [^.;,)]+",
        r"relied on [^.;]+",
        r"struggled to [^.;]+",
        r"lacks? [^.;]+",
        r"single small-scale project",
        r"here(?:'s| is) a [^:\n]+",
    )
    lower = compact.lower()
    for pattern in phrase_patterns:
        match = re.search(pattern, lower)
        if match:
            return [compact[match.start() : match.end()][:120]]
    return [compact[:120]]


def _short_requirement(requirement: str) -> str:
    return re.sub(r"\s+", " ", requirement).strip()[:120]


def _positive_terms_from_requirement(requirement: str) -> list[str]:
    terms = []
    for token in re.findall(r"\b[A-Z][A-Za-z0-9+#.-]{2,}\b|\b(?:Python|SQL|HTML5|CSS3|JavaScript|AWS|Azure|Linux|Kubernetes)\b", requirement):
        if token not in terms:
            terms.append(token)
    return terms[:4]


def _compact_text(text: str, limit: int) -> str:
    compact = re.sub(r"\n{3,}", "\n\n", text).strip()
    return compact[:limit]


def _case_signature(case: dict[str, Any]) -> str:
    payload = {
        "job_description": case.get("job_description"),
        "resume": case.get("resume"),
        "must_not_match_text": case.get("must_not_match_text"),
        "must_missing_text": case.get("must_missing_text"),
    }
    return sha1(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


def _valid_regression_case(case: dict[str, Any]) -> bool:
    required = ["id", "description", "job_description", "resume"]
    if any(not str(case.get(key) or "").strip() for key in required):
        return False
    if not case.get("must_not_match_text") and not case.get("must_missing_text") and not case.get("must_match_text"):
        return False
    return len(str(case["job_description"])) >= 20 and len(str(case["resume"])) >= 20


def _case_passes_current_engine(case: dict[str, Any]) -> bool:
    result = score_resume_jd_match(str(case.get("resume") or ""), str(case.get("job_description") or ""))
    matched_text = json.dumps(result.get("requirement_matches", []), sort_keys=True).lower()
    missing_text = json.dumps(result.get("missing_requirements", []), sort_keys=True).lower()
    full_text = json.dumps(result, sort_keys=True).lower()

    for text in case.get("must_not_match_text") or []:
        if str(text).lower() in matched_text:
            return False
    for text in case.get("must_missing_text") or []:
        if str(text).lower() not in missing_text:
            return False
    for text in case.get("must_match_text") or []:
        if str(text).lower() not in full_text:
            return False
    return True


def _ignored_candidate_ids() -> set[str]:
    ignored = _read_json(IGNORED_CANDIDATES_PATH, [])
    if not isinstance(ignored, list):
        return set()
    return {str(item) for item in ignored if str(item).strip()}


def _write_ignored_candidate_ids(candidate_ids: set[str]) -> None:
    IGNORED_CANDIDATES_PATH.write_text(
        json.dumps(sorted(candidate_ids), indent=2) + "\n",
        encoding="utf-8",
    )


def _saved_lesson_ids() -> set[str]:
    saved = _read_json(CALIBRATION_LESSONS_PATH, [])
    if not isinstance(saved, list):
        return set()
    return {str(item.get("id")) for item in saved if isinstance(item, dict) and str(item.get("id") or "").strip()}


def _normalize_lessons(candidate_ids: list[str], lessons: list[dict[str, str]]) -> dict[str, str]:
    normalized: dict[str, str] = {}
    for candidate_id in candidate_ids:
        candidate_id = str(candidate_id).strip()
        if candidate_id:
            normalized[candidate_id] = "regression_bug"
    for lesson in lessons:
        candidate_id = str(lesson.get("candidate_id") or "").strip()
        lesson_type = str(lesson.get("lesson_type") or "regression_bug").strip()
        if candidate_id and lesson_type in LESSON_TYPES:
            normalized[candidate_id] = lesson_type
    return normalized


def _calibration_lesson_from_candidate(candidate: dict[str, Any], lesson_type: str) -> dict[str, Any]:
    proposed_case = candidate.get("proposed_case") if isinstance(candidate.get("proposed_case"), dict) else {}
    return {
        "id": candidate["id"],
        "lesson_type": lesson_type,
        "description": candidate.get("reason") or "",
        "failure_mode": candidate.get("failure_mode") or "",
        "case_slug": candidate.get("case_slug") or "",
        "resume_file": candidate.get("resume_file") or "",
        "requirement": candidate.get("requirement") or "",
        "evidence": candidate.get("evidence") or "",
        "analysis_path": candidate.get("analysis_path") or "",
        "job_description": proposed_case.get("job_description") or "",
        "resume": proposed_case.get("resume") or "",
        "created_at": datetime.utcnow().isoformat(),
    }


def _recent_files(root: Path, limit: int = 8) -> list[dict[str, Any]]:
    if not root.exists():
        return []
    files = [path for path in root.glob("**/*") if path.is_file()]
    files.sort(key=lambda path: path.stat().st_mtime, reverse=True)
    items = []
    for path in files[:limit]:
        stat = path.stat()
        items.append(
            {
                "path": str(path.relative_to(BASE_DIR)),
                "name": path.name,
                "size_bytes": stat.st_size,
                "updated_at": datetime.utcfromtimestamp(stat.st_mtime),
            }
        )
    return items


def _read_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback


def _expected_profile_for_resume(manifest: dict[str, Any], filename: str) -> str:
    for item in manifest.get("resumes") or []:
        if item.get("file") == filename:
            return str(item.get("expected_profile") or "")
    return ""


def _ollama_or_fallback(prompt: str, fallback: str) -> str:
    response = _ollama_request_or_empty(prompt, num_predict=1800, timeout=180)
    return response.strip() if response.strip() else fallback


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.lower()).strip("-")
    return slug or "case"


def _jd_prompt(title: str, scenario: str) -> str:
    scenario_instruction = {
        "clean_baseline": (
            "Use only Responsibilities, Required Skills, and Preferred Skills. "
            "This is the clean control case."
        ),
        "boilerplate_heavy": (
            "Include noisy sections: About Us, Who We Are, Our Mission, Benefits, Equal Opportunity Employer, "
            "and then real Responsibilities and Required Skills. The boilerplate must sound like company marketing, "
            "not candidate requirements."
        ),
        "metadata_heavy": (
            "Include Job Attributes with salary range, work mode, location, employment type, target start date, "
            "travel, sponsorship, and security clearance before the real requirements."
        ),
        "scraped_job_board": (
            "Simulate copied job board text with Apply now, similar jobs, company rating, navigation labels, "
            "repeated company snippets, benefits, and EEO text mixed around the real requirements."
        ),
        "compound_skill_list": (
            "Include at least one long comma-separated Required Skills line with 12-18 tools, platforms, or technologies. "
            "Some tools should be essential and some optional."
        ),
        "domain_scope_trap": (
            "Include requirements with domain qualifiers and scope qualifiers, such as software/SaaS, enterprise, "
            "regulated industry, global, multi-site, high-volume, or low-latency. Make the qualifier essential."
        ),
    }[scenario]
    return (
        "Write a realistic job description for a scoring-engine stress test. "
        "The text should look like something copied from a real job posting. "
        "Always include concrete Responsibilities and Required Skills somewhere in the text. "
        f"Scenario: {scenario}. {scenario_instruction}\n\n"
        f"Job title: {title}\n\n"
        "Return only the job posting text."
    )


def _resume_prompt(title: str, jd_text: str, profile: str, scenario: str) -> str:
    profile_instruction = {
        "strong": "Create a strong-match resume snippet with explicit affirmative evidence for most core requirements. Use realistic wording, not exact copy.",
        "weak": "Create a weak or scope-mismatch resume snippet with adjacent low-level tools but lacking enterprise scope.",
        "contra": "Create a contra-evidence resume snippet that mentions some relevant terms but explicitly says the candidate did not perform one or more higher-scope requirements.",
    }[profile]
    scenario_instruction = {
        "domain_scope_trap": (
            "For weak and contra profiles, include related generic experience but omit or negate the essential domain qualifier. "
            "Example pattern: generic sales but not software/SaaS sales, or generic infrastructure but not low-latency trading infrastructure."
        ),
        "compound_skill_list": (
            "For weak and contra profiles, include only some of the listed tools so the scorer must avoid matched/missing contradictions."
        ),
    }.get(scenario, "Keep the resume realistic and avoid copying JD boilerplate as if it were candidate evidence.")
    return (
        f"{profile_instruction}\n\n"
        f"Scenario instruction: {scenario_instruction}\n\n"
        f"Target job title: {title}\n\n"
        f"Job description:\n{jd_text}\n\n"
        "Return only the resume snippet text."
    )


def _judge_prompt(analysis: dict[str, Any]) -> str:
    return (
        "You are a strict QA inspector for a resume/JD scoring engine. "
        "Review this JSON output for known failure modes: metadata leakage, boilerplate leakage, "
        "contra-evidence as matched evidence, generic snippet scattering, title/header proof, "
        "scope mismatch, and matched/missing contradiction. "
        "If you find a real issue, include a proposed regression case in JSON at the end. "
        "If the output is clean, say so clearly.\n\n"
        f"Analysis JSON:\n{json.dumps(analysis, indent=2)}"
    )


def _fallback_jd(title: str, scenario: str) -> str:
    core = (
        "Responsibilities\n"
        f"- Own core delivery for {title} workstreams in production environments.\n"
        "- Document decisions, risks, and measurable outcomes.\n"
        "- Partner with cross-functional stakeholders to improve reliability, quality, and execution.\n\n"
        "Required Skills\n"
        "- Hands-on experience with the primary tools, systems, and workflows for the role.\n"
        "- Ability to explain trade-offs, scale, and operational impact.\n"
        "- Evidence of production ownership, stakeholder communication, and measurable results.\n\n"
        "Preferred Skills\n"
        "- Experience improving automation, reliability, reporting, or stakeholder workflows."
    )
    if scenario == "boilerplate_heavy":
        return (
            "About Us\n"
            "Acme Growth Labs is building delightful tools for ambitious teams. We believe great people make great things together.\n\n"
            "Who We Are\n"
            "We are curious, kind, customer-obsessed, and committed to an inclusive workplace.\n\n"
            f"{core}\n\n"
            "Benefits\n"
            "Flexible PTO, wellness stipend, learning budget, team events, and medical coverage.\n\n"
            "Equal Opportunity Employer\n"
            "We celebrate diversity and encourage applicants from all backgrounds."
        )
    if scenario == "metadata_heavy":
        return (
            "Job Attributes\n"
            "Employment type: Full-time\n"
            "Work mode: Hybrid\n"
            "Location: New York, NY\n"
            "Salary range: $110,000 - $150,000\n"
            "Target start date: 2026-09-15\n"
            "Travel: Up to 15%\n"
            "Sponsorship: Not available\n\n"
            f"{core}"
        )
    if scenario == "scraped_job_board":
        return (
            "Apply now\n"
            "Company rating 4.4 | Similar jobs | Save job | Share\n\n"
            "About the company\n"
            "Acme is a leading platform helping teams do their best work. Today, thousands of customers trust our tools.\n\n"
            f"{core}\n\n"
            "Recommended jobs near you\n"
            "Senior Analyst, Operations Lead, Customer Success Manager\n\n"
            "Benefits and perks\n"
            "Dental, vision, 401(k), commuter benefits, and free snacks.\n\n"
            "EEO Statement\n"
            "We are an equal opportunity employer."
        )
    if scenario == "compound_skill_list":
        return (
            f"{core}\n\n"
            "Required Skills: Python, SQL, AWS, Azure, Kubernetes, Docker, Terraform, Ansible, Linux, PostgreSQL, "
            "GitHub Actions, monitoring, observability, incident response, security, compliance, stakeholder reporting.\n"
            "Preferred Skills: cost optimization, performance tuning, multi-region deployments, and vendor management."
        )
    if scenario == "domain_scope_trap":
        return (
            "Responsibilities\n"
            f"- Lead {title} work across enterprise-scale, regulated, multi-site environments.\n"
            "- Own domain-specific delivery where generic adjacent experience is not enough.\n\n"
            "Required Skills\n"
            "- Experience selling B2B software or SaaS products to enterprise customers.\n"
            "- Experience with SaaS revenue recognition, ASC 606, deferred revenue, and revenue contracts.\n"
            "- Project management experience leading software development teams using Agile and Scrum.\n"
            "- Linux infrastructure experience in low-latency trading environments with deterministic performance tuning.\n"
            "- Technical support experience troubleshooting hardware, software, and help desk tickets."
        )
    return core


def _fallback_resume(title: str, profile: str, scenario: str) -> str:
    if scenario == "domain_scope_trap" and profile == "weak":
        return (
            f"{title} candidate with related but generic experience. Account manager with 5 years of sales experience "
            "exceeding quota and managing enterprise accounts. Project manager with 7 years managing timelines, budgets, "
            "vendors, and stakeholder communications. Infrastructure engineer with 8 years of Linux server administration, "
            "patching, monitoring, and virtualization experience."
        )
    if scenario == "domain_scope_trap" and profile == "contra":
        return (
            f"{title} adjacent profile. Sold professional services but did not sell software or SaaS products. "
            "Managed infrastructure but did not work in low-latency trading environments. Supported accounting close "
            "but did not own SaaS revenue recognition or ASC 606 revenue contracts."
        )
    if scenario == "compound_skill_list" and profile == "weak":
        return (
            f"{title} with hands-on Python, SQL, Linux, Docker, and GitHub Actions experience, but no Kubernetes, "
            "Terraform, Ansible, Azure, or incident response ownership."
        )
    if profile == "strong":
        return (
            f"Senior {title}. Owned production workflows, documented trade-offs, delivered measurable improvements, "
            "and partnered with cross-functional stakeholders across implementation and operations."
        )
    if profile == "contra":
        return (
            f"Adjacent {title} exposure. Supported handoffs to the team that owned the core process, "
            "but did not own production delivery or final technical decisions."
        )
    return (
        f"Entry-level adjacent experience for {title}. Used related tools in small internal workflows, "
        "but scope was limited and did not include enterprise ownership."
    )


def _fallback_judge_report(analysis: dict[str, Any]) -> str:
    return (
        "# Sandbox Judge Report\n\n"
        "Ollama judge output was unavailable, so this fallback report only records that deterministic scoring completed.\n\n"
        f"- Case: {analysis.get('case_slug')}\n"
        f"- Resume: {analysis.get('resume_file')}\n"
        f"- Score: {analysis.get('match_score')}\n"
    )
