from flask import Flask, request, jsonify, Blueprint
import bcrypt
import jwt
import datetime
from config import connection
from functools import wraps
from werkzeug.utils import secure_filename
from config import send_email
import os
from config import SECRET_KEY
import cloudinary.uploader
import random
from config import add_notification



professional_bp = Blueprint("professional", __name__)

UPLOAD_FOLDER = os.path.join(os.getcwd(), "static", "doc")

ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# -------------------- PROFESSIONAL SIGNUP --------------------
@professional_bp.route("/signup", methods=["POST"])
def professional_signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    skill = request.form.get("skill")
    phone = request.form.get("phone")  # fixed
    experience = request.form.get("experience")

    if not all([name, email, password, skill]):
        return jsonify({
            "message": "Name, Email, Password, and Skill are required",
            "status": "error"
        }), 400

    document = request.files.get("document")
    document_url = None

    if document:
        if allowed_file(document.filename):
            filename = secure_filename(document.filename)
            try:
                upload_result = cloudinary.uploader.upload(
                    document,
                    resource_type="raw",  # fixed
                    folder="servease/resume"
                )
                document_url = upload_result.get("secure_url")
            except Exception as e:
                return jsonify({"message": f"Document upload failed: {str(e)}"}), 500
        else:
            return jsonify({
                "message": "Invalid document format. Allowed: pdf, doc, docx"
            }), 400

    # Password hashing
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Database insert
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM professionals WHERE email=%s", (email,))
        if cursor.fetchone():
            return jsonify({"message": "Email already registered"}), 400

        cursor.execute("""
            INSERT INTO professionals
            (name, email, password, phone, skill, experience, document_path, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'pending')
        """, (name, email, hashed_password, phone, skill, experience, document_url))

        conn.commit()

        # Send email
        subject = "ServEase Signup Received"
        body = f"""
        Hello {name},

        Thank you for registering as a professional on ServEase.

        Your account is now pending approval by admin. You will receive an email once approved.

        Regards,
        ServEase Team
        """
        send_email(email, subject, body)

        return jsonify({
            "message": "Signup successful, pending admin approval",
            "status": "success",
            "document_url": document_url
        }), 201

    finally:
        cursor.close()
        conn.close()

# -------------------- PROFESSIONAL LOGIN --------------------
@professional_bp.route("/login", methods=["POST"])
def professional_login():
    email = request.form.get("email")
    password = request.form.get("password")

    if not all([email, password]):
        return jsonify({"message": "Email and Password are required", "status": "error"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM professionals WHERE email=%s", (email,))
        professional = cursor.fetchone()

        if not professional:
            return jsonify({"message": "Email not registered", "status": "error"}), 404

        if professional["status"] != "approved":
            return jsonify({"message": f"Your account is {professional['status']}, cannot login", "status": "error"}), 403

        # Check password
        if not bcrypt.checkpw(password.encode("utf-8"), professional["password"].encode("utf-8")):
            return jsonify({"message": "Incorrect password", "status": "error"}), 401

        # Generate JWT token
        token_payload = {
            "professional_id": professional["professional_id"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)  # token valid for 1 day
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        # Send login email
        subject = "ServEase Login Notification"
        body = f"""
        Hello {professional['name']},

        You have successfully logged in to your ServEase Professional account.

        If this wasn't you, please contact support immediately.

        Regards,
        ServEase Team
        """
        send_email(email, subject, body)

        # Return response
        return jsonify({
            "message": "Login successful",
            "status": "success",
            "token": token
        }), 200

    finally:
        cursor.close()
        conn.close()
def professional_token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth = request.headers.get("Authorization")

        if not auth:
            return jsonify({"message":"Token missing"}),401

        if not auth.startswith("Bearer "):
            return jsonify({"message":"Invalid token format"}),401

        token = auth.split(" ")[1]

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            pro_id = data["professional_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message":"Token expired"}),401
        except jwt.InvalidTokenError:
            return jsonify({"message":"Invalid token"}),401

        return f(pro_id,*args,**kwargs)

    return decorated

# -------------------- Forgot Password (Send OTP) --------------------
@professional_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    if not request.is_json:
        return jsonify({"message": "Content-Type must be application/json"}), 415

    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM professionals WHERE email=%s", (email,))
        professional = cursor.fetchone()

        # Always return same response to avoid leaking existence
        if not professional:
            return jsonify({"message": "If this email exists, OTP has been sent"}), 200

        # Delete old OTPs for this professional
        cursor.execute("DELETE FROM professional_password_reset WHERE professional_id=%s",
                       (professional["professional_id"],))

        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)

        # Insert OTP record
        cursor.execute("""
            INSERT INTO professional_password_reset 
            (professional_id, otp, expires_at)
            VALUES (%s, %s, %s)
        """, (professional["professional_id"], otp, expires_at))
        conn.commit()

        # Send OTP email
        subject = "ServEase Password Reset OTP"
        body = f"""
        Hello {professional['name']},

        Your password reset OTP is: {otp}

        This OTP is valid for 10 minutes. Do not share it with anyone.

        Regards,
        ServEase Team
        """
        send_email(professional["email"], subject, body)

        return jsonify({"message": "If this email exists, OTP has been sent"}), 200

    finally:
        cursor.close()
        conn.close()
# -------------------- Verify OTP --------------------
@professional_bp.route("/verify-otp", methods=["POST"])
def verify_otp():
    if not request.is_json:
        return jsonify({"message": "Content-Type must be application/json"}), 415

    data = request.get_json()
    email = data.get("email", "").strip().lower()
    otp = str(data.get("otp", "")).strip()

    if not email or not otp:
        return jsonify({"message": "Email and OTP are required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM professionals WHERE LOWER(email) = %s", (email,))
        professional = cursor.fetchone()
        if not professional:
            return jsonify({"message": "Invalid request"}), 400

        # Fetch OTP record
        cursor.execute("""
            SELECT * FROM professional_password_reset
            WHERE professional_id=%s AND otp=%s
        """, (professional["professional_id"], otp))
        record = cursor.fetchone()

        if not record:
            return jsonify({"message": "OTP not found"}), 400
        if datetime.datetime.utcnow() > record["expires_at"]:
            return jsonify({"message": "OTP expired"}), 400
        if record["attempts"] >= 3:
            return jsonify({"message": "Too many attempts"}), 403

        # Mark OTP as verified
        cursor.execute("""
            UPDATE professional_password_reset
            SET is_verified=1
            WHERE professional_id=%s AND otp=%s
        """, (professional["professional_id"], otp))
        conn.commit()

        return jsonify({"message": "OTP verified successfully"}), 200

    finally:
        cursor.close()
        conn.close()
# -------------------- Reset Password --------------------
@professional_bp.route("/reset-password", methods=["POST"])
def reset_password():
    if not request.is_json:
        return jsonify({"message": "Content-Type must be application/json"}), 415

    data = request.get_json()
    email = data.get("email")
    new_password = data.get("password")
    if not email or not new_password:
        return jsonify({"message": "Email and new password are required"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM professionals WHERE email=%s", (email,))
        professional = cursor.fetchone()
        if not professional:
            return jsonify({"message": "Invalid request"}), 400

        # Check if OTP was verified
        cursor.execute("""
            SELECT * FROM professional_password_reset
            WHERE professional_id=%s
        """, (professional["professional_id"],))
        record = cursor.fetchone()
        if not record or record["is_verified"] == 0:
            return jsonify({"message": "OTP not verified"}), 403

        # Hash new password
        hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

        # Update professional password
        cursor.execute("""
            UPDATE professionals
            SET password=%s
            WHERE professional_id=%s
        """, (hashed_password.decode("utf-8"), professional["professional_id"]))

        # Delete OTP record after success
        cursor.execute("""
            DELETE FROM professional_password_reset
            WHERE professional_id=%s
        """, (professional["professional_id"],))
        conn.commit()

        # Send confirmation email
        subject = "ServEase Password Changed Successfully"
        body = f"""
        Hello {professional['name']},

        Your password has been successfully changed.

        If this was not you, contact support immediately.

        Regards,
        ServEase Team
        """
        send_email(professional["email"], subject, body)

        return jsonify({"message": "Password reset successful"}), 200

    finally:
        cursor.close()
        conn.close()


#------------------------------------------Services here-----------------------------
@professional_bp.route("/services/add", methods =["POST"])
@professional_token_required
def add_service(pro_id):

    data = request.get_json()

    service_name = data.get("service_name")
    category = data.get("category")
    description = data.get("description")
    price = data.get("price")

    if not all([service_name, category, price]):
        return jsonify({"message": "Required fields missing"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            INSERT INTO services
            (service_name, category, description, price, professional_id, status)
            VALUES (%s,%s,%s,%s,%s,'active')
        """, (service_name, category, description, price, pro_id))

        conn.commit()

        return jsonify({
            "message": "Service added successfully"
        }), 201

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/services/my", methods=["GET"])#
@professional_token_required
def my_services(pro_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT * FROM services
            WHERE professional_id=%s
        """, (pro_id,))

        services = cursor.fetchall()

        return jsonify(services), 200

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/services/edit/<int:service_id>", methods=["PUT"])
@professional_token_required
def edit_service(pro_id, service_id):

    data = request.get_json()

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # ownership check
        cursor.execute("""
            SELECT * FROM services
            WHERE service_id=%s AND professional_id=%s
        """, (service_id, pro_id))

        service = cursor.fetchone()

        if not service:
            return jsonify({"message":"Service not found"}),404

        service_name = data.get("service_name", service["service_name"])
        category = data.get("category", service["category"])
        description = data.get("description", service["description"])
        price = data.get("price", service["price"])
        status = data.get("status", service["status"])
        allowed_status = ["active", "inactive"]
        if status not in allowed_status:
            return jsonify({"message": "Invalid status"}), 400

        cursor.execute("""
            UPDATE services
            SET service_name=%s,
                category=%s,
                description=%s,
                price=%s,
                status=%s
            WHERE service_id=%s
        """, (
            service_name,
            category,
            description,
            price,
            status,
            service_id
        ))

        conn.commit()

        return jsonify({"message":"Service updated successfully"}),200

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/services/delete/<int:service_id>", methods=["DELETE"])
@professional_token_required
def delete_service(pro_id, service_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            DELETE FROM services
            WHERE service_id=%s AND professional_id=%s
        """, (service_id, pro_id))

        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message":"Service not found"}),404

        return jsonify({"message":"Service deleted"}),200

    finally:
        cursor.close()
        conn.close()


#--------------------------------------------VIEW ALL BOOKING REQUEST------------------------------
@professional_bp.route("/bookings/requests", methods=["GET"])
@professional_token_required
def booking_request(professional_id):
    conn = connection()
    cursor=conn.cursor(dictionary=True)
    try:
        cursor.execute("""
                    SELECT b.*, u.name as customer_name
                    FROM bookings b
                    LEFT JOIN users u
                    ON b.user_id = u.user_id
                    WHERE b.professional_id=%s
                    ORDER BY b.created_at DESC
                """, (professional_id,))

        data = cursor.fetchall()
        return jsonify(data), 200

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/bookings/accept/<int:booking_id>", methods=["PUT"])
@professional_token_required
def accept_booking(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        print("\n========== ACCEPT BOOKING DEBUG ==========")
        print("📌 Professional ID (token):", professional_id)
        print("📌 Booking ID:", booking_id)

        # 1️⃣ Check booking first (DEBUG PURPOSE)
        cursor.execute("""
            SELECT booking_id, user_id, professional_id, status
            FROM bookings
            WHERE booking_id=%s
        """, (booking_id,))

        booking_data = cursor.fetchone()
        print("📦 Booking from DB:", booking_data)

        if not booking_data:
            print("❌ Booking does not exist")
            return jsonify({"message": "Booking not found"}), 404

        # 2️⃣ Check ownership
        if booking_data["professional_id"] != professional_id:
            print("❌ Professional mismatch")
            return jsonify({
                "message": "This booking is not assigned to you"
            }), 403

        # 3️⃣ Check status
        if booking_data["status"] != "pending":
            print("❌ Booking status not pending:", booking_data["status"])
            return jsonify({
                "message": f"Booking already {booking_data['status']}"
            }), 400

        # 4️⃣ Update booking status
        cursor.execute("""
            UPDATE bookings
            SET status='accepted'
            WHERE booking_id=%s
        """, (booking_id,))

        conn.commit()

        print("✅ Booking status updated")

        # 5️⃣ Send notification to customer
        print("📨 Sending notification to user:", booking_data["user_id"])

        add_notification(
            user_id=booking_data["user_id"],
            message="Your booking has been accepted",
            n_type="booking_accepted"
        )

        print("🎉 Notification sent successfully")
        print("==========================================\n")

        return jsonify({"message": "Booking accepted"}), 200

    except Exception as e:
        print("🔥 ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/bookings/reject/<int:booking_id>", methods=["PUT"])
@professional_token_required
def reject_booking(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1️⃣ Check booking exists and is pending
        cursor.execute("""
            SELECT user_id
            FROM bookings
            WHERE booking_id=%s
            AND professional_id=%s
            AND status='pending'
        """, (booking_id, professional_id))

        booking = cursor.fetchone()

        if not booking:
            return jsonify({
                "message": "Booking not found or already processed"
            }), 404

        # 2️⃣ Update status
        cursor.execute("""
            UPDATE bookings
            SET status='rejected'
            WHERE booking_id=%s
            AND professional_id=%s
        """, (booking_id, professional_id))

        conn.commit()

        # 3️⃣ Trigger Notification (AFTER SUCCESS)
        add_notification(
            user_id=booking["user_id"],
            message="Your booking has been rejected by the professional.",
            n_type="booking_rejected"
        )

        return jsonify({"message": "Booking rejected successfully"}), 200

    finally:
        cursor.close()
        conn.close()


@professional_bp.route("/bookings/<int:booking_id>", methods=["GET"])
@professional_token_required
def booking_detail(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT b.*, u.name as customer_name, u.phone
            FROM bookings b
            LEFT JOIN users u
            ON b.user_id=u.user_id
            WHERE b.booking_id=%s
            AND b.professional_id=%s
        """, (booking_id, professional_id))

        data = cursor.fetchone()

        if not data:
            return jsonify({"message":"Booking not found"}),404

        return jsonify(data),200

    finally:
        cursor.close()
        conn.close()

@professional_bp.route("/bookings/status/<int:booking_id>", methods=["PUT"])
@professional_token_required
def update_live_status(professional_id, booking_id):

    data = request.get_json()
    live_status = data.get("live_status")

    allowed = [
        "on_the_way",
        "arrived",
        "work_started",
        "completed",
        "failed",
        "cancelled"
    ]

    if not live_status or live_status not in allowed:
        return jsonify({"message": "Invalid status"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1️⃣ First check booking exists
        cursor.execute("""
            SELECT user_id, status
            FROM bookings
            WHERE booking_id=%s
            AND professional_id=%s
        """, (booking_id, professional_id))

        booking = cursor.fetchone()
        if booking["status"] in ["completed", "cancelled"]:
            return jsonify({"message": "Booking already closed"}), 400

        if not booking:
            return jsonify({"message": "Booking not found"}), 404

        # 2️⃣ Decide main booking status
        status = None

        if live_status == "completed":
            status = "completed"

        elif live_status in ["cancelled", "failed"]:
            status = "cancelled"

        # 3️⃣ Update booking
        if status:
            cursor.execute("""
                UPDATE bookings
                SET live_status=%s,
                    status=%s
                WHERE booking_id=%s
                AND professional_id=%s
            """, (live_status, status, booking_id, professional_id))
        else:
            cursor.execute("""
                UPDATE bookings
                SET live_status=%s
                WHERE booking_id=%s
                AND professional_id=%s
            """, (live_status, booking_id, professional_id))

        conn.commit()

        # 4️⃣ Notification: Live Update
        add_notification(
            user_id=booking["user_id"],
            message=f"Service status updated to {live_status}.",
            n_type="live_update"
        )

        # 5️⃣ Notification: Rating Request (Only when completed)
        if live_status == "completed":
            add_notification(
                user_id=booking["user_id"],
                message="Your service is completed. Please rate your experience.",
                n_type="rating_request"
            )

        return jsonify({
            "message": "Status updated successfully",
            "live_status": live_status
        }), 200

    finally:
        cursor.close()
        conn.close()


@professional_bp.route("/services/toggle/<int:service_id>", methods=["PUT"])
@professional_token_required
def toggle_service(professional_id, service_id): #services enable / disabled

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # 1️⃣ Check service belongs to professional
        cursor.execute("""
            SELECT status
            FROM services
            WHERE service_id=%s
            AND professional_id=%s
        """, (service_id, professional_id))

        service = cursor.fetchone()

        if not service:
            return jsonify({"message": "Service not found"}), 404

        # 2️⃣ Toggle logic
        new_status = "inactive" if service["status"] == "active" else "active"

        cursor.execute("""
            UPDATE services
            SET status=%s
            WHERE service_id=%s
            AND professional_id=%s
        """, (new_status, service_id, professional_id))

        conn.commit()

        return jsonify({
            "message": f"Service {new_status} successfully",
            "new_status": new_status
        }), 200

    finally:
        cursor.close()
        conn.close()




#------------------------------------------RATINGS AND REVIEWS-----------------------------
@professional_bp.route("/reviews/my", methods=["GET"])
@professional_token_required
def my_reviews(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Get average & total
        cursor.execute("""
            SELECT AVG(rating) as avg_rating, COUNT(*) as total
            FROM ratings_reviews
            WHERE professional_id=%s
        """, (professional_id,))

        stats = cursor.fetchone()

        avg_rating = round(float(stats["avg_rating"]), 2) if stats["avg_rating"] else 0
        total_reviews = stats["total"]

        # Get review list
        cursor.execute("""
            SELECT r.rating, r.review, r.created_at,
                   u.name as customer_name
            FROM ratings_reviews r
            JOIN users u
            ON r.user_id = u.user_id
            WHERE r.professional_id=%s
            ORDER BY r.created_at DESC
        """, (professional_id,))

        reviews = cursor.fetchall()

        return jsonify({
            "average_rating": avg_rating,
            "total_reviews": total_reviews,
            "reviews": reviews
        }), 200

    finally:
        cursor.close()
        conn.close()


#-------------------------------------------------NOTIFICATIONS-------------
@professional_bp.route("/notifications", methods=["GET"])
@professional_token_required
def get_notifications(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT notification_id, message, status, created_at
            FROM notifications
            WHERE professional_id=%s
            ORDER BY created_at DESC
        """, (professional_id,))

        notifications = cursor.fetchall()

        return jsonify({
            "notifications": notifications
        }), 200

    finally:
        cursor.close()
        conn.close()

#MARK AS READ
@professional_bp.route("/notifications/read/<int:notification_id>", methods=["PUT"])
@professional_token_required
def mark_notification_read(professional_id, notification_id):

    conn = connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            UPDATE notifications
            SET status='read'
            WHERE notification_id=%s
            AND professional_id=%s
        """, (notification_id, professional_id))

        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "Notification not found"}), 404

        return jsonify({"message": "Notification marked as read"}), 200

    finally:
        cursor.close()
        conn.close()

#UNREAD COUNT
@professional_bp.route("/notifications/unread-count", methods=["GET"])
@professional_token_required
def unread_count(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT COUNT(*) as unread
            FROM notifications
            WHERE professional_id=%s
            AND status='unread'
        """, (professional_id,))

        count = cursor.fetchone()["unread"]

        return jsonify({
            "unread_count": count
        }), 200

    finally:
        cursor.close()
        conn.close()
















#-----------------------------DASHBOARD FOR PROFESSIONAL--------------
@professional_bp.route("/dashboard", methods=["GET"])
@professional_token_required
def professional_dashboard(pro_id):
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # -------- Total, pending, accepted, completed jobs -----------
        cursor.execute("""
            SELECT 
                COUNT(*) AS total_jobs,
                SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) AS pending_jobs,
                SUM(CASE WHEN status='accepted' THEN 1 ELSE 0 END) AS accepted_jobs,
                SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) AS completed_jobs
            FROM bookings
            WHERE professional_id=%s
        """, (pro_id,))
        jobs = cursor.fetchone()

        # -------- Earnings (total, monthly, today) -----------
        cursor.execute("""
            SELECT 
                IFNULL(SUM(p.amount),0) AS total_earn,
                IFNULL(SUM(CASE WHEN MONTH(p.created_at)=MONTH(CURDATE()) AND YEAR(p.created_at)=YEAR(CURDATE()) THEN p.amount ELSE 0 END),0) AS monthly_earn,
                IFNULL(SUM(CASE WHEN DATE(p.created_at)=CURDATE() THEN p.amount ELSE 0 END),0) AS today_earn
            FROM payments p
            JOIN bookings b ON b.booking_id = p.booking_id
            WHERE b.professional_id=%s
            AND p.payment_status='paid'
        """, (pro_id,))
        earnings = cursor.fetchone()

        # -------- Average rating -----------
        cursor.execute("""
            SELECT IFNULL(AVG(rating),0) AS average_rating
            FROM ratings_reviews
            WHERE professional_id=%s
        """, (pro_id,))
        rating = cursor.fetchone()

        # Combine all results
        dashboard = {
            "total_jobs": jobs["total_jobs"] or 0,
            "pending_jobs": jobs["pending_jobs"] or 0,
            "accepted_jobs": jobs["accepted_jobs"] or 0,
            "completed_jobs": jobs["completed_jobs"] or 0,
            "total_earn": float(earnings["total_earn"]),
            "monthly_earn": float(earnings["monthly_earn"]),
            "today_earn": float(earnings["today_earn"]),
            "average_rating": float(round(rating["average_rating"],2))
        }

        return jsonify(dashboard), 200

    finally:
        cursor.close()
        conn.close()


