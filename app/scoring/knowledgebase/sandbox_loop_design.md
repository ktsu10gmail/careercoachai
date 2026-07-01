# CareerCoachAI Synthetic Scoring Sandbox Loop

## Purpose

The sandbox loop is a local QA system for improving CareerCoachAI's resume/JD matching engine. It uses local Ollama models to generate synthetic job descriptions and resumes, runs CareerCoachAI's scoring engine against them, then evaluates whether the output contains known failure modes.

The goal is to turn mistakes into durable product knowledge:

1. Generate realistic test cases.
2. Score them with CareerCoachAI.
3. Detect bad matching behavior.
4. Convert true failures into regression cases.
5. Improve the scoring engine and knowledgebase over time.

This is not model fine-tuning. It is a controlled learning loop built from guardrails, examples, and tests.

## Why This Matters

Generic LLMs can describe resumes, but they are not naturally reliable scoring engines. CareerCoachAI's competitive advantage should come from accumulated evaluation know-how:

- what counts as real evidence
- what counts as weak or adjacent evidence
- what must be treated as missing
- which snippets create false positives
- how domain-specific scope should be interpreted

Every discovered mistake should become part of the knowledgebase.

## Proposed Folder Structure

```text
app/scoring/
  knowledgebase/
    sandbox_loop_design.md
    README.md
    failure_modes.md
    regression_runner.md

  regression_cases/
    resume_jd_guardrails.json

  sandbox/
    job_titles.txt
    run_sandbox_loop.py
    stage_1_inputs/
    stage_2_outputs/
    stage_3_evaluations/
    promoted_cases/
```

## Stage 1: Generate Synthetic Inputs

Input:

```text
app/scoring/sandbox/job_titles.txt
```

Example:

```text
Systems Architect
Senior Accounting Manager
AI Systems Engineer
Full-Stack Python Developer
```

For each job title, the sandbox generator creates:

- one realistic JD
- one strong-match resume
- one weak/scope-mismatch resume
- optionally one contra-evidence resume

The generated files should be saved under:

```text
app/scoring/sandbox/stage_1_inputs/{case_slug}/
  job_description.txt
  resume_strong.txt
  resume_weak.txt
  resume_contra.txt
  manifest.json
```

The `manifest.json` should describe expected behavior:

```json
{
  "job_title": "Senior Accounting Manager",
  "resumes": [
    {
      "file": "resume_strong.txt",
      "expected_profile": "strong_match"
    },
    {
      "file": "resume_weak.txt",
      "expected_profile": "scope_mismatch"
    },
    {
      "file": "resume_contra.txt",
      "expected_profile": "contra_evidence"
    }
  ]
}
```

## Stage 2: Run CareerCoachAI Scoring

The sandbox should run CareerCoachAI scoring against every generated JD/resume pair.

Recommended functions:

- `score_resume_jd_match()`
- optionally `analyze_resume_for_public_tool()` for full application-style output

Outputs should be saved as JSON:

```text
app/scoring/sandbox/stage_2_outputs/{case_slug}/
  resume_strong_analysis.json
  resume_weak_analysis.json
  resume_contra_analysis.json
```

Each output should include:

- job title
- source filenames
- expected profile
- match score
- score breakdown
- matched requirements
- missing requirements
- evidence quotes
- confidence level
- raw generated JD and resume references

## Stage 3: Judge Analysis Quality

The judge step uses local Ollama to inspect CareerCoachAI's output for known failure modes.

The judge should look for:

- metadata leakage
- boilerplate leakage
- contra-evidence classified as matched evidence
- generic snippet scattering
- title/header lines used as proof
- scope mismatch
- compound skill-list contradiction
- matched/missing contradiction

Judge reports should be saved as markdown:

```text
app/scoring/sandbox/stage_3_evaluations/{case_slug}/
  resume_strong_eval.md
  resume_weak_eval.md
  resume_contra_eval.md
```

The judge can suggest regression cases, but it should not automatically modify the production knowledgebase.

## Stage 4: Promote Confirmed Failures

Human review is required before promotion.

When a judge report reveals a real bug:

1. Add the failure pattern to:

```text
app/scoring/knowledgebase/failure_modes.md
```

2. Add a machine-readable case to:

```text
app/scoring/regression_cases/resume_jd_guardrails.json
```

3. Update deterministic code in:

```text
app/scoring/engine.py
```

4. Update LLM interface rules in:

```text
app/services/ai_service.py
```

5. Run:

```bash
python3 -m app.scoring.run_regression_cases
```

## Important Design Rules

### Deterministic Engine First

The sandbox may use an LLM to generate test material and judge output, but scoring truth should live in deterministic code.

### No Automatic Self-Modifying Rules

The judge must not automatically rewrite scoring rules. It can propose cases, but humans should approve before promotion.

### Use Local LLM For Generation

Synthetic generation should use Ollama by default to avoid API cost and rate limits.

### Keep Gemini Out Of Bulk Sandbox Generation

Gemini can be used for normal app analysis, but sandbox generation should default to local Ollama unless explicitly requested.

### Preserve Reproducibility

Generated cases should include:

- model name
- prompt version
- timestamp
- job title
- expected profile

### Keep Positive And Negative Cases

The sandbox should not only test failures. It should also protect valid matches.

Example positive cases:

- real Kubernetes deployment evidence should match Kubernetes requirements
- real ASC 606 ownership should match technical accounting requirements
- real VMware migration ownership should match VMware infrastructure requirements

Example negative cases:

- QuickBooks bookkeeping should not match ASC 606 ownership
- title lines should not prove leadership
- "did not prepare" should not prove preparation

## Proposed CLI

Generate synthetic inputs:

```bash
python3 -m app.scoring.sandbox.run_sandbox_loop generate
```

Run CareerCoachAI scoring:

```bash
python3 -m app.scoring.sandbox.run_sandbox_loop score
```

Judge outputs:

```bash
python3 -m app.scoring.sandbox.run_sandbox_loop judge
```

Run all stages:

```bash
python3 -m app.scoring.sandbox.run_sandbox_loop all
```

## Initial Milestones

### Milestone 1

Create folder structure, `job_titles.txt`, and a generator that produces JD/resume text files with Ollama.

### Milestone 2

Run deterministic CareerCoachAI scoring for generated inputs and save structured JSON outputs.

### Milestone 3

Add local Ollama judge reports.

### Milestone 4

Add a human-reviewed promotion workflow for converting judge findings into regression cases.

### Milestone 5

Add domain packs:

- accounting
- infrastructure
- AI systems
- software engineering
- sales/account executive
- product marketing

