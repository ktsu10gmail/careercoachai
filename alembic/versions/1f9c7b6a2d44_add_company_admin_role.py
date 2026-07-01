"""add company admin role

Revision ID: 1f9c7b6a2d44
Revises: 8b6f0d2c4e11
Create Date: 2026-06-05 15:32:00.000000
"""
from alembic import op


revision = "1f9c7b6a2d44"
down_revision = "8b6f0d2c4e11"
branch_labels = None
depends_on = None


def upgrade():
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'COMPANY_ADMIN' BEFORE 'HR'")


def downgrade():
    # PostgreSQL does not support removing enum labels without recreating the type.
    pass
