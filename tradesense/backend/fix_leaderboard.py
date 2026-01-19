import sqlite3
import random

db_path = 'instance/tradesense.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Diverse Moroccan names
names = [
    'Amine El Fassi', 
    'Zineb Benjelloun', 
    'Othmane Tazi', 
    'Saida Lahlou', 
    'Driss Mansouri', 
    'Meryem Alami', 
    'Kamal Bennani', 
    'Sofia Iraqi',
    'Youssef Alaoui',
    'Kenza Tahiri'
]

print("Starting database diversification...")

# 1. Cleanup existing non-essential users and their challenges
# We keep only admin if it exists
cursor.execute('SELECT id FROM users WHERE email = "admin@tradesense.com"')
admin = cursor.fetchone()
admin_id = admin[0] if admin else None

if admin_id:
    cursor.execute('DELETE FROM challenges WHERE user_id != ?', (admin_id,))
    cursor.execute('DELETE FROM users WHERE id != ?', (admin_id,))
else:
    cursor.execute('DELETE FROM challenges')
    cursor.execute('DELETE FROM users')

# 2. Re-populate with diverse users and challenges
for i, name in enumerate(names):
    # Create user
    email = f"trader_{i}@tradesense.ma"
    cursor.execute('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', 
                  (name, email, 'scrypt:32768:8:1$dummy'))
    user_id = cursor.lastrowid
    
    # Randomize plan (1: Starter, 2: Pro, 3: Elite)
    plan_id = random.choice([1, 2, 3])
    balances = {1: 5000, 2: 10000, 3: 25000}
    start_balance = balances[plan_id]
    
    # Generate realistic profit for leaderboard (Top ones have more profit)
    # i=0 is rank 1, i=9 is rank 10
    profit_pct = (12 - i * 1.1) + random.uniform(-0.5, 0.5)
    current_equity = start_balance * (1 + profit_pct / 100)
    
    # Create challenge
    cursor.execute('''
        INSERT INTO challenges (user_id, plan_id, start_balance, current_equity, status, created_at) 
        VALUES (?, ?, ?, ?, "active", DATETIME("now"))
    ''', (user_id, plan_id, start_balance, current_equity))

conn.commit()
print(f"Database cleanup and diversification complete. {len(names)} diverse traders created.")
conn.close()
