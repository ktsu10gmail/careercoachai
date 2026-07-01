"""add candidate submissions

Revision ID: b6c3d2e9a4f1
Revises: a8e4f1c2d9b0
Create Date: 2026-06-12 01:20:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "b6c3d2e9a4f1"
down_revision = "a8e4f1c2d9b0"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "candidate_submissions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("application_id", sa.Integer(), nullable=False),
        sa.Column("submitted_by_user_id", sa.Integer(), nullable=True),
        sa.Column("submitted_to_name", sa.String(length=120), nullable=False),
        sa.Column("submitted_to_email", sa.String(length=255), nullable=False),
        sa.Column("submission_status", sa.String(length=40), nullable=False, server_default="pending"),
        sa.Column("client_feedback", sa.Text(), nullable=True),
        sa.Column("submitted_at", sa.DateTime(), nullable=True),
        sa.Column("reviewed_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["application_id"], ["applications.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["submitted_by_user_id"], ["users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_candidate_submissions_application_id"), "candidate_submissions", ["application_id"], unique=False)
    op.create_index(op.f("ix_candidate_submissions_id"), "candidate_submissions", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_candidate_submissions_id"), table_name="candidate_submissions")
    op.drop_index(op.f("ix_candidate_submissions_application_id"), table_name="candidate_submissions")
    op.drop_table("candidate_submissions")
