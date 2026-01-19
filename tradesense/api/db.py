import os
import asyncio
from libsql_client import create_client

# Initialize Turso client
def get_db_client():
    """Get Turso database client"""
    url = os.environ.get('TURSO_DATABASE_URL')
    auth_token = os.environ.get('TURSO_AUTH_TOKEN')
    
    if not url or not auth_token:
        raise ValueError("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set")
    
    return create_client(
        url=url,
        auth_token=auth_token
    )

# Global client instance
db = None

# Internal helper for async execution
async def _async_execute(query, params=None):
    url = os.environ.get('TURSO_DATABASE_URL')
    auth_token = os.environ.get('TURSO_AUTH_TOKEN')
    
    if not url or not auth_token:
        raise ValueError("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set")
        
    async with create_client(url=url, auth_token=auth_token) as client:
        return await client.execute(query, params or [])

def execute_query(query, params=None):
    """Execute a query and return results"""
    return asyncio.run(_async_execute(query, params))

def execute_many(query, params_list):
    """Execute multiple queries in a batch"""
    results = []
    for params in params_list:
        results.append(execute_query(query, params))
    return results

def fetch_one(query, params=None):
    """Fetch a single row"""
    result = execute_query(query, params)
    rows = result.rows
    return rows[0] if rows else None

def fetch_all(query, params=None):
    """Fetch all rows"""
    result = execute_query(query, params)
    return result.rows
