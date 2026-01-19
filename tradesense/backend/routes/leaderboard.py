from flask import Blueprint, jsonify
from sqlalchemy import text
from models import db
from datetime import datetime

leaderboard_bp = Blueprint('leaderboard', __name__)

@leaderboard_bp.route('/monthly-top10', methods=['GET'])
def get_monthly_top10():
    try:
        # SQL Query from exam requirements
        sql = text("""
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
        """)
        
        result = db.session.execute(sql)
        
        traders = []
        rank = 1
        for row in result:
            traders.append({
                'rank': rank,
                'name': row[0],
                'equity': float(row[1]),
                'profit_pct': float(row[3])
            })
            rank += 1
            
        return jsonify({'traders': traders})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
