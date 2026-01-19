from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Debug logging for Vercel
@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())
    print(f"DEBUG: {request.method} {request.path}")

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-secret')

# Initialize extensions
CORS(app)
JWTManager(app)

# Initialize database connection
from db import init_db
init_db()

# Register blueprints
from routes.auth import auth_bp
from routes.market import market_bp
from routes.trades import trades_bp
from routes.challenges import challenges_bp
from routes.admin import admin_bp
from routes.leaderboard import leaderboard_bp
from routes.checkout import checkout_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(market_bp, url_prefix='/api/market')
app.register_blueprint(trades_bp, url_prefix='/api/trades')
app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
app.register_blueprint(checkout_bp, url_prefix='/api/checkout')

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'TradeSense API is running'}), 200

# The Vercel Python runtime finds the 'app' variable in this file automatically.
# No special 'handler' function is needed for Flask.

if __name__ == '__main__':
    app.run(debug=True, port=5000)
