-- TradeSense Database Schema for Turso (libSQL)

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price_dh DECIMAL(10, 2) NOT NULL,
    start_balance DECIMAL(10, 2) NOT NULL,
    features_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    start_balance DECIMAL(10, 2) NOT NULL,
    current_equity DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    failure_reason VARCHAR(255),
    max_daily_loss_pct DECIMAL(5, 2) DEFAULT 5.00,
    max_total_loss_pct DECIMAL(5, 2) DEFAULT 10.00,
    profit_target_pct DECIMAL(5, 2) DEFAULT 10.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    passed_at DATETIME,
    failed_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
);

-- Trades table
CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 4) NOT NULL,
    total_value DECIMAL(10, 2) NOT NULL,
    profit_loss DECIMAL(10, 2) DEFAULT 0,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id)
);

-- Daily metrics table
CREATE TABLE IF NOT EXISTS daily_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    date DATE NOT NULL,
    day_start_equity DECIMAL(10, 2) NOT NULL,
    day_end_equity DECIMAL(10, 2),
    day_pnl DECIMAL(10, 2),
    day_pnl_pct DECIMAL(5, 2),
    max_intraday_drawdown_pct DECIMAL(5, 2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id),
    UNIQUE (challenge_id, date)
);

-- PayPal settings table
CREATE TABLE IF NOT EXISTS paypal_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enabled BOOLEAN DEFAULT 0,
    client_id VARCHAR(255),
    client_secret VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_trades_challenge_id ON trades(challenge_id);
CREATE INDEX IF NOT EXISTS idx_trades_executed_at ON trades(executed_at);
CREATE INDEX IF NOT EXISTS idx_daily_metrics_challenge_id ON daily_metrics(challenge_id);
