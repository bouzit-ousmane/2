from datetime import datetime
import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Define convention for constraints to avoid migration issues
convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}

metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    challenges = db.relationship('Challenge', backref='user', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Plan(db.Model):
    __tablename__ = 'plans'
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price_dh = db.Column(db.Numeric(10, 2), nullable=False)
    start_balance = db.Column(db.Numeric(10, 2), nullable=False)
    features_json = db.Column(db.Text)  # JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'name': self.name,
            'price_dh': float(self.price_dh),
            'start_balance': float(self.start_balance),
            'features': json.loads(self.features_json) if self.features_json else [],
        }

class Challenge(db.Model):
    __tablename__ = 'challenges'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id'), nullable=False)
    
    start_balance = db.Column(db.Numeric(10, 2), nullable=False)
    current_equity = db.Column(db.Numeric(10, 2), nullable=False)
    
    status = db.Column(db.String(50), default='active')  # active, passed, failed
    failure_reason = db.Column(db.String(255), nullable=True) # To store why it failed
    
    max_daily_loss_pct = db.Column(db.Numeric(5, 2), default=5.00)
    max_total_loss_pct = db.Column(db.Numeric(5, 2), default=10.00)
    profit_target_pct = db.Column(db.Numeric(5, 2), default=10.00)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    passed_at = db.Column(db.DateTime, nullable=True)
    failed_at = db.Column(db.DateTime, nullable=True)

    trades = db.relationship('Trade', backref='challenge', lazy=True)
    daily_metrics = db.relationship('DailyMetric', backref='challenge', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plan_id': self.plan_id,
            'start_balance': float(self.start_balance),
            'current_equity': float(self.current_equity),
            'status': self.status,
            'targets': {
                'daily_loss_pct': float(self.max_daily_loss_pct),
                'total_loss_pct': float(self.max_total_loss_pct),
                'profit_target_pct': float(self.profit_target_pct)
            },
            'trades': [t.to_dict() for t in self.trades][-10:], # Last 10 trades for performance
            'created_at': self.created_at.isoformat()
        }

class Trade(db.Model):
    __tablename__ = 'trades'
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)  # buy/sell
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 4), nullable=False)
    total_value = db.Column(db.Numeric(10, 2), nullable=False)
    profit_loss = db.Column(db.Numeric(10, 2), default=0)
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'side': self.side,
            'quantity': self.quantity,
            'price': float(self.price),
            'total_value': float(self.total_value),
            'profit_loss': float(self.profit_loss),
            'executed_at': self.executed_at.isoformat()
        }

class DailyMetric(db.Model):
    __tablename__ = 'daily_metrics'
    id = db.Column(db.Integer, primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    
    day_start_equity = db.Column(db.Numeric(10, 2), nullable=False)
    day_end_equity = db.Column(db.Numeric(10, 2), nullable=True)
    day_pnl = db.Column(db.Numeric(10, 2), nullable=True)
    day_pnl_pct = db.Column(db.Numeric(5, 2), nullable=True)
    
    max_intraday_drawdown_pct = db.Column(db.Numeric(5, 2), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('challenge_id', 'date', name='uq_challenge_date'),)

class PayPalSetting(db.Model):
    __tablename__ = 'paypal_settings'
    id = db.Column(db.Integer, primary_key=True)
    enabled = db.Column(db.Boolean, default=False)
    client_id = db.Column(db.String(255), nullable=True)
    client_secret = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
