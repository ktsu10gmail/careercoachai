"""add candidate profiles

Revision ID: a8e4f1c2d9b0
Revises: 5d7c9f2a1b88
Create Date: 2026-06-12 00:40:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "a8e4f1c2d9b0"
down_revision = "5d7c9f2a1b88"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "candidates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_company_id", sa.Integer(), nullable=False),
        sa.Column("applicant_user_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=80), nullable=True),
        sa.Column("location", sa.String(length=160), nullable=True),
        sa.Column("resume_file_url", sa.String(length=255), nullable=True),
        sa.Column("resume_text", sa.Text(), nullable=True),
        sa.Column("parsed_profile_json", sa.JSON(), nullable=True),
        sa.Column("consent_talent_network", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["applicant_user_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["owner_company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_candidates_applicant_user_id"), "candidates", ["applicant_user_id"], unique=False)
    op.create_index(op.f("ix_candidates_email"), "candidates", ["email"], unique=False)
    op.create_index(op.f("ix_candidates_id"), "candidates", ["id"], unique=False)
    op.create_index(op.f("ix_candidates_owner_company_id"), "candidates", ["owner_company_id"], unique=False)

    with op.batch_alter_table("applications") as batch_op:
        batch_op.add_column(sa.Column("candidate_id", sa.Integer(), nullable=True))
        batch_op.create_index(op.f("ix_applications_candidate_id"), ["candidate_id"], unique=False)
        batch_op.create_foreign_key(
            "fk_applications_candidate_id_candidates",
            "candidates",
            ["candidate_id"],
            ["id"],
            ondelete="SET NULL",
        )

    bind = op.get_bind()
    dialect = bind.dialect.name
    now_expr = "CURRENT_TIMESTAMP"

    if dialect == "postgresql":
        op.execute(
            f"""
            INSERT INTO candidates (
                owner_company_id,
                applicant_user_id,
                name,
                email,
                resume_file_url,
                consent_talent_network,
                created_at,
                updated_at
            )
            SELECT
                jobs.company_id,
                users.id,
                users.name,
                users.email,
                MAX(applications.resume_path),
                false,
                {now_expr},
                {now_expr}
            FROM applications
            JOIN jobs ON jobs.id = applications.job_id
            JOIN users ON users.id = applications.applicant_id
            WHERE jobs.company_id IS NOT NULL
            GROUP BY jobs.company_id, users.id, users.name, users.email
            """
        )
        op.execute(
            """
            UPDATE applications
            SET candidate_id = candidates.id
            FROM candidates, jobs
            WHERE applications.job_id = jobs.id
              AND candidates.owner_company_id = jobs.company_id
              AND candidates.applicant_user_id = applications.applicant_id
            """
        )
    else:
        op.execute(
            f"""
            INSERT INTO candidates (
                owner_company_id,
                applicant_user_id,
                name,
                email,
                resume_file_url,
                consent_talent_network,
                created_at,
                updated_at
            )
            SELECT
                jobs.company_id,
                users.id,
                users.name,
                users.email,
                MAX(applications.resume_path),
                0,
                {now_expr},
                {now_expr}
            FROM applications
            JOIN jobs ON jobs.id = applications.job_id
            JOIN users ON users.id = applications.applicant_id
            WHERE jobs.company_id IS NOT NULL
            GROUP BY jobs.company_id, users.id, users.name, users.email
            """
        )
        op.execute(
            """
            UPDATE applications
            SET candidate_id = (
                SELECT candidates.id
                FROM candidates
                JOIN jobs ON jobs.company_id = candidates.owner_company_id
                WHERE jobs.id = applications.job_id
                  AND candidates.applicant_user_id = applications.applicant_id
                LIMIT 1
            )
            WHERE candidate_id IS NULL
            """
        )

    with op.batch_alter_table("applications") as batch_op:
        batch_op.alter_column("applicant_id", existing_type=sa.Integer(), nullable=True)


def downgrade() -> None:
    with op.batch_alter_table("applications") as batch_op:
        batch_op.alter_column("applicant_id", existing_type=sa.Integer(), nullable=False)
        batch_op.drop_constraint("fk_applications_candidate_id_candidates", type_="foreignkey")
        batch_op.drop_index(op.f("ix_applications_candidate_id"))
        batch_op.drop_column("candidate_id")

    op.drop_index(op.f("ix_candidates_owner_company_id"), table_name="candidates")
    op.drop_index(op.f("ix_candidates_id"), table_name="candidates")
    op.drop_index(op.f("ix_candidates_email"), table_name="candidates")
    op.drop_index(op.f("ix_candidates_applicant_user_id"), table_name="candidates")
    op.drop_table("candidates")
