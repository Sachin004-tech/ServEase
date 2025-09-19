# from flask import Flask, request, jsonify, Blueprint, current_app
# from config import connection
# import jwt
# import datetime
# from functools import wraps
#
#
#
# admin_bp = Blueprint("admin", __name__)
#
#
# @admin_bp.route("/login", methods=["POST"])
# def admin_login():
#     data = request.json
#     username = data.get("username")
#     password = data.get("password")
#
#
#     conn = connection()
#     cursor = conn.cursor(dictionary= True)
#
#     cursor.execute("SELECT * FROM admin WHERE username = %s AND password = %s",(username, password))
#     admin = cursor.fetchone()
#
#     cursor.close()
#     conn.close()
#
#
#     if admin:
#         return jsonify({
#             "message": "Login is Successful",
#             "admin_id": admin["admin_id"]
#         }), 200
#
#     else:
#         return jsonify({"message":"Invalid details of Admin"}),401











from flask import request, jsonify, Blueprint, current_app
from config import connection
import jwt
import datetime
from functools import wraps
import bcrypt

admin_bp = Blueprint("admin", __name__)

# =====================
# Helper: Token Generator
# =====================
def create_access_token(payload, expires_minutes=15):
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes)
    token = jwt.encode(payload_copy, current_app.config["SECRET_KEY"], algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

# =====================
# Helper: Token Required Decorator
# =====================
def token_required(require_admin=False):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", None)
            if not auth_header:
                return jsonify({"error": "Authorization header missing"}), 401
            try:
                token = auth_header.split()[1]  # "Bearer <token>"
                decoded = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            except jwt.ExpiredSignatureError:
                return jsonify({"error": "Token expired"}), 401
            except Exception as e:
                return jsonify({"error": "Invalid token", "details": str(e)}), 401

            if require_admin and decoded.get("role") != "admin":
                return jsonify({"error": "Admin role required"}), 403

            request.user = decoded
            return f(*args, **kwargs)
        return wrapper
    return decorator

# =====================
# Admin Signup Route (only if you want to create admins via API)
# =====================
@admin_bp.route("/signup", methods=["POST"])
def admin_signup():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "username and password required"}), 400

    # hash password
    password_bytes = password.encode("utf-8")
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())  # bytes

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # store hashed as string (utf-8) - ensure DB column length sufficient
        cursor.execute(
            "INSERT INTO admin (username, password) VALUES (%s, %s)",
            (username, hashed.decode("utf-8"))
        )
        conn.commit()
        admin_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({"message": "Error creating admin", "details": str(e)}), 500

    cursor.close()
    conn.close()
    return jsonify({"message": "Admin created", "admin_id": admin_id}), 201

# =====================
# Admin Login Route (uses bcrypt check)
# =====================
@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "username and password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # fetch by username only (not by password)
        cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
        admin = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not admin:
        return jsonify({"message": "Invalid details of Admin"}), 401

    stored_hash = admin.get("password")  # string from DB
    if not stored_hash:
        return jsonify({"message": "Admin password not set"}), 500

    # compare using bcrypt
    try:
        password_bytes = password.encode("utf-8")
        stored_hash_bytes = stored_hash.encode("utf-8")
        if not bcrypt.checkpw(password_bytes, stored_hash_bytes):
            return jsonify({"message": "Invalid details of Admin"}), 401
    except Exception as e:
        return jsonify({"message": "Error verifying password", "details": str(e)}), 500

    # Create JWT token
    token = create_access_token({
        "admin_id": admin["admin_id"],
        "username": admin["username"],
        "role": "admin"
    }, expires_minutes=15)

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "expires_in_minutes": 15
    }), 200

# =====================
# Example Protected Route
# =====================
@admin_bp.route("/dashboard", methods=["GET"])
@token_required(require_admin=True)
def admin_dashboard():
    user = request.user  # from token
    return jsonify({
        "message": f"Welcome admin {user.get('username')}",
        "admin_id": user.get("admin_id")
    }), 200
