"""add application ai comments

Revision ID: 6a2f8e7b91c4
Revises: 1f9c7b6a2d44
Create Date: 2026-06-08 02:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "6a2f8e7b91c4"
down_revision = "1f9c7b6a2d44"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("applications", sa.Column("resume_comment", sa.Text(), nullable=True))
    op.add_column("applications", sa.Column("answer_comment", sa.Text(), nullable=True))


def downgrade():
    op.drop_column("applications", "answer_comment")
    op.drop_column("applications", "resume_comment")
