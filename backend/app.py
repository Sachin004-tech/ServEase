from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.admin_routes import admin_bp
from routes.customer_routes import customer_bp
from routes.professional_routes import professional_bp
app = Flask(__name__)


CORS(app)

app.register_blueprint(admin_bp , url_prefix="/admin")
app.register_blueprint(customer_bp, url_prefix="/customer")
app.register_blueprint(professional_bp, url_prefix="/professional")


if __name__ == '__main__':
    app.run(debug=True)
