# 🚀 PolyCaster Deployment Guide

This guide walks you through deploying the backend first, then configuring the frontend to connect to it.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- All environment variables ready (see below)

---

## 🔧 Step 1: Prepare Environment Variables

### Backend Environment Variables

You'll need these for the backend deployment:

```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# AI Service
OPENAI_API_KEY=your_openai_api_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# Blockchain - EVM (Base Sepolia)
BASE_RPC_URL=your_base_rpc_url
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
SERVER_WALLET=your_server_wallet_address
PRIVATE_KEY=your_private_key

# Blockchain - Solana
SOLANA_SERVER_WALLET=your_solana_server_wallet_address
SOLANA_PRIVATE_KEY=your_solana_private_key_base58
SOLANA_RPC_URL=your_solana_rpc_url

# Frontend URL (will be set after frontend deployment)
FRONTEND_URL=https://your-frontend.vercel.app

# Node Environment
NODE_ENV=production
PORT=8000
```

### Frontend Environment Variables

You'll need these for the frontend deployment:

```env
# Backend API URL (will be set after backend deployment)
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app

# Solana RPC
NEXT_PUBLIC_SOLANA_RPC_URL=your_solana_rpc_url

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

---

## 🎯 Step 2: Deploy Backend to Vercel

### 2.1. Connect Backend Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository: `https://github.com/isaac-richie/caster-solana.git`
4. **Important**: Set the **Root Directory** to `backend-ts`
   - In Vercel project settings, go to **Settings → General → Root Directory**
   - Set it to: `backend-ts`

### 2.2. Configure Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist` (or leave empty, Vercel will handle it)
- **Install Command**: `npm install`

### 2.3. Add Environment Variables

In Vercel project settings, go to **Settings → Environment Variables** and add all backend environment variables:

**For Production:**
- Add all variables from the "Backend Environment Variables" section above
- **Important**: For `FRONTEND_URL`, use a placeholder for now: `https://your-frontend.vercel.app`
  - We'll update this after frontend deployment

### 2.4. Deploy Backend

1. Click **"Deploy"**
2. Wait for deployment to complete (usually 2-3 minutes)
3. Once deployed, Vercel will give you a URL like: `https://your-backend-xyz.vercel.app`
4. **Save this URL** - you'll need it for the frontend!

### 2.5. Test Backend Deployment

Test the backend health endpoint:

```bash
curl https://your-backend-xyz.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "api": "running",
    "polymarket": "healthy",
    "ai_engine": "healthy",
    "facilitator": "healthy",
    "database": "healthy"
  }
}
```

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1. Connect Frontend Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** (create a separate project for frontend)
3. Import the same GitHub repository: `https://github.com/isaac-richie/caster-solana.git`
4. **Important**: Set the **Root Directory** to `polycasterz`
   - In Vercel project settings, go to **Settings → General → Root Directory**
   - Set it to: `polycasterz`

### 3.2. Configure Build Settings

Vercel should auto-detect Next.js, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`

### 3.3. Add Environment Variables

In Vercel project settings, go to **Settings → Environment Variables** and add:

**For Production:**
- `NEXT_PUBLIC_API_URL` = `https://your-backend-xyz.vercel.app` (the backend URL from Step 2.4)
- `NEXT_PUBLIC_SOLANA_RPC_URL` = your Solana RPC URL
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` = your Thirdweb client ID

### 3.4. Deploy Frontend

1. Click **"Deploy"**
2. Wait for deployment to complete (usually 3-5 minutes)
3. Once deployed, Vercel will give you a URL like: `https://your-frontend-abc.vercel.app`
4. **Save this URL** - you'll need it for the backend!

---

## 🔄 Step 4: Update Backend with Frontend URL

### 4.1. Update Backend Environment Variables

Now that you have the frontend URL, update the backend:

1. Go to your **Backend Vercel Project** → **Settings → Environment Variables**
2. Find `FRONTEND_URL`
3. Update it to your actual frontend URL: `https://your-frontend-abc.vercel.app`
4. Click **"Save"**

### 4.2. Redeploy Backend

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. This ensures CORS is properly configured with the correct frontend URL

---

## ✅ Step 5: Verify Everything Works

### 5.1. Test Frontend → Backend Connection

1. Open your frontend URL: `https://your-frontend-abc.vercel.app`
2. Open browser DevTools (F12) → Console tab
3. Try searching for a market
4. Check the console for API requests - they should go to your backend URL

### 5.2. Test API Endpoints

Test from browser console or curl:

```javascript
// In browser console on frontend
fetch('https://your-backend-xyz.vercel.app/health')
  .then(r => r.json())
  .then(console.log)
```

### 5.3. Test Full Flow

1. Connect wallet (EVM or Solana)
2. Search for a market
3. Click "Get AI Analysis"
4. Complete payment
5. Verify analysis appears

---

## 🔍 Troubleshooting

### CORS Errors

If you see CORS errors:

1. **Check backend `FRONTEND_URL`** - must match your frontend URL exactly
2. **Check frontend `NEXT_PUBLIC_API_URL`** - must match your backend URL exactly
3. **Redeploy both** after fixing environment variables

### Backend Not Responding

1. Check Vercel deployment logs: **Deployments → Click deployment → View Function Logs**
2. Verify all environment variables are set
3. Check backend health endpoint: `https://your-backend.vercel.app/health`

### Frontend Build Errors

1. Check Vercel build logs
2. Verify `NEXT_PUBLIC_API_URL` is set
3. Ensure all dependencies are in `package.json`

### API 404 Errors

1. Verify `NEXT_PUBLIC_API_URL` in frontend matches backend URL
2. Check backend routes are correct
3. Test backend endpoint directly: `curl https://your-backend.vercel.app/health`

---

## 📝 Quick Reference

### Backend URL
```
https://your-backend-xyz.vercel.app
```

### Frontend URL
```
https://your-frontend-abc.vercel.app
```

### Environment Variable Mapping

**Backend needs:**
- `FRONTEND_URL` = Frontend URL

**Frontend needs:**
- `NEXT_PUBLIC_API_URL` = Backend URL

---

## 🎉 You're Done!

Your PolyCaster app should now be live and fully functional!

- **Frontend**: `https://your-frontend-abc.vercel.app`
- **Backend**: `https://your-backend-xyz.vercel.app`

Both services are connected and ready for production use.

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)

---

## 🔐 Security Notes

1. **Never commit** `.env` files to Git
2. **Use Vercel Environment Variables** for all secrets
3. **Update CORS** after deployment to restrict origins
4. **Use HTTPS** (Vercel provides this automatically)
5. **Rotate API keys** regularly

---

Made with ❤️ by the PolyCaster Team

