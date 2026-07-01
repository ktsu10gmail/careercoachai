import json
from pathlib import Path

from app.scoring import score_resume_jd_match


CASES_PATH = Path(__file__).parent / "regression_cases" / "resume_jd_guardrails.json"


def _lower_json(value: object) -> str:
    return json.dumps(value, sort_keys=True).lower()


def _contains_all(haystack: str, needles: list[str]) -> bool:
    return all(needle.lower() in haystack for needle in needles)


def run_cases() -> None:
    cases = json.loads(CASES_PATH.read_text(encoding="utf-8"))
    failures: list[str] = []
    skipped = 0

    for case in cases:
        case_id = case["id"]
        if case.get("status") == "planned":
            skipped += 1
            continue

        result = score_resume_jd_match(case["resume"], case["job_description"])
        matched_text = _lower_json(result.get("requirement_matches", []))
        missing_text = _lower_json(result.get("missing_requirements", []))
        full_text = _lower_json(result)

        for text in case.get("must_not_match_text", []):
            if text.lower() in matched_text:
                failures.append(f"{case_id}: forbidden matched text found: {text}")

        for text in case.get("must_missing_text", []):
            if text.lower() not in missing_text:
                failures.append(f"{case_id}: expected missing text not found: {text}")

        if case.get("must_match_text") and not _contains_all(full_text, case["must_match_text"]):
            failures.append(f"{case_id}: expected matched/analysis text missing: {case['must_match_text']}")

    if failures:
        details = "\n".join(f"- {failure}" for failure in failures)
        raise SystemExit(f"Regression guardrail failures:\n{details}")

    print(f"Passed {len(cases) - skipped} scoring guardrail regression cases. Skipped {skipped} planned case(s).")


if __name__ == "__main__":
    run_cases()
