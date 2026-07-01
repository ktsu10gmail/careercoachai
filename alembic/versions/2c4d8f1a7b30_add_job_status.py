"""add job status

Revision ID: 2c4d8f1a7b30
Revises: 6a2f8e7b91c4
Create Date: 2026-06-08 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "2c4d8f1a7b30"
down_revision = "6a2f8e7b91c4"
branch_labels = None
depends_on = None


job_status = sa.Enum("DRAFT", "ACTIVE", "CLOSED", name="jobstatus")


def upgrade() -> None:
    job_status.create(op.get_bind(), checkfirst=True)
    op.add_column(
        "jobs",
        sa.Column("status", job_status, nullable=False, server_default="ACTIVE"),
    )
    if op.get_bind().dialect.name != "sqlite":
        op.alter_column("jobs", "status", server_default=None)


def downgrade() -> None:
    op.drop_column("jobs", "status")
    job_status.drop(op.get_bind(), checkfirst=True)
