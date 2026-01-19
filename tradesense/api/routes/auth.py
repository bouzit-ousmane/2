from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from db import execute_query, fetch_one
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # VALIDATION - Check for all required fields
        if not data or 'email' not in data or 'password' not in data or 'name' not in data:
            return jsonify({'error': 'Missing required fields: name, email, password'}), 400
        
        # Check if user exists
        existing_user = fetch_one(
            'SELECT * FROM users WHERE email = ?',
            [data['email']]
        )
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        password_hash = generate_password_hash(data['password'])
        result = execute_query(
            'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
            [data['name'], data['email'], password_hash, 'user']
        )
        
        # Get the created user
        new_user = fetch_one(
            'SELECT * FROM users WHERE email = ?',
            [data['email']]
        )
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': new_user['id'],
            'name': new_user['name']
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Get user from database
        user_row = fetch_one(
            'SELECT * FROM users WHERE email = ?',
            [data.get('email')]
        )
        
        if not user_row or not check_password_hash(user_row['password_hash'], data.get('password')):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create token with user ID identity
        access_token = create_access_token(identity=str(user_row['id']))
        
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user_row['id'],
                'name': user_row['name'],
                'email': user_row['email'],
                'role': user_row.get('role', 'user')
            }
        }), 200
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    try:
        user_id = get_jwt_identity()
        
        user_row = fetch_one(
            'SELECT * FROM users WHERE id = ?',
            [user_id]
        )
        
        if not user_row:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'id': user_row['id'],
                'name': user_row['name'],
                'email': user_row['email'],
                'role': user_row.get('role', 'user')
            }
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to get user: {str(e)}'}), 500
