#backend/app/config.py
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress SQLAlchemy warning
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")  # Add a default
    DEBUG = True

