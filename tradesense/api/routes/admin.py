from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import execute_query, fetch_one, fetch_all
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

# Decorator for admin check
def admin_required():
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            user = fetch_one('SELECT * FROM users WHERE id = ?', [user_id])
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        # Fix for flask wrapper naming
        decorator.__name__ = fn.__name__
        return decorator
    return wrapper

@admin_bp.route('/challenges', methods=['GET'])
@admin_required()
def get_all_challenges():
    challenges = fetch_all('SELECT * FROM challenges ORDER BY created_at DESC', [])
    
    challenges_list = []
    for c in challenges:
        challenges_list.append({
            'id': c['id'],
            'user_id': c['user_id'],
            'plan_id': c['plan_id'],
            'start_balance': float(c['start_balance']),
            'current_equity': float(c['current_equity']),
            'status': c['status'],
            'created_at': c.get('created_at')
        })
    
    return jsonify({'challenges': challenges_list})

@admin_bp.route('/challenges/<int:id>/override', methods=['PUT'])
@admin_required()
def override_challenge(id):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['active', 'passed', 'failed']:
        return jsonify({'error': 'Invalid status'}), 400
        
    challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [id])
    if not challenge:
        return jsonify({'error': 'Challenge not found'}), 404
    
    if new_status == 'passed':
        execute_query(
            'UPDATE challenges SET status = ?, passed_at = datetime("now") WHERE id = ?',
            [new_status, id]
        )
    elif new_status == 'failed':
        execute_query(
            'UPDATE challenges SET status = ?, failed_at = datetime("now") WHERE id = ?',
            [new_status, id]
        )
    else:
        execute_query(
            'UPDATE challenges SET status = ? WHERE id = ?',
            [new_status, id]
        )
        
    return jsonify({'success': True, 'message': f'Challenge status updated to {new_status}'})

@admin_bp.route('/paypal-settings', methods=['GET', 'PUT'])
@admin_required()
def manage_paypal():
    setting = fetch_one('SELECT * FROM paypal_settings LIMIT 1', [])
    
    if not setting:
        execute_query(
            'INSERT INTO paypal_settings (enabled) VALUES (?)',
            [0]
        )
        setting = fetch_one('SELECT * FROM paypal_settings LIMIT 1', [])
        
    if request.method == 'PUT':
        data = request.get_json()
        execute_query(
            'UPDATE paypal_settings SET enabled = ?, client_id = ?, client_secret = ?, updated_at = datetime("now") WHERE id = ?',
            [
                data.get('enabled', setting['enabled']),
                data.get('client_id', setting.get('client_id')),
                data.get('client_secret', setting.get('client_secret')),
                setting['id']
            ]
        )
        setting = fetch_one('SELECT * FROM paypal_settings WHERE id = ?', [setting['id']])
        
    return jsonify({
        'enabled': setting['enabled'],
        'client_id': setting.get('client_id')
    })
