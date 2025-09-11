from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.admin_routes import admin_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(admin_bp , url_prefix="/admin")

    
if __name__ == '__main__':
    app.run(debug=True)
