"""create recruit schema

Revision ID: 8b6f0d2c4e11
Revises: dd35a60c99ff
Create Date: 2026-06-05 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "8b6f0d2c4e11"
down_revision = "dd35a60c99ff"
branch_labels = None
depends_on = None


user_role = sa.Enum("COMPANY_ADMIN", "HR", "APPLICANT", "HIRING_MANAGER", name="userrole")
application_status = sa.Enum(
    "SUBMITTED",
    "PRE_QUALIFIED",
    "HIRED",
    "REJECTED",
    name="applicationstatus",
)
interview_verdict = sa.Enum("HIRE", "REJECT", name="interviewverdict")


def upgrade():
    user_role.create(op.get_bind(), checkfirst=True)
    application_status.create(op.get_bind(), checkfirst=True)
    interview_verdict.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=128), nullable=False),
        sa.Column("industry", sa.String(length=120), nullable=True),
        sa.Column("website", sa.String(length=255), nullable=True),
        sa.Column("size", sa.String(length=80), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index(op.f("ix_companies_id"), "companies", ["id"], unique=False)
    op.create_index(op.f("ix_companies_slug"), "companies", ["slug"], unique=False)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", user_role, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_company_id"), "users", ["company_id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=False)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=True),
        sa.Column("hr_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=200), nullable=False),
        sa.Column("position", sa.String(length=200), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("salary_range", sa.String(length=120), nullable=True),
        sa.Column("job_url", sa.String(length=128), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["hr_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("job_url"),
    )
    op.create_index(op.f("ix_jobs_company_id"), "jobs", ["company_id"], unique=False)
    op.create_index(op.f("ix_jobs_id"), "jobs", ["id"], unique=False)
    op.create_index(op.f("ix_jobs_job_url"), "jobs", ["job_url"], unique=False)

    op.create_table(
        "applications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("applicant_id", sa.Integer(), nullable=False),
        sa.Column("resume_path", sa.String(length=255), nullable=False),
        sa.Column("matching_score", sa.Float(), nullable=True),
        sa.Column("answer_score", sa.Float(), nullable=True),
        sa.Column("status", application_status, nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["applicant_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_applications_id"), "applications", ["id"], unique=False)

    op.create_table(
        "questions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_questions_id"), "questions", ["id"], unique=False)

    op.create_table(
        "answers",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("application_id", sa.Integer(), nullable=False),
        sa.Column("question_id", sa.Integer(), nullable=False),
        sa.Column("answer_text", sa.Text(), nullable=False),
        sa.Column("score", sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(["application_id"], ["applications.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["question_id"], ["questions.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_answers_id"), "answers", ["id"], unique=False)

    op.create_table(
        "interviews",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("application_id", sa.Integer(), nullable=False),
        sa.Column("hiring_manager_id", sa.Integer(), nullable=True),
        sa.Column("schedule_time", sa.DateTime(), nullable=True),
        sa.Column("manager_comment", sa.Text(), nullable=True),
        sa.Column("final_verdict", interview_verdict, nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["application_id"], ["applications.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["hiring_manager_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_interviews_id"), "interviews", ["id"], unique=False)


def downgrade():
    op.drop_index(op.f("ix_interviews_id"), table_name="interviews")
    op.drop_table("interviews")
    op.drop_index(op.f("ix_answers_id"), table_name="answers")
    op.drop_table("answers")
    op.drop_index(op.f("ix_questions_id"), table_name="questions")
    op.drop_table("questions")
    op.drop_index(op.f("ix_applications_id"), table_name="applications")
    op.drop_table("applications")
    op.drop_index(op.f("ix_jobs_job_url"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_id"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_company_id"), table_name="jobs")
    op.drop_table("jobs")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_company_id"), table_name="users")
    op.drop_table("users")
    op.drop_index(op.f("ix_companies_slug"), table_name="companies")
    op.drop_index(op.f("ix_companies_id"), table_name="companies")
    op.drop_table("companies")

    interview_verdict.drop(op.get_bind(), checkfirst=True)
    application_status.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)
