"""add usage stats market locale

Revision ID: f2b9c8a1d7e3
Revises: e7a4c2d9f130
Create Date: 2026-06-18 14:30:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "f2b9c8a1d7e3"
down_revision: Union[str, None] = "e7a4c2d9f130"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS usage_stats (
            id SERIAL PRIMARY KEY,
            company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            session_id VARCHAR(128),
            visitor_id VARCHAR(128),
            role VARCHAR(40),
            market VARCHAR(40),
            locale VARCHAR(20),
            host VARCHAR(255),
            event_type VARCHAR(80) NOT NULL,
            path VARCHAR(255),
            result_score DOUBLE PRECISION,
            metadata_json JSON,
            created_at TIMESTAMP WITHOUT TIME ZONE
        )
        """
    )
    op.execute("ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS market VARCHAR(40)")
    op.execute("ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS locale VARCHAR(20)")
    op.execute("ALTER TABLE usage_stats ADD COLUMN IF NOT EXISTS host VARCHAR(255)")
    for column in [
        "company_id",
        "user_id",
        "session_id",
        "visitor_id",
        "role",
        "market",
        "locale",
        "host",
        "event_type",
        "path",
        "created_at",
    ]:
        op.execute(f"CREATE INDEX IF NOT EXISTS ix_usage_stats_{column} ON usage_stats ({column})")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_usage_stats_host")
    op.execute("DROP INDEX IF EXISTS ix_usage_stats_locale")
    op.execute("DROP INDEX IF EXISTS ix_usage_stats_market")
    op.execute("ALTER TABLE usage_stats DROP COLUMN IF EXISTS host")
    op.execute("ALTER TABLE usage_stats DROP COLUMN IF EXISTS locale")
    op.execute("ALTER TABLE usage_stats DROP COLUMN IF EXISTS market")
