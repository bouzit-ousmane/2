from flask import Blueprint, jsonify
from db import fetch_all
from datetime import datetime

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/monthly-top10', methods=['GET'])
def get_monthly_top10():
    try:
        # SQL Query for monthly top 10 traders
        sql = """
            SELECT 
              u.name,
              c.current_equity,
              c.start_balance,
              ((c.current_equity - c.start_balance) / c.start_balance * 100) as profit_pct
            FROM challenges c
            JOIN users u ON c.user_id = u.id
            WHERE c.status = 'active'
              AND strftime('%Y-%m', c.created_at) = strftime('%Y-%m', 'now')
            ORDER BY profit_pct DESC, c.current_equity DESC
            LIMIT 10
        """
        
        rows = fetch_all(sql, [])
        
        traders = []
        rank = 1
        for row in rows:
            traders.append({
                'rank': rank,
                'name': row['name'],
                'equity': float(row['current_equity']),
                'profit_pct': float(row['profit_pct'])
            })
            rank += 1
            
        return jsonify({'traders': traders})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
