from flask import Flask, request, jsonify, Blueprint
from config import connection

admin_bp = Blueprint("admin", __name__)








@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")


    conn = connection()
    cursor = conn.cursor(dictionary= True)

    cursor.execute("SELECT * FROM admin WHERE username = % AND password = %s",(username, password))
    admin = cursor.fetchone()

    cursor.close()
    conn.close()


    if admin:
        return jsonify({ "message ": "Login is Successful","admin_id ":admin["admin_id "]}),200
    else:
        return jsonify({"message":"Invalid details of Admin"}),401