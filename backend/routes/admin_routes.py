from flask import request, jsonify, Blueprint
from config import connection

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return  jsonify({"message":"Username and Password required"}),400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try :
        cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
        admin = cursor.fetchone()

    finally:
        cursor.close()
        conn.close()

    if not admin:
        return jsonify({"message":"Invalid admin username "}),401

    stored_password = admin.get("password")

    if password!=stored_password:
        return jsonify({"message":"Invalid password"}),401

    return jsonify({
        "message":f"Welcome Admin{admin['username']}",
        "admin_id": admin["admin_id"]
    }),200


@admin_bp.route("?dashboard", methods=["GET"])
def admin_dashboard():
    return jsonify({"message":"Welcome to Admin Panel"}),200