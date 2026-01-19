"""
Data models for TradeSense
Since we're using Turso (raw SQL), these are plain Python classes for data serialization
"""
from datetime import datetime
import json
from typing import Optional, List, Dict, Any


class User:
    def __init__(self, id: int, name: str, email: str, password_hash: str, 
                 role: str = 'user', created_at: str = None):
        self.id = id
        self.name = name
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    @staticmethod
    def from_row(row):
        """Create User from database row"""
        if not row:
            return None
        return User(
            id=row['id'],
            name=row['name'],
            email=row['email'],
            password_hash=row['password_hash'],
            role=row.get('role', 'user'),
            created_at=row.get('created_at')
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at
        }


class Plan:
    def __init__(self, id: int, slug: str, name: str, price_dh: float, 
                 start_balance: float, features_json: str = None, created_at: str = None):
        self.id = id
        self.slug = slug
        self.name = name
        self.price_dh = price_dh
        self.start_balance = start_balance
        self.features_json = features_json
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    @staticmethod
    def from_row(row):
        """Create Plan from database row"""
        if not row:
            return None
        return Plan(
            id=row['id'],
            slug=row['slug'],
            name=row['name'],
            price_dh=float(row['price_dh']),
            start_balance=float(row['start_balance']),
            features_json=row.get('features_json'),
            created_at=row.get('created_at')
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'slug': self.slug,
            'name': self.name,
            'price_dh': self.price_dh,
            'start_balance': self.start_balance,
            'features': json.loads(self.features_json) if self.features_json else []
        }


class Challenge:
    def __init__(self, id: int, user_id: int, plan_id: int, start_balance: float,
                 current_equity: float, status: str = 'active', failure_reason: str = None,
                 max_daily_loss_pct: float = 5.00, max_total_loss_pct: float = 10.00,
                 profit_target_pct: float = 10.00, created_at: str = None,
                 passed_at: str = None, failed_at: str = None):
        self.id = id
        self.user_id = user_id
        self.plan_id = plan_id
        self.start_balance = start_balance
        self.current_equity = current_equity
        self.status = status
        self.failure_reason = failure_reason
        self.max_daily_loss_pct = max_daily_loss_pct
        self.max_total_loss_pct = max_total_loss_pct
        self.profit_target_pct = profit_target_pct
        self.created_at = created_at or datetime.utcnow().isoformat()
        self.passed_at = passed_at
        self.failed_at = failed_at
    
    @staticmethod
    def from_row(row):
        """Create Challenge from database row"""
        if not row:
            return None
        return Challenge(
            id=row['id'],
            user_id=row['user_id'],
            plan_id=row['plan_id'],
            start_balance=float(row['start_balance']),
            current_equity=float(row['current_equity']),
            status=row.get('status', 'active'),
            failure_reason=row.get('failure_reason'),
            max_daily_loss_pct=float(row.get('max_daily_loss_pct', 5.00)),
            max_total_loss_pct=float(row.get('max_total_loss_pct', 10.00)),
            profit_target_pct=float(row.get('profit_target_pct', 10.00)),
            created_at=row.get('created_at'),
            passed_at=row.get('passed_at'),
            failed_at=row.get('failed_at')
        )
    
    def to_dict(self, include_trades=False):
        result = {
            'id': self.id,
            'user_id': self.user_id,
            'plan_id': self.plan_id,
            'start_balance': self.start_balance,
            'current_equity': self.current_equity,
            'status': self.status,
            'targets': {
                'daily_loss_pct': self.max_daily_loss_pct,
                'total_loss_pct': self.max_total_loss_pct,
                'profit_target_pct': self.profit_target_pct
            },
            'created_at': self.created_at
        }
        return result


class Trade:
    def __init__(self, id: int, challenge_id: int, symbol: str, side: str,
                 quantity: int, price: float, total_value: float, 
                 profit_loss: float = 0, executed_at: str = None):
        self.id = id
        self.challenge_id = challenge_id
        self.symbol = symbol
        self.side = side
        self.quantity = quantity
        self.price = price
        self.total_value = total_value
        self.profit_loss = profit_loss
        self.executed_at = executed_at or datetime.utcnow().isoformat()
    
    @staticmethod
    def from_row(row):
        """Create Trade from database row"""
        if not row:
            return None
        return Trade(
            id=row['id'],
            challenge_id=row['challenge_id'],
            symbol=row['symbol'],
            side=row['side'],
            quantity=row['quantity'],
            price=float(row['price']),
            total_value=float(row['total_value']),
            profit_loss=float(row.get('profit_loss', 0)),
            executed_at=row.get('executed_at')
        )
    
    def to_dict(self):
        return {
            'id': self.id,
            'symbol': self.symbol,
            'side': self.side,
            'quantity': self.quantity,
            'price': self.price,
            'total_value': self.total_value,
            'profit_loss': self.profit_loss,
            'executed_at': self.executed_at
        }


class DailyMetric:
    def __init__(self, id: int, challenge_id: int, date: str, day_start_equity: float,
                 day_end_equity: float = None, day_pnl: float = None, 
                 day_pnl_pct: float = None, max_intraday_drawdown_pct: float = None,
                 created_at: str = None):
        self.id = id
        self.challenge_id = challenge_id
        self.date = date
        self.day_start_equity = day_start_equity
        self.day_end_equity = day_end_equity
        self.day_pnl = day_pnl
        self.day_pnl_pct = day_pnl_pct
        self.max_intraday_drawdown_pct = max_intraday_drawdown_pct
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    @staticmethod
    def from_row(row):
        """Create DailyMetric from database row"""
        if not row:
            return None
        return DailyMetric(
            id=row['id'],
            challenge_id=row['challenge_id'],
            date=row['date'],
            day_start_equity=float(row['day_start_equity']),
            day_end_equity=float(row['day_end_equity']) if row.get('day_end_equity') else None,
            day_pnl=float(row['day_pnl']) if row.get('day_pnl') else None,
            day_pnl_pct=float(row['day_pnl_pct']) if row.get('day_pnl_pct') else None,
            max_intraday_drawdown_pct=float(row['max_intraday_drawdown_pct']) if row.get('max_intraday_drawdown_pct') else None,
            created_at=row.get('created_at')
        )
