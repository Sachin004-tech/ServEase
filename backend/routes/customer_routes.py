from flask import Flask, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt
import jwt
import datetime
from config import connection

SECRET_KEY = "YOUR_SECRET_KEY"

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/signup', methods=['POST'])
def customer_signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address")

    if not (name and email and password):  #validation
        return jsonify({"message": "All fields are required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    # Check user h ya nhi
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({"message": "Email already registered"}), 400

    # password hashing using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insert user details
    cursor.execute(
        "INSERT INTO users(name,email,password,phone,address) VALUES(%s,%s,%s,%s,%s)",
        (name, email, hashed_password.decode('utf-8'), phone, address)
    )
    conn.commit()

    user_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({"message": "Signup successful", "user_id": user_id}), 201

# ------------------ LOGIN ------------------
@customer_bp.route('/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):  #validation
        return jsonify({"message": "Email and password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,)) #fetch by email
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    # Check password using bcrypt
    if bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        # Generate JWT token for login
        token = jwt.encode(
            {
                "user_id": user["user_id"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token valid for 1hr
            },
            SECRET_KEY,
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "address": user["address"],
                "created_at": str(user["created_at"])
            }
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
