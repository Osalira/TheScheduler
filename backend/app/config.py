#backend/app/config.py
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress SQLAlchemy warning
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "default_secret_key")  # Add a default
    DEBUG = True
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)  # Access token expiry
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)     # Refresh token expiry


