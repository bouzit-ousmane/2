from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Challenge, db

challenges_bp = Blueprint('challenges', __name__)

@challenges_bp.route('/active', methods=['GET'])
@jwt_required()
def get_active_challenge():
    user_id = get_jwt_identity()
    # Find active challenge
    challenge = Challenge.query.filter_by(user_id=user_id, status='active').order_by(Challenge.created_at.desc()).first()
    
    if not challenge:
        # Fallback: check if they have ANY challenge (maybe just passed/failed)
        challenge = Challenge.query.filter_by(user_id=user_id).order_by(Challenge.created_at.desc()).first()
        
    if challenge:
        return jsonify({'challenge': challenge.to_dict()})
    return jsonify({'challenge': None})

@challenges_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_challenge_detail(id):
    user_id = get_jwt_identity()
    challenge = Challenge.query.get_or_404(id)
    
    if str(challenge.user_id) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 403
        
    return jsonify({
        'challenge': challenge.to_dict(),
        'trades': [t.to_dict() for t in challenge.trades]
    })
