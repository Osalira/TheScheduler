# backend/app/schemas/task_schema.py
from marshmallow import Schema, fields

class TaskSchema(Schema):
    title = fields.Str(required=True)
    time_to_complete = fields.Float(required=True)
    status = fields.Str(required=True)
    day_of_week = fields.Str()
    time_slot = fields.Str()
    reoccurring = fields.Bool()
    priority = fields.Str()
