# Career Coaching AI

Career Coaching AI is a FastAPI and Next.js recruiting operations app for direct employers, recruiting agencies, applicants, and hiring managers.

## What It Supports

- Direct employers can create jobs, publish a company job board, review applications, qualify candidates, and schedule interviews.
- Recruiting agencies can manage client companies, recruiter-owned candidate profiles, TXT/PDF/DOCX resume uploads, candidate-to-job matching, client submissions, feedback, ownership tracking, and recruiter performance.
- Applicants can create an account, apply through job links, upload TXT/PDF/DOCX resumes, answer standardized questions, and view their portal.
- Hiring managers can review assigned interviews and submit recommendations.
- Guides are linked from the relevant workflow pages so users can open help while they work.

## Entry Points

Production frontend:

```text
Employer entry:
http://localhost:3001
http://192.168.1.46:3001

Recruiting agency entry:
http://localhost:4001
http://192.168.1.46:4001

Applicant entry:
http://localhost:5001
http://192.168.1.46:5001
```

Backend API docs:

```text
http://localhost:8000/docs
```

Common pages:

- Employer start page: `http://localhost:3001/`
- Recruiting agency start page: `http://localhost:4001/`
- Applicant start page: `http://localhost:5001/`
- Employer / agency login: `/employer/login`
- Employer / agency setup: `/employer/setup`
- Workspace after login: `/employer/workspace`
- Agency clients: `/agency/clients`
- Agency candidates: `/agency/candidates`
- Agency matching: `/agency/matching`
- Agency performance: `/agency/performance`
- Applicant login: `/applicant/login`
- Applicant setup: `/applicant/setup`
- Applicant portal: `/applicant/portal`

## Employer vs Recruiting Agency

The system decides the workflow from the company `organization_type`.

During `/employer/setup`, choose:

- `Direct employer` for in-house hiring.
- `Recruiting agency` for client-company, recruiter, candidate matching, submission, and performance workflows.

The `3001` landing page links to setup with `?type=employer`.
The `4001` landing page links to setup with `?type=agency`.
The `5001` landing page shows applicant tools only.

After login, `/auth/me` returns the user role and company type. The frontend uses that to show the correct workspace pages.

## Test Accounts

Recruiting agency test accounts:

```text
Agency Admin: pw.admin.1781223478262@example.com
Agency HR:    pw.hr.1781223478262@example.com
Recruiter:    pw.recruiter.1781223478262@example.com
Password:     password123
```

Direct employer examples in the local database include:

```text
admin@jetta.com
david.su@jetta.com
walker.cheng@jetta.com
```

Use the password that was seeded or assigned locally for those older demo users.

## Run The App

Recommended manual start:

```bash
cd /home/ksu/recruit-system
./start_recruit_system.sh
```

This starts Docker services and the production frontends on ports `3001`, `4001`, and `5001`.

Manual development start:

```bash
cd /home/ksu/recruit-system
docker compose up -d

cd /home/ksu/recruit-system/frontend
npm run dev -- --hostname 0.0.0.0 -p 3002
```

## Auto Start After Reboot

Autostart is installed as a user systemd service:

```text
~/.config/systemd/user/recruit-system.service
~/.config/systemd/user/recruit-system-agency.service
~/.config/systemd/user/recruit-system-applicant.service
```

Useful commands:

```bash
systemctl --user status recruit-system.service
systemctl --user status recruit-system-agency.service
systemctl --user status recruit-system-applicant.service
journalctl --user -u recruit-system.service -u recruit-system-agency.service -u recruit-system-applicant.service -f
systemctl --user restart recruit-system.service recruit-system-agency.service recruit-system-applicant.service
systemctl --user disable --now recruit-system.service recruit-system-agency.service recruit-system-applicant.service
```

Installer script:

```bash
cd /home/ksu/recruit-system
./scripts/install_autostart.sh
```

## Backend Services

Docker Compose starts:

- PostgreSQL on host port `5433`
- FastAPI backend on host port `8000`
- Ollama container for AI scoring

The backend runs Alembic migrations at container startup through `docker-entrypoint.sh`.

## Resume Uploads

Supported formats:

- `.txt`
- `.pdf`
- `.docx`

Applicant applications and recruiter-added candidate profiles use the same parser:

- TXT is read directly.
- PDF is parsed with `pypdf`.
- DOCX is parsed with `python-docx`.

Uploaded resumes are stored under `uploads/resumes` by default, or `UPLOAD_DIR` when configured.

## Guides

Guide pages:

- Company admin guide: `/guides/company-admin`
- HR and recruiter guide: `/guides/hr`
- Applicant guide: `/guides/applicant`
- Hiring manager guide: `/guides/hiring-manager`

Relevant workflow pages include a guide button in the page header. The guide opens in a new tab so users can keep their current form or workflow open.

## API Highlights

Auth and setup:

- `POST /auth/token`
- `GET /auth/me`
- `POST /employer/setup`

Employer / HR:

- `GET /hr/jobs`
- `POST /hr/jobs`
- `GET /hr/applications`
- `POST /hr/applications/{application_id}/prequalify`

Agency:

- `GET /client-companies`
- `POST /client-companies`
- `GET /candidates`
- `POST /candidates`
- `POST /candidates/{candidate_id}/upload-resume`
- `GET /candidates/{candidate_id}/applications`
- `POST /candidates/{candidate_id}/match-job`
- `POST /applications/{application_id}/submit-to-client`
- `GET /submissions`
- `PUT /submissions/{submission_id}/feedback`
- `GET /recruiter-performance`

Applicants:

- `GET /companies`
- `GET /companies/by-slug/{company_slug}/jobs`
- `GET /jobs/{job_url}`
- `POST /applications`

Hiring managers:

- `GET /interviews`
- `POST /interviews/{id}/decision`

## Verification

Common checks:

```bash
cd /home/ksu/recruit-system
.venv/bin/python -m compileall app

cd /home/ksu/recruit-system/frontend
npm run lint
npm run build
```

## Notes

- The repo is configured for local development and demonstration.
- `docker-compose.yml` contains local defaults such as `SECRET_KEY=supersecretkey`.
- For production, replace secrets, configure a real domain, HTTPS, persistent upload storage, backups, and email/notification delivery.
