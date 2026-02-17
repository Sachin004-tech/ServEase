from flask import Flask
from flask import request, jsonify, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt
import jwt
import datetime
from config import connection, send_email
from functools import wraps
import random  # for the password reset
from config import SECRET_KEY
from datetime import timedelta, time, date






customer_bp = Blueprint('customer', __name__)


@customer_bp.route('/signup', methods=['POST'])
def customer_signup():

    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body missing"}), 400

    name = data.get("name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address")

    if not (name and email and password):
        return jsonify({"message": "Name, Email, Password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # check existing
        cursor.execute("SELECT user_id FROM users WHERE email=%s", (email,))
        if cursor.fetchone():
            return jsonify({"message": "Email already exists"}), 400

        # hash password
        hashed_password = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

        # insert
        cursor.execute("""
            INSERT INTO users(name,username,email,password,phone,address)
            VALUES(%s,%s,%s,%s,%s,%s)
        """, (name, username, email, hashed_password, phone, address))

        conn.commit()

        # SEND EMAIL (SAFE WAY)
        subject = "Welcome to ServEase"
        body = f"""
Hello {name},

Your account has been created successfully.

Thanks for joining ServEase.
"""

        email_sent = send_email(email, subject, body)

        email_sent = send_email(email, subject, body)
        print("EMAIL STATUS:", email_sent)

        return jsonify({

            "email_sent": email_sent,
            "message": "Signup successful. Mail sent successful to the registered mail id"
        }), 201

    except Exception as e:
        print("Signup Error:", str(e))
        return jsonify({"message": "Server error"}), 500

    finally:
        cursor.close()
        conn.close()



@customer_bp.route('/login', methods=['POST'])
def customer_login():

    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body missing"}), 400

    login_input = data.get("email")
    password = data.get("password")

    if not login_input or not password:
        return jsonify({"message": "Email/Username & password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT * FROM users
            WHERE email=%s OR username=%s
        """, (login_input, login_input))

        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Invalid credentials"}), 401

        if user["is_blocked"] == 1:
            return jsonify({"message": "Account blocked"}), 403

        if not bcrypt.checkpw(
                password.encode(),
                user["password"].encode()):

            return jsonify({"message": "Invalid credentials"}), 401

        # JWT TOKEN
        payload = {
            "user_id": user["user_id"],
            "email": user["email"],
            "role": "customer",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        if isinstance(token, bytes):
            token = token.decode()

        # LOGIN ALERT EMAIL (SAFE)
        subject = "ServEase Login Alert"
        body = f"""
Hello {user['name']},

You have logged into your ServEase account.

If this wasn't you, contact support.
"""

        email_sent = send_email(user["email"], subject, body)

        return jsonify({
            "message": "Login successful. Mail sent successful to the registered mail id",
            "token": token,
            "email_sent": email_sent,
            "user": {
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "address": user["address"]
            }
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"message": "Server error"}), 500

    finally:
        cursor.close()
        conn.close()

def customer_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token is missing"}), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Invalid token format"}), 401

        token = auth_header.split(" ")[1]

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = data["user_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(user_id, *args, **kwargs)

    return decorated

# FORGOT PASSWORD + OTP GENERATE
@customer_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email=data.get("email")

    if not email:
        return jsonify({"message":"Email is required"})
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s",(email,))
        user = cursor.fetchone()

        if not user: # always return same response bcz for security reason
            return jsonify({"message":"If this email exists, OTP has been sent"})

        #Delete old otp if exist
        cursor.execute("DELETE FROM password_reset_otp WHERE user_id = %s",(user["user_id"],))

        #Generate 6 digit otp pin
        otp = str(random.randint(100000, 999999))
        expire_at = datetime.datetime.utcnow()+datetime.timedelta(minutes=10)

        cursor.execute("""
            INSERT INTO password_reset_otp (user_id, otp, expires_at)
            VALUES (%s, %s, %s)
        """, (user["user_id"], otp, expire_at))

        conn.commit()

        #Send OTP to Email
        subject = "ServEase password Reset OTP"
        body = f"""
         Hello {user['name']},

        Your password reset OTP is: {otp}

        This OTP is valid for 10 minutes.
        Do not share it with anyone.

        Regards,
        ServEase Team       
        """
        send_email(user["email"], subject, body)

        return jsonify({"message":"If this email exists, OTP has been sent"}),200

    finally:
        cursor.close()
        conn.close()
@customer_bp.route('/verify-otp', methods=['POST'])
def verify_otp():

    data = request.get_json()
    email = data.get("email").strip().lower()
    otp = str(data.get("otp")).strip()

    if not email or not otp:
        return jsonify({"message": "Email and OTP are required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = %s", (email.lower(),))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Invalid request"}), 400

        cursor.execute("""
            SELECT * FROM password_reset_otp 
            WHERE user_id = %s AND otp = %s
        """, (user["user_id"],otp))

        record = cursor.fetchone()

        if not record:
            return jsonify({"message": "OTP not found"}), 400

        # Expiry check
        if datetime.datetime.utcnow() > record["expires_at"]:
            return jsonify({"message": "OTP expired"}), 400

        # Attempt limit
        if record["attempts"] >= 3:
            return jsonify({"message": "Too many attempts"}), 403

        # Mark verified
        cursor.execute("""
            UPDATE password_reset_otp
            SET is_verified = 1
            WHERE user_id = %s AND otp=%s
        """, (user["user_id"],otp))

        conn.commit()

        return jsonify({"message": "OTP verified successfully"}), 200


    finally:
        cursor.close()
        conn.close()
@customer_bp.route('/reset-password', methods=['POST'])
def reset_password():

    data = request.get_json()
    email = data.get("email")
    new_password = data.get("password")

    if not email or not new_password:
        return jsonify({"message": "Email and new password required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "Invalid request"}), 400

        cursor.execute("""
            SELECT * FROM password_reset_otp
            WHERE user_id = %s
        """, (user["user_id"],))

        record = cursor.fetchone()

        if not record or record["is_verified"] == 0:
            return jsonify({"message": "OTP not verified"}), 403

        # Hash new password
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        cursor.execute("""
            UPDATE users
            SET password = %s
            WHERE user_id = %s
        """, (hashed_password.decode('utf-8'), user["user_id"]))

        # Delete OTP record after success
        cursor.execute("""
            DELETE FROM password_reset_otp
            WHERE user_id = %s
        """, (user["user_id"],))

        conn.commit()

        # Send confirmation email
        subject = "ServEase Password Changed Successfully"
        body = f"""
        Hello {user['name']},

        Your password has been successfully changed.

        If this was not you, contact support immediately.

        Regards,
        ServEase Team
        """

        send_email(user["email"], subject, body)

        return jsonify({"message": "Password reset successful"}), 200

    finally:
        cursor.close()
        conn.close()


#----------------------------SERVICES----------------------------
@customer_bp.route("/services", methods=["GET"])
def get_all_services():

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT s.*, p.name AS professional_name,
                   p.skill, p.experience
            FROM services s
            JOIN professionals p
            ON s.professional_id = p.professional_id
            WHERE s.status='active'
            AND p.status='approved'
        """)

        data = cursor.fetchall()

        return jsonify(data), 200

    finally:
        cursor.close()
        conn.close()
@customer_bp.route("/services/search", methods=["GET"])
def search_services():

    query = request.args.get("query", "").strip()

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        sql = """
            SELECT s.*, p.name AS professional_name
            FROM services s
            JOIN professionals p
            ON s.professional_id = p.professional_id
            WHERE s.status='active'
            AND (
                s.service_name LIKE %s
                OR s.category LIKE %s
            )
        """

        search = f"%{query}%"

        cursor.execute(sql, (search, search))

        results = cursor.fetchall()

        return jsonify(results), 200

    finally:
        cursor.close()
        conn.close()



# ---------------- BOOK SERVICE ----------------
@customer_bp.route("/bookings/create", methods=["POST"])
@customer_token_required
def create_booking(user_id):

    data = request.get_json()

    service_id = data.get("service_id")
    booking_date = data.get("booking_date")
    booking_time = data.get("booking_time")

    if not all([service_id, booking_date, booking_time]):
        return jsonify({"message": "Required fields missing"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get service details
        cursor.execute("""
            SELECT * FROM services
            WHERE service_id=%s AND status='active'
        """, (service_id,))
        service = cursor.fetchone()

        if not service:
            return jsonify({"message": "Service not found"}), 404

        # Insert booking
        cursor.execute("""
            INSERT INTO bookings
            (user_id, professional_id, service_id,
             amount, booking_date, booking_time,
             status, service_name, live_status)
            VALUES (%s,%s,%s,%s,%s,%s,
                    'pending',%s,'pending')
        """, (
            user_id,
            service["professional_id"],
            service_id,
            service["price"],
            booking_date,
            booking_time,
            service["service_name"]
        ))

        conn.commit()

        return jsonify({
            "message": "Booking created successfully"
        }), 201

    finally:
        cursor.close()
        conn.close()
@customer_bp.route("/bookings/my", methods=["GET"])
@customer_token_required
def my_bookings(user_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT b.*, p.name AS professional_name
            FROM bookings b
            LEFT JOIN professionals p
            ON b.professional_id = p.professional_id
            WHERE b.user_id=%s
            ORDER BY b.created_at DESC
        """, (user_id,))

        data = cursor.fetchall()
        for row in data:
            for key, value in row.items():
                if isinstance(value, (timedelta, time)):
                    row[key] = str(value)

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error":str(e)}),500
    finally:
        cursor.close()
        conn.close()



# -------- CUSTOMER MY BOOKINGS (ALL HISTORY) --------
@customer_bp.route("/bookings/all-my", methods=["GET"])
@customer_token_required
def my_all_bookings(user_id):

    # optional filter
    status = request.args.get("status", "").strip().lower()

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:

        sql = """
            SELECT 
                b.booking_id,
                b.service_name,
                b.amount,
                b.booking_date,
                b.booking_time,
                b.status,
                b.live_status,
                b.created_at,
                p.name AS professional_name,
                p.phone AS professional_phone,
                p.skill AS professional_skill
            FROM bookings b
            JOIN professionals p
            ON b.professional_id = p.professional_id
            WHERE b.user_id = %s
        """

        params = [user_id]

        # status filter (optional)
        if status:
            sql += " AND b.status = %s"
            params.append(status)

        # latest booking first (history + current)
        sql += " ORDER BY b.booking_date DESC, b.booking_time DESC"

        cursor.execute(sql, tuple(params))

        bookings = cursor.fetchall()

        # optional message if empty
        if not bookings:
            return jsonify({
                "message": "No bookings found",
                "data": []
            }), 200
        for row in bookings:
            for key in row:
                if row[key] is not None:
                    row[key] = str(row[key])

        return jsonify({
            "total_bookings": len(bookings),
            "data": bookings
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}),500

    finally:
        cursor.close()
        conn.close()

@customer_bp.route("/bookings/details/<int:booking_id>", methods=["GET"])
@customer_token_required
def booking_details_customer(user_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT b.*, p.name AS professional_name,
                   p.phone AS professional_phone,
                   p.skill
            FROM bookings b
            JOIN professionals p
            ON b.professional_id = p.professional_id
            WHERE b.booking_id=%s
            AND b.user_id=%s
        """, (booking_id, user_id))

        booking = cursor.fetchone()

        if not booking:
            return jsonify({"message": "Booking not found"}), 404


        for key in booking:
            if booking[key] is not None:
                booking[key] = str(booking[key])

        return jsonify(booking), 200
    except Exception as e:
        return jsonify({"error":str(e)}),500

    finally:
        cursor.close()
        conn.close()

@customer_bp.route("/bookings/cancel/<int:booking_id>", methods=["PUT"])
@customer_token_required
def cancel_booking(user_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:

        cursor.execute("""
            SELECT b.*, p.email AS pro_email
            FROM bookings b
            JOIN professionals p
            ON b.professional_id = p.professional_id
            WHERE b.booking_id=%s
            AND b.user_id=%s
        """, (booking_id, user_id))

        booking = cursor.fetchone()

        if not booking:
            return jsonify({"message":"Booking not found"}),404

        if booking["status"] not in ["pending", "accepted"]:
            return jsonify({"message":"Cannot cancel this booking"}),400

        cursor.execute("""
            UPDATE bookings
            SET status='cancelled',
                live_status='cancelled'
            WHERE booking_id=%s
        """, (booking_id,))

        conn.commit()

        return jsonify({
            "message":"Booking cancelled successfully"
        }),200

    finally:
        cursor.close()
        conn.close()






























# ---------------- PROFILE MANAGEMENT ----------------
@customer_bp.route("/profile", methods=["GET"])
@customer_token_required
def view_profile(user_id):
    """
    View customer profile
    """
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT user_id, name, email, phone, address, created_at FROM users WHERE user_id=%s", (user_id,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Convert datetime to string
        user["created_at"] = str(user["created_at"])
        return jsonify({"profile": user}), 200
    finally:
        cursor.close()
        conn.close()


@customer_bp.route("/profile/update", methods=["PUT"])
@customer_token_required
def update_profile(user_id):
    """
    Update customer profile: name, phone, address
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body is missing"}), 400

    name = data.get("name")
    phone = data.get("phone")
    address = data.get("address")

    if not any([name, phone, address]):
        return jsonify({"message": "At least one field is required to update"}), 400

    conn = connection()
    cursor = conn.cursor()

    try:
        # Build dynamic update query
        updates = []
        params = []

        if name:
            updates.append("name=%s")
            params.append(name)
        if phone:
            updates.append("phone=%s")
            params.append(phone)
        if address:
            updates.append("address=%s")
            params.append(address)

        params.append(user_id)

        sql = f"UPDATE users SET {', '.join(updates)} WHERE user_id=%s"
        cursor.execute(sql, tuple(params))
        conn.commit()

        return jsonify({"message": "Profile updated successfully"}), 200

    finally:
        cursor.close()
        conn.close()



#CUSTOMER DASHBOARD
@customer_bp.route("/dashboard", methods=["GET"])
@customer_token_required
def customer_dashboard(user_id):
    """
    Dashboard summary for customer bookings
    """
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Total bookings
        cursor.execute("SELECT COUNT(*) AS total FROM bookings WHERE user_id=%s", (user_id,))
        total_bookings = cursor.fetchone()["total"]

        # Completed bookings
        cursor.execute("SELECT COUNT(*) AS completed FROM bookings WHERE user_id=%s AND status='completed'", (user_id,))
        completed = cursor.fetchone()["completed"]

        # Pending bookings
        cursor.execute("SELECT COUNT(*) AS pending FROM bookings WHERE user_id=%s AND status='pending'", (user_id,))
        pending = cursor.fetchone()["pending"]

        # Accepted bookings
        cursor.execute("SELECT COUNT(*) AS accepted FROM bookings WHERE user_id=%s AND status='accepted'", (user_id,))
        accepted = cursor.fetchone()["accepted"]

        # Upcoming booking (next booking based on date & time)
        cursor.execute("""
            SELECT booking_id, service_name, booking_date, booking_time, status 
            FROM bookings
            WHERE user_id=%s AND status IN ('pending','accepted')
            ORDER BY booking_date ASC, booking_time ASC
            LIMIT 1
        """, (user_id,))
        upcoming = cursor.fetchone()

        # Last booking (most recent)
        cursor.execute("""
            SELECT booking_id, service_name, booking_date, booking_time, status 
            FROM bookings
            WHERE user_id=%s
            ORDER BY booking_date DESC, booking_time DESC
            LIMIT 1
        """, (user_id,))
        last_booking = cursor.fetchone()

        # Convert datetime objects to string
        for b in [upcoming, last_booking]:
            if b:
                b["booking_date"] = str(b["booking_date"])
                b["booking_time"] = str(b["booking_time"])

        return jsonify({
            "total_bookings": total_bookings,
            "completed": completed,
            "pending": pending,
            "accepted": accepted,
            "upcoming_booking": upcoming,
            "last_booking": last_booking
        }), 200

    finally:
        cursor.close()
        conn.close()















