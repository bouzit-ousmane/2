# TradeSense Vercel Deployment Guide

## Overview

This guide will help you deploy TradeSense to Vercel with Turso as the cloud database.

## Prerequisites

- [x] Turso account created at [turso.tech](https://turso.tech)
- [x] Turso database created
- [x] Turso credentials (Database URL and Auth Token)
- [ ] Vercel account at [vercel.com](https://vercel.com)
- [ ] Vercel CLI installed (optional): `npm i -g vercel`

## Environment Variables

You need to set the following environment variables in both `.env.local` (for local development) and Vercel dashboard (for production):

### Required Variables

```env
# Turso Database
TURSO_DATABASE_URL=libsql://tradingsense-ousmane.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...

# Flask Security
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Next.js Public API URL
NEXT_PUBLIC_API_URL=/api
```

### Generating Secret Keys

For production, generate secure random keys:

```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## Local Development Setup

### 1. Install Dependencies

```bash
# Install Python dependencies for API
cd api
pip install -r requirements.txt
cd ..

# Install Node dependencies for frontend (if not already done)
cd frontend
npm install
cd ..
```

### 2. Set Up Environment Variables

Create `.env.local` in the project root with your Turso credentials (already created).

### 3. Initialize Database

Run the seed script to create tables and populate initial data:

```bash
cd api
python seed.py
```

This will:
- Create all database tables
- Seed plans (Starter, Pro, Elite)
- Create admin user
- Create demo users with sample challenges

### 4. Run Development Server

```bash
# From project root
npm run dev
```

This will start the Next.js development server at http://localhost:3000

The API will be available at http://localhost:3000/api/*

## Vercel Deployment

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Vercel deployment ready"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In the Vercel dashboard, go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`
     - `SECRET_KEY`
     - `JWT_SECRET_KEY`
     - `NEXT_PUBLIC_API_URL` (set to `/api`)

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? tradesense
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add SECRET_KEY
vercel env add JWT_SECRET_KEY
vercel env add NEXT_PUBLIC_API_URL

# Deploy to production
vercel --prod
```

## Post-Deployment

### 1. Verify Deployment

Visit your Vercel URL (e.g., `https://tradesense.vercel.app`)

### 2. Test API Endpoints

```bash
# Health check
curl https://your-app.vercel.app/api/health

# Should return: {"status":"ok","message":"TradeSense API is running"}
```

### 3. Test Login

- Navigate to your app
- Login with admin credentials:
  - Email: `admin@tradesense.ai`
  - Password: `admin123`

## Troubleshooting

### API Routes Not Working

- Check Vercel function logs in the dashboard
- Verify environment variables are set correctly
- Ensure `vercel.json` is in the project root

### Database Connection Errors

- Verify `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are correct
- Check Turso dashboard to ensure database is active
- Run `python api/seed.py` locally to test connection

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json` and `requirements.txt`
- Verify Python version in `vercel.json` matches your local version

## Database Management

### Viewing Data

Use Turso CLI or web interface:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Connect to your database
turso db shell tradingsense-ousmane

# Run SQL queries
SELECT * FROM users;
SELECT * FROM challenges;
```

### Backing Up Data

```bash
# Export database
turso db dump tradingsense-ousmane > backup.sql
```

## Project Structure

```
tradesense/
├── api/                      # Flask backend (Vercel serverless functions)
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   ├── db.py               # Turso database connection
│   ├── models.py           # Data models
│   ├── index.py            # Flask app entry point
│   ├── schema.sql          # Database schema
│   ├── seed.py             # Database seed script
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend (moved to root in deployment)
├── next.config.js          # Next.js configuration
├── vercel.json            # Vercel configuration
└── .env.local             # Environment variables (local only)
```

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- Check Turso documentation: https://docs.turso.tech
- Review application logs in Vercel dashboard
