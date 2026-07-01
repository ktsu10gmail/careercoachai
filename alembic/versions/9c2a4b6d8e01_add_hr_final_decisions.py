"""add hr final decisions

Revision ID: 9c2a4b6d8e01
Revises: 7e1d5f3c2a10
Create Date: 2026-06-11 14:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "9c2a4b6d8e01"
down_revision = "7e1d5f3c2a10"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if op.get_bind().dialect.name == "postgresql":
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS 'OFFER_PENDING'")
            op.execute("ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS 'ON_HOLD'")
    op.add_column("applications", sa.Column("hr_final_comment", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("hr_final_decided_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("applications", "hr_final_decided_at")
    op.drop_column("applications", "hr_final_comment")
