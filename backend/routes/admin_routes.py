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



#--------------------------------------------All Professionls are here------------------------------------------------------