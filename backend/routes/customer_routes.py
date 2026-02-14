from django.conf.global_settings import SECRET_KEY
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





customer_bp = Blueprint('customer', __name__)

# ------------------ SIGNUP ------------------
@customer_bp.route('/signup', methods=['POST'])
def customer_signup():
    data = request.get_json()
    if not data :
        return jsonify({"message":"Request body is missing"}),400

    name = data.get("name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    address = data.get("address")

    if not (name and email and password):  # required field validation
        return jsonify({"message": "Name, Email and Password are required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:  #Check if email already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"message":"Email already registered"}), 400

        #Hashing
        hashed_password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())

        cursor.execute("""INSERT INTO users (name , email, password, phone , address) VALUES
            (%s,%s,%s,%s,%s) """, (name, email,hashed_password.decode('utf-8'), phone , address))

        conn.commit()


        #Send email sfter signup
        subject = "Welcome to ServEase"
        body = f"""
                Hello {name},

                Your account has been successfully created on ServEase.

                Username: {username}

                Thank you for choosing ServEase.

                Regards,
                ServEase Team
                """

        send_email(email, subject, body)
        return jsonify({"message":"Signup successful"}),201
    finally:
        cursor.close()
        conn.close()


# ------------------ LOGIN ------------------
@customer_bp.route('/login', methods=['POST'])
def customer_login():
    data = request.get_json()

    if not data:
        return jsonify({"message": "Request body is missing"}), 400

    login_input = data.get("email") # it can be either email or username
    password = data.get("password")

    if not login_input or not password:
        return jsonify({"message": "Email/Username and Password required"}), 400

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

        # 🔴 Blocked user check
        if user["is_blocked"] == 1:
            return jsonify({"message": "Your account has been blocked"}), 403

        # Check password
        if not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
            return jsonify({"message": "Invalid credentials"}), 401

        # Create JWT
        payload = {
            "user_id": user["user_id"],
            "email": user["email"],
            "role": "customer",
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        # Fix for some PyJWT versions
        if isinstance(token, bytes):
            token = token.decode('utf-8')

        # Send login alert email
        subject ="ServEase Login Alert"
        body = f"""
                Hello {user['name']},

                You have successfully logged into your ServEase account.

                If this was not you, please contact support immediately.

                Regards,
                ServEase Team
                """

        send_email(user["email"], subject, body)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {        # it can re remove but before discuss
                "user_id": user["user_id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "address": user["address"],
                "created_at": str(user["created_at"])
            }
        }), 200

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























#
#
#
# # --------------------------------------------Services-----------------------------------------
# #all services
# # -------------------------------------------- Services -----------------------------------------
#
# # ✅ All active services
# @customer_bp.route("/services", methods=["GET"])
# def all_services():
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute("SELECT * FROM services")
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_services": len(services),
#         "services": services
#     }), 200
#
#
# # ✅ Search by name
# @customer_bp.route("/services/search", methods=["GET"])
# def search_services():
#     name = request.args.get("name")
#     if not name:
#         return jsonify({"message": "Service name is required"}), 400
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = "SELECT * FROM services WHERE service_name = %s"
#     cursor.execute(query, ("%" + name + "%",))
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_services": len(services),
#         "services": services
#     }), 200
#
#
# # ✅ Filter by category
# @customer_bp.route("/services/category/<string:category>", methods=["GET"])
# def service_by_category(category):
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute("SELECT * FROM services WHERE status='active' AND category = %s", (category,))
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "category": category,
#         "total_services": len(services),
#         "services": services
#     }), 200
#
#
# # ✅ Sort by price (asc / desc)
# @customer_bp.route("/services/price", methods=["GET"])
# def service_by_price():
#     order = request.args.get("order", "asc")
#
#     if order not in ["asc", "desc"]:
#         return jsonify({"message": "Invalid order, use asc or desc"}), 400
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute(f"SELECT * FROM services WHERE status='active' ORDER BY price {order.upper()}")
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "order": order,
#         "total_services": len(services),
#         "services": services
#     }), 200
#
#
# # ✅ Trending services (most booked)
# @customer_bp.route("/services/trending", methods=["GET"])
# def trending_services():
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT s.*, COUNT(b.booking_id) AS total_bookings
#         FROM services s
#         LEFT JOIN bookings b ON s.service_id = b.service_id
#         WHERE s.status='active'
#         GROUP BY s.service_id
#         ORDER BY total_bookings DESC
#         LIMIT 5
#     """
#     cursor.execute(query)
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({"trending_services": services}), 200
#
# #Book now services
# @customer_bp.route("/book-service",methods=["POST"])
#
# def book_service(user_id):
#     data = request.get_json()
#     service_id = data.get("service_id")
#     booking_date = data.get("booking_date")
#     booking_time = data.get("booking_time")
#
#     if not all([service_id, booking_date, booking_time]):
#         return jsonify({"message":"All fields are requried"}),400
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute("""
#         SELECT service_id, professional_id, price, service_name, status
#         FROM services
#         WHERE service_id = %s
#     """, (service_id,))
#     service = cursor.fetchone()
#     if not service:
#         return jsonify({"message":"Service not found"}),404
#     if service["status"]!= "active":
#         return jsonify({"messgae":"Service is not available"}),400
#
#     professional_id = service["professional_id"]
#     amount = service["price"]
#     service_name = service["service_name"]
#
#     cursor.execute("""
#         SELECT * FROM bookings
#         WHERE professional_id=%s
#         AND booking_date=%s
#         AND booking_time=%s
#         AND status IN ('pending','accepted')
#     """, (professional_id, booking_date, booking_time))
#
#     if cursor.fetchone():
#         return jsonify({"message":"Professional already booked at this time "}),400
#
#     cursor.execute("""
#         INSERT INTO bookings
#         (user_id, professional_id, service_id, amount, booking_date, booking_time, service_name)
#         VALUES (%s, %s, %s, %s, %s, %s, %s)
#     """,  (user_id, professional_id, service_id, amount, booking_date, booking_time, service_name))
#     conn.commit()
#     booking_id = cursor.lastrowid
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "message":"Booking successful!",
#         "booking_id":booking_id,
#         "status":"pending"
#     }),201
#
#
# # ------------------- VIEW ALL PROFESSIONALS -------------------
# @customer_bp.route("/professionals", methods=["GET"])
# def view_professionals():
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             p.professional_id,
#             p.name,
#             p.skill,
#             p.experience,
#             p.status,
#             p.phone,
#
#             -- total services by professional
#             COUNT(DISTINCT s.service_id) AS total_services,
#
#             -- active services (all services because you don't have status column in services)
#             COUNT(DISTINCT s.service_id) AS active_services,
#
#             -- average rating
#             ROUND(AVG(r.rating), 1) AS avg_rating,
#
#             -- total completed jobs
#             COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.booking_id END) AS total_jobs_done
#
#         FROM professionals p
#         LEFT JOIN services s ON p.professional_id = s.professional_id
#         LEFT JOIN rating_reviews r ON p.professional_id = r.professional_id
#         LEFT JOIN bookings b ON p.professional_id = b.professional_id
#
#         WHERE p.status = 'approved'
#         GROUP BY p.professional_id
#         ORDER BY avg_rating DESC
#     """
#
#     cursor.execute(query)
#     professionals = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_professionals": len(professionals),
#         "professionals": professionals
#     }), 200
#
#
# # ------------------- VIEW PROFESSIONALS BY SERVICE -------------------
# @customer_bp.route("/professionals/service/<int:service_id>", methods=["GET"])
# def professionals_by_service(service_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             p.professional_id,
#             p.name,
#             p.skill,
#             p.experience,
#             s.service_name,
#             s.category,
#             s.price,
#
#             ROUND(AVG(r.rating), 1) AS avg_rating,
#             COUNT(DISTINCT CASE WHEN b.status='completed' THEN b.booking_id END) AS total_jobs_done
#
#         FROM services s
#         JOIN professionals p ON s.professional_id = p.professional_id
#         LEFT JOIN rating_reviews r ON p.professional_id = r.professional_id
#         LEFT JOIN bookings b ON p.professional_id = b.professional_id
#
#         WHERE s.service_id = %s
#         AND p.status = 'approved'
#         GROUP BY p.professional_id
#     """
#
#     cursor.execute(query, (service_id,))
#     professionals = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "professionals": professionals
#     }), 200
#
#
# # ------------------- PROFESSIONAL PROFILE -------------------
# @customer_bp.route("/professionals/<int:professional_id>", methods=["GET"])
# def professional_profile(professional_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             p.professional_id,
#             p.name,
#             p.email,
#             p.phone,
#             p.skill,
#             p.experience,
#             p.status,
#
#             COUNT(DISTINCT s.service_id) AS total_services,
#             ROUND(AVG(r.rating), 1) AS avg_rating,
#             COUNT(DISTINCT CASE WHEN b.status='completed' THEN b.booking_id END) AS total_jobs_done
#
#         FROM professionals p
#         LEFT JOIN services s ON p.professional_id = s.professional_id
#         LEFT JOIN rating_reviews r ON p.professional_id = r.professional_id
#         LEFT JOIN bookings b ON p.professional_id = b.professional_id
#
#         WHERE p.professional_id = %s
#         GROUP BY p.professional_id
#     """
#
#     cursor.execute(query, (professional_id,))
#     professional = cursor.fetchone()
#
#     cursor.close()
#     conn.close()
#
#     if not professional:
#         return jsonify({"message": "Professional not found"}), 404
#
#     return jsonify({"professional": professional}), 200
#
#
# # ------------------- PROFESSIONAL SERVICES -------------------
# @customer_bp.route("/professionals/<int:professional_id>/services", methods=["GET"])
# def professional_services(professional_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute("""
#         SELECT service_id, service_name, category, description, price
#         FROM services
#         WHERE professional_id = %s
#     """, (professional_id,))
#
#     services = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_services": len(services),
#         "services": services
#     }), 200
#
#
# # sort professionals
# @customer_bp.route("/professionals/sort", methods=["GET"])
# def sort_professionals():
#
#     sort_by = request.args.get("by", "rating")  # rating / experience / jobs
#
#     order_map = {
#         "rating": "avg_rating DESC",
#         "experience": "p.experience DESC",
#         "jobs": "total_jobs_done DESC"
#     }
#
#     order_clause = order_map.get(sort_by, "avg_rating DESC")
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = f"""
#         SELECT
#             p.professional_id,
#             p.name,
#             p.skill,
#             p.experience,
#
#             ROUND(AVG(r.rating), 1) AS avg_rating,
#             COUNT(DISTINCT CASE WHEN b.status='completed' THEN b.booking_id END) AS total_jobs_done
#
#         FROM professionals p
#         LEFT JOIN rating_reviews r ON p.professional_id = r.professional_id
#         LEFT JOIN bookings b ON p.professional_id = b.professional_id
#
#         WHERE p.status='approved'
#         GROUP BY p.professional_id
#         ORDER BY {order_clause}
#     """
#
#     cursor.execute(query)
#     professionals = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({"professionals": professionals}), 200
#
# # ------------------------ ALL BOOKINGS OF CUSTOMER ------------------------
# @customer_bp.route("/bookings", methods=["GET"])
#
# def customer_all_bookings(user_id):
#
#     status = request.args.get("status")  # optional filter
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             b.booking_id,
#             b.booking_date,
#             b.booking_time,
#             b.amount,
#             b.status,
#             b.live_status,
#             b.service_name,
#             b.created_at,
#
#             s.category,
#             s.description,
#
#             p.professional_id,
#             p.name AS professional_name,
#             p.phone AS professional_phone,
#             p.skill AS professional_skill
#
#         FROM bookings b
#         JOIN professionals p ON b.professional_id = p.professional_id
#         JOIN services s ON b.service_id = s.service_id
#         WHERE b.user_id = %s
#     """
#
#     params = [user_id]
#
#     if status:
#         query += " AND b.status = %s"
#         params.append(status)
#
#     query += " ORDER BY b.created_at DESC"
#
#     cursor.execute(query, tuple(params))
#     bookings = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_bookings": len(bookings),
#         "status_filter": status if status else "all",
#         "bookings": bookings
#     }), 200
#
#
# # ------------------------ BOOKING DETAILS ------------------------
# @customer_bp.route("/bookings/<int:booking_id>", methods=["GET"])
#
# def booking_details(user_id, booking_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             b.booking_id,
#             b.booking_date,
#             b.booking_time,
#             b.amount,
#             b.status,
#             b.live_status,
#             b.service_name,
#             b.created_at,
#
#             u.name AS customer_name,
#             u.phone AS customer_phone,
#
#             p.professional_id,
#             p.name AS professional_name,
#             p.phone AS professional_phone,
#             p.skill AS professional_skill,
#
#             s.category,
#             s.description,
#             s.price
#
#         FROM bookings b
#         JOIN users u ON b.user_id = u.user_id
#         JOIN professionals p ON b.professional_id = p.professional_id
#         JOIN services s ON b.service_id = s.service_id
#
#         WHERE b.booking_id = %s AND b.user_id = %s
#     """
#
#     cursor.execute(query, (booking_id, user_id))
#     booking = cursor.fetchone()
#
#     cursor.close()
#     conn.close()
#
#     if not booking:
#         return jsonify({"message": "Booking not found"}), 404
#
#     return jsonify({"booking": booking}), 200
#
#
# # ------------------------ BOOKING SUMMARY ------------------------
# @customer_bp.route("/bookings/summary", methods=["GET"])
#
# def booking_summary(user_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             COUNT(*) AS total,
#             SUM(status='pending') AS pending,
#             SUM(status='accepted') AS accepted,
#             SUM(status='completed') AS completed,
#             SUM(status='cancelled') AS cancelled
#         FROM bookings
#         WHERE user_id = %s
#     """
#
#     cursor.execute(query, (user_id,))
#     summary = cursor.fetchone()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({"summary": summary}), 200
#
#
# # ------------------------ ADD RATING & REVIEW ------------------------
# @customer_bp.route("/review", methods=["POST"])
#
# def add_review(user_id):
#
#     data = request.get_json()
#     booking_id = data.get("booking_id")
#     rating = data.get("rating")
#     review = data.get("review", "")
#
#     # validation
#     if not booking_id or not rating:
#         return jsonify({"message": "Booking ID and rating are required"}), 400
#
#     if int(rating) < 1 or int(rating) > 5:
#         return jsonify({"message": "Rating must be between 1 and 5"}), 400
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     # check booking
#     cursor.execute("""
#         SELECT booking_id, professional_id, status
#         FROM bookings
#         WHERE booking_id=%s AND user_id=%s
#     """, (booking_id, user_id))
#
#     booking = cursor.fetchone()
#
#     if not booking:
#         return jsonify({"message": "Booking not found"}), 404
#
#     # ⭐ main condition: service must be completed
#     if booking["status"] != "completed":
#         return jsonify({"message": "You can review only after service completion"}), 400
#
#     professional_id = booking["professional_id"]
#
#     # check already reviewed
#     cursor.execute("""
#         SELECT * FROM rating_reviews
#         WHERE booking_id=%s
#     """, (booking_id,))
#
#     if cursor.fetchone():
#         return jsonify({"message": "Review already submitted for this booking"}), 400
#
#     # insert review
#     cursor.execute("""
#         INSERT INTO rating_reviews (booking_id, user_id, professional_id, rating, review)
#         VALUES (%s, %s, %s, %s, %s)
#     """, (booking_id, user_id, professional_id, rating, review))
#
#     conn.commit()
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "message": "Review submitted successfully",
#         "rating": rating
#     }), 201
#
#
# # ------------------------ VIEW PROFESSIONAL REVIEWS ------------------------
# @customer_bp.route("/professionals/<int:professional_id>/reviews", methods=["GET"])
# def professional_reviews(professional_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     query = """
#         SELECT
#             r.review_id,
#             r.rating,
#             r.review,
#             r.created_at,
#             u.name AS customer_name,
#             b.service_name
#         FROM rating_reviews r
#         JOIN users u ON r.user_id = u.user_id
#         JOIN bookings b ON r.booking_id = b.booking_id
#         WHERE r.professional_id = %s
#         ORDER BY r.created_at DESC
#     """
#
#     cursor.execute(query, (professional_id,))
#     reviews = cursor.fetchall()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "total_reviews": len(reviews),
#         "reviews": reviews
#     }), 200
#
#
#
# # ------------------------ PROFESSIONAL AVG RATING (Auto calculation)------------------------
# @customer_bp.route("/professionals/<int:professional_id>/rating", methods=["GET"])
# def professional_avg_rating(professional_id):
#
#     conn = connection()
#     cursor = conn.cursor(dictionary=True)
#
#     cursor.execute("""
#         SELECT
#             ROUND(AVG(rating), 1) AS avg_rating,
#             COUNT(*) AS total_reviews
#         FROM rating_reviews
#         WHERE professional_id = %s
#     """, (professional_id,))
#
#     result = cursor.fetchone()
#
#     cursor.close()
#     conn.close()
#
#     return jsonify({
#         "professional_id": professional_id,
#         "avg_rating": result["avg_rating"] if result["avg_rating"] else 0,
#         "total_reviews": result["total_reviews"]
#     }), 200
