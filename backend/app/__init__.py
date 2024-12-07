# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.config import Config
from app.extensions import db, jwt, bcrypt, limiter  # Import extensions


def create_app():
    # Create and configure the app
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    limiter.init_app(app)  # Initialize rate limiter
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
    CORS(app)
    Migrate(app, db)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.tasks import tasks_bp
    # from app.routes.archives import archive_bp
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(tasks_bp, url_prefix='/api')
    # app.register_blueprint(archive_bp, url_prefix='/api')

    return app

