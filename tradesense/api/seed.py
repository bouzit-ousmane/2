"""
Seed script to populate Turso database with initial data
Run this script once to set up your database
"""
import os
import asyncio
from dotenv import load_dotenv
from libsql_client import create_client
import json
from werkzeug.security import generate_password_hash

# Load environment variables from parent directory
load_dotenv('../.env.local')

async def run_seed():
    # Connect to Turso
    url = os.environ.get('TURSO_DATABASE_URL')
    auth_token = os.environ.get('TURSO_AUTH_TOKEN')

    if not url or not auth_token:
        print("Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local")
        exit(1)

    async with create_client(url=url, auth_token=auth_token) as db:
        print("Connected to Turso database")

        # Read and execute schema
        print("Creating tables...")
        with open('schema.sql', 'r') as f:
            schema_sql = f.read()
            # Split by semicolon and execute each statement
            statements = [s.strip() for s in schema_sql.split(';') if s.strip()]
            for statement in statements:
                try:
                    await db.execute(statement)
                    print(f"✓ Executed: {statement[:50]}...")
                except Exception as e:
                    print(f"✗ Error: {e}")

        print("\nSeeding plans...")
        plans = [
            ('starter', 'Starter', 200.00, 5000.00, json.dumps([
                "Capital: 5,000$",
                "Profit target: +10%",
                "Max loss: -10%",
                "Basic AI signals",
                "Email support"
            ])),
            ('pro', 'Pro', 500.00, 10000.00, json.dumps([
                "Capital: 10,000$",
                "Profit target: +10%",
                "Max loss: -10%",
                "Advanced AI signals",
                "24/7 support",
                "MasterClass access"
            ])),
            ('elite', 'Elite', 1000.00, 25000.00, json.dumps([
                "Capital: 25,000$",
                "Profit target: +10%",
                "Max loss: -10%",
                "Personalized AI",
                "1-on-1 coaching",
                "80% profit share"
            ]))
        ]

        for slug, name, price, balance, features in plans:
            try:
                await db.execute(
                    'INSERT INTO plans (slug, name, price_dh, start_balance, features_json) VALUES (?, ?, ?, ?, ?)',
                    [slug, name, price, balance, features]
                )
                print(f"✓ Created plan: {name}")
            except Exception as e:
                print(f"✗ Plan {name} already exists or error: {e}")

        print("\nCreating admin user...")
        admin_password = generate_password_hash('admin123')
        try:
            await db.execute(
                'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                ['Admin', 'admin@tradesense.ai', admin_password, 'admin']
            )
            print("✓ Created admin user (admin@tradesense.ai / admin123)")
        except Exception as e:
            print(f"✗ Admin user already exists or error: {e}")

        print("\nCreating demo users...")
        demo_users = [
            ('Ahmed Benali', 'ahmed@demo.com', 5500.0, 1),
            ('Fatima Zahra', 'fatima@demo.com', 5250.0, 1),
            ('Youssef Alaoui', 'youssef@demo.com', 5200.0, 1)
        ]

        for name, email, equity, plan_id in demo_users:
            try:
                password = generate_password_hash('password123')
                await db.execute(
                    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                    [name, email, password, 'user']
                )
                
                # Get user ID
                result = await db.execute('SELECT id FROM users WHERE email = ?', [email])
                user_id = result.rows[0]['id']
                
                # Create challenge
                await db.execute(
                    'INSERT INTO challenges (user_id, plan_id, start_balance, current_equity, status) VALUES (?, ?, ?, ?, ?)',
                    [user_id, plan_id, 5000.0, equity, 'active']
                )
                
                print(f"✓ Created demo user: {name} ({email})")
            except Exception as e:
                print(f"✗ Demo user {name} already exists or error: {e}")

        print("\n✅ Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(run_seed())
    print("\nYou can now login with:")
    print("  Admin: admin@tradesense.ai / admin123")
    print("  Demo: ahmed@demo.com / password123")
