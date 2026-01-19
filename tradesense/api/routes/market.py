from flask import Blueprint, request, jsonify
import yfinance as yf
from datetime import datetime
import random
import time

market_bp = Blueprint('market', __name__)

# Cache for mock prices to keep them somewhat consistent
MOCK_PRICES = {
    'BTC-USD': 65000.0,
    'ETH-USD': 3500.0,
    'AAPL': 180.0,
    'MSFT': 400.0,
    'IAM': 105.0,
    'ATW': 250.0
}

def get_mock_quote(symbol):
    base_price = MOCK_PRICES.get(symbol, 100.0)
    # Random walk: +/- 0.1%
    change_pct = random.uniform(-0.001, 0.001)
    new_price = base_price * (1 + change_pct)
    MOCK_PRICES[symbol] = new_price
    
    return {
        'symbol': symbol,
        'price': new_price,
        'change': new_price - base_price,
        'change_percent': change_pct * 100,
        'timestamp': datetime.utcnow().isoformat(),
        'source': 'mock'
    }

@market_bp.route('/quote', methods=['GET'])
def get_quote():
    symbol = request.args.get('symbol')
    if not symbol:
        return jsonify({'error': 'Symbol required'}), 400
        
    try:
        # Using a small timeout or just prepared for failure
        ticker = yf.Ticker(symbol)
        
        # Try history first as it's often more reliable than fast_info
        hist = ticker.history(period='1d', interval='1m')
        
        if not hist.empty:
            last_row = hist.iloc[-1]
            price = float(last_row['Close'])
            prev_close = float(hist.iloc[0]['Close'])
            change = price - prev_close
            change_pct = (change / prev_close) * 100 if prev_close else 0
            
            return jsonify({
                'symbol': symbol,
                'price': price,
                'change': change,
                'change_percent': change_pct,
                'timestamp': datetime.utcnow().isoformat(),
                'source': 'yfinance'
            })
        else:
            # Fallback to fast_info if history fails
            price = ticker.fast_info.last_price
            if price is None or price == 0:
                raise ValueError("No price found")
                
            prev_close = ticker.fast_info.previous_close
            change = price - prev_close
            change_pct = (change / prev_close) * 100 if prev_close else 0
            return jsonify({
                'symbol': symbol,
                'price': float(price),
                'change': float(change),
                'change_percent': float(change_pct),
                'timestamp': datetime.utcnow().isoformat(),
                'source': 'yfinance_fast'
            })
            
    except Exception as e:
        print(f"Market API Error for {symbol}: {str(e)}. Using mock data.")
        return jsonify(get_mock_quote(symbol))

@market_bp.route('/history', methods=['GET'])
def get_history():
    symbol = request.args.get('symbol')
    interval = request.args.get('interval', '1m')
    period = request.args.get('range', '1d')
    
    if not symbol:
        return jsonify({'error': 'Symbol required'}), 400
        
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            raise ValueError("History is empty")

        data = []
        for index, row in hist.iterrows():
            data.append({
                'time': int(index.timestamp()),
                'open': float(row['Open']),
                'high': float(row['High']),
                'low': float(row['Low']),
                'close': float(row['Close']),
                'volume': int(row['Volume'])
            })
            
        return jsonify({'symbol': symbol, 'data': data})
    except Exception as e:
        print(f"History API Error for {symbol}: {str(e)}. Generating mock history.")
        # Generate mock history: 50 points
        data = []
        now = int(time.time())
        base_price = MOCK_PRICES.get(symbol, 100.0)
        for i in range(50):
            t = now - (50 - i) * 60 # 1 minute intervals
            change = base_price * random.uniform(-0.01, 0.01)
            data.append({
                'time': t,
                'open': base_price,
                'high': base_price + abs(change),
                'low': base_price - abs(change),
                'close': base_price + change,
                'volume': random.randint(100, 1000)
            })
            base_price += change
            
        return jsonify({'symbol': symbol, 'data': data, 'source': 'mock'})
