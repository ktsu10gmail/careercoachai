"""add employer invitation roles

Revision ID: 6c1e7b9a4d20
Revises: 4f8b2a1c9d77
Create Date: 2026-06-28 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "6c1e7b9a4d20"
down_revision: Union[str, None] = "4f8b2a1c9d77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        ALTER TABLE employer_invitations
        ADD COLUMN IF NOT EXISTS roles JSON
        """
    )
    op.execute(
        """
        UPDATE employer_invitations
        SET roles = json_build_array(role::text)
        WHERE roles IS NULL
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE employer_invitations DROP COLUMN IF EXISTS roles")
