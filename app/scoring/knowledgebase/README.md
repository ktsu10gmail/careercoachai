# CareerCoachAI Scoring Knowledgebase

This knowledgebase records the resume/JD matching mistakes we have observed, the guardrails that prevent them, and the regression cases that should keep the system from repeating them.

The goal is not to make the LLM "remember" corrections. The goal is to turn mistakes into durable product knowledge:

- deterministic scoring rules in `app/scoring/engine.py`
- LLM interface rules in `app/services/ai_service.py`
- policy documentation in `app/scoring/policies/resume_jd_match.md`
- regression cases in `app/scoring/regression_cases/`

## Operating Principles

1. Deterministic checks are the source of truth for scoring.
2. The LLM may help with extraction, wording, and summaries, but it must not override guardrails.
3. Every discovered bad output should become one or more regression cases.
4. Evidence must be affirmative, source-grounded, and scoped to the requirement.
5. Missing evidence means "not shown in the resume," not "the candidate cannot do it."

## Current Guardrail Families

- **Document boundary guardrails:** JD text and resume text are wrapped with explicit start/end markers before LLM calls.
- **JD cleaning guardrails:** marketing copy, benefits, EEO text, culture slogans, metadata, and page boilerplate are removed before scoring.
- **Metadata isolation guardrails:** salary, start date, work mode, location, department, openings, and job level are not scored as skills.
- **Contra-evidence guardrails:** snippets that say the candidate did not perform a task are moved to Missing or unclear.
- **Scope-alignment guardrails:** generic bookkeeping/tool lists cannot satisfy enterprise accounting, technical accounting, or strategic ownership requirements.
- **Anti-scattering guardrails:** one generic snippet cannot be reused as medium evidence for many unrelated advanced requirements.
- **Header-evidence guardrails:** title/date/header lines cannot prove a requirement by themselves.
- **No-contradiction guardrails:** a requirement or technology should not appear as both clearly matched and clearly missing in the same report.

## How To Add A New Lesson

1. Save the bad output pattern in `failure_modes.md`.
2. Add a machine-readable case under `app/scoring/regression_cases/`.
3. Implement or adjust the deterministic guardrail.
4. Update the LLM prompt only after the deterministic rule is in place.
5. Run the case and verify forbidden output is absent.

