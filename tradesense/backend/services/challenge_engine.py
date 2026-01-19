from datetime import datetime
from models import Challenge, DailyMetric, Trade, db

class ChallengeEngine:
    @staticmethod
    def evaluate_rules(challenge_id: int):
        """
        Evaluates strict prop firm rules after a trade or periodically.
        
        Rules:
        1. Daily Loss Limit (5%): (Start Equity Day X - Current Equity) / Start Equity Day X >= 0.05
        2. Total Loss Limit (10%): (Initial Balance - Current Equity) / Initial Balance >= 0.10
        3. Profit Target (10%): (Current Equity - Initial Balance) / Initial Balance >= 0.10
        """
        
        challenge = Challenge.query.get(challenge_id)
        if not challenge or challenge.status != 'active':
            return
            
        current_equity = float(challenge.current_equity)
        start_balance = float(challenge.start_balance)
        
        # 1. Get Daily Start Equity
        # We need the metric for TODAY. If it doesn't exist, we create it
        today = datetime.utcnow().date()
        daily_metric = DailyMetric.query.filter_by(
            challenge_id=challenge_id, 
            date=today
        ).first()
        
        if not daily_metric:
            # If no metric for today, day_start_equity is current_equity (usually from previous day close)
            # OR logic to carry over previous day's close.
            # For simplicity in this engine: if it's the very first trade of the day, 
            # we assume day_start is current equity before this trade (or handle daily snapshots separately).
            # Here we assume a daily snapshot job runs at 00:00. 
            # If not, we fallback to start_balance for Day 1.
            day_start_equity = float(challenge.current_equity) 
            # TODO: Ideally fetch yesterday's end equity
        else:
            day_start_equity = float(daily_metric.day_start_equity)

        # --- RULE 1: DAILY LOSS (5%) ---
        # Drawdown amount
        if day_start_equity <= 0:
            day_start_equity = start_balance # Fallback to initial balance if today's start is missing/invalid

        daily_drawdown = day_start_equity - current_equity
        # Drawdown percentage
        daily_drawdown_pct = (daily_drawdown / day_start_equity) * 100.0 if day_start_equity > 0 else 0
        
        if daily_drawdown_pct >= 5.0:
            challenge.status = 'failed'
            challenge.failed_at = datetime.utcnow()
            challenge.failure_reason = 'Daily Loss Limit Exceeded (>5%)'
            db.session.commit()
            return {
                'status': 'failed',
                'reason': f'Daily Loss: -{daily_drawdown_pct:.2f}% (Limit: -5%)'
            }

        # --- RULE 2: TOTAL LOSS (10%) ---
        total_drawdown = start_balance - current_equity
        total_drawdown_pct = (total_drawdown / start_balance) * 100.0 if start_balance > 0 else 0
        
        if total_drawdown_pct >= 10.0:
            challenge.status = 'failed'
            challenge.failed_at = datetime.utcnow()
            challenge.failure_reason = 'Total Loss Limit Exceeded (>10%)'
            db.session.commit()
            return {
                'status': 'failed',
                'reason': f'Total Loss: -{total_drawdown_pct:.2f}% (Limit: -10%)'
            }

        # --- RULE 3: PROFIT TARGET (10%) ---
        profit = current_equity - start_balance
        profit_pct = (profit / start_balance) * 100.0 if start_balance > 0 else 0
        
        if profit_pct >= 10.0:
            challenge.status = 'passed'
            challenge.passed_at = datetime.utcnow()
            db.session.commit()
            return {
                'status': 'passed',
                'reason': f'Profit Target Hit: +{profit_pct:.2f}% (Target: +10%)'
            }

        return {'status': 'active'}

    @staticmethod
    def calculate_trade_impact(challenge_id: int, pnl: float):
        """
        Updates equity and checks rules immediately.
        """
        challenge = Challenge.query.get(challenge_id)
        if challenge:
            challenge.current_equity = float(challenge.current_equity) + pnl
            db.session.commit()
            
            # Re-evaluate
            return ChallengeEngine.evaluate_rules(challenge_id)
