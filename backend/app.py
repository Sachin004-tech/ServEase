from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.admin_routes import admin_bp
from routes.customer_routes import customer_bp
from routes.professional_routes import professional_bp
import os
from config import SECRET_KEY


app = Flask(__name__)

CORS(
  app,
  resources={
    r"/*": {
      "origins": [
        "http://localhost:5173",
        "http://localhost:3000"
      ]
    }
  }
)

app.config["SECRET_KEY"] = "SECRET_KEY"

app.register_blueprint(admin_bp, url_prefix="/admin")
app.register_blueprint(customer_bp, url_prefix="/customer")
app.register_blueprint(professional_bp, url_prefix="/professional")

#print(app.url_map)

# import secrets
# print(secrets.token_hex(32))


if __name__ == '__main__':
    app.run(debug=True)














