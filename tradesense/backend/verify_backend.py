from app import create_app, db
from models import User, Plan
import json
import unittest

class TestTradeSenseBackend(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            # Seed Plan only if it doesn't exist
            if not Plan.query.filter_by(slug='starter').first():
                plan = Plan(slug='starter', name='Starter', price_dh=200, start_balance=5000, features_json='[]')
                db.session.add(plan)
                db.session.commit()

    def test_1_auth(self):
        # Register with unique email
        import time
        email = f"test_{int(time.time())}@example.com"
        res = self.client.post('/api/auth/register', json={
            'name': 'Test Trader', 'email': email, 'password': 'password123'
        })
        self.assertEqual(res.status_code, 201)
        
        # Login
        res = self.client.post('/api/auth/login', json={
            'email': email, 'password': 'password123'
        })
        self.assertEqual(res.status_code, 200)
        token = res.json['access_token']
        return token

    def test_2_market_data(self):
        # Test yfinance
        res = self.client.get('/api/market/quote?symbol=BTC-USD')
        self.assertEqual(res.status_code, 200, f"Yfinance failed: {res.json}")
        self.assertIn('price', res.json)
        
        # Test Morocco Scraper (or mock)
        res = self.client.get('/api/market/quote-ma?symbol=IAM')
        self.assertEqual(res.status_code, 200)
        self.assertIn('price', res.json)
        self.assertIn('source', res.json)

    def test_3_full_flow(self):
        # 1. Login
        token = self.test_1_auth()
        headers = {'Authorization': f'Bearer {token}'}
        
        # 2. Buy Challenge
        res = self.client.post('/api/checkout/mock', headers=headers, json={'plan_slug': 'starter'})
        self.assertEqual(res.status_code, 201)
        challenge_id = res.json['challenge_id']
        
        # 3. Get Active Challenge
        res = self.client.get('/api/challenges/active', headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json['challenge']['id'], challenge_id)
        
        # 4. Execute Trade (Buy IAM)
        res = self.client.post('/api/trades', headers=headers, json={
            'challenge_id': challenge_id,
            'symbol': 'MA_IAM',
            'side': 'buy',
            'quantity': 10
        })
        self.assertEqual(res.status_code, 201)
        self.assertEqual(res.json['success'], True)
        
        # 5. Check Trade History
        res = self.client.get(f'/api/trades?challenge_id={challenge_id}', headers=headers)
        self.assertEqual(len(res.json['trades']), 1)

if __name__ == '__main__':
    unittest.main()
