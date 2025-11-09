# Deploying Backend on Render

You can deploy the backend on **Render** (great for Node.js/Express APIs) and keep the frontend on **Vercel** (ideal for Next.js).

---

## 🎯 Deployment Strategy

- **Backend (Express API)**: Deploy on **Render**
- **Frontend (Next.js)**: Deploy on **Vercel**

This hybrid approach gives you:
- ✅ Better backend performance on Render
- ✅ Fast Next.js deployment on Vercel
- ✅ Separate scaling for each service
- ✅ Cost-effective solution

---

## 🚀 Step-by-Step: Deploy Backend on Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up or log in (GitHub login recommended)
3. Connect your GitHub account

### Step 2: Create New Web Service

1. **Click "New +"** in dashboard
2. Select **"Web Service"**
3. **Connect Repository**:
   - Select: `isaac-richie/casterz`
   - Click **"Connect"**

### Step 3: Configure Backend Service

Fill in the configuration:

- **Name**: `polycaster-backend` (or your choice)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend-ts` ⚠️ **IMPORTANT**
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: 
  - **Free**: For testing (spins down after inactivity)
  - **Starter ($7/month)**: Always-on, better for production
  - **Standard ($25/month)**: Auto-scaling, recommended for production

### Step 4: Add Environment Variables

Click **"Environment"** tab and add all backend variables:

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
PORT=10000
NODE_ENV=production
```

**Important Notes**:
- Render sets `PORT` automatically, but you can override it
- `FRONTEND_URL` should be your Vercel frontend URL (set after frontend deploys)

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Build the project
   - Start the service
3. Wait for deployment (usually 2-5 minutes)
4. **Copy the service URL** (e.g., `https://polycaster-backend.onrender.com`)

---

## 🔧 Render Configuration File (Optional)

You can create `render.yaml` in the root for infrastructure as code:

```yaml
services:
  - type: web
    name: polycaster-backend
    env: node
    buildCommand: cd backend-ts && npm install && npm run build
    startCommand: cd backend-ts && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      # Add other environment variables in Render dashboard
```

---

## 🔗 Connect Frontend (Vercel) to Backend (Render)

### Step 1: Deploy Frontend on Vercel

Follow the Vercel deployment guide, but use your **Render backend URL**:

```
NEXT_PUBLIC_API_URL=https://polycaster-backend.onrender.com
```

### Step 2: Update Backend CORS

After frontend deploys, update `FRONTEND_URL` in Render:

1. Go to Render dashboard → Your backend service
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your Vercel frontend URL
4. Click **"Save Changes"**
5. Service will auto-redeploy

---

## ⚙️ Render-Specific Configuration

### Health Check Endpoint

Render automatically checks `/health` endpoint. Your backend already has this:

```
GET /health
```

### Auto-Deploy

- **Auto-Deploy**: Enabled by default
- **Branch**: `main` (or your default branch)
- **Deploys on**: Every push to `main`

### Custom Domain (Optional)

1. Go to **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records as instructed

---

## 💰 Render Pricing

### Free Tier
- ✅ 750 hours/month
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold starts can be slow (30-60 seconds)
- ✅ Good for development/testing

### Starter Plan ($7/month)
- ✅ Always-on (no spin-down)
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ Good for production

### Standard Plan ($25/month)
- ✅ Auto-scaling
- ✅ 2 GB RAM
- ✅ 1 CPU
- ✅ Better performance

**Recommendation**: Start with **Starter** plan for production.

---

## 🔄 Deployment Workflow

```
GitHub Push → Render detects changes → Auto-deploys backend
           → Vercel detects changes → Auto-deploys frontend
```

Both services deploy independently!

---

## 📋 Environment Variables for Render

Copy these into Render → Environment tab:

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

**Note**: `PORT` is automatically set by Render, but you can override it if needed.

---

## 🐛 Troubleshooting

### Issue: Build fails
- **Solution**: Check build logs in Render dashboard
- Verify `package.json` has correct build script
- Ensure TypeScript compiles successfully

### Issue: Service won't start
- **Solution**: Check start command is `npm start`
- Verify `dist/index.js` exists after build
- Check logs for runtime errors

### Issue: Slow cold starts (Free tier)
- **Solution**: Upgrade to Starter plan ($7/month) for always-on

### Issue: CORS errors
- **Solution**: 
  1. Verify `FRONTEND_URL` is set correctly
  2. Check backend CORS configuration
  3. Ensure frontend URL matches exactly

---

## ✅ Deployment Checklist

### Render Backend
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Set root directory to `backend-ts`
- [ ] Configure build and start commands
- [ ] Add all environment variables
- [ ] Deploy and copy URL

### Vercel Frontend
- [ ] Create Vercel project
- [ ] Set root directory to `polycasterz`
- [ ] Add environment variables
- [ ] Set `NEXT_PUBLIC_API_URL` to Render backend URL
- [ ] Deploy

### Final Configuration
- [ ] Update `FRONTEND_URL` in Render with Vercel frontend URL
- [ ] Redeploy backend
- [ ] Test API connection
- [ ] Verify CORS works

---

## 🎯 Summary

**Backend on Render**:
- ✅ Better for long-running processes
- ✅ Always-on option (Starter plan)
- ✅ Good for Express/Node.js APIs
- ✅ Auto-deploy on Git push

**Frontend on Vercel**:
- ✅ Optimized for Next.js
- ✅ Fast global CDN
- ✅ Automatic optimizations
- ✅ Free tier is generous

**Hybrid Approach**: Best of both worlds! 🚀

