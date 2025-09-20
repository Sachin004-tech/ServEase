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

admin_bp = Blueprint("admin", __name__)

# =====================
# Helper: Token Generator
# =====================
def create_access_token(payload, expires_minutes=60):
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.datetime.utcnow() + datetime.timedelta(minutes=expires_minutes)
    token = jwt.encode(payload_copy, current_app.config["SECRET_KEY"], algorithm="HS256")
    if isinstance(token, bytes):  # ensure str
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

            # if admin role required
            if require_admin and decoded.get("role") != "admin":
                return jsonify({"error": "Admin role required"}), 403

            request.user = decoded  # attach decoded user info
            return f(*args, **kwargs)
        return wrapper
    return decorator


# =====================
# Admin Login Route
# =====================
@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM admin WHERE username = %s AND password = %s", (username, password))
    admin = cursor.fetchone()
    cursor.close()
    conn.close()

    if not admin:
        return jsonify({"message": "Invalid details of Admin"}), 401

    # Create JWT token
    token = create_access_token({
        "admin_id": admin["admin_id"],
        "username": admin["username"],
        "role": "admin"
    }, expires_minutes=60)

    return jsonify({
        "message": "Login Successful",
        "token": token,
        "expires_in_minutes": 60
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
