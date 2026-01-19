import sqlite3
import os

db_path = 'instance/tradesense.db'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- Active Challenges and User Names ---")
cursor.execute('''
    SELECT c.id, u.name, c.current_equity, c.status 
    FROM challenges c 
    JOIN users u ON c.user_id = u.id 
    WHERE c.status = "active"
''')
rows = cursor.fetchall()
for row in rows:
    print(row)

print("\n--- User Count ---")
cursor.execute('SELECT COUNT(*) FROM users')
print(f"Total Users: {cursor.fetchone()[0]}")

conn.close()
