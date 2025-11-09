# Backend Environment Variables for Vercel Deployment

## 🔒 BACKEND API - Server Variables Only

These are **server-side only** (NOT exposed to browser). Add these to your **Backend Project** in Vercel.

---

## 📋 Complete List (17 variables)

### Database (Supabase) - REQUIRED
```bash
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### AI Service (OpenAI) - REQUIRED
```bash
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

### Email Service (Resend) - REQUIRED
```bash
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
```

### Payment & Blockchain (Base Sepolia) - REQUIRED
```bash
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
PAYMENT_RECIPIENT_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MIN_PAYMENT_AMOUNT=0.2
```

### External APIs - OPTIONAL (has defaults)
```bash
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
```

### Server Configuration - REQUIRED
```bash
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

---

## 📝 Copy-Paste Format (One Block)

```bash
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
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

---

## ⚠️ Critical Variables (Must Set)

These **MUST** be set or the backend won't work:

1. ✅ `SUPABASE_URL` - Your Supabase project URL
2. ✅ `SUPABASE_SERVICE_KEY`` - Supabase service role key (for admin operations)
3. ✅ `OPENAI_API_KEY` - Your OpenAI API key
4. ✅ `RESEND_API_KEY` - Your Resend API key (for emails)
5. ✅ `THIRDWEB_SECRET_KEY` - Your Thirdweb secret key
6. ✅ `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` - Your Thirdweb client ID
7. ✅ `FRONTEND_URL` - Your frontend Vercel URL (set after frontend deploys)

---

## 🔄 Deployment Workflow

### Step 1: Initial Backend Deployment
1. Set all variables **except** `FRONTEND_URL` (use placeholder: `https://your-frontend.vercel.app`)
2. Deploy backend
3. Copy backend URL (e.g., `https://polycaster-backend.vercel.app`)

### Step 2: After Frontend Deploys
1. Deploy frontend (use backend URL in `NEXT_PUBLIC_API_URL`)
2. Copy frontend URL (e.g., `https://polycaster-frontend.vercel.app`)
3. Update `FRONTEND_URL` in backend environment variables
4. Redeploy backend

---

## 📊 Variable Descriptions

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SUPABASE_URL` | Supabase project URL | ✅ Yes | `https://jejfuksuzmsvqmgweopi.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/public key | ✅ Yes | - |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | ✅ Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | ✅ Yes | - |
| `OPENAI_MODEL` | OpenAI model to use | ⚠️ Optional | `gpt-4o-mini` |
| `RESEND_API_KEY` | Resend API key | ✅ Yes | - |
| `EMAIL_FROM` | Email sender address | ⚠️ Optional | `onboarding@resend.dev` |
| `EMAIL_FROM_NAME` | Email sender name | ⚠️ Optional | `PolyCaster` |
| `THIRDWEB_SECRET_KEY` | Thirdweb secret key | ✅ Yes | - |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID | ✅ Yes | - |
| `SERVER_WALLET_ADDRESS` | Server wallet for payments | ⚠️ Optional | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `PAYMENT_RECIPIENT_WALLET` | Payment recipient wallet | ⚠️ Optional | Same as `SERVER_WALLET_ADDRESS` |
| `BASE_RPC_URL` | Base Sepolia RPC endpoint | ⚠️ Optional | `https://sepolia.base.org` |
| `USDC_CONTRACT_ADDRESS` | USDC on Base Sepolia | ⚠️ Optional | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| `MIN_PAYMENT_AMOUNT` | Minimum payment amount | ⚠️ Optional | `0.2` |
| `POLYMARKET_API_URL` | Polymarket API endpoint | ⚠️ Optional | `https://gamma-api.polymarket.com/markets` |
| `FRONTEND_URL` | Frontend URL for CORS/emails | ✅ Yes | - |
| `PORT` | Server port | ⚠️ Optional | `8000` (Vercel sets automatically) |
| `NODE_ENV` | Environment mode | ⚠️ Optional | `production` |

---

## ✅ Quick Checklist

- [ ] SUPABASE_URL
- [ ] SUPABASE_KEY
- [ ] SUPABASE_SERVICE_KEY
- [ ] OPENAI_API_KEY
- [ ] OPENAI_MODEL
- [ ] RESEND_API_KEY
- [ ] EMAIL_FROM
- [ ] EMAIL_FROM_NAME
- [ ] THIRDWEB_SECRET_KEY
- [ ] NEXT_PUBLIC_THIRDWEB_CLIENT_ID
- [ ] SERVER_WALLET_ADDRESS
- [ ] PAYMENT_RECIPIENT_WALLET
- [ ] BASE_RPC_URL
- [ ] USDC_CONTRACT_ADDRESS
- [ ] MIN_PAYMENT_AMOUNT
- [ ] POLYMARKET_API_URL
- [ ] FRONTEND_URL (set after frontend deploys)
- [ ] PORT (optional)
- [ ] NODE_ENV (optional)

---

## 🎯 Where to Add in Vercel

1. Go to your **Backend Project** in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Click **Add New**
4. Paste each variable (or use bulk import if available)
5. Set environment to **"Production"**
6. Click **Save**

---

## 🔍 Testing After Deployment

After setting all variables and deploying, test:

1. **Health Check**: `https://your-backend.vercel.app/health`
2. **Markets**: `https://your-backend.vercel.app/markets`
3. **Check logs** in Vercel dashboard for any errors

