# # backend/app/models/archived_week.py

# from app.extensions import db

# class ArchivedWeek(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     week_start_date = db.Column(db.Date, nullable=False)
#     week_end_date = db.Column(db.Date, nullable=False)
#     tasks = db.relationship("ArchivedTask", backref="week", lazy=True)


# class ArchivedTask(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     week_id = db.Column(db.Integer, db.ForeignKey("archived_week.id"), nullable=False)
#     title = db.Column(db.String(255), nullable=True)
#     day_of_week = db.Column(db.String(50), nullable=True)
#     time_slot = db.Column(db.String(50), nullable=True)
#     task_description = db.Column(db.Text, nullable=True)
#     duration = db.Column(db.Float, nullable=True)  # In half-hour blocks
