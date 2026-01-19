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
    """Fetch a single row as a dictionary"""
    result = execute_query(query, params)
    if not result.rows:
        return None
    
    # Convert Row to dict using zip
    return dict(zip(result.columns, result.rows[0]))

def fetch_all(query, params=None):
    """Fetch all rows as a list of dictionaries"""
    result = execute_query(query, params)
    
    # Convert all Rows to dicts
    return [dict(zip(result.columns, row)) for row in result.rows]
