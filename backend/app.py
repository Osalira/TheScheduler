# backend/app/app.py
from app import create_app
from apscheduler.schedulers.background import BackgroundScheduler
from app.utils.archive_tasks import archive_weekly_tasks
import logging

# Set up the logger to show messages in the terminal
logging.basicConfig(level=logging.INFO)



def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        archive_weekly_tasks,
        "cron",
        day_of_week="sun",
        hour=23,
        minute=59,  # Runs every Sunday at 23:59
    )
    scheduler.start()

start_scheduler()


app = create_app()

# @app.after_request
# def log_request(response):
#     # Log the method, path, and response code
#     app.logger.info(f"{response.status_code} {response.method} {response.path}")
#     return response

# app.config['JWT_HEADER_TYPE'] = None
if __name__ == '__main__':
    app.run(debug=True)

