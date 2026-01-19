"""
Test Turso database connection
"""
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables from parent directory
load_dotenv('../.env.local')

async def run_test():
    url = os.environ.get('TURSO_DATABASE_URL')
    auth_token = os.environ.get('TURSO_AUTH_TOKEN')
    
    if not url or not auth_token:
        print("❌ Error: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local")
        exit(1)
    
    print(f"Connecting to: {url}")
    
    try:
        from libsql_client import create_client
        async with create_client(url=url, auth_token=auth_token) as db:
            print("✅ Successfully connected to Turso database!")
            
            # Test query
            result = await db.execute("SELECT 1 as test")
            print(f"✅ Test query successful: {result.rows}")
            
            # Check if tables exist
            tables_result = await db.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row['name'] for row in tables_result.rows]
            
            if tables:
                print(f"\n📊 Existing tables: {', '.join(tables)}")
            else:
                print("\n⚠️  No tables found. Run 'python seed.py' to initialize the database.")
            
            # Check users count
            if 'users' in tables:
                users_result = await db.execute("SELECT COUNT(*) as count FROM users")
                user_count = users_result.rows[0]['count']
                print(f"👥 Users in database: {user_count}")
            
            print("\n✅ Connection test complete!")
    except ImportError:
        print("❌ Error: libsql-client not installed")
        print("Run: pip install libsql-client")
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check that TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are correct in .env.local")
        print("2. Verify your Turso database is active at turso.tech")
        print("3. Ensure you have internet connection")

if __name__ == "__main__":
    asyncio.run(run_test())
