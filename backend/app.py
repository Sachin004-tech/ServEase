from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    pass
    
if __name__ == '__main__':
    app.run(debug=True)
