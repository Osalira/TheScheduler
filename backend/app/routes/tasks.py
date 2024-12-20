# backend\app\routes\tasks.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.models.task import Task
from app.models.task import WeeklyArchive
from app.models.task import ArchivedTask
from app.schemas.task_schema import TaskSchema
from app.extensions import db
import datetime
from sqlalchemy import and_


import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


# Define the Blueprint
tasks_bp = Blueprint('tasks', __name__)

# Fetch all tasks for the current user
@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    # Retrieve the user ID from the JWT
    user_id = get_jwt_identity()  # This is now a string or integer

    # Fetch tasks associated with the current user
    tasks = Task.query.filter_by(user_id=user_id).all()

    # Serialize the tasks using TaskSchema
    task_schema = TaskSchema(many=True)
    tasks_data = task_schema.dump(tasks)

    return jsonify(tasks_data), 200




logger.info("Entering create_task endpoint")
# Create a new task
@tasks_bp.route('/addtasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user = get_jwt_identity()

    try:
        # Parse JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid or missing JSON payload"}), 400

        # Extract fields from JSON
        title = data.get('title')
        time_to_complete = data.get('time_to_complete')
        task_description = data.get('task_description', "")
        status = data.get('status')
        reoccurring = data.get('reoccurring', False)
        priority = data.get('priority', 'not_sure')
        day_of_week = data.get('day_of_week')
        time_slot = data.get('time_slot')

        # Basic validation
        required_fields = ['title', 'time_to_complete', 'status']
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {missing_fields}"}), 400

        # Prepare task data
        task_data = {
            "title": title,
            "time_to_complete": time_to_complete,
            "task_description": task_description,
            "status": status,
            "reoccurring": reoccurring,
            "priority": priority,
            "day_of_week": day_of_week,
            "time_slot": time_slot,
            "user_id": current_user
        }

        # Create and persist the task
        task = Task(**task_data)
        db.session.add(task)
        db.session.commit()

        return jsonify({"message": "Task created!", "task": task.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Unexpected error", "details": str(e)}), 500



# # Update a specific task
@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    # Get the current user ID from the JWT token
    current_user = get_jwt_identity()

    # Query for the task using the user ID and task ID
    task = Task.query.filter_by(id=task_id, user_id=current_user).first()  # Use current_user directly
    if not task:
        return jsonify({"error": "Task not found"}), 404

    # Parse JSON data from the request
    data = request.json
    try:
        # Update fields if provided, otherwise keep the current value
        task.day_of_week = data.get('day_of_week', task.day_of_week)
        task.time_slot = data.get('time_slot', task.time_slot)
        db.session.commit()

        # Return the updated task
        return jsonify({"message": "Task updated!", "task": task.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# # Delete a specific task
@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    # Get the current user ID from the JWT token
    current_user = get_jwt_identity()

    # Query for the task using the user ID and task ID
    task = Task.query.filter_by(id=task_id, user_id=current_user).first()  # Use current_user directly
    if not task:
        return jsonify({"error": "Task not found"}), 404

    try:
        # Delete the task
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": f"Task {task_id} deleted successfully!"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@tasks_bp.route('/archive_week', methods=['POST'])
@jwt_required()
def archive_week():
    current_user = get_jwt_identity()

    # Determine the start and end of the current week
    today = datetime.date.today()
    start_of_week = today - datetime.timedelta(days=today.weekday())  # Monday
    end_of_week = start_of_week + datetime.timedelta(days=6)  # Sunday

    # Check if this week has already been archived
    existing_archive = WeeklyArchive.query.filter_by(
        week_start_date=start_of_week,
        week_end_date=end_of_week,
        user_id=current_user
    ).first()
    if existing_archive:
        return jsonify({"error": "This week is already archived"}), 400

    # Archive the tasks
    tasks_to_archive = Task.query.filter(
        and_(Task.user_id == current_user, Task.day_of_week.isnot(None))
    ).all()

    if not tasks_to_archive:
        return jsonify({"error": "No tasks to archive"}), 404

    # Create the archive
    archive = WeeklyArchive(
        week_start_date=start_of_week,
        week_end_date=end_of_week,
        user_id=current_user
    )
    db.session.add(archive)
    db.session.flush()

    # Create archived task entries
    for task in tasks_to_archive:
        archived_task = ArchivedTask(
            task_id=task.id,
            title=task.title,
            time_to_complete=task.time_to_complete,
            status=task.status,
            priority=task.priority,
            day_of_week=task.day_of_week,
            time_slot=task.time_slot,
            task_description=task.task_description,
            week_id=archive.id
        )
        db.session.add(archived_task)

    db.session.commit()

    return jsonify({"message": "Week archived successfully"}), 201

@tasks_bp.route('/archived_weeks', methods=['GET'])
@jwt_required()
def get_archived_weeks():
    current_user = get_jwt_identity()
    archived_weeks = WeeklyArchive.query.filter_by(user_id=current_user).all()
    data = []
    for week in archived_weeks:
        week_data = {
            "id": week.id,
            "week_start_date": week.week_start_date,
            "week_end_date": week.week_end_date,
            "tasks": [task.to_dict() for task in week.tasks]
        }
        data.append(week_data)
    return jsonify(data), 200
