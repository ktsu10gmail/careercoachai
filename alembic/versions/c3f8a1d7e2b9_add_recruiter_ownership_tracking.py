"""add recruiter ownership tracking

Revision ID: c3f8a1d7e2b9
Revises: b6c3d2e9a4f1
Create Date: 2026-06-12 00:35:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "c3f8a1d7e2b9"
down_revision = "b6c3d2e9a4f1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("candidates") as batch_op:
        batch_op.add_column(sa.Column("created_by_user_id", sa.Integer(), nullable=True))
        batch_op.create_index(op.f("ix_candidates_created_by_user_id"), ["created_by_user_id"], unique=False)
        batch_op.create_foreign_key(
            "fk_candidates_created_by_user_id_users",
            "users",
            ["created_by_user_id"],
            ["id"],
            ondelete="SET NULL",
        )

    op.execute("UPDATE candidates SET created_by_user_id = applicant_user_id WHERE created_by_user_id IS NULL")

    with op.batch_alter_table("applications") as batch_op:
        batch_op.add_column(sa.Column("matched_by_user_id", sa.Integer(), nullable=True))
        batch_op.create_index(op.f("ix_applications_matched_by_user_id"), ["matched_by_user_id"], unique=False)
        batch_op.create_foreign_key(
            "fk_applications_matched_by_user_id_users",
            "users",
            ["matched_by_user_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade() -> None:
    with op.batch_alter_table("applications") as batch_op:
        batch_op.drop_constraint("fk_applications_matched_by_user_id_users", type_="foreignkey")
        batch_op.drop_index(op.f("ix_applications_matched_by_user_id"))
        batch_op.drop_column("matched_by_user_id")

    with op.batch_alter_table("candidates") as batch_op:
        batch_op.drop_constraint("fk_candidates_created_by_user_id_users", type_="foreignkey")
        batch_op.drop_index(op.f("ix_candidates_created_by_user_id"))
        batch_op.drop_column("created_by_user_id")
