# Vercel Deployment Guide

## 📦 Project Structure

You have **two separate projects** to deploy:

1. **Frontend (Next.js)**: `polycasterz/`
2. **Backend API (Express)**: `backend-ts/`

---

## 🚀 Deployment Steps

### 1. Deploy Backend API First

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `backend-ts`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (or leave empty if using `vercel.json`)
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`

5. Add **Environment Variables** (see below)

6. Deploy!

### 2. Deploy Frontend

1. Add another project in Vercel
2. Configure:
   - **Root Directory**: `polycasterz`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)
   - **Install Command**: `npm install`

3. Add **Environment Variables** (see below)
4. **Important**: Set `NEXT_PUBLIC_API_URL` to your backend URL

5. Deploy!

---

## 🔐 Environment Variables

### Backend API Environment Variables

Add these in **Vercel → Settings → Environment Variables** for your backend project:

```bash
# Database
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# AI Service
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Email Service
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster

# Payment & Blockchain
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BASE_RPC_URL=https://mainnet.base.org
USDC_CONTRACT_ADDRESS=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
MIN_PAYMENT_AMOUNT=0.2

# Thirdweb Facilitator (X402)
X402_API_KEY=your_x402_api_key
X402_FACILITATOR_URL=https://api.x402.io

# External APIs
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets

# Server Config
PORT=8000
NODE_ENV=production
```

### Frontend Environment Variables

Add these for your **frontend project**:

```bash
# API Connection
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
# ⚠️ IMPORTANT: Update this to your actual backend URL after deployment

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id

# Optional
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## ⚙️ Vercel Configuration Files

### Backend: `backend-ts/vercel.json`

Create this file if it doesn't exist:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Frontend: `polycasterz/vercel.json` (Optional)

Next.js auto-detects, but you can customize:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## 🔄 Deployment Workflow

1. **Push to GitHub** (main branch)
2. **Vercel auto-deploys** (if connected)
3. **Update `NEXT_PUBLIC_API_URL`** in frontend with backend URL
4. **Redeploy frontend** to pick up new API URL
5. **Test all features**

---

## ✅ Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend loads correctly
- [ ] `NEXT_PUBLIC_API_URL` points to backend
- [ ] Database connections work
- [ ] Email service works
- [ ] Payment processing works
- [ ] AI analysis works
- [ ] Alerts system works
- [ ] CORS is configured correctly

---

## 🐛 Common Issues

### Backend not accessible
- Check Vercel deployment logs
- Verify build succeeded
- Check environment variables are set

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS settings
- Verify backend is deployed and running

### CORS errors
- Add frontend URL to backend CORS whitelist
- Check `cors()` middleware in `backend-ts/src/index.ts`

### Environment variables not working
- Make sure variables are set for correct environment (Production/Preview)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

---

## 📝 Quick Reference

### Backend URL Format
```
https://your-backend-project.vercel.app
```

### Frontend URL Format
```
https://your-frontend-project.vercel.app
```

### Update API URL
After backend deploys, copy the URL and set:
```
NEXT_PUBLIC_API_URL=https://your-backend-project.vercel.app
```

Then redeploy frontend.

---

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel CLI](https://vercel.com/docs/cli)

