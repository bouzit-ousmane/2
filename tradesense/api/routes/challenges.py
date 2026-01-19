from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import fetch_one, fetch_all

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_challenge():
    user_id = get_jwt_identity()
    
    # Find active challenge
    challenge = fetch_one(
        'SELECT * FROM challenges WHERE user_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1',
        [user_id, 'active']
    )
    
    if not challenge:
        # Fallback: check if they have ANY challenge
        challenge = fetch_one(
            'SELECT * FROM challenges WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [user_id]
        )
        
    if challenge:
        # Get trades for this challenge
        trades = fetch_all(
            'SELECT * FROM trades WHERE challenge_id = ? ORDER BY executed_at DESC LIMIT 10',
            [challenge['id']]
        )
        
        challenge_dict = {
            'id': challenge['id'],
            'user_id': challenge['user_id'],
            'plan_id': challenge['plan_id'],
            'start_balance': float(challenge['start_balance']),
            'current_equity': float(challenge['current_equity']),
            'status': challenge['status'],
            'targets': {
                'daily_loss_pct': float(challenge.get('max_daily_loss_pct', 5.0)),
                'total_loss_pct': float(challenge.get('max_total_loss_pct', 10.0)),
                'profit_target_pct': float(challenge.get('profit_target_pct', 10.0))
            },
            'created_at': challenge.get('created_at'),
            'trades': [{
                'id': t['id'],
                'symbol': t['symbol'],
                'side': t['side'],
                'quantity': t['quantity'],
                'price': float(t.get('price', 0)),
                'total_value': float(t.get('total_value', 0)),
                'profit_loss': float(t.get('profit_loss', 0)),
                'executed_at': t.get('executed_at')
            } for t in trades]
        }
        return jsonify({'challenge': challenge_dict})
    
    return jsonify({'challenge': None})

@challenges_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_challenge_detail(id):
    user_id = get_jwt_identity()
    challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [id])
    
    if not challenge:
        return jsonify({'error': 'Challenge not found'}), 404
    
    if str(challenge['user_id']) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
        
    trades = fetch_all(
        'SELECT * FROM trades WHERE challenge_id = ? ORDER BY executed_at DESC',
        [id]
    )
    
    return jsonify({
        'challenge': {
            'id': challenge['id'],
            'user_id': challenge['user_id'],
            'plan_id': challenge['plan_id'],
            'start_balance': float(challenge['start_balance']),
            'current_equity': float(challenge.get('current_equity', 0)),
            'status': challenge.get('status'),
            'created_at': challenge.get('created_at')
        },
        'trades': [{
            'id': t['id'],
            'symbol': t['symbol'],
            'side': t['side'],
            'quantity': t['quantity'],
            'price': float(t.get('price', 0)),
            'total_value': float(t.get('total_value', 0)),
            'profit_loss': float(t.get('profit_loss', 0)),
            'executed_at': t.get('executed_at')
        } for t in trades]
    })
