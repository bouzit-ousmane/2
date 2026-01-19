from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, Challenge, PayPalSetting, db

admin_bp = Blueprint('admin', __name__)

# Decorator for admin check
def admin_required():
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        # Fix for flask wrapper naming
        decorator.__name__ = fn.__name__
        return decorator
    return wrapper

@admin_bp.route('/challenges', methods=['GET'])
@admin_required()
def get_all_challenges():
    challenges = Challenge.query.order_by(Challenge.created_at.desc()).all()
    return jsonify({'challenges': [c.to_dict() for c in challenges]})

@admin_bp.route('/challenges/<int:id>/override', methods=['PUT'])
@admin_required()
def override_challenge(id):
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status not in ['active', 'passed', 'failed']:
        return jsonify({'error': 'Invalid status'}), 400
        
    challenge = Challenge.query.get_or_404(id)
    challenge.status = new_status
    if new_status == 'passed':
        from datetime import datetime
        challenge.passed_at = datetime.utcnow()
    elif new_status == 'failed':
        from datetime import datetime
        challenge.failed_at = datetime.utcnow()
        
    db.session.commit()
    return jsonify({'success': True, 'message': f'Challenge status updated to {new_status}'})

@admin_bp.route('/paypal-settings', methods=['GET', 'PUT'])
@admin_required()
def manage_paypal():
    setting = PayPalSetting.query.first()
    if not setting:
        setting = PayPalSetting(enabled=False)
        db.session.add(setting)
        db.session.commit()
        
    if request.method == 'PUT':
        data = request.get_json()
        setting.enabled = data.get('enabled', setting.enabled)
        setting.client_id = data.get('client_id', setting.client_id)
        setting.client_secret = data.get('client_secret', setting.client_secret)
        db.session.commit()
        
    return jsonify({
        'enabled': setting.enabled,
        'client_id': setting.client_id
    })
