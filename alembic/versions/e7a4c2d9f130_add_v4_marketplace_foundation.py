"""add v4 marketplace foundation

Revision ID: e7a4c2d9f130
Revises: c3f8a1d7e2b9
Create Date: 2026-06-13 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "e7a4c2d9f130"
down_revision = "c3f8a1d7e2b9"
branch_labels = None
depends_on = None


candidate_profile_status = sa.Enum(
    "ANONYMOUS",
    "REGISTERED",
    "OPTED_IN",
    "HIRED",
    "ARCHIVED",
    name="candidateprofilestatus",
)
application_source = sa.Enum(
    "DIRECT_APPLY",
    "RECRUITER_SUBMIT",
    "TALENT_NETWORK",
    name="applicationsource",
)


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        candidate_profile_status.create(bind, checkfirst=True)
        application_source.create(bind, checkfirst=True)
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'PLATFORM_ADMIN' BEFORE 'COMPANY_ADMIN'")

    with op.batch_alter_table("candidates") as batch_op:
        batch_op.add_column(
            sa.Column(
                "profile_status",
                candidate_profile_status if dialect == "postgresql" else sa.String(length=50),
                nullable=False,
                server_default="REGISTERED",
            )
        )
        batch_op.add_column(sa.Column("searchable_title", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("searchable_skills", sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column("last_ai_score", sa.DateTime(), nullable=True))
        batch_op.create_index(op.f("ix_candidates_profile_status"), ["profile_status"], unique=False)

    op.execute("UPDATE candidates SET profile_status = 'OPTED_IN' WHERE consent_talent_network = true")
    op.execute("UPDATE candidates SET profile_status = 'REGISTERED' WHERE profile_status IS NULL")

    with op.batch_alter_table("applications") as batch_op:
        batch_op.add_column(
            sa.Column(
                "source",
                application_source if dialect == "postgresql" else sa.String(length=50),
                nullable=False,
                server_default="DIRECT_APPLY",
            )
        )
        batch_op.create_index(op.f("ix_applications_source"), ["source"], unique=False)

    op.execute("UPDATE applications SET source = 'RECRUITER_SUBMIT' WHERE matched_by_user_id IS NOT NULL")
    op.execute("UPDATE applications SET source = 'DIRECT_APPLY' WHERE source IS NULL")

    op.create_table(
        "talent_matches",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("candidate_id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("match_score", sa.Float(), nullable=True),
        sa.Column("strengths", sa.JSON(), nullable=True),
        sa.Column("weaknesses", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["candidate_id"], ["candidates.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("candidate_id", "job_id", name="uq_talent_matches_candidate_job"),
    )
    op.create_index(op.f("ix_talent_matches_candidate_id"), "talent_matches", ["candidate_id"], unique=False)
    op.create_index(op.f("ix_talent_matches_id"), "talent_matches", ["id"], unique=False)
    op.create_index(op.f("ix_talent_matches_job_id"), "talent_matches", ["job_id"], unique=False)


def downgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    op.drop_index(op.f("ix_talent_matches_job_id"), table_name="talent_matches")
    op.drop_index(op.f("ix_talent_matches_id"), table_name="talent_matches")
    op.drop_index(op.f("ix_talent_matches_candidate_id"), table_name="talent_matches")
    op.drop_table("talent_matches")

    with op.batch_alter_table("applications") as batch_op:
        batch_op.drop_index(op.f("ix_applications_source"))
        batch_op.drop_column("source")

    with op.batch_alter_table("candidates") as batch_op:
        batch_op.drop_index(op.f("ix_candidates_profile_status"))
        batch_op.drop_column("last_ai_score")
        batch_op.drop_column("searchable_skills")
        batch_op.drop_column("searchable_title")
        batch_op.drop_column("profile_status")

    if dialect == "postgresql":
        application_source.drop(bind, checkfirst=True)
        candidate_profile_status.drop(bind, checkfirst=True)
