# backend\app\routes\tasks.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.models.task import Task
from app.schemas.task_schema import TaskSchema
from app import db

# Define the Blueprint
tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=current_user['id']).all()
    return jsonify([task.to_dict() for task in tasks]), 200

@tasks_bp.route('/', methods=['POST'])
@jwt_required()
def create_task():
    current_user = get_jwt_identity()
    data = request.json

    try:
        # Validate data
        task_schema = TaskSchema()
        validated_data = task_schema.load(data)

        # Create and save the task
        task = Task(**validated_data, user_id=current_user['id'])
        db.session.add(task)
        db.session.commit()
        return jsonify({"message": "Task created!"}), 201

    except ValidationError as err:
        return jsonify({"error": err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
