# backend/app/schemas/task_schema.py
from marshmallow import Schema, fields


class TaskSchema(Schema):
    id = fields.Int(required=True)  # Ensure `id` is included in the serialized response
    title = fields.Str(required=False, allow_none=True)  # Optional, allows None or a string
    time_to_complete = fields.Float(required=False)  # Optional, must be a float
    status = fields.Str(required=False)  # Optional, must be a string
    priority = fields.Str(required=False, allow_none=True)  # Optional, allows None or a string
    day_of_week = fields.Str(required=False, allow_none=True)  # Optional, allows None or a string
    time_slot = fields.Str(required=False, allow_none=True)  # Optional, allows None or a string
    task_description = fields.Str(required=False, allow_none=True)  # Optional, allows None or a string
    reoccurring = fields.Bool(required=False, missing=False)  # Optional, defaults to False
    user_id = fields.Int(required=False, allow_none=True)  # Optional, allows None or an integer






