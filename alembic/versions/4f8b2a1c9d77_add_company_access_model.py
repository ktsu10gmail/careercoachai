"""add company access model

Revision ID: 4f8b2a1c9d77
Revises: 3d2e1f0a9b88
Create Date: 2026-06-27 20:45:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "4f8b2a1c9d77"
down_revision: Union[str, None] = "3d2e1f0a9b88"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE companies
        ADD COLUMN IF NOT EXISTS access_model VARCHAR(40) NOT NULL DEFAULT 'Role_Based'
        """
    )
    op.execute(
        """
        UPDATE companies
        SET access_model = 'Role_Based'
        WHERE access_model IS NULL
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE companies DROP COLUMN IF EXISTS access_model")
