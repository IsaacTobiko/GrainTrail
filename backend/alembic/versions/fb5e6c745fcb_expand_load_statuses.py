"""expand load statuses

Revision ID: fb5e6c745fcb
Revises: dd7ac9853693
Create Date: 2026-11-24 18:04:06.034053

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fb5e6c745fcb'
down_revision: Union[str, Sequence[str], None] = 'dd7ac9853693'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE loadstatus RENAME TO loadstatus_old")
    op.execute(
        "CREATE TYPE loadstatus AS ENUM "
        "('ordered','loading','weighed','cleared','in_transit','delivered','closed','stopped')"
    )
    op.execute(
        "ALTER TABLE loads ALTER COLUMN status TYPE loadstatus USING 'ordered'::loadstatus"
    )
    op.execute("DROP TYPE loadstatus_old")


def downgrade() -> None:
    op.execute("ALTER TYPE loadstatus RENAME TO loadstatus_new")
    op.execute(
        "CREATE TYPE loadstatus AS ENUM ('pending','loaded','in_transit','delivered')"
    )
    op.execute(
        "ALTER TABLE loads ALTER COLUMN status TYPE loadstatus USING 'pending'::loadstatus"
    )
    op.execute("DROP TYPE loadstatus_new")