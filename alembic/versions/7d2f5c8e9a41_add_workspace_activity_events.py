"""add workspace activity events

Revision ID: 7d2f5c8e9a41
Revises: 6c1e7b9a4d20
Create Date: 2026-06-29 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7d2f5c8e9a41"
down_revision: Union[str, None] = "6c1e7b9a4d20"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "workspace_activity_events",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=False),
        sa.Column("actor_user_id", sa.Integer(), nullable=True),
        sa.Column("actor_name_snapshot", sa.String(length=120), nullable=True),
        sa.Column("actor_email_snapshot", sa.String(length=255), nullable=True),
        sa.Column("event_type", sa.String(length=80), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=True),
        sa.Column("entity_id", sa.Integer(), nullable=True),
        sa.Column("entity_label", sa.String(length=255), nullable=True),
        sa.Column("summary", sa.String(length=500), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["actor_user_id"], ["users.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_workspace_activity_events_actor_user_id"), "workspace_activity_events", ["actor_user_id"], unique=False)
    op.create_index(op.f("ix_workspace_activity_events_company_id"), "workspace_activity_events", ["company_id"], unique=False)
    op.create_index(op.f("ix_workspace_activity_events_created_at"), "workspace_activity_events", ["created_at"], unique=False)
    op.create_index(op.f("ix_workspace_activity_events_entity_id"), "workspace_activity_events", ["entity_id"], unique=False)
    op.create_index(op.f("ix_workspace_activity_events_entity_type"), "workspace_activity_events", ["entity_type"], unique=False)
    op.create_index(op.f("ix_workspace_activity_events_event_type"), "workspace_activity_events", ["event_type"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_workspace_activity_events_event_type"), table_name="workspace_activity_events")
    op.drop_index(op.f("ix_workspace_activity_events_entity_type"), table_name="workspace_activity_events")
    op.drop_index(op.f("ix_workspace_activity_events_entity_id"), table_name="workspace_activity_events")
    op.drop_index(op.f("ix_workspace_activity_events_created_at"), table_name="workspace_activity_events")
    op.drop_index(op.f("ix_workspace_activity_events_company_id"), table_name="workspace_activity_events")
    op.drop_index(op.f("ix_workspace_activity_events_actor_user_id"), table_name="workspace_activity_events")
    op.drop_table("workspace_activity_events")
