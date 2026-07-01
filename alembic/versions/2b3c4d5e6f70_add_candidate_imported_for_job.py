"""add candidate imported for job

Revision ID: 2b3c4d5e6f70
Revises: 1a2b3c4d5e6f
Create Date: 2026-06-24 17:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "2b3c4d5e6f70"
down_revision = "1a2b3c4d5e6f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("candidates", sa.Column("imported_for_job_id", sa.Integer(), nullable=True))
    op.create_index(
        op.f("ix_candidates_imported_for_job_id"),
        "candidates",
        ["imported_for_job_id"],
        unique=False,
    )
    op.create_foreign_key(
        "fk_candidates_imported_for_job_id_jobs",
        "candidates",
        "jobs",
        ["imported_for_job_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_candidates_imported_for_job_id_jobs", "candidates", type_="foreignkey")
    op.drop_index(op.f("ix_candidates_imported_for_job_id"), table_name="candidates")
    op.drop_column("candidates", "imported_for_job_id")
