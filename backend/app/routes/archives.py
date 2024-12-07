# backend/app/routes/archive.py

# from flask import Blueprint, jsonify
# from app.models.task import WeeklyArchive, ArchivedTask
# from app.schemas.archived_week_schema import ArchivedWeekSchema

# archive_bp = Blueprint("archive", __name__)

# @archive_bp.route("/archived_weeks", methods=["GET"])
# def get_archived_weeks():
#     archived_weeks = WeeklyArchive.query.all()
#     schema = ArchivedWeekSchema(many=True)
#     return jsonify(schema.dump(archived_weeks)), 200
