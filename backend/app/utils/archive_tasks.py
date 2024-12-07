# backend/app/utils/archive_tasks.py

from datetime import datetime, timedelta
from app.models.task import Task
from app.models.task import WeeklyArchive, ArchivedTask
from app.extensions import db

def archive_weekly_tasks():
    today = datetime.today()
    start_of_week = today - timedelta(days=today.weekday())  # Monday
    end_of_week = start_of_week + timedelta(days=6)  # Sunday

    # Fetch tasks to archive
    tasks_to_archive = Task.query.all()

    # Create an ArchivedWeek entry
    archived_week = WeeklyArchive(
        week_start_date=start_of_week.date(),
        week_end_date=end_of_week.date(),
    )
    db.session.add(archived_week)
    db.session.commit()

    # Archive tasks
    for task in tasks_to_archive:
        archived_task = ArchivedTask(
            week_id=archived_week.id,
            title=task.title,
            day_of_week=task.day_of_week,
            time_slot=task.time_slot,
            task_description=task.task_description,
            duration=task.time_to_complete,
        )
        db.session.add(archived_task)
    db.session.commit()

    # Clear current week tasks
    Task.query.delete()
    db.session.commit()
