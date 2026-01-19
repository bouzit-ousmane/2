from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import execute_query, fetch_one
from datetime import datetime

checkout_bp = Blueprint('checkout', __name__)

@checkout_bp.route('/mock', methods=['POST'])
@jwt_required()
def mock_checkout():
    """
    Simulates a successful payment and creates a challenge.
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    plan_slug = data.get('plan_slug')
    
    if not plan_slug:
        return jsonify({'error': 'Plan slug required'}), 400
        
    plan = fetch_one('SELECT * FROM plans WHERE slug = ?', [plan_slug])
    if not plan:
        return jsonify({'error': 'Invalid plan'}), 404
        
    # Create challenge
    execute_query(
        'INSERT INTO challenges (user_id, plan_id, start_balance, current_equity, status, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
        [user_id, plan['id'], plan['start_balance'], plan['start_balance'], 'active']
    )
    
    # Get the created challenge
    challenge = fetch_one(
        'SELECT * FROM challenges WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [user_id]
    )
    
    return jsonify({
        'success': True,
        'message': 'Challenge created successfully',
        'challenge_id': challenge['id']
    }), 201

@checkout_bp.route('/paypal-status', methods=['GET'])
def get_paypal_status():
    setting = fetch_one('SELECT * FROM paypal_settings LIMIT 1', [])
    return jsonify({'enabled': setting['enabled'] if setting else False})
