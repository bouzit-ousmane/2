from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)

    # Register Blueprints
    from routes.auth import auth_bp
    from routes.market import market_bp
    from routes.trades import trades_bp
    from routes.challenges import challenges_bp
    from routes.admin import admin_bp
    from routes.leaderboard import leaderboard_bp
    from routes.checkout import checkout_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(trades_bp, url_prefix='/api/trades')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(leaderboard_bp, url_prefix='/api/leaderboard')
    app.register_blueprint(checkout_bp, url_prefix='/api/checkout')

    with app.app_context():
        db.create_all()
        # Seed Plans if not exist
        from models import Plan
        if not Plan.query.first():
            import json
            plans = [
                ('starter', 'Starter', 200.00, 5000.00, json.dumps(["Capital: 5,000$", "Profit target: +10%", "Max loss: -10%", "Basic AI signals", "Email support"])),
                ('pro', 'Pro', 500.00, 10000.00, json.dumps(["Capital: 10,000$", "Profit target: +10%", "Max loss: -10%", "Advanced AI signals", "24/7 support", "MasterClass access"])),
                ('elite', 'Elite', 1000.00, 25000.00, json.dumps(["Capital: 25,000$", "Profit target: +10%", "Max loss: -10%", "Personalized AI", "1-on-1 coaching", "80% profit share"]))
            ]
            for slug, name, price, balance, feats in plans:
                db.session.add(Plan(slug=slug, name=name, price_dh=price, start_balance=balance, features_json=feats))
            
            # Create Admin
            from models import User
            from models import Challenge
            from werkzeug.security import generate_password_hash
            if not User.query.filter_by(role='admin').first():
                 db.session.add(User(name='Admin', email='admin@tradesense.ai', password_hash=generate_password_hash('admin123'), role='admin'))
            
            # Seed some mock competitors for leaderboard
            mock_competitors = [
                ('Ahmed Benali', 'ahmed@demo.com', 5500.0),
                ('Fatima Zahra', 'fatima@demo.com', 5250.0),
                ('Youssef Alaoui', 'youssef@demo.com', 5200.0)
            ]
            for m_name, m_email, m_equity in mock_competitors:
                if not User.query.filter_by(email=m_email).first():
                    u = User(name=m_name, email=m_email, password_hash=generate_password_hash('password123'))
                    db.session.add(u)
                    db.session.flush() # Get ID
                    # Add challenge for them
                    c = Challenge(user_id=u.id, plan_id=1, start_balance=5000.0, current_equity=m_equity, status='active')
                    db.session.add(c)

            db.session.commit()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
