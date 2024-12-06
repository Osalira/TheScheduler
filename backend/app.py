# backend/app/app.py
from app import create_app

import logging

# Set up the logger to show messages in the terminal
logging.basicConfig(level=logging.INFO)

app = create_app()

# @app.after_request
# def log_request(response):
#     # Log the method, path, and response code
#     app.logger.info(f"{response.status_code} {response.method} {response.path}")
#     return response

# app.config['JWT_HEADER_TYPE'] = None
if __name__ == '__main__':
    app.run(debug=True)

