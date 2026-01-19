BEGIN TRANSACTION;
CREATE TABLE challenges (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	plan_id INTEGER NOT NULL, 
	start_balance NUMERIC(10, 2) NOT NULL, 
	current_equity NUMERIC(10, 2) NOT NULL, 
	status VARCHAR(50), 
	failure_reason VARCHAR(255), 
	max_daily_loss_pct NUMERIC(5, 2), 
	max_total_loss_pct NUMERIC(5, 2), 
	profit_target_pct NUMERIC(5, 2), 
	created_at DATETIME, 
	passed_at DATETIME, 
	failed_at DATETIME, 
	CONSTRAINT pk_challenges PRIMARY KEY (id), 
	CONSTRAINT fk_challenges_user_id_users FOREIGN KEY(user_id) REFERENCES users (id), 
	CONSTRAINT fk_challenges_plan_id_plans FOREIGN KEY(plan_id) REFERENCES plans (id)
);
INSERT INTO "challenges" VALUES(1,1,1,5000,5.596876033557268783e+03,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(2,2,3,25000,2.783704544507498212e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(3,3,1,5000,5.474393442909700753e+03,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(4,4,2,10000,10831.4969017594,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(5,5,2,10000,1.079947570533958423e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(6,6,2,10000,1.068632129204959711e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(7,7,3,25000,2.637132855094263504e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(8,8,1,5000,5.193614532568515642e+03,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(9,9,3,25000,2.584007155032905212e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(10,10,3,25000,2.553878971174253092e+04,'active',NULL,NULL,NULL,NULL,'2026-01-18 23:34:35',NULL,NULL);
INSERT INTO "challenges" VALUES(11,11,2,10000,9963.16,'active',NULL,5,10,10,'2026-01-18 23:39:14.860062',NULL,NULL);
CREATE TABLE daily_metrics (
	id INTEGER NOT NULL, 
	challenge_id INTEGER NOT NULL, 
	date DATE NOT NULL, 
	day_start_equity NUMERIC(10, 2) NOT NULL, 
	day_end_equity NUMERIC(10, 2), 
	day_pnl NUMERIC(10, 2), 
	day_pnl_pct NUMERIC(5, 2), 
	max_intraday_drawdown_pct NUMERIC(5, 2), 
	created_at DATETIME, 
	CONSTRAINT pk_daily_metrics PRIMARY KEY (id), 
	CONSTRAINT uq_challenge_date UNIQUE (challenge_id, date), 
	CONSTRAINT fk_daily_metrics_challenge_id_challenges FOREIGN KEY(challenge_id) REFERENCES challenges (id)
);
CREATE TABLE paypal_settings (
	id INTEGER NOT NULL, 
	enabled BOOLEAN, 
	client_id VARCHAR(255), 
	client_secret VARCHAR(255), 
	updated_at DATETIME, 
	CONSTRAINT pk_paypal_settings PRIMARY KEY (id)
);
CREATE TABLE plans (
	id INTEGER NOT NULL, 
	slug VARCHAR(50) NOT NULL, 
	name VARCHAR(100) NOT NULL, 
	price_dh NUMERIC(10, 2) NOT NULL, 
	start_balance NUMERIC(10, 2) NOT NULL, 
	features_json TEXT, 
	created_at DATETIME, 
	CONSTRAINT pk_plans PRIMARY KEY (id), 
	CONSTRAINT uq_plans_slug UNIQUE (slug)
);
INSERT INTO "plans" VALUES(1,'starter','Starter',200,5000,'["Capital: 5,000$", "Profit target: +10%", "Max loss: -10%", "Basic AI signals", "Email support"]','2026-01-18 12:46:37.273751');
INSERT INTO "plans" VALUES(2,'pro','Pro',500,10000,'["Capital: 10,000$", "Profit target: +10%", "Max loss: -10%", "Advanced AI signals", "24/7 support", "MasterClass access"]','2026-01-18 12:46:37.273780');
INSERT INTO "plans" VALUES(3,'elite','Elite',1000,25000,'["Capital: 25,000$", "Profit target: +10%", "Max loss: -10%", "Personalized AI", "1-on-1 coaching", "80% profit share"]','2026-01-18 12:46:37.273797');
CREATE TABLE trades (
	id INTEGER NOT NULL, 
	challenge_id INTEGER NOT NULL, 
	symbol VARCHAR(20) NOT NULL, 
	side VARCHAR(10) NOT NULL, 
	quantity INTEGER NOT NULL, 
	price NUMERIC(10, 4) NOT NULL, 
	total_value NUMERIC(10, 2) NOT NULL, 
	profit_loss NUMERIC(10, 2), 
	executed_at DATETIME, 
	CONSTRAINT pk_trades PRIMARY KEY (id), 
	CONSTRAINT fk_trades_challenge_id_challenges FOREIGN KEY(challenge_id) REFERENCES challenges (id)
);
INSERT INTO "trades" VALUES(1,3,'IAM','buy',3,102.68,308.04,-3.080400000000000361e-01,'2026-01-18 17:51:31.263230');
INSERT INTO "trades" VALUES(2,3,'IAM','buy',6,102.68,616.08,-6.160800000000000721e-01,'2026-01-18 17:52:24.686432');
INSERT INTO "trades" VALUES(3,5,'BTC-USD','buy',1,95050,95050,-95.05,'2026-01-18 18:01:09.605000');
INSERT INTO "trades" VALUES(4,5,'MSFT','buy',3,415,1245,-1.245,'2026-01-18 18:26:47.974709');
INSERT INTO "trades" VALUES(5,5,'BTC-USD','buy',1,95050,95050,-95.05,'2026-01-18 18:26:55.923722');
INSERT INTO "trades" VALUES(6,6,'GOOGL','buy',5,150,750,-0.75,'2026-01-18 22:35:08.621340');
INSERT INTO "trades" VALUES(7,6,'TSLA','sell',2,175,350,-3.500000000000000334e-01,'2026-01-18 22:35:40.682892');
INSERT INTO "trades" VALUES(8,11,'AAPL','buy',4,185,740,-0.74,'2026-01-18 23:40:17.790217');
INSERT INTO "trades" VALUES(9,11,'NVDA','buy',38,950,36100,-36.1,'2026-01-18 23:41:04.687076');
CREATE TABLE users (
	id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	password_hash VARCHAR(255) NOT NULL, 
	role VARCHAR(50), 
	created_at DATETIME, 
	CONSTRAINT pk_users PRIMARY KEY (id), 
	CONSTRAINT uq_users_email UNIQUE (email)
);
INSERT INTO "users" VALUES(1,'Amine El Fassi','trader_0@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(2,'Zineb Benjelloun','trader_1@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(3,'Othmane Tazi','trader_2@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(4,'Saida Lahlou','trader_3@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(5,'Driss Mansouri','trader_4@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(6,'Meryem Alami','trader_5@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(7,'Kamal Bennani','trader_6@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(8,'Sofia Iraqi','trader_7@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(9,'Youssef Alaoui','trader_8@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(10,'Kenza Tahiri','trader_9@tradesense.ma','scrypt:32768:8:1$dummy',NULL,NULL);
INSERT INTO "users" VALUES(11,'user','user@gmail.com','scrypt:32768:8:1$yRBtxGbalAwXijuW$a88f676bea30918a5ac6a973dbed6729532047de7005d24d0294cbcae4ac482b2f8b36e32aa8452bdc9d9d95583c9fde9a457ff49ee2783ad08f8cc6577601c0','user','2026-01-18 23:38:38.769577');
COMMIT;
