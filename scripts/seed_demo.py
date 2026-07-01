"""Seed demo users, a sample job and questions for local development."""
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.db import crud
from app.schemas import UserCreate, JobCreate
from app.services.auth_service import get_password_hash, create_access_token


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # HR user
        hr = crud.get_user_by_email(db, "hr@example.com")
        if not hr:
            hr_in = UserCreate(name="HR Admin", email="hr@example.com", password="passw0rd", role="HR")
            try:
                hashed = get_password_hash(hr_in.password)
            except Exception:
                hashed = ""
            hr = crud.create_user(db, hr_in, hashed)
            print("Created HR user: id=", hr.id)

        # Applicant user
        app_user = crud.get_user_by_email(db, "applicant@example.com")
        if not app_user:
            a_in = UserCreate(name="Applicant Demo", email="applicant@example.com", password="passw0rd", role="Applicant")
            try:
                ahashed = get_password_hash(a_in.password)
            except Exception:
                ahashed = ""
            app_user = crud.create_user(db, a_in, ahashed)
            print("Created Applicant user: id=", app_user.id)

        # Hiring manager
        hm = crud.get_user_by_email(db, "manager@example.com")
        if not hm:
            m_in = UserCreate(name="Hiring Manager", email="manager@example.com", password="passw0rd", role="Hiring_Manager")
            try:
                mhashed = get_password_hash(m_in.password)
            except Exception:
                mhashed = ""
            hm = crud.create_user(db, m_in, mhashed)
            print("Created Hiring Manager user: id=", hm.id)

        # Sample job
        job = crud.get_job_by_url(db, "dev-backend-engineer")
        if not job:
            job_in = JobCreate(
                title="Backend Engineer (Dev)",
                position="Backend Engineer",
                description="Responsible for building APIs and services in Python. Familiarity with SQLAlchemy, FastAPI, and Docker is required.",
                salary_range="60k-90k",
            )
            job = crud.create_job(db, job_in, job_url="dev-backend-engineer", hr_id=hr.id)
            print("Created Job: id=", job.id)

            questions = [
                {"text": "Describe your experience with FastAPI.", "category": "Tech"},
                {"text": "Explain how you design RESTful APIs.", "category": "Design"},
                {"text": "How do you approach database schema migrations?", "category": "DB"},
            ]
            crud.create_questions(db, job, questions)
            print("Added sample questions for job")

        # Print tokens for convenience
        print("\nDemo access tokens:")
        print("HR:", create_access_token(str(hr.id)))
        print("Applicant:", create_access_token(str(app_user.id)))
        print("Hiring Manager:", create_access_token(str(hm.id)))

    finally:
        db.close()


if __name__ == "__main__":
    seed()
