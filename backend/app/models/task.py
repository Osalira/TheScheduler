# backend/app/models/task.py
# backend/app/models/task.py
# from app import db
from app.extensions import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    time_to_complete = db.Column(db.Float, nullable=True)
    status = db.Column(db.String(50), nullable=True)
    priority = db.Column(db.String(50), nullable=True)
    day_of_week = db.Column(db.String(50), nullable=True)
    time_slot = db.Column(db.String(50), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Made optional
    task_description = db.Column(db.Text, nullable=True)
    reoccurring = db.Column(db.Boolean, nullable=True, default=False)  # Added reoccurring field

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "time_to_complete": self.time_to_complete,
            "status": self.status,
            "priority": self.priority,
            "day_of_week": self.day_of_week,
            "time_slot": self.time_slot,
            "user_id": self.user_id,
            "task_description": self.task_description,
            "reoccurring": self.reoccurring,
        }

