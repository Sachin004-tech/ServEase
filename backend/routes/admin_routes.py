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
        "message":f"Welcome Admin {admin['username']}",
        "admin_id": admin["admin_id"]
    }),200

#--------------------------------------------------Admin Dashboard------------------------------------------------------
# @admin_bp.route("/admin_dashboard")
# def admin_dashboard():
#     graph and pi chart
#     return jsonify({"message":"This is admin dashboard"})

#all registered users


@admin_bp.route("/managed_users", methods=["GET"])
def managed_users():
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute(""" SELECT user_id, name, email, phone, address, created_at FROM users
         ORDER BY created_at DESC 
         """)
        users = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": "All registered users fetech successfully",
        "total_users": len(users),
        "users": users
    }), 200

@admin_bp.route("/managed_users/search", methods=["GET"])
def search_users():
    query = request.args.get("query", "")

    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT user_id, name, email, phone, address, created_at
            FROM users
            WHERE name LIKE %s OR email LIKE %s
            ORDER BY created_at DESC
        """, (f"%{query}%", f"%{query}%"))
        results = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": f"Search results for '{query}'",
        "results": results
    }), 200

@admin_bp.route("/managed_users/<int:user_id>/block", methods=["PUT"])
def block_unblock_user(user_id):
    action = request.args.get("action", "block")  # block / unblock

    conn = connection()
    cursor = conn.cursor()

    try:
        new_status = 1 if action == "block" else 0
        cursor.execute("UPDATE users SET is_blocked = %s WHERE user_id = %s", (new_status, user_id))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": f"User {user_id} {'blocked' if new_status else 'unblocked'} successfully"
    }), 200

@admin_bp.route("/managed_users/<int:user_id>/bookings", methods=["GET"])
def view_user_bookings(user_id):
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT booking_id, service_name, booking_date, status, amount
            FROM bookings
            WHERE user_id = %s
            ORDER BY booking_date DESC
        """, (user_id,))
        bookings = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": f"Booking history for user {user_id}",
        "bookings": bookings
    }), 200

@admin_bp.route("/managed_users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    conn = connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM users WHERE user_id = %s", (user_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": f"User ID {user_id} deleted successfully"
    }), 200



#--------------------------------------------All Professionls------------------------------------------------------
@admin_bp.route("/managed_professionals", methods=["GET"]) # get all professional with status (pending , approved , reject )
def managed_professionals():
    conn = connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
                 SELECT professional_id , name , email , phone , skill , experience 
                 document_path , status , created_at FROM professionals  ORDER BY created_at DESC 
        """)
        professionals = cursor.fetchall()

    finally:
        cursor.close()
        conn.close()

    return jsonify({
        "message": "All professionals fetched successfully",
        "total_professionals": len(professionals),
        "professionals": professionals
    }), 200

#---------------------------------------------------add search section-------------------------------------------------

@admin_bp.route("/managed_professionals/<int:professional_id>/approve", methods=["PUT"])
def approve_professional(professional_id):
    conn = connection()
    cursor=conn.cursor()

    try:
        cursor.execute("UPDATE professionals SET status = 'approved' WHERE professional_id = %s", (professional_id,))
        conn.commit()

    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": f"Professional {professional_id} approved successfully"}), 200
@admin_bp.route("/managed_professionals/<int:professional_id>/reject", methods=["PUT"])
def reject_professional(professional_id):
    """
    Reject a professional registration
    """
    conn = connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE professionals SET status = 'rejected' WHERE professional_id = %s", (professional_id,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": f"Professional {professional_id} rejected successfully"}), 200


@admin_bp.route("/managed_professionals/<int:professional_id>/document", methods=["GET"])
def view_professional_document(professional_id):
    """
    Get the document path for a professional (CV or proof)
    """
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT document_path FROM professionals WHERE professional_id = %s", (professional_id,))
        result = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not result or not result.get("document_path"):
        return jsonify({"message": "No document found"}), 404

    return jsonify({
        "message": f"Document found for professional {professional_id}",
        "document_path": result["document_path"]
    }), 200
@admin_bp.route("/managed_professionals/<int:professional_id>/details", methods=["GET"])
def professional_details(professional_id):
    """
    View specialization, average rating, total bookings for a professional
    """
    conn = connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # Professional Info
        cursor.execute("""
            SELECT name, email, phone, skill, experience, status
            FROM professionals WHERE professional_id = %s
        """, (professional_id,))
        professional = cursor.fetchone()

        if not professional:
            return jsonify({"message": "Professional not found"}), 404

        # Average Rating
        cursor.execute("""
            SELECT ROUND(AVG(rating), 1) AS avg_rating 
            FROM ratings_reviews WHERE professional_id = %s
        """, (professional_id,))
        rating = cursor.fetchone().get("avg_rating") or 0

        # Total Bookings
        cursor.execute("""
            SELECT COUNT(*) AS total_bookings 
            FROM bookings WHERE professional_id = %s
        """, (professional_id,))
        total = cursor.fetchone().get("total_bookings")

    finally:
        cursor.close()
        conn.close()

    professional["average_rating"] = rating
    professional["total_bookings"] = total

    return jsonify({
        "message": f"Professional {professional_id} details fetched successfully",
        "details": professional
    }), 200

#---------------------------- Delete the unverified professionals or pending request-----------------------------


#--------------------------------------------ALL bookings control--------------------------------------------------

#------------------------------------------------All Services------------------------------------------------------
#------------------------------------------------ALL Payments--------------------------------------------