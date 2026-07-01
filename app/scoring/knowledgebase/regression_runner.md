# Regression Runner

The regression cases in `app/scoring/regression_cases/resume_jd_guardrails.json` are the seed set for a future automated test runner.

Run the current deterministic scorer checks with:

```bash
python3 -m app.scoring.run_regression_cases
```

Each active case is executed against `score_resume_jd_match()`.

Suggested assertions:

- `must_not_match_text`: text must not appear in `requirement_matches` evidence or requirements.
- `must_missing_text`: text should appear in `missing_requirements` requirements or reasons.
- `must_match_text`: text should appear in matched requirements or evidence.
- `must_not_contradict_terms`: if a term appears in matched output, it must not also appear as missing.

Planned next step:

Extend the runner to optionally execute application-level `analyze_resume_for_public_tool()` checks for LLM narrative output, while keeping deterministic scorer checks fast enough for every backend change.
