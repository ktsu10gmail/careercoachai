"""merge password reset and candidate heads

Revision ID: 3d2e1f0a9b88
Revises: 0f4c8a9d2e61, 2b3c4d5e6f70
Create Date: 2026-06-25 00:10:00.000000
"""

from typing import Sequence, Union


revision: str = "3d2e1f0a9b88"
down_revision: Union[str, tuple[str, str], None] = (
    "0f4c8a9d2e61",
    "2b3c4d5e6f70",
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
