from datetime import datetime
from db import execute_query, fetch_one

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
        
        challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [challenge_id])
        if not challenge or challenge['status'] != 'active':
            return
            
        current_equity = float(challenge['current_equity'])
        start_balance = float(challenge['start_balance'])
        
        # 1. Get Daily Start Equity
        today = datetime.utcnow().date().isoformat()
        daily_metric = fetch_one(
            'SELECT * FROM daily_metrics WHERE challenge_id = ? AND date = ?',
            [challenge_id, today]
        )
        
        if not daily_metric:
            day_start_equity = float(challenge['current_equity'])
        else:
            day_start_equity = float(daily_metric['day_start_equity'])

        # --- RULE 1: DAILY LOSS (5%) ---
        if day_start_equity <= 0:
            day_start_equity = start_balance

        daily_drawdown = day_start_equity - current_equity
        daily_drawdown_pct = (daily_drawdown / day_start_equity) * 100.0 if day_start_equity > 0 else 0
        
        if daily_drawdown_pct >= 5.0:
            execute_query(
                'UPDATE challenges SET status = ?, failed_at = datetime("now"), failure_reason = ? WHERE id = ?',
                ['failed', 'Daily Loss Limit Exceeded (>5%)', challenge_id]
            )
            return {
                'status': 'failed',
                'reason': f'Daily Loss: -{daily_drawdown_pct:.2f}% (Limit: -5%)'
            }

        # --- RULE 2: TOTAL LOSS (10%) ---
        total_drawdown = start_balance - current_equity
        total_drawdown_pct = (total_drawdown / start_balance) * 100.0 if start_balance > 0 else 0
        
        if total_drawdown_pct >= 10.0:
            execute_query(
                'UPDATE challenges SET status = ?, failed_at = datetime("now"), failure_reason = ? WHERE id = ?',
                ['failed', 'Total Loss Limit Exceeded (>10%)', challenge_id]
            )
            return {
                'status': 'failed',
                'reason': f'Total Loss: -{total_drawdown_pct:.2f}% (Limit: -10%)'
            }

        # --- RULE 3: PROFIT TARGET (10%) ---
        profit = current_equity - start_balance
        profit_pct = (profit / start_balance) * 100.0 if start_balance > 0 else 0
        
        if profit_pct >= 10.0:
            execute_query(
                'UPDATE challenges SET status = ?, passed_at = datetime("now") WHERE id = ?',
                ['passed', challenge_id]
            )
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
        challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [challenge_id])
        if challenge:
            new_equity = float(challenge['current_equity']) + pnl
            execute_query(
                'UPDATE challenges SET current_equity = ? WHERE id = ?',
                [new_equity, challenge_id]
            )
            
            # Re-evaluate
            return ChallengeEngine.evaluate_rules(challenge_id)
