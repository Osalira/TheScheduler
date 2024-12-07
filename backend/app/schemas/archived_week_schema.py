# backend/app/schemas/archived_week_schema.py

from marshmallow import Schema, fields

class ArchivedTaskSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    day_of_week = fields.Str()
    time_slot = fields.Str()
    task_description = fields.Str()
    duration = fields.Float()

class ArchivedWeekSchema(Schema):
    id = fields.Int()
    week_start_date = fields.Date()
    week_end_date = fields.Date()
    tasks = fields.Nested(ArchivedTaskSchema, many=True)
