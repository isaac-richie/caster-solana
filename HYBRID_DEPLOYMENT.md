# Hybrid Deployment: Render (Backend) + Vercel (Frontend)

This guide shows you how to deploy:
- **Backend API** → Render
- **Frontend** → Vercel

---

## 🎯 Why This Setup?

### Render for Backend ✅
- Better for long-running Node.js services
- Always-on option (no cold starts)
- Good for Express APIs
- Alert checker service runs continuously

### Vercel for Frontend ✅
- Optimized for Next.js
- Fast global CDN
- Automatic optimizations
- Great free tier

---

## 📋 Quick Setup Guide

### Part 1: Deploy Backend on Render

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** (GitHub recommended)
3. **New → Web Service**
4. **Connect Repository**: `isaac-richie/casterz`
5. **Configure**:
   - Name: `polycaster-backend`
   - Root Directory: `backend-ts`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Starter ($7/month) or Free
6. **Add Environment Variables** (see below)
7. **Deploy** → Copy URL

### Part 2: Deploy Frontend on Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **New Project**
3. **Import Repository**: `isaac-richie/casterz`
4. **Configure**:
   - Name: `polycaster-frontend`
   - Root Directory: `polycasterz`
   - Framework: Next.js (auto)
5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://polycaster-backend.onrender.com
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
   ```
6. **Deploy** → Copy URL

### Part 3: Connect Them

1. **Update Render Backend**:
   - Go to Render dashboard
   - Environment → Update `FRONTEND_URL` with Vercel frontend URL
   - Save (auto-redeploys)

2. **Done!** Both services are connected

---

## 🔗 URLs After Deployment

- **Backend**: `https://polycaster-backend.onrender.com`
- **Frontend**: `https://polycaster-frontend.vercel.app`

---

## 📝 Environment Variables

### Render (Backend) - 18 variables

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
NODE_ENV=production
```

### Vercel (Frontend) - 3 variables

```
NEXT_PUBLIC_API_URL=https://polycaster-backend.onrender.com
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## ✅ Advantages of This Setup

1. **Backend on Render**:
   - ✅ Always-on (no cold starts)
   - ✅ Better for background services (alert checker)
   - ✅ More reliable for API endpoints
   - ✅ Good pricing for production

2. **Frontend on Vercel**:
   - ✅ Optimized Next.js deployment
   - ✅ Fast global CDN
   - ✅ Automatic optimizations
   - ✅ Great developer experience

3. **Both Auto-Deploy**:
   - ✅ Push to GitHub → Both deploy automatically
   - ✅ Independent scaling
   - ✅ Separate monitoring

---

## 🚀 Deployment Order

1. **Deploy Backend on Render** → Get backend URL
2. **Deploy Frontend on Vercel** → Use backend URL in `NEXT_PUBLIC_API_URL`
3. **Update Backend** → Add frontend URL to `FRONTEND_URL`
4. **Test** → Verify everything works

---

## 💡 Pro Tips

1. **Start with Free tier** on Render to test, then upgrade to Starter
2. **Use custom domains** for production (optional)
3. **Monitor both services** separately
4. **Set up alerts** in both platforms
5. **Use Render's health checks** to monitor backend

---

## 📚 Full Guides

- **Backend on Render**: See `RENDER_BACKEND_DEPLOYMENT.md`
- **Frontend on Vercel**: See `VERCEL_DUAL_DEPLOYMENT.md`
- **Environment Variables**: See `ENV_VARIABLES_COPY.txt`

---

## 🎉 You're All Set!

This hybrid approach gives you the best of both platforms! 🚀

