"""update interview recommendations

Revision ID: 7e1d5f3c2a10
Revises: 2c4d8f1a7b30
Create Date: 2026-06-08 18:20:00.000000
"""
from alembic import op


revision = "7e1d5f3c2a10"
down_revision = "2c4d8f1a7b30"
branch_labels = None
depends_on = None


def upgrade() -> None:
    if op.get_bind().dialect.name == "postgresql":
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE interviewverdict ADD VALUE IF NOT EXISTS 'ACCEPTABLE'")
            op.execute(
                "ALTER TYPE interviewverdict ADD VALUE IF NOT EXISTS 'STRONGLY_RECOMMEND'"
            )
    op.execute(
        "UPDATE interviews SET final_verdict = 'STRONGLY_RECOMMEND' "
        "WHERE final_verdict = 'HIRE'"
    )
    op.execute(
        "UPDATE applications SET status = 'PRE_QUALIFIED' "
        "WHERE status = 'HIRED'"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE interviews SET final_verdict = 'HIRE' "
        "WHERE final_verdict = 'STRONGLY_RECOMMEND'"
    )
