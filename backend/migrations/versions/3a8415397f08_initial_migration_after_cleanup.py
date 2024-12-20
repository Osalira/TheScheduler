"""Initial migration after cleanup

Revision ID: 3a8415397f08
Revises: 
Create Date: 2024-12-07 05:17:37.147082

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3a8415397f08'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('weekly_archive',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('week_start_date', sa.Date(), nullable=False),
    sa.Column('week_end_date', sa.Date(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('archived_task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('task_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('time_to_complete', sa.Float(), nullable=True),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('priority', sa.String(length=50), nullable=True),
    sa.Column('day_of_week', sa.String(length=50), nullable=True),
    sa.Column('time_slot', sa.String(length=50), nullable=True),
    sa.Column('task_description', sa.Text(), nullable=True),
    sa.Column('week_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['week_id'], ['weekly_archive.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('task_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('reoccurring', sa.Boolean(), nullable=True))
        batch_op.alter_column('time_to_complete',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=True)
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
        batch_op.alter_column('time_to_complete',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=False)
        batch_op.drop_column('reoccurring')
        batch_op.drop_column('task_description')

    op.drop_table('archived_task')
    op.drop_table('weekly_archive')
    # ### end Alembic commands ###
