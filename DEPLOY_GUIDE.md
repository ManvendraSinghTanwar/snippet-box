# 🚀 Full Deployment Guide

## Option 1: Railway (Recommended - Easiest)

### Steps:
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "Deploy from GitHub repo"
   - Select your `snippet-box` repository
   - Add PostgreSQL database service
   - Set environment variables:
     ```
     OPENAI_API_KEY=your_key_here
     NODE_ENV=production
     DATABASE_URL=will_be_auto_set_by_railway
     ```

3. **Done!** Your app will be live at `your-app.railway.app`

## Option 2: Render

### Steps:
1. **Push to GitHub** (same as above)

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Connect GitHub account
   - Create "Web Service"
   - Select your repository
   - Settings:
     - Build Command: `npm run build`
     - Start Command: `npm start`
     - Add PostgreSQL database
     - Environment variables (same as Railway)

## Option 3: DigitalOcean App Platform

### Steps:
1. **Push to GitHub**

2. **Deploy on DigitalOcean**
   - Go to DigitalOcean Apps
   - Create app from GitHub
   - Configure build settings
   - Add managed database
   - Set environment variables

## Environment Variables Needed:
```
OPENAI_API_KEY=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
NODE_ENV=production
PORT=5000
DATABASE_URL=postgres://... (auto-provided by platform)
```

## Database Migration

The app will automatically:
- Create database tables on first run
- Run migrations
- Set up the schema

Your SQLite database will be replaced with PostgreSQL automatically when you set the DATABASE_URL.

## 🎯 Recommended: Railway

**Why Railway?**
- ✅ Easiest setup
- ✅ Built-in database
- ✅ Free tier
- ✅ Auto-deploys from GitHub
- ✅ Environment variables UI
- ✅ Logs and monitoring

**Total time: ~5 minutes** from GitHub push to live app!
