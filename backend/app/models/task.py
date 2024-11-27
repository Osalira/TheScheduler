# backend/app/models/task.py
# backend/app/models/task.py
# from app import db
from app.extensions import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=True)
    time_to_complete = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(50), nullable=True)
    day_of_week = db.Column(db.String(50), nullable=True)
    time_slot = db.Column(db.String(50), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

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
        }
