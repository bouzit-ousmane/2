import yfinance as yf
import sys

def test_quote(symbol):
    try:
        print(f"Testing symbol: {symbol}")
        ticker = yf.Ticker(symbol)
        
        print("Trying history(period='1d')...")
        hist = ticker.history(period='1d')
        if not hist.empty:
            print(f"Last Price (from history): {hist['Close'].iloc[-1]}")
        else:
            print("History is empty.")
            
        print("Trying fast_info (with timeout)...")
        # yfinance doesn't have a built-in timeout for fast_info, 
        # but let's see if it eventually returns if we wait.
        info = ticker.fast_info
        print(f"Fast Info Price: {getattr(info, 'last_price', 'N/A')}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_symbol = sys.argv[1] if len(sys.argv) > 1 else "BTC-USD"
    test_quote(test_symbol)
