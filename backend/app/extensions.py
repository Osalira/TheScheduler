# backend\app\extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Define extensions
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

limiter = Limiter(
    get_remote_address,
    storage_uri="redis://localhost:6379"
)
