# Vercel Setup Script - Automated Deployment Guide

This guide will help you set up both projects on Vercel using the Vercel CLI.

---

## 🚀 Quick Setup (Using Vercel CLI)

### Prerequisites

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

---

## 📋 Step-by-Step Setup

### Step 1: Deploy Backend

```bash
# Navigate to backend directory
cd backend-ts

# Link to Vercel project (creates new project)
vercel link

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: polycaster-backend
# - Directory: ./backend-ts (or just press enter)
# - Override settings? No

# Add environment variables
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add OPENAI_API_KEY production
vercel env add RESEND_API_KEY production
vercel env add THIRDWEB_SECRET_KEY production
vercel env add FRONTEND_URL production
# ... add all other backend variables

# Deploy to production
vercel --prod
```

### Step 2: Deploy Frontend

```bash
# Navigate to frontend directory
cd ../polycasterz

# Link to Vercel project (creates new project)
vercel link

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: polycaster-frontend
# - Directory: ./polycasterz (or just press enter)
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# (Enter your backend URL when prompted)
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID production
vercel env add NEXT_PUBLIC_SERVER_WALLET production

# Deploy to production
vercel --prod
```

---

## 🎯 Alternative: Manual Dashboard Setup

If you prefer using the Vercel Dashboard (easier for first-time setup):

### Backend Project Setup

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import Git Repository: `isaac-richie/casterz`
3. **Configure Project**:
   - **Project Name**: `polycaster-backend`
   - **Root Directory**: `backend-ts` ⚠️ **CRITICAL**
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build`
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`
4. **Environment Variables**: Add all backend variables
5. Click **Deploy**

### Frontend Project Setup

1. Go to [vercel.com/new](https://vercel.com/new) (in a new tab)
2. Import Git Repository: `isaac-richie/casterz` (same repo)
3. **Configure Project**:
   - **Project Name**: `polycaster-frontend`
   - **Root Directory**: `polycasterz` ⚠️ **CRITICAL**
   - **Framework Preset**: `Next.js` (auto-detected)
   - Build settings auto-configured
4. **Environment Variables**: Add frontend variables
5. Click **Deploy**

---

## 📝 Environment Variables Setup

### For Backend Project

Copy and paste these into Vercel Dashboard → Environment Variables:

```
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MIN_PAYMENT_AMOUNT=0.2
X402_API_KEY=your_x402_api_key
X402_FACILITATOR_URL=https://api.x402.io
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

### For Frontend Project

Copy and paste these into Vercel Dashboard → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

**Important**: Replace `https://your-backend-api.vercel.app` with your actual backend URL after it deploys.

---

## ✅ Post-Deployment Checklist

After both projects are deployed:

1. [ ] Backend deployed successfully
2. [ ] Frontend deployed successfully
3. [ ] Update `NEXT_PUBLIC_API_URL` in frontend with backend URL
4. [ ] Update `FRONTEND_URL` in backend with frontend URL
5. [ ] Redeploy both projects
6. [ ] Test API connection from frontend
7. [ ] Verify CORS is working
8. [ ] Test all features

---

## 🔄 Automatic Deployments

Once configured, both projects will automatically deploy on every push to `main` branch:

- Push to GitHub → Both projects detect changes
- Backend changes → Only backend redeploys
- Frontend changes → Only frontend redeploys
- Both change → Both redeploy

---

## 🆘 Need Help?

If you encounter issues:

1. Check Vercel deployment logs
2. Verify root directories are set correctly
3. Ensure all environment variables are set
4. Check that both projects are linked to the same GitHub repo

