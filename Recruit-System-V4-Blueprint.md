# Career Coaching AI V4 Implementation Blueprint
## Data-Driven Talent Marketplace

### Strategic Objective
Transition Career Coaching AI from a workflow-driven ATS (V3) into a data-driven Talent Marketplace (V4).

## 1. Business Goals

### Solving the Cold Start Problem
- Attract candidates directly using a free AI-powered resume analysis tool.
- Allow anonymous resume uploads and JD matching.
- Convert candidates into marketplace participants through opt-in enrollment.

### Monetizing the Talent Network
- Build a searchable database of qualified candidates.
- Provide Recruiters and Companies with immediate access to pre-vetted talent.
- Generate candidate-to-job matches proactively.

### Reduce Candidate Friction
- No account required for initial analysis.
- Account creation occurs only after value has been demonstrated.

---

## 2. Core System Roles

### Applicant
- Upload resume without login.
- Receive AI resume analysis.
- Opt into Talent Network.
- Create candidate account.

### Company
- Post jobs for its own organization.
- Review applicants.
- Search Talent Network.

### Recruiter Agency
- Post jobs for multiple client companies.
- Manage client company relationships.
- Search Talent Network.

### Platform Administrator
- Global access.
- Marketplace analytics.
- System management.

---

## 3. Candidate Lifecycle

### ANONYMOUS
- Resume uploaded.
- Analysis generated.
- No account created.

### REGISTERED
- Candidate account exists.
- Not visible in marketplace.

### OPTED_IN
- Candidate visible in Talent Network.

### HIRED
- Candidate marked hired.

### ARCHIVED
- Candidate hidden from searches.

---

## 4. Architectural Foundation

### Candidate ≠ Application
Candidate represents a person.

Application represents a relationship between a candidate and a job.

This separation is mandatory.

### Organization-Based Security
Organizations remain fully isolated.

Shared talent pool does not expose:
- Applications
- Notes
- Hiring decisions
- Internal recruiter activity

---

## 5. Frontend Requirements

### Public Free Analysis Page

Route:
```
/free-analysis
```

Features:
- Upload Resume (PDF/DOCX)
- Paste Job Description
- Run AI Analysis
- Display Match Score
- Display Strengths
- Display Weaknesses
- Display Extracted Candidate Information

### Conversion Flow

After analysis:

Display:

> Opt into our Talent Network for future job opportunities.

If selected:
- Collect password
- Create account
- Set consent_talent_network = true

---

## 6. Resume Parsing Requirements

### Supported Formats
- PDF
- DOCX

### Libraries
- PyMuPDF
- python-docx

### Extracted Profile Schema

```json
{
  "name": "",
  "email": "",
  "phone": "",
  "address": "",
  "experience": [],
  "skills": [],
  "education": []
}
```

### Validation Screen

Allow applicant to review and edit:
- Name
- Email
- Phone
- Address

before saving.

---

## 7. Matching Engine Design

### Tier 1: Fast Database Search

Purpose:
- Instant candidate discovery.

Search Fields:
- searchable_title
- searchable_skills

Technology:
- PostgreSQL Full Text Search

Output:
- Top 100 candidates

### Tier 2: AI Deep Matching

Purpose:
- Accurate candidate ranking.

Input:
- Candidate profile
- Job Description

Output:
- Match score (0-100)
- Strengths
- Weaknesses

Processing:
- Background worker
- Celery task queue

Results stored in:
```
talent_matches
```

---

## 8. Marketplace Features

### Job Creation Flow

When a job is posted:

Immediately display:
- Matched candidates
- Preliminary ranking

Then:

Background AI scoring updates rankings.

### Talent Search Page

Route:
```
/marketplace
```

Filters:
- Skill
- Job Title
- Location
- Years Experience
- Match Score

---

## 9. Database Changes

### Candidate Enhancements

```sql
ALTER TABLE candidates
ADD COLUMN consent_talent_network BOOLEAN DEFAULT FALSE;

ALTER TABLE candidates
ADD COLUMN profile_status VARCHAR(50);

ALTER TABLE candidates
ADD COLUMN parsed_profile_json JSONB;

ALTER TABLE candidates
ADD COLUMN searchable_title TEXT;

ALTER TABLE candidates
ADD COLUMN searchable_skills TEXT[];

ALTER TABLE candidates
ADD COLUMN last_ai_score TIMESTAMP;
```

### Recruiter Client Companies

```sql
CREATE TABLE recruiter_clients (
    id UUID PRIMARY KEY,
    recruiter_org_id UUID NOT NULL,
    company_name TEXT NOT NULL,
    company_website TEXT,
    created_at TIMESTAMP
);
```

### Talent Matches

```sql
CREATE TABLE talent_matches (
    id UUID PRIMARY KEY,
    candidate_id UUID,
    job_id UUID,
    match_score NUMERIC,
    created_at TIMESTAMP
);
```

### Applications Source Tracking

Add:

```sql
applications.source
```

Values:

- direct_apply
- recruiter_submit
- talent_network

---

## 10. API Requirements

### Public Analysis

```http
POST /api/public/analyze
```

Input:

```json
{
  "resume_file": "",
  "job_description": ""
}
```

Output:

```json
{
  "match_score": 87,
  "strengths": [],
  "weaknesses": [],
  "extracted_profile": {}
}
```

### Talent Network Opt-In

```http
POST /api/public/opt-in
```

Input:

```json
{
  "candidate_data": {},
  "password": ""
}
```

Output:

```json
{
  "candidate_id": "",
  "account_created": true
}
```

### Marketplace Search

```http
GET /api/marketplace/candidates
```

Filters:
- skill
- location
- title
- years_experience

---

## 11. Privacy Rules

Only candidates with:

```text
consent_talent_network = TRUE
```

appear in marketplace searches.

Candidates who do not opt in:

- Never appear in marketplace searches.
- Never appear in recruiter searches.
- Remain available only for jobs they directly applied to.

---

## 12. Performance Requirements

| Feature | Target |
|----------|----------|
| Free Analysis | < 15 seconds |
| Talent Search | < 2 seconds |
| Job Creation | < 1 second |
| AI Matching | < 10 minutes |

---

## 13. Migration Requirements

Must preserve:

- Existing V3 jobs
- Existing V3 applications
- Existing V3 candidates
- Existing organization relationships

Requirements:

- Zero downtime migration
- Safe defaults on all new columns
- Backward compatibility

---

## 14. Acceptance Tests

### AT-001
Anonymous user uploads resume.

Expected:
- Analysis generated
- No account created

### AT-002
Anonymous user opts in.

Expected:
- Candidate account created

### AT-003
Candidate does not opt in.

Expected:
- Not visible in marketplace

### AT-004
Recruiter posts job.

Expected:
- Matched candidates displayed within 2 seconds

### AT-005
AI matching runs asynchronously.

Expected:
- Rankings updated in background

### AT-006
Recruiter sees only marketplace candidates.

### AT-007
Company cannot see another company's applicants.

### AT-008
Recruiter agency manages multiple client companies.

### AT-009
Existing V3 jobs continue functioning after migration.

---

## 15. Definition of Done

The V4 migration is complete when:

1. Anonymous resume analysis is operational.
2. Talent Network opt-in workflow is operational.
3. Candidate profile extraction is operational.
4. Marketplace search is operational.
5. Recruiter agency model is operational.
6. Tier 1 and Tier 2 matching pipelines are operational.
7. V3 data remains intact.
8. All acceptance tests pass.
