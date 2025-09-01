# Snippet Box Deployment Guide

## Option 1: Split Deployment (Recommended)

### Frontend (Vercel)
1. Create a separate repository for just the `client` folder
2. Deploy to Vercel with these settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Backend (Railway/Render)
1. Deploy the main project (server) to Railway or Render
2. Set environment variables:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`
   - `PORT` (auto-set by platform)

### Configuration
Update the client to point to your deployed backend URL.

## Option 2: Vercel All-in-One

Use the provided `vercel.json` configuration:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project root
3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NODE_ENV=production`

## Database Considerations

- **SQLite**: Works for development, but not recommended for production
- **Recommended**: Switch to PostgreSQL (Vercel Postgres, Supabase, or Neon)
- **Alternative**: Use Vercel KV for simple key-value storage

## Environment Variables

Required for production:
```
OPENAI_API_KEY=your_openai_key_here
NODE_ENV=production
DATABASE_URL=your_database_url (if switching from SQLite)
```
