
from flask import Flask, request, jsonify, Blueprint
import bcrypt
import jwt
import datetime
from config import connection


SECRET_KEY = "YOUR_SECRET_KEY"

professional_bp = Blueprint("professional", __name__, url_prefix="/professional")

# -------------------- SIGNUP --------------------
@professional_bp.route("/signup", methods=["POST"])
def professional_signup():

    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    skill = data.get("skill")
    experience = data.get("experience")
    document_path = data.get("document")  # optional


    if not all([name, email, password, skill]):
        return jsonify({"message": "Required fields are missing"}), 400

    conn = connection()
    cursor = conn.cursor()

    # Hash password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor.execute("""
            INSERT INTO professionals (name, email, password, phone, skill, experience, document_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, email, hashed_password.decode('utf-8'), phone, skill, experience, document_path))
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

    cursor.execute("SELECT * FROM professionals WHERE email=%s", (email,))
    professional = cursor.fetchone()

    cursor.close()
    conn.close()

    if professional:
        # Verify password using bcrypt
        if bcrypt.checkpw(password.encode('utf-8'), professional["password"].encode('utf-8')):
            # Generate JWT token (2 hours expiry)
            token = jwt.encode(
                {
                    "professional_id": professional["professional_id"],
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
                },
                SECRET_KEY,
                algorithm="HS256"
            )

            return jsonify({
                "message": "Login successful!",
                "token": token,
                "professional": {
                    "professional_id": professional["professional_id"],
                    "name": professional["name"],
                    "status": professional["status"],
                    "email": professional["email"],
                    "skill": professional["skill"],
                    "experience": professional["experience"]
                }
            }), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# -------------------- PROTECTED ROUTE EXAMPLE --------------------
from functools import wraps
from flask import request

def token_required(f):
    """
    Decorator to protect routes with JWT token.
    - Checks Authorization header
    - Decodes token
    - Passes professional_id to route
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            professional_id = data["professional_id"]
        except:
            return jsonify({"message": "Token is invalid or expired!"}), 401
        return f(professional_id, *args, **kwargs)
    return decorated

@professional_bp.route("/profile", methods=["GET"])
@token_required
def professional_profile(professional_id):
    """
    Example protected route:
    - Returns logged-in professional's profile
    - Requires valid JWT token
    """
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT professional_id,name,email,phone,skill,experience,status,document_path FROM professionals WHERE professional_id=%s", (professional_id,))
    professional = cursor.fetchone()
    cursor.close()
    conn.close()

    if not professional:
        return jsonify({"message": "Professional not found"}), 404

    return jsonify({"professional": professional}), 200
