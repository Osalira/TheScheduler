import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import atexit
from dotenv import load_dotenv  # Import dotenv to load .env file
# added lines
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

# Load environment variables from .env
load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)
# added lines
bcrypt = Bcrypt(app)
# Configure logging for dataBase
logging.basicConfig(level=logging.INFO)

# sql_command = """
#     CREATE TABLE users (
#         id SERIAL PRIMARY KEY,
#         username VARCHAR(255) UNIQUE NOT NULL,
#         email VARCHAR(255) UNIQUE NOT NULL,
#         password_hash TEXT NOT NULL,
#         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#     );
# """
# sql_command = """
# ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
# """



# Database connection setup using environment variables
try:
    conn = psycopg2.connect(
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    cursor = conn.cursor()
    logging.info("Database connection established successfully.")
    # execute the command and save it
    # cursor.execute(sql_command.replace("\n", " "))
    # conn.commit()
except psycopg2.Error as e:
    logging.error(f"Error connecting to the database: {e}")
    exit(1)



# Home route
@app.route('/')
def home():
    return "Welcome to the Scheduler API!"

# Added lines
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not (username and email and password):
        return jsonify({"error": "Missing fields"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)
            RETURNING id
            """, (username, email, hashed_password)
        )
        user_id = cursor.fetchone()[0]
        conn.commit()
        return jsonify({"message": "User registered!", "user_id": user_id}), 201
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500


app.config['JWT_SECRET_KEY'] = 'your_jwt_secret'
jwt = JWTManager(app)

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    cursor.execute("SELECT id, password_hash FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and bcrypt.check_password_hash(user[1], password):
        access_token = create_access_token(identity={"id": user[0], "email": email})
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
# End of added lines

# Tasks endpoint: GET and POST
@app.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def tasks():
    if request.method == 'POST':
        try:
            data = request.json
            # Basic validation
            required_fields = ['title', 'time_to_complete', 'status']
            if not all(field in data for field in required_fields):
                return jsonify({"error": "Missing required fields!"}), 400

            cursor.execute(
                """
                INSERT INTO tasks (title, time_to_complete, notes, status, reoccurring, priority, day_of_week, time_slot)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id

                """,
                (
                    data['title'],
                    data.get('time_to_complete'),
                    data.get('notes'),
                    data['status'],
                    data.get('reoccurring'),
                    data.get('priority'),
                    data.get('day_of_week'),
                    data.get('time_slot'),
                )
            )
            
            task_id = cursor.fetchone()[0]  # Get the generated task ID
            logging.info(f"Received data: {data}")
            conn.commit()
            

            logging.info("Task created successfully.")
            return jsonify({"message": "Task created!", "id": task_id}), 201
        except psycopg2.Error as e:
            logging.error(f"Error inserting task: {e}")
            return jsonify({"error": str(e)}), 500

    elif request.method == 'GET':
        try:
            cursor.execute("SELECT * FROM tasks")
            rows = cursor.fetchall()
            tasks = [
                {
                    "id": row[0],
                    "title": row[1],
                    "time_to_complete": row[2],
                    "notes": row[3],
                    "status": row[4],
                    "reoccurring": row[5],
                    "priority": row[6],
                    "day_of_week": row[7],
                    "time_slot": row[8],
                    "created_at": row[9],
                }
                for row in rows
            ]

            logging.info("Tasks fetched successfully.")
            return jsonify(tasks)
        except psycopg2.Error as e:
            logging.error(f"Error fetching tasks: {e}")
            return jsonify({"error": str(e)}), 500

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
        row = cursor.fetchone()
        if not row:
            return jsonify({"error": "Task not found"}), 404

        task = {
            "id": row[0],
            "title": row[1],
            "time_to_complete": row[2],
            "notes": row[3],
            "status": row[4],
            "reoccurring": row[5],
            "priority": row[6],
            "day_of_week": row[7],
            "time_slot": row[8],
            "created_at": row[9]
        }
        return jsonify(task)
    except psycopg2.Error as e:
        logging.error(f"Error fetching task: {e}")
        return jsonify({"error": str(e)}), 500


# Update a task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        data = request.json
        day_of_week = data.get('day_of_week')  # Can be null
        time_slot = data.get('time_slot')  # Can be null

        cursor.execute(
            """
            UPDATE tasks
            SET day_of_week = %s, time_slot = %s
            WHERE id = %s
            """,
            (day_of_week, time_slot, task_id)
        )
        conn.commit()
        return jsonify({"message": "Task updated!"}), 200
    except psycopg2.Error as e:
        conn.rollback()
        logging.error(f"Error updating task {task_id}: {e}")
        return jsonify({"error": str(e)}), 500

# Delete a task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        conn.commit()
        logging.info(f"Task {task_id} deleted successfully.")
        return jsonify({"message": "Task deleted!"}), 200
    except psycopg2.Error as e:
        logging.error(f"Error deleting task {task_id}: {e}")
        return jsonify({"error": str(e)}), 500

# Close resources on app shutdown
@atexit.register
def close_resources():
    if cursor:
        cursor.close()
    if conn:
        conn.close()
    logging.info("Database resources closed.")

if __name__ == '__main__':
    app.run(debug=True)


