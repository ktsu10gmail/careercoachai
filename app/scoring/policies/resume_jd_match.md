# AI Scoring And Guardrail Policy

This policy is the guardrail for public resume/job-description match scoring, assessment question generation, and answer scoring. The LLM may help with wording, profile extraction, narrative comments, and question drafting, but important numeric outcomes must be controlled by deterministic evidence checks.

For the full lessons-learned knowledgebase, see `app/scoring/knowledgebase/README.md` and `app/scoring/knowledgebase/failure_modes.md`.

## LLM Provider Order

- Primary provider: Gemini.
- Backup provider: local Ollama.
- Local backup model: llama3.2.
- Current environment settings:
  - AI_PRIMARY_PROVIDER=gemini
  - AI_FALLBACK_PROVIDER=ollama
  - AI_HEAVY_PROVIDERS=gemini,ollama
  - OLLAMA_MODEL_NAME=llama3.2

Gemini can improve language quality and extraction, but it must not be the source of truth for protected scoring decisions.

## Output Contract

- Score range: 0 to 100.
- The score is evidence-based, not a hiring decision.
- Missing evidence means "not shown in the resume," not "the candidate cannot do it."
- Use short resume snippets as support when available.
- Lower confidence when the resume or job description has little readable text.

## Category Weights

- Must-have requirements: 35%
- Preferred requirements: 15%
- Experience and seniority: 20%
- Domain and tools fit: 20%
- Evidence quality: 10%

## Evidence Levels

- Direct: the resume explicitly names the requirement or a configured alias.
- Adjacent: the resume shows related technology, domain, or responsibility that may transfer.
- Domain gap: the resume proves the core activity, but not the required industry, platform, regulatory, product, or business domain.
- Scope gap: the resume proves related work, but not the required scale, seniority, ownership level, complexity, or operating environment.
- Missing: no clear resume evidence is visible.
- Contra-evidence: the resume mentions the requirement but explicitly says the candidate did not perform it, lacked the scope, or only supported another owner. Contra-evidence must be treated as missing or unclear, never as a match.

Examples of contra-evidence:

- "Did not prepare GAAP financial statements."
- "Supported handoffs to external accountants but did not own the process."
- "No direct experience with ASC 606."
- "Assisted the team that owned statutory reporting."

## Domain And Scope Matching

Requirements must be evaluated as compound requirements when they contain qualifiers. A match to the generic action is not enough when the JD requires a specific domain or scope.

Use this structure:

```text
Requirement = core action/skill + domain qualifier + scope qualifier
```

Examples:

- "Experience selling B2B software or SaaS products" requires sales evidence plus software/SaaS evidence.
- "SaaS revenue recognition under ASC 606" requires accounting evidence plus SaaS revenue-recognition evidence plus ASC 606 evidence.
- "Linux infrastructure in low-latency trading environments" requires Linux infrastructure evidence plus low-latency/trading environment evidence.
- "Enterprise multi-entity close and consolidated financial statements" requires accounting close evidence plus enterprise/multi-entity/consolidation evidence.

Scoring behavior:

- If the resume proves both the core action and required qualifier, classify as Direct or strong evidence.
- If the resume proves the action but not the required domain, classify as Domain gap or Missing or unclear.
- If the resume proves the domain but not the required scale or ownership, classify as Scope gap or Missing or unclear.
- If the resume explicitly denies the qualifier or scope, classify as Contra-evidence.
- Adjacent evidence may receive partial credit only when the result clearly labels the missing qualifier.

Examples of near misses that must not be upgraded to full matches:

- Generic sales experience does not fully satisfy software/SaaS sales.
- Generic bookkeeping does not satisfy SaaS revenue recognition, ASC 606, IFRS, statutory reporting, or consolidated financial statements.
- Generic project management does not satisfy software development program ownership unless the software/technical delivery context is shown.
- Generic Linux administration does not satisfy low-latency trading performance tuning unless that environment is shown.

## JD Cleaning Layer

Raw pasted job descriptions must be cleaned before scoring or question generation. Users often paste the entire "About this job" page, which can include company marketing, benefits, legal text, and culture slogans.

Keep role-relevant content from sections such as:

- About the Role
- Responsibilities
- What You'll Do
- Requirements
- Qualifications
- Required Skills
- Preferred Requirements
- Skills and Experience
- What We're Looking For

Drop or ignore non-requirement content from sections such as:

- Who We Are
- About Us
- Company Overview
- Benefits
- Compensation
- Salary
- Equal Opportunity Employer
- Perks
- How to Apply
- Why Join Us
- Apply now
- Save job
- Share job
- Similar jobs
- Recommended jobs
- Company rating
- Job board navigation text

Also drop job title/header lines, company traction statements, and vague culture slogans unless they contain a clear requirement signal such as "must have," "required," "experience with," "familiarity with," or "proficient in."

Metadata-only attributes must not become requirements or resume evidence. Treat these fields as structured job metadata, not match criteria:

- Salary or compensation
- Target start date
- Application deadline
- Employment type
- Work mode
- Location
- Department
- Number of openings
- Job level

If metadata needs to be displayed, keep it in job metadata fields. Do not place qualitative analysis inside metadata fields, and do not score candidates against metadata unless the JD body expresses a real requirement.

## Compound Skill Lists

Large comma-separated skill lists must not be treated as one all-or-nothing requirement. Split long tool and technology lists into individual requirement tokens before scoring when practical.

Example:

```text
Required Skills: Python, SQL, AWS, Azure, Kubernetes, Docker, Terraform, Ansible, Linux, PostgreSQL, GitHub Actions, observability, incident response.
```

Preferred behavior:

- Score individual tools independently where possible.
- Do not say a candidate lacks a technology that already appears in matched evidence.
- Do not mark the entire requirement as strong if the resume only proves a few generic tools.
- Avoid contradictory output where the same item appears as both matched and missing.
- Treat passive tool lists as weaker than active execution evidence unless the JD only asks for familiarity.

## Document Boundary Rules

LLM calls must wrap source documents with explicit boundaries:

```text
--- START OF JOB DESCRIPTION ---
...
--- END OF JOB DESCRIPTION ---

--- START OF CANDIDATE RESUME ---
...
--- END OF CANDIDATE RESUME ---
```

Requirements may only come from the job description block. Resume evidence may only come from the candidate resume block. Any output evidence that is not grounded in the declared source must be discarded or replaced with deterministic fallback evidence.

## Structured Output Separation

LLM output must keep metadata and qualitative analysis separate.

- Metadata fields may contain only raw extracted values, booleans, dates, or null.
- Salary, target start date, work mode, location, and similar fields must not contain skill-gap commentary.
- Qualitative reasoning belongs only in designated evaluation, summary, gap analysis, or evidence fields.
- If a value is missing, use null or an empty collection according to the schema. Do not invent filler text.

The backend should prefer strict schemas or Pydantic models for LLM output. If an LLM returns malformed or mixed output, deterministic code must clean, discard, or replace unsafe fields before they reach scoring or display.

## Question Model

For the Automated Mediator assessment:

- Total questions: 10
- Hard skill questions: 7
- JD hard skill questions: 4
- Resume hard skill questions: 3
- Soft skill questions: 3
- Final answer score: hard skill average * 70% + soft skill average * 30%

Question normalization must enforce this split even when the LLM returns imperfect JSON or missing metadata:

- Questions 1-4 default to JD-Based Hard.
- Questions 5-7 default to Resume-Based Hard.
- Questions 8-10 default to Soft.
- Hard questions use weight 0.7.
- Soft questions use weight 0.3.

Hiring manager preview and interview-guide generation must use the same model:

- Clean the JD before question generation.
- Use explicit resume/JD document boundaries when an LLM drafts questions.
- Do not generate questions from About Us, Who We Are, benefits, EEO, compensation, apply-now text, similar jobs, company ratings, or job-board navigation.
- JD-Based Hard questions must come from cleaned job requirements.
- Resume-Based Hard questions must come from resume/profile evidence.
- If an LLM returns noisy, duplicate, or ungrounded questions, discard them and refill from deterministic fallback questions while preserving the 4 JD Hard / 3 Resume Hard / 3 Soft split.

## Answer Scoring Guardrails

Assessment answers are scored on a 0 to 10 scale. The LLM may suggest answer scores, but every score must pass deterministic guardrails before being used.

- Blank answers score 0.
- Very short answers cannot receive high scores.
- Irrelevant answers cannot receive high scores.
- Generic answers without concrete details, examples, measurements, trade-offs, or root-cause reasoning are capped.
- If the LLM score is far away from the deterministic fallback score, blend the two instead of trusting the LLM outright.
- Final Q&A score remains weighted: hard skill average * 70% + soft skill average * 30%.

The answer score is intended to measure answer evidence quality, not personality, confidence, writing style, or protected characteristics.

## Guardrails

- Do not let model-generated numbers override the deterministic score.
- Do not reward generic business words as skills.
- Prefer requirement evidence from exact snippets in the resume.
- Give partial credit for aliases and adjacent evidence, but keep it visibly lower than direct evidence.
- If a role-specific phrase is absent from the resume, report it as a clarification opportunity.
- If a resume snippet proves non-performance, do not count it as strong evidence. Move that requirement to Missing or unclear and preserve the snippet as the gap reason.
- Do not let one generic resume snippet scatter across many advanced requirements. If the same passive tool/task list is reused across several requirements, or a generic bookkeeping/tool list is mapped to enterprise scope such as ASC 606, IFRS, consolidated statements, statutory reporting, international subsidiaries, technical memos, cross-functional ownership, or accounting policy ownership, downgrade it to Missing or unclear.
- Do not use title/header lines, candidate names, locations, email addresses, or page boilerplate as requirement proof.
- Do not let generated preface text such as "Here is a resume snippet" become matched evidence.
- Do not allow the same phrase to appear as both strong evidence and the reason a requirement is missing.
- Use the LLM for narrative wording only after deterministic score fields have been calculated.
- Missing evidence should be framed as a clarification opportunity, not as proof that the applicant lacks the ability.

## Sandbox And Knowledgebase Workflow

The scoring sandbox exists to create and review controlled resume/JD examples before turning lessons into permanent guardrails.

Sandbox generation should include both clean and noisy JD scenarios:

- Clean baseline
- Boilerplate-heavy JDs with About Us, Who We Are, Benefits, EEO, and culture text
- Metadata-heavy JDs with salary, work mode, location, employment type, target start date, travel, sponsorship, and clearance
- Scraped job-board JDs with Apply now, Save job, Similar jobs, company ratings, navigation text, and repeated snippets
- Compound skill-list JDs with long technology/tool arrays
- Domain/scope trap JDs where the core action is generic but the domain or scope qualifier is essential

The sandbox review queue must distinguish different lesson types:

- Bug / regression: the scorer made a real mistake. Save this as a hard regression case under `app/scoring/regression_cases/resume_jd_guardrails.json`.
- Adjacent / partial: the evidence is related but not a full match. Save this as a calibration lesson, not a hard bug.
- Correct match: the scorer behaved correctly. Save this as a positive calibration lesson, not a hard bug.
- Ignore: do not save the item.

Calibration lessons are stored separately from hard regressions:

```text
app/scoring/sandbox/calibration_lessons.json
```

Only hard regression cases should fail the deterministic regression runner. Adjacent, partial, and correct-match examples should inform future prompt wording, scoring thresholds, and reviewer guidance without making the test suite over-strict.

## Regression Runner

Machine-readable guardrail cases live in:

```text
app/scoring/regression_cases/resume_jd_guardrails.json
```

Run the regression suite after scoring-engine changes:

```bash
python3 -m app.scoring.run_regression_cases
```

Active cases must pass before scoring changes are considered safe. Planned cases may remain skipped when they document known issues that are not implemented yet.

Question-generation guardrail cases live in the question runner:

```bash
python3 -m app.scoring.run_question_guardrails
```

Run this after changes to hiring-manager preview, interview-guide generation, JD cleaning, or question balancing.
