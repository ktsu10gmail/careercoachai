# Resume/JD Matching Failure Modes

This file is the human-readable playbook for failure modes discovered during CareerCoachAI analysis reviews.

## FM-001: Metadata Becomes A Requirement

**Symptom**

The analysis treats fields such as salary, target start date, work mode, location, openings, or job level as match requirements.

**Bad Example**

`Target start date: 2026-09-15` appears under matched evidence or missing requirements.

**Rule**

Metadata-only attributes must remain metadata. They are not scored as skills or responsibilities unless the JD body expresses a real requirement.

**Implementation**

- `app/scoring/engine.py`: `_is_jd_metadata_line`
- `app/services/ai_service.py`: metadata isolation prompt rules

## FM-002: Boilerplate Or Marketing Text Becomes A Requirement

**Symptom**

Company mission, benefits, culture text, or "About us" paragraphs appear as missing requirements.

**Bad Example**

`We believe in an open and flat structure` appears under Missing or unclear.

**Rule**

Drop non-requirement sections before scoring. Keep responsibilities, qualifications, required skills, and preferred skills.

**Implementation**

- `app/scoring/engine.py`: `IGNORED_JD_SECTION_HEADINGS`, `_is_company_marketing_line`

## FM-003: Contra-Evidence Is Treated As Strong Evidence

**Symptom**

A resume snippet that explicitly says the candidate did not perform a task appears under matched evidence.

**Bad Example**

Requirement: `Prepare GAAP financial statements`

Resume snippet: `Supported month-end bookkeeping handoffs to external accountants but did not prepare GAAP financial statements.`

Bad output: snippet appears under Matched evidence.

**Rule**

If a snippet proves non-performance or lack of scope, it must be Missing or unclear, never a match.

**Implementation**

- `app/scoring/engine.py`: `contra` match level, `_is_contra_evidence`
- `app/services/ai_service.py`: Rule of Contra-Evidence in prompt

## FM-004: Generic Snippet Scattering

**Symptom**

One generic resume snippet is reused as evidence for many advanced requirements.

**Bad Example**

`Bookkeeping, AP/AR, bank reconciliation, QuickBooks` is mapped to ASC 606, IFRS, consolidated financial statements, international subsidiaries, and accounting policy ownership.

**Rule**

If a generic tool/task list is reused across advanced requirements, downgrade it to Missing or unclear.

**Implementation**

- `app/scoring/engine.py`: `_apply_anti_scattering_guardrail`, `scope_gap` match level
- `app/services/ai_service.py`: scope alignment prompt rule

## FM-005: Header Or Title Treated As Proof

**Symptom**

A resume header line such as `Senior / Lead Role | Freelance Bookkeeping | 2023 - Present` is used as evidence for leadership, technical accounting, or execution scope.

**Rule**

Title/date/header lines cannot prove requirements by themselves. Require an action verb and task context.

**Implementation**

- `app/scoring/engine.py`: `_is_weak_resume_header_evidence`

## FM-006: Compound Skill List Contradiction

**Symptom**

A large `Required skills:` string is partially matched, then the same technologies appear again as missing.

**Bad Example**

Matched evidence says Windows Server, RHEL, Ubuntu, VMware, Hyper-V, Azure, and GCP are present. Missing or unclear also says those same technologies are missing.

**Rule**

Large comma-separated skill lists should be split into skill-level checks or sanitized so matched terms are not repeated as missing.

**Status**

Identified. Needs implementation.

**Planned Implementation**

- Split large required-skill arrays into individual requirements before scoring.
- Add a mutual-exclusion cleanup so matched technologies are removed from missing summaries.

