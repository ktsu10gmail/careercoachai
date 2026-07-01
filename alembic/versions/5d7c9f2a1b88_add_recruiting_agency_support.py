"""add recruiting agency support

Revision ID: 5d7c9f2a1b88
Revises: 9c2a4b6d8e01
Create Date: 2026-06-11 18:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = "5d7c9f2a1b88"
down_revision = "9c2a4b6d8e01"
branch_labels = None
depends_on = None


organization_type = sa.Enum("EMPLOYER", "RECRUITING_AGENCY", name="organizationtype")


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        organization_type.create(bind, checkfirst=True)
        with op.get_context().autocommit_block():
            op.execute("ALTER TYPE userrole ADD VALUE IF NOT EXISTS 'RECRUITER'")

    with op.batch_alter_table("companies") as batch_op:
        batch_op.add_column(
            sa.Column(
                "organization_type",
                organization_type if dialect == "postgresql" else sa.String(length=40),
                nullable=True,
            )
        )
        batch_op.add_column(sa.Column("status", sa.String(length=40), nullable=True))
    op.execute("UPDATE companies SET organization_type = 'EMPLOYER' WHERE organization_type IS NULL")
    op.execute("UPDATE companies SET status = 'active' WHERE status IS NULL")
    with op.batch_alter_table("companies") as batch_op:
        batch_op.alter_column("organization_type", nullable=False)
        batch_op.alter_column("status", nullable=False)

    op.create_table(
        "client_companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("agency_company_id", sa.Integer(), nullable=False),
        sa.Column("company_name", sa.String(length=200), nullable=False),
        sa.Column("industry", sa.String(length=120), nullable=True),
        sa.Column("website", sa.String(length=255), nullable=True),
        sa.Column("contact_name", sa.String(length=120), nullable=True),
        sa.Column("contact_email", sa.String(length=255), nullable=True),
        sa.Column("contact_phone", sa.String(length=80), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=40), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["agency_company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_client_companies_agency_company_id"), "client_companies", ["agency_company_id"], unique=False)
    op.create_index(op.f("ix_client_companies_id"), "client_companies", ["id"], unique=False)

    with op.batch_alter_table("jobs") as batch_op:
        batch_op.add_column(sa.Column("client_company_id", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("assigned_recruiter_id", sa.Integer(), nullable=True))
        batch_op.create_index(op.f("ix_jobs_client_company_id"), ["client_company_id"], unique=False)
        batch_op.create_foreign_key(
            "fk_jobs_client_company_id_client_companies",
            "client_companies",
            ["client_company_id"],
            ["id"],
            ondelete="SET NULL",
        )
        batch_op.create_foreign_key(
            "fk_jobs_assigned_recruiter_id_users",
            "users",
            ["assigned_recruiter_id"],
            ["id"],
            ondelete="SET NULL",
        )


def downgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    with op.batch_alter_table("jobs") as batch_op:
        batch_op.drop_constraint("fk_jobs_assigned_recruiter_id_users", type_="foreignkey")
        batch_op.drop_constraint("fk_jobs_client_company_id_client_companies", type_="foreignkey")
        batch_op.drop_index(op.f("ix_jobs_client_company_id"))
        batch_op.drop_column("assigned_recruiter_id")
        batch_op.drop_column("client_company_id")

    op.drop_index(op.f("ix_client_companies_id"), table_name="client_companies")
    op.drop_index(op.f("ix_client_companies_agency_company_id"), table_name="client_companies")
    op.drop_table("client_companies")

    with op.batch_alter_table("companies") as batch_op:
        batch_op.drop_column("status")
        batch_op.drop_column("organization_type")

    if dialect == "postgresql":
        organization_type.drop(bind, checkfirst=True)
