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




professional_bp = Blueprint("professional", __name__, url_prefix="/professional")
UPLOAD_FOLDER = "static/doc"


ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}

def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# -------------------- SIGNUP -------------

@professional_bp.route("/signup", methods=["POST"])
def professional_signup():

    # ---------- FORM DATA ----------
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()
    phone = request.form.get("phone", "").strip()
    skill = request.form.get("skill", "").strip()
    experience = request.form.get("experience", "").strip()
    if experience:
        experience = int(experience)
    else:
        experience = None

    file = request.files.get("document")

    # ---------- VALIDATION ----------
    if not all([name, email, password, skill]):
        return jsonify({"message": "Required fields missing"}), 400

    if not file or file.filename == "":
        return jsonify({"message": "Document required"}), 400

    if not allowed_file(file.filename):
        return jsonify({"message": "Only pdf, doc, docx allowed"}), 400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # ---------- EMAIL CHECK ----------
        cursor.execute(
            "SELECT * FROM professionals WHERE email=%s",
            (email,)
        )
        if cursor.fetchone():
            return jsonify({"message": "Email already exists"}), 400

        # ---------- PASSWORD HASH ----------
        hashed = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # ---------- SAVE FILE ----------
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # ---------- INSERT ----------
        cursor.execute("""
            INSERT INTO professionals
            (name,email,password,phone,skill,experience,document_path,status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,'pending')
        """, (
            name, email, hashed,
            phone, skill, experience,
            filepath
        ))

        conn.commit()

        # ---------- SEND EMAIL ----------
        subject = "ServEase Professional Signup"
        body = f"""
Hello {name},

Your professional account has been created successfully.

Status: Pending Approval

You will be notified once approved by admin.

Regards,
ServEase Team
"""

        send_email(email, subject, body)

        return jsonify({
            "message": "Signup successful. Waiting for approval."
        }), 201

    finally:
        cursor.close()
        conn.close()


@professional_bp.route("/login", methods=["POST"])
def professional_login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message":"Email and password required"}),400

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM professionals WHERE email=%s",
            (email,)
        )

        pro = cursor.fetchone()

        if not pro:
            return jsonify({"message":"Invalid credentials"}),401

        # status check
        if pro["status"] != "approved":
            return jsonify({
                "message":"Account not approved yet"
            }),403

        # password verify
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            pro["password"].encode("utf-8")
        ):
            return jsonify({"message":"Invalid credentials"}),401

        # JWT token
        payload = {
            "professional_id": pro["professional_id"],
            "role":"professional",
            "exp": datetime.datetime.utcnow() +
                   datetime.timedelta(hours=2)
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        if isinstance(token, bytes):
            token = token.decode("utf-8")

        # login alert email
        subject = "ServEase Professional Login Alert"
        body = f"""
Hello {pro['name']},

You have successfully logged into ServEase.

If this wasn't you, contact support immediately.

Regards,
ServEase Team
        """

        send_email(pro["email"], subject, body)

        return jsonify({
            "message":"Login successful",
            "token":token
        }),200

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






































@professional_bp.route("/profile", methods=["GET"])

def professional_profile(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT professional_id,name,email,phone,skill,experience,status,document_path FROM professionals WHERE professional_id=%s", (professional_id,))
    professional = cursor.fetchone()
    cursor.close()
    conn.close()

    if not professional:
        return jsonify({"message": "Professional not found"}), 404

    return jsonify({"professional": professional}), 200



#------------------------------------------Services here-----------------------------
#Add new services
@professional_bp.route("/servcies/add", methods=["POST"])

def add_service(professional_id):

    data = request.get_json()
    service_name = data.get("service_name")
    category = data.get("category")
    description  = data.get("description")
    price = data.get("price")

    if not all([service_name, category, price]):
        return jsonify({"message":"Requried fields are missing"}),400

    conn= connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO services (service_name, category, description, price, professional_id)
            VALUES (%s, %s, %s, %s, %s)
        """,(service_name, category,description,price,professional_id))
        conn.commit()
        return jsonify({"message":"Service added successfully"}),201
    except Exception as err:
        return jsonify({"error":str(err)}),500
    finally:
        cursor.close()
        conn.close()

#View own services
@professional_bp.route("/services", methods=["GET"])

def get_professional_services(professional_id):
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT service_id, service_name, category, description, price, professional_id
        FROM services
        WHERE professional_id = %s
    """, (professional_id,))
    services = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify({
        "total_services":len(services),
        "services":services
    }),200

#Total services count by professional
@professional_bp.route("/services/count", methods=["GET"])

def count_services(professional_id):

    conn = connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM services WHERE professional_id=%s", (professional_id,))
    total = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    return jsonify({"total_services": total}), 200


#Update and Delete the services
@professional_bp.route("/services/update/<int:service_id>", methods=["PUT"])

def update_service(professional_id, service_id):

    data = request.get_json()
    service_name = data.get("service_name")
    category = data.get("category")
    description = data.get("description")
    price = data.get("price")

    conn = connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE services 
        SET service_name=%s, category=%s, description=%s, price=%s
        WHERE service_id=%s AND professional_id=%s
    """, (service_name, category, description, price, service_id, professional_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Service updated successfully!"}), 200


@professional_bp.route("/services/delete/<int:service_id>", methods=["DELETE"])

def delete_service(professional_id, service_id):

    conn = connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM services 
        WHERE service_id=%s AND professional_id=%s
    """, (service_id, professional_id))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Service deleted successfully!"}), 200

# -------------------- VIEW PROFESSIONAL BOOKINGS --------------------
@professional_bp.route("/bookings", methods=["GET"])

def view_bookings(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.status,
            b.live_status,
            b.amount,
            b.service_name,
            u.name AS customer_name,
            u.phone AS customer_phone,
            u.address AS customer_address
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.professional_id = %s
        ORDER BY b.created_at DESC
    """

    cursor.execute(query, (professional_id,))
    bookings = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "total_bookings": len(bookings),
        "bookings": bookings
    }), 200

# -------------------- ACCEPT BOOKING --------------------
@professional_bp.route("/bookings/accept/<int:booking_id>", methods=["PUT"])

def accept_booking(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE bookings
        SET status='accepted', live_status='accepted'
        WHERE booking_id=%s AND professional_id=%s
    """, (booking_id, professional_id))

    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"message": "Booking not found or unauthorized"}), 404

    cursor.close()
    conn.close()

    return jsonify({"message": "Booking accepted successfully!"}), 200


# -------------------- REJECT BOOKING --------------------
@professional_bp.route("/bookings/reject/<int:booking_id>", methods=["PUT"])

def reject_booking(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE bookings
        SET status='cancelled', live_status='cancelled'
        WHERE booking_id=%s AND professional_id=%s
    """, (booking_id, professional_id))

    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"message": "Booking not found or unauthorized"}), 404

    cursor.close()
    conn.close()

    return jsonify({"message": "Booking rejected successfully!"}), 200


# -------------------- BOOKING DETAILS --------------------
@professional_bp.route("/bookings/<int:booking_id>", methods=["GET"])

def booking_details(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            b.*,
            u.name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            u.address AS customer_address,
            p.name AS professional_name
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN professionals p ON b.professional_id = p.professional_id
        WHERE b.booking_id=%s AND b.professional_id=%s
    """

    cursor.execute(query, (booking_id, professional_id))
    booking = cursor.fetchone()

    cursor.close()
    conn.close()

    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    return jsonify({"booking": booking}), 200

# -------------------- INCOMING BOOKINGS --------------------
@professional_bp.route("/bookings/incoming", methods=["GET"])

def incoming_bookings(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.amount,
            b.status,
            b.live_status,
            b.service_name,
            b.created_at,

            u.name AS customer_name,
            u.phone AS customer_phone,
            u.address AS customer_address

        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.professional_id = %s AND b.status = 'pending'
        ORDER BY b.created_at DESC
    """

    cursor.execute(query, (professional_id,))
    bookings = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "incoming_jobs": len(bookings),
        "bookings": bookings
    }), 200


# -------------------- ACTIVE JOBS --------------------
@professional_bp.route("/bookings/active", methods=["GET"])

def active_jobs(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            b.booking_id,
            b.booking_date,
            b.booking_time,
            b.amount,
            b.status,
            b.live_status,
            b.service_name,

            u.name AS customer_name,
            u.phone AS customer_phone,
            u.address AS customer_address

        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        WHERE b.professional_id = %s 
        AND (
            b.status = 'accepted'
            OR b.live_status IN ('on_the_way', 'arrived')
        )
        ORDER BY b.created_at DESC
    """

    cursor.execute(query, (professional_id,))
    jobs = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "active_jobs": len(jobs),
        "jobs": jobs
    }), 200


# -------------------- JOB SUMMARY --------------------
@professional_bp.route("/dashboard/stats", methods=["GET"])

def professional_dashboard_stats(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            COUNT(*) AS total_jobs,
            SUM(status='pending') AS incoming_jobs,
            SUM(status='accepted') AS accepted_jobs,
            SUM(status='completed') AS completed_jobs,
            SUM(status='cancelled') AS cancelled_jobs
        FROM bookings
        WHERE professional_id = %s
    """

    cursor.execute(query, (professional_id,))
    stats = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({"stats": stats}), 200


# -------------------- UPDATE LIVE STATUS --------------------
@professional_bp.route("/bookings/status/<int:booking_id>", methods=["PUT"])

def update_live_status(professional_id, booking_id):

    data = request.get_json()
    live_status = data.get("live_status")

    allowed_status = ["on_the_way", "arrived", "completed"]

    if live_status not in allowed_status:
        return jsonify({"message": "Invalid status"}), 400

    conn = connection()
    cursor = conn.cursor()

    # if completed → update main status too
    if live_status == "completed":
        cursor.execute("""
            UPDATE bookings
            SET live_status=%s, status='completed'
            WHERE booking_id=%s AND professional_id=%s
        """, (live_status, booking_id, professional_id))
    else:
        cursor.execute("""
            UPDATE bookings
            SET live_status=%s
            WHERE booking_id=%s AND professional_id=%s
        """, (live_status, booking_id, professional_id))

    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"message": "Booking not found"}), 404

    cursor.close()
    conn.close()

    return jsonify({"message": "Live status updated successfully!"}), 200


#------------------------Rating and Reviews----------------------
# -------------------- VIEW RATINGS & REVIEWS --------------------
@professional_bp.route("/reviews", methods=["GET"])

def view_professional_reviews(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT 
            r.review_id,
            r.rating,
            r.review,
            r.created_at,

            u.name AS customer_name,
            u.email AS customer_email,
            b.service_name,
            b.booking_date,
            b.booking_time

        FROM ratings_reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN bookings b ON r.booking_id = b.booking_id
        WHERE r.professional_id = %s
        ORDER BY r.created_at DESC
    """

    cursor.execute(query, (professional_id,))
    reviews = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "total_reviews": len(reviews),
        "reviews": reviews
    }), 200


# -------------------- PROFESSIONAL AVG RATING --------------------
@professional_bp.route("/reviews/stats", methods=["GET"])

def professional_rating_stats(professional_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            ROUND(AVG(rating), 1) AS avg_rating,
            COUNT(*) AS total_reviews,
            SUM(rating=5) AS five_star,
            SUM(rating=4) AS four_star,
            SUM(rating=3) AS three_star,
            SUM(rating=2) AS two_star,
            SUM(rating=1) AS one_star
        FROM ratings_reviews
        WHERE professional_id = %s
    """, (professional_id,))

    stats = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify({"rating_stats": stats}), 200


# -------------------- REVIEW BY BOOKING --------------------
@professional_bp.route("/reviews/<int:booking_id>", methods=["GET"])

def review_by_booking(professional_id, booking_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            r.review_id,
            r.rating,
            r.review,
            r.created_at,
            u.name AS customer_name
        FROM ratings_reviews r
        JOIN users u ON r.user_id = u.user_id
        WHERE r.booking_id=%s AND r.professional_id=%s
    """, (booking_id, professional_id))

    review = cursor.fetchone()

    cursor.close()
    conn.close()

    if not review:
        return jsonify({"message": "No review found"}), 404

    return jsonify({"review": review}), 200














#------------------------------------------DASHBOARD-------------------
# -------------------- PROFESSIONAL DASHBOARD --------------------
@professional_bp.route("/dashboard", methods=["GET"])

def professional_dashboard(professional_id):
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    # 1️⃣ JOB STATS + EARNINGS
    query_jobs = """
        SELECT 
            COUNT(*) AS total_jobs,
            SUM(status='pending') AS pending_jobs,
            SUM(status='accepted') AS accepted_jobs,
            SUM(status='completed') AS completed_jobs,

            IFNULL(SUM(CASE WHEN status='completed' THEN amount ELSE 0 END), 0) AS total_earning,

            IFNULL(SUM(CASE 
                WHEN status='completed' AND MONTH(booking_date)=MONTH(CURDATE()) 
                AND YEAR(booking_date)=YEAR(CURDATE()) 
                THEN amount ELSE 0 END), 0) AS monthly_earning,

            IFNULL(SUM(CASE 
                WHEN status='completed' AND booking_date=CURDATE() 
                THEN amount ELSE 0 END), 0) AS today_earning

        FROM bookings
        WHERE professional_id = %s
    """

    cursor.execute(query_jobs, (professional_id,))
    job_stats = cursor.fetchone()

    # 2️⃣ RATING STATS
    query_rating = """
        SELECT 
            ROUND(AVG(rating), 1) AS avg_rating,
            COUNT(*) AS total_reviews
        FROM ratings_reviews
        WHERE professional_id = %s
    """

    cursor.execute(query_rating, (professional_id,))
    rating_stats = cursor.fetchone()

    cursor.close()
    conn.close()

    dashboard = {
        "jobs": job_stats,
        "ratings": rating_stats
    }

    return jsonify({
        "message": "Professional dashboard data fetched successfully",
        "dashboard": dashboard
    }), 200


# -------------------- UPDATE PROFESSIONAL PROFILE --------------------
@professional_bp.route("/profile/update", methods=["PATCH"])

def update_professional_profile(professional_id):

    data = request.get_json()
    fields = []
    values = []

    for key in ["name", "phone", "skill", "experience", "document_path"]:
        if key in data:
            fields.append(f"{key}=%s")
            values.append(data[key])

    if not fields:
        return jsonify({"message": "No data provided"}), 400

    values.append(professional_id)

    conn = connection()
    cursor = conn.cursor()

    query = f"UPDATE professionals SET {', '.join(fields)} WHERE professional_id=%s"
    cursor.execute(query, tuple(values))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Profile updated successfully!"}), 200
