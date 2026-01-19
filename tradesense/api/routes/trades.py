from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import execute_query, fetch_one, fetch_all
from services.challenge_engine import ChallengeEngine
import yfinance as yf

trades_bp = Blueprint('trades', __name__)

@trades_bp.route('', methods=['POST'])
@jwt_required()
def execute_trade():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    challenge_id = data.get('challenge_id')
    symbol = data.get('symbol')
    side = data.get('side')  # buy or sell
    quantity = int(data.get('quantity', 0))
    
    if not all([challenge_id, symbol, side, quantity]):
        return jsonify({'error': 'Missing fields'}), 400
        
    challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [challenge_id])
    if not challenge or str(challenge['user_id']) != str(user_id):
        return jsonify({'error': 'Challenge not found or unauthorized'}), 404
        
    if challenge['status'] != 'active':
        return jsonify({'error': f'Challenge is {challenge["status"]}, cannot trade'}), 400

    # 1. Fetch Current Price
    try:
        current_price = None
        
        # Try yfinance
        try:
            ticker = yf.Ticker(symbol)
            current_price = ticker.fast_info.last_price
        except Exception as yf_err:
            print(f"yfinance error for {symbol}: {yf_err}")
            hist = ticker.history(period="1d")
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]

        if current_price is None:
            # Fallback prices
            defaults = {
                'BTC-USD': 95050.0, 
                'ETH-USD': 2650.0, 
                'IAM': 102.50, 
                'ATW': 485.0,
                'AAPL': 185.0,
                'TSLA': 175.0,
                'GOOGL': 150.0,
                'MSFT': 415.0,
                'META': 485.0,
                'NVDA': 950.0,
                'AMZN': 178.0
            }
            current_price = defaults.get(symbol, 100.0)
            print(f"Warning: Using fallback price for {symbol}: {current_price}")
            
    except Exception as e:
        print(f"Critical error in execute_trade price fetch: {str(e)}")
        return jsonify({'error': f'Internal price fetch error: {str(e)}'}), 500

    total_value = float(quantity) * float(current_price)
    commission = total_value * 0.001  # 0.1% commission
    
    # Insert trade
    execute_query(
        'INSERT INTO trades (challenge_id, symbol, side, quantity, price, total_value, profit_loss, executed_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime("now"))',
        [challenge_id, symbol, side, quantity, current_price, total_value, -commission]
    )
    
    # Get the trade ID
    trade = fetch_one('SELECT * FROM trades WHERE challenge_id = ? ORDER BY id DESC LIMIT 1', [challenge_id])
    
    # Update Equity (deduct commission)
    new_equity = float(challenge['current_equity']) - commission
    execute_query(
        'UPDATE challenges SET current_equity = ? WHERE id = ?',
        [new_equity, challenge_id]
    )
    
    # Check Rules
    status_result = ChallengeEngine.evaluate_rules(challenge_id)
    
    # Get updated challenge status
    updated_challenge = fetch_one('SELECT status FROM challenges WHERE id = ?', [challenge_id])
    
    return jsonify({
        'success': True,
        'trade_id': trade['id'],
        'price': current_price,
        'challenge_status': updated_challenge['status'],
        'rules_evaluation': status_result
    }), 201

@trades_bp.route('', methods=['GET'])
@jwt_required()
def get_trades():
    user_id = get_jwt_identity()
    challenge_id = request.args.get('challenge_id')
    
    if not challenge_id:
        return jsonify({'error': 'Challenge ID required'}), 400
        
    challenge = fetch_one('SELECT * FROM challenges WHERE id = ?', [challenge_id])
    if not challenge or str(challenge['user_id']) != str(user_id):
        return jsonify({'error': 'Unauthorized'}), 404
        
    trades = fetch_all('SELECT * FROM trades WHERE challenge_id = ? ORDER BY executed_at DESC', [challenge_id])
    
    trades_list = []
    for trade in trades:
        trades_list.append({
            'id': trade['id'],
            'symbol': trade['symbol'],
            'side': trade['side'],
            'quantity': trade['quantity'],
            'price': float(trade.get('price', 0)),
            'total_value': float(trade.get('total_value', 0)),
            'profit_loss': float(trade.get('profit_loss', 0)),
            'executed_at': trade.get('executed_at')
        })
    
    return jsonify({'trades': trades_list})
