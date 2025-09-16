from flask import Flask, request, jsonify, current_app, Blueprint
import os
from werkzeug.utils import secure_filename
from config import connection

professional_bp = Blueprint("professional", __name__, url_prefix="/professional")

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@professional_bp.route("/signup", methods=["POST"])
def professional_signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")  # plain for now
    phone = data.get("phone")
    skill = data.get("skill")
    experience = data.get("experience")
    document_path = data.get("document")  # optional, file name or URL

    # Required fields check
    if not all([name, email, password, skill]):
        return jsonify({"message": "Required fields are missing"}), 400

    conn = connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO professionals (name, email, password, phone, skill, experience, document_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, email, password, phone, skill, experience, document_path))
        conn.commit()
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()





@professional_bp.route("/login", methods=["POST"])
def professional_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({"message": "Email and password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM professionals WHERE email=%s AND password=%s", (email, password))
    professional = cursor.fetchone()

    cursor.close()
    conn.close()

    if professional:
        return jsonify({
            "message": "Login successful!",
            "professional_id": professional["professional_id"],
            "name": professional["name"],
            "status": professional["status"]
        }), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401