# backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
from app.config import Config
from app.extensions import db, jwt, bcrypt, limiter  # Import extensions

# Create a Limiter instance globally
# Initialize Flask-Limiter with Redis as the storage backend
# rate_limiter = Limiter(
#     key_func=get_remote_address,
#     storage_uri="redis://localhost:6379"
# )

def create_app():
    # Create and configure the app
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
     # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    limiter.init_app(app)  # Initialize rate limiter
    CORS(app)
    Migrate(app, db)
    

    # Register blueprints
    
    # from app.routes.register import register_bp
    # from app.routes.login import login_bp
    from app.routes.auth import auth_bp
    from app.routes.tasks import tasks_bp
    # app.register_blueprint(register_bp, url_prefix='/api/register')
    # app.register_blueprint(login_bp, url_prefix='/api/login')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')

    return app

