"""add job detail fields

Revision ID: 4a9d2e8c6b31
Revises: f2b9c8a1d7e3
Create Date: 2026-06-23 16:55:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "4a9d2e8c6b31"
down_revision: Union[str, None] = "f2b9c8a1d7e3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_id INTEGER")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department VARCHAR(120)")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type VARCHAR(40)")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_mode VARCHAR(40)")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location VARCHAR(160)")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_level VARCHAR(80)")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS number_openings INTEGER NOT NULL DEFAULT 1")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS required_skills TEXT")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS target_start_date DATE")
    op.execute("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_deadline DATE")
    op.execute("ALTER TABLE jobs ALTER COLUMN number_openings SET DEFAULT 1")
    op.execute("UPDATE jobs SET number_openings = 1 WHERE number_openings IS NULL")
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_constraint
                WHERE conname = 'fk_jobs_hiring_manager_id_users'
            ) THEN
                ALTER TABLE jobs
                ADD CONSTRAINT fk_jobs_hiring_manager_id_users
                FOREIGN KEY (hiring_manager_id)
                REFERENCES users(id)
                ON DELETE SET NULL;
            END IF;
        END $$;
        """
    )


def downgrade() -> None:
    op.execute("ALTER TABLE jobs DROP CONSTRAINT IF EXISTS fk_jobs_hiring_manager_id_users")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS application_deadline")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS target_start_date")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS required_skills")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS number_openings")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS job_level")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS location")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS work_mode")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS employment_type")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS department")
    op.execute("ALTER TABLE jobs DROP COLUMN IF EXISTS hiring_manager_id")
