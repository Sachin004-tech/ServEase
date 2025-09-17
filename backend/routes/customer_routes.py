from flask import Flask, request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from config import connection


customer_bp = Blueprint('customer',__name__)

@customer_bp.route('/signup', methods=['POST'])
def customer_signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address")

    if not (name and email and password):
        return jsonify({"message":"all fields are required"}) , 400


    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cursor.fetchone()
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({"message":"Email already registered"})


    hashe_password = generate_password_hash(password)
    cursor.execute(
        "INSERT INTO users(name,email,password,phone,address) VALUES(%s,%s,%s,%s,%s)", (name,email,password,phone,address)
    )
    conn.commit()

    user_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({"message":"Signup successful" , "user_id": user_id}),201



@customer_bp.route('/login', methods=['POST'])
def customer_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not (email and password):
        return jsonify({'message': "Email and password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)


    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401


    if user["password"] == password:   #if use hash then check_password_hash replace with user
        return jsonify({
            "message": "Login successful",
            "user_id": user["user_id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "address": user["address"],
            "created_at": str(user["created_at"])
        }), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401
