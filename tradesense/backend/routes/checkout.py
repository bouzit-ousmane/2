from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Plan, Challenge, PayPalSetting, db
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
        
    plan = Plan.query.filter_by(slug=plan_slug).first()
    if not plan:
        return jsonify({'error': 'Invalid plan'}), 404
        
    # Check if user already has active challenge?
    # Usually users can have multiple, but for MVP let's allow it.
    
    challenge = Challenge(
        user_id=user_id,
        plan_id=plan.id,
        start_balance=plan.start_balance,
        current_equity=plan.start_balance,
        status='active'
    )
    
    db.session.add(challenge)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Challenge created successfully',
        'challenge_id': challenge.id
    }), 201

@checkout_bp.route('/paypal-status', methods=['GET'])
def get_paypal_status():
    setting = PayPalSetting.query.first()
    return jsonify({'enabled': setting.enabled if setting else False})
