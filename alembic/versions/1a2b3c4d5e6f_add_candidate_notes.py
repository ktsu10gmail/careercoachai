"""add candidate notes

Revision ID: 1a2b3c4d5e6f
Revises: 4a9d2e8c6b31
Create Date: 2026-06-24 16:45:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "1a2b3c4d5e6f"
down_revision = "4a9d2e8c6b31"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("candidates", sa.Column("notes", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("candidates", "notes")
