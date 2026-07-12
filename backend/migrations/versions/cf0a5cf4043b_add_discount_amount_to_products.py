"""add_discount_amount_to_products

Revision ID: cf0a5cf4043b
Revises: 3c3e25c1160a
Create Date: 2026-07-12 11:56:10.888865

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cf0a5cf4043b'
down_revision: Union[str, None] = '3c3e25c1160a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('discount_amount', sa.Numeric(precision=10, scale=2), server_default='0.0', nullable=False))


def downgrade() -> None:
    op.drop_column('products', 'discount_amount')