# backend\app\routes\auth.py
from flask import Blueprint, request, jsonify, render_template
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
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
    # Get the content type of the request
    content_type = request.content_type

    # Handle content types for JSON or form data
    if content_type == 'application/json' and request.is_json:
        data = request.json
    elif content_type in ['application/x-www-form-urlencoded', 'multipart/form-data']:
        data = request.form.to_dict()
    else:
        return jsonify({"msg": "Unsupported Content-Type", "value": content_type}), 400

    # Extract identifier and password
    identifier = data.get('identifier')  # Accept both username or email as 'identifier'
    password = data.get('password')

    if not identifier or not password:
        return jsonify({"error": "Missing username/email or password"}), 400

    # Check if identifier is an email or username
    user = User.query.filter(
        (User.email == identifier) | (User.username == identifier)
    ).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        # Generate access and refresh tokens
        access_token = create_access_token(identity=str(user.id))
        
        # refresh_token = create_refresh_token(identity=str(user.id))
        # return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200
        return jsonify({"access_token": access_token}), 200

    return jsonify({"error": "Invalid credentials"}), 401


# @auth_bp.route("/refresh", methods=["POST"])
# @jwt_required(refresh=True)
# def refresh():
#     current_user = get_jwt_identity()
#     access_token = create_access_token(identity=current_user)
#     # add_token_to_database(access_token)
#     return jsonify({"access_token": access_token}), 200