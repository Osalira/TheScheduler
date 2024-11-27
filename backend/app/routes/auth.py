# backend\app\routes\auth.py
from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError
from app.models.user import User
from app.schemas.user_schema import UserSchema
from app.extensions import db, limiter, bcrypt  # Import extensions

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/', methods=['GET'])
def home():
    return render_template('index.html') 

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register_user():
    data = request.json
    try:
        user_schema = UserSchema()
        validated_data = user_schema.load(data)

        hashed_password = bcrypt.generate_password_hash(validated_data['password']).decode('utf-8')
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            password_hash=hashed_password
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered!"}), 201

    except ValidationError as err:
        return jsonify(err.messages), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Registration failed", "details": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login_user():
    data = request.json
    user = User.query.filter_by(email=data.get('email')).first()
    if user and bcrypt.check_password_hash(user.password_hash, data.get('password')):
        access_token = create_access_token(identity={"id": user.id, "email": user.email})
        return jsonify({"token": access_token}), 200
    return jsonify({"error": "Invalid credentials"}), 401
