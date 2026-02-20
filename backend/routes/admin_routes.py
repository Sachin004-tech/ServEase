from flask import request, jsonify, Blueprint
from config import connection, send_email

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
        "message":f"Welcome Admin {admin['username']}",
        "admin_id": admin["admin_id"]
    }),200







#------------------------------------------------------PROFESSIONAL REQUEST CONTROL ------------------------------------
@admin_bp.route("/professional/pending", methods=["GET"])   # admin can see the pending requests of professionals
def pending_professionals():
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT professional_id, name, email, phone,
                   skill, experience, document_path, status
            FROM professionals
            WHERE status = 'pending'
        """)

        data = cursor.fetchall()

        return jsonify({
            "total_pending": len(data),
            "professionals": data
        }), 200

    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/professional/approve/<int:pro_id>", methods=["PUT"]) # approved the request
def approve_professional(pro_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM professionals WHERE professional_id=%s",
            (pro_id,)
        )

        pro = cursor.fetchone()

        if not pro:
            return jsonify({"message":"Professional not found"}),404

        cursor.execute("""
            UPDATE professionals
            SET status='approved'
            WHERE professional_id=%s
        """,(pro_id,))

        conn.commit()

        # Email notification
        subject = "ServEase Account Approved"
        body = f"""
Hello {pro['name']},

Congratulations 🎉

Your professional account has been approved by admin.

You can now login to ServEase.

Regards,
ServEase Team
        """

        send_email(pro["email"], subject, body)

        return jsonify({
            "message":"Professional approved successfully"
        }),200

    finally:
        cursor.close()
        conn.close()

@admin_bp.route("/professional/reject/<int:pro_id>", methods=["PUT"])# reject the request
def reject_professional(pro_id):

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT * FROM professionals WHERE professional_id=%s",
            (pro_id,)
        )

        pro = cursor.fetchone()

        if not pro:
            return jsonify({"message":"Professional not found"}),404

        cursor.execute("""
            UPDATE professionals
            SET status='rejected'
            WHERE professional_id=%s
        """,(pro_id,))

        conn.commit()

        # Email notification
        subject = "ServEase Account Status Update"
        body = f"""
Hello {pro['name']},

Your professional account was not approved at this time.

Please contact support for more details.

Regards,
ServEase Team
        """

        send_email(pro["email"], subject, body)

        return jsonify({
            "message":"Professional rejected"
        }),200

    finally:
        cursor.close()
        conn.close()









#--------------------------------------------------Admin Dashboard------------------------------------------------------
@admin_bp.route("/admin_dashboard", methods=["GET"])
def admin_dashboard():
    conn= connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT COUNT(*) AS total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) AS total_professionals FROM professionals")
        total_professionals = cursor.fetchone()["total_professionals"]

        cursor.execute("SELECT COUNT(*) AS total_bookings FROM bookings")
        total_bookings = cursor.fetchone()["total_bookings"]

        cursor.execute("SELECT COUNT(*) AS total_services FROM services")
        total_services = cursor.fetchone()["total_services"]

        cursor.execute("SELECT COUNT(*) AS total_payments FROM payments WHERE payment_status='paid'")
        total_payments = cursor.fetchone()["total_payments"]

        cursor.execute("SELECT IFNULL(SUM(amount),0) AS total_revenue FROM payments WHERE payment_status='paid'")
        total_revenue = cursor.fetchone()["total_revenue"]

    finally:
        cursor.close()
        conn.close()

    return jsonify({

        "message" : "Admin Dashboard fetched successfully",
        "total_users" : total_users,
        "total_professionals" : total_professionals,
        "total_bookings" : total_bookings,
        "total_services": total_services,
        "total_payments": total_payments,
        "total_revenue": float(total_revenue)

        # return for charts and graph
    }),200

@admin_bp.route("/admin_chart_data", methods=["GET"])
def admin_chart_data():
    conn= connection()
    cursor = conn.cursor()

    query ="""SELECT MONTH(booking_date) AS MONTH , COUNT(*)
    FROM bookings 
    GROUP BY MONTH(booking_date)
    ORDER BY MONTH(booking_date)
    
    """
    cursor.execute(query)
    data = cursor.fetchall()

    cursor.close()
    conn.close()


    labels = [f"Month {row[0]}" for row in data ]
    values = [row[1] for row in data]

    return jsonify({
        "labels":labels,
        "values":values
    })






#----------------------------------all registered users------------------------------------------------------------

