"""add password reset tokens

Revision ID: 0f4c8a9d2e61
Revises: f2b9c8a1d7e3
Create Date: 2026-06-25 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "0f4c8a9d2e61"
down_revision: Union[str, None] = "f2b9c8a1d7e3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token_hash VARCHAR(128) NOT NULL UNIQUE,
            expires_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
            used_at TIMESTAMP WITHOUT TIME ZONE,
            created_at TIMESTAMP WITHOUT TIME ZONE
        )
        """
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_user_id "
        "ON password_reset_tokens (user_id)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_token_hash "
        "ON password_reset_tokens (token_hash)"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_expires_at "
        "ON password_reset_tokens (expires_at)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_password_reset_tokens_expires_at")
    op.execute("DROP INDEX IF EXISTS ix_password_reset_tokens_token_hash")
    op.execute("DROP INDEX IF EXISTS ix_password_reset_tokens_user_id")
    op.execute("DROP TABLE IF EXISTS password_reset_tokens")
