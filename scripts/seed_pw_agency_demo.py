from __future__ import annotations

import os
import sys
from datetime import datetime
from pathlib import Path

from sqlalchemy import select

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:password@localhost:5433/recruitdb",
)

from app.db.models import (  # noqa: E402
    Answer,
    Application,
    ApplicationStatus,
    Candidate,
    CandidateSubmission,
    ClientCompany,
    Job,
    JobStatus,
    Question,
    User,
    UserRole,
)
from app.db.session import SessionLocal  # noqa: E402
from app.services.auth_service import get_password_hash  # noqa: E402


AGENCY_ID = 4
HR_EMAIL = "pw.hr.1781223478262@example.com"
RECRUITER_EMAIL = "pw.recruiter.1781223478262@example.com"
PASSWORD = "password123"


CLIENTS = [
    {
        "company_name": "Northstar BioAnalytics",
        "industry": "Healthcare analytics",
        "website": "https://northstar-bio.example.com",
        "contact_name": "Maya Chen",
        "contact_email": "maya.chen@northstar-bio.example.com",
        "contact_phone": "555-210-1001",
        "notes": "Scaling clinical data products for hospital networks.",
    },
    {
        "company_name": "AtlasGrid Energy",
        "industry": "Clean energy software",
        "website": "https://atlasgrid.example.com",
        "contact_name": "Jordan Patel",
        "contact_email": "jordan.patel@atlasgrid.example.com",
        "contact_phone": "555-210-1002",
        "notes": "Building grid forecasting and asset monitoring tools.",
    },
    {
        "company_name": "Cobalt Harbor Logistics",
        "industry": "Supply chain technology",
        "website": "https://cobaltharbor.example.com",
        "contact_name": "Elena Rossi",
        "contact_email": "elena.rossi@cobaltharbor.example.com",
        "contact_phone": "555-210-1003",
        "notes": "Modernizing freight operations and customer visibility.",
    },
]


JOBS = [
    {
        "client": "Northstar BioAnalytics",
        "title": "Senior Data Engineer",
        "position": "Data Platform",
        "salary_range": "$135k - $165k",
        "description": (
            "Design and operate healthcare data pipelines using Python, SQL, Airflow, "
            "dbt, and cloud data warehouses. Build reliable ingestion for clinical, "
            "claims, and operational datasets. Partner with analytics, security, and "
            "product teams to improve data quality, observability, HIPAA-aware access "
            "patterns, and downstream reporting performance."
        ),
    },
    {
        "client": "AtlasGrid Energy",
        "title": "Full Stack Product Engineer",
        "position": "React / FastAPI",
        "salary_range": "$120k - $150k",
        "description": (
            "Build customer-facing grid analytics workflows with React, TypeScript, "
            "FastAPI, PostgreSQL, and background jobs. Own product features from API "
            "design through UI delivery. Collaborate with energy analysts to turn "
            "forecasting models and device telemetry into operational dashboards."
        ),
    },
    {
        "client": "Cobalt Harbor Logistics",
        "title": "Implementation Project Manager",
        "position": "Enterprise Delivery",
        "salary_range": "$105k - $130k",
        "description": (
            "Lead enterprise software implementations for logistics customers. Manage "
            "project plans, stakeholder updates, integrations, data migration, training, "
            "and go-live readiness. Translate operational needs into product feedback "
            "while keeping timelines, risks, and customer adoption visible."
        ),
    },
]


CANDIDATES = [
    {
        "name": "Avery Morgan",
        "email": "avery.morgan.demo@example.com",
        "phone": "555-310-2001",
        "location": "Austin, TX",
        "resume_text": (
            "Senior data engineer with 8 years of Python, SQL, Airflow, dbt, Snowflake, "
            "and healthcare analytics experience. Built HIPAA-aware ingestion pipelines, "
            "data quality checks, lineage monitoring, and self-service marts for clinical "
            "operations teams."
        ),
        "match_job": "Senior Data Engineer",
        "score": 91.0,
        "submission_status": "accepted",
    },
    {
        "name": "Priya Shah",
        "email": "priya.shah.demo@example.com",
        "phone": "555-310-2002",
        "location": "Seattle, WA",
        "resume_text": (
            "Full stack engineer experienced with React, TypeScript, FastAPI, PostgreSQL, "
            "Docker, and analytics dashboards. Delivered workflow automation tools for "
            "operations teams and partnered closely with product managers and analysts."
        ),
        "match_job": "Full Stack Product Engineer",
        "score": 88.0,
        "submission_status": "pending",
    },
    {
        "name": "Marcus Lee",
        "email": "marcus.lee.demo@example.com",
        "phone": "555-310-2003",
        "location": "Chicago, IL",
        "resume_text": (
            "Implementation project manager with 10 years leading enterprise SaaS rollouts "
            "for logistics and supply chain customers. Expert in stakeholder management, "
            "integration planning, migration readiness, training, and executive reporting."
        ),
        "match_job": "Implementation Project Manager",
        "score": 86.0,
        "submission_status": "reviewed",
    },
]


APPLICANTS = [
    {
        "name": "Nina Alvarez",
        "email": "nina.alvarez.applicant@example.com",
        "job": "Full Stack Product Engineer",
        "resume_text": (
            "Applicant with 5 years of React, TypeScript, Python, FastAPI, PostgreSQL, "
            "and product analytics experience. Built internal dashboards and customer "
            "portals for operational data products."
        ),
        "matching_score": 82.0,
        "answer_score": 8.4,
    },
    {
        "name": "Owen Brooks",
        "email": "owen.brooks.applicant@example.com",
        "job": "Senior Data Engineer",
        "resume_text": (
            "Applicant data engineer with Python, SQL, Spark, Airflow, dbt, BigQuery, "
            "and healthcare reporting experience. Interested in reliable pipelines, "
            "data contracts, and analytics enablement."
        ),
        "matching_score": 79.0,
        "answer_score": 7.9,
    },
]


QUESTION_TEMPLATES = [
    ("Hard Skill", "Describe your most relevant technical experience for this role."),
    ("Hard Skill", "Which tools or systems from the job description have you used in production?"),
    ("Hard Skill", "Give an example of a project where you improved reliability, quality, or delivery speed."),
    ("Hard Skill", "How would you approach the first 30 days in this role?"),
    ("Hard Skill", "What technical risk would you watch for in this position?"),
    ("Soft Skill", "Tell us about a time you worked across teams to deliver an outcome."),
    ("Soft Skill", "How do you communicate tradeoffs to non-technical stakeholders?"),
    ("Soft Skill", "Describe a time you had to recover a project or task that was off track."),
    ("Soft Skill", "How do you organize work when priorities change quickly?"),
    ("Soft Skill", "What type of team environment helps you do your best work?"),
]


def slugify(value: str, user_id: int) -> str:
    return f"demo-{value.lower().replace(' ', '-')}-{user_id}"


def get_user(db, email: str) -> User:
    user = db.execute(select(User).where(User.email == email)).scalar_one()
    return user


def get_or_create_client(db, payload: dict) -> ClientCompany:
    client = db.execute(
        select(ClientCompany).where(
            ClientCompany.agency_company_id == AGENCY_ID,
            ClientCompany.company_name == payload["company_name"],
        )
    ).scalar_one_or_none()
    if client:
        return client
    client = ClientCompany(agency_company_id=AGENCY_ID, **payload)
    db.add(client)
    db.flush()
    return client


def get_or_create_job(db, client_by_name: dict[str, ClientCompany], payload: dict, hr: User, recruiter: User) -> Job:
    job = db.execute(
        select(Job).where(
            Job.company_id == AGENCY_ID,
            Job.title == payload["title"],
        )
    ).scalar_one_or_none()
    if job:
        return job
    job = Job(
        company_id=AGENCY_ID,
        client_company_id=client_by_name[payload["client"]].id,
        hr_id=hr.id,
        assigned_recruiter_id=recruiter.id,
        title=payload["title"],
        position=payload["position"],
        description=payload["description"],
        salary_range=payload["salary_range"],
        job_url=slugify(payload["title"], hr.id),
        status=JobStatus.ACTIVE,
    )
    db.add(job)
    db.flush()
    for category, text in QUESTION_TEMPLATES:
        db.add(Question(job_id=job.id, category=category, text=text))
    db.flush()
    return job


def get_or_create_candidate(db, payload: dict, recruiter: User) -> Candidate:
    candidate = db.execute(
        select(Candidate).where(
            Candidate.owner_company_id == AGENCY_ID,
            Candidate.email == payload["email"],
        )
    ).scalar_one_or_none()
    if candidate:
        return candidate
    candidate = Candidate(
        owner_company_id=AGENCY_ID,
        created_by_user_id=recruiter.id,
        name=payload["name"],
        email=payload["email"],
        phone=payload["phone"],
        location=payload["location"],
        resume_file_url=f"demo-resume:{payload['email']}",
        resume_text=payload["resume_text"],
        consent_talent_network=True,
    )
    db.add(candidate)
    db.flush()
    return candidate


def get_or_create_application(
    db,
    candidate: Candidate,
    job: Job,
    recruiter: User,
    score: float,
    answer_score: float | None = None,
    applicant: User | None = None,
) -> Application:
    application = db.execute(
        select(Application).where(
            Application.candidate_id == candidate.id,
            Application.job_id == job.id,
        )
    ).scalar_one_or_none()
    if application:
        return application
    application = Application(
        job_id=job.id,
        candidate_id=candidate.id,
        applicant_id=applicant.id if applicant else candidate.applicant_user_id,
        matched_by_user_id=recruiter.id if applicant is None else None,
        resume_path=candidate.resume_file_url or f"candidate:{candidate.id}",
        matching_score=score,
        answer_score=answer_score,
        resume_comment=f"Demo score: candidate background is aligned to {job.title}.",
        answer_comment="Demo answers show relevant experience and clear communication.",
        status=ApplicationStatus.SUBMITTED,
    )
    db.add(application)
    db.flush()
    return application


def get_or_create_submission(db, application: Application, sender: User, status: str, client_email: str) -> None:
    existing = db.execute(
        select(CandidateSubmission).where(CandidateSubmission.application_id == application.id)
    ).scalar_one_or_none()
    if existing:
        return
    submission = CandidateSubmission(
        application_id=application.id,
        submitted_by_user_id=sender.id,
        submitted_to_name="Client Hiring Team",
        submitted_to_email=client_email,
        submission_status=status,
        client_feedback=f"Demo client feedback status: {status}.",
        reviewed_at=datetime.utcnow() if status != "pending" else None,
    )
    db.add(submission)


def get_or_create_applicant_user(db, payload: dict) -> User:
    user = db.execute(select(User).where(User.email == payload["email"])).scalar_one_or_none()
    if user:
        return user
    user = User(
        name=payload["name"],
        email=payload["email"],
        hashed_password=get_password_hash(PASSWORD),
        role=UserRole.APPLICANT,
    )
    db.add(user)
    db.flush()
    return user


def create_demo_answers(db, application: Application, job: Job, applicant_name: str) -> None:
    if db.execute(select(Answer).where(Answer.application_id == application.id)).first():
        return
    questions = db.execute(select(Question).where(Question.job_id == job.id)).scalars().all()
    for question in questions[:5]:
        db.add(
            Answer(
                application_id=application.id,
                question_id=question.id,
                answer_text=(
                    f"{applicant_name} demo answer: I have handled similar work using "
                    "structured planning, clear communication, and measurable delivery outcomes."
                ),
                score=8.0,
            )
        )


def main() -> None:
    db = SessionLocal()
    try:
        hr = get_user(db, HR_EMAIL)
        recruiter = get_user(db, RECRUITER_EMAIL)
        clients = [get_or_create_client(db, payload) for payload in CLIENTS]
        client_by_name = {client.company_name: client for client in clients}
        jobs = [get_or_create_job(db, client_by_name, payload, hr, recruiter) for payload in JOBS]
        job_by_title = {job.title: job for job in jobs}

        for payload in CANDIDATES:
            candidate = get_or_create_candidate(db, payload, recruiter)
            job = job_by_title[payload["match_job"]]
            application = get_or_create_application(db, candidate, job, recruiter, payload["score"])
            client = client_by_name[next(item["client"] for item in JOBS if item["title"] == job.title)]
            get_or_create_submission(db, application, hr, payload["submission_status"], client.contact_email)

        for payload in APPLICANTS:
            applicant = get_or_create_applicant_user(db, payload)
            candidate = db.execute(
                select(Candidate).where(
                    Candidate.owner_company_id == AGENCY_ID,
                    Candidate.applicant_user_id == applicant.id,
                )
            ).scalar_one_or_none()
            if candidate is None:
                candidate = Candidate(
                    owner_company_id=AGENCY_ID,
                    applicant_user_id=applicant.id,
                    created_by_user_id=applicant.id,
                    name=payload["name"],
                    email=payload["email"],
                    resume_file_url=f"demo-resume:{payload['email']}",
                    resume_text=payload["resume_text"],
                    consent_talent_network=True,
                )
                db.add(candidate)
                db.flush()
            job = job_by_title[payload["job"]]
            application = get_or_create_application(
                db,
                candidate,
                job,
                recruiter,
                payload["matching_score"],
                payload["answer_score"],
                applicant=applicant,
            )
            create_demo_answers(db, application, job, applicant.name)

        db.commit()
        print("Seeded PW agency demo data.")
        print(f"Clients: {', '.join(client.company_name for client in clients)}")
        print(f"Jobs: {', '.join(job.title for job in jobs)}")
        print("Applicant password: password123")
    finally:
        db.close()


if __name__ == "__main__":
    main()
