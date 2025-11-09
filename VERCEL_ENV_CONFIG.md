# Vercel Environment Variables Configuration

This document lists all environment variables that need to be configured in Vercel for deployment.

## 🎯 Frontend (Next.js) - Public Variables

These variables are exposed to the browser (must start with `NEXT_PUBLIC_`):

### Required
```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
# or if backend is on different platform:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com

NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

### Optional (with defaults)
```bash
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## 🔒 Backend API - Server Variables

These are server-side only (NOT exposed to browser):

### Database (Supabase)
```bash
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### AI Service (OpenAI)
```bash
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

### Email Service (Resend)
```bash
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
```

### Payment & Blockchain
```bash
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
MIN_PAYMENT_AMOUNT=0.2
```

### External APIs
```bash
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
```

### Server Configuration
```bash
PORT=8000
NODE_ENV=production
```

---

## 📋 Complete Vercel Configuration Checklist

### Step 1: Frontend Project Settings

1. Go to your **Frontend Project** in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add these variables:

```
NEXT_PUBLIC_API_URL = https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID = your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET = 0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

### Step 2: Backend API Project Settings

1. Go to your **Backend API Project** in Vercel Dashboard
2. Navigate to **Settings → Environment Variables**
3. Add all backend variables listed above

### Step 3: Environment-Specific Values

For each environment (Production, Preview, Development), set:

- **Production**: Use production API keys and URLs
- **Preview**: Can use same as production or separate test keys
- **Development**: Can use development/test keys

---

## 🚀 Quick Setup Script

You can also set these via Vercel CLI:

```bash
# Frontend variables
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_THIRDWEB_CLIENT_ID production

# Backend variables
vercel env add SUPABASE_URL production
vercel env add SUPABASE_KEY production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add OPENAI_API_KEY production
vercel env add RESEND_API_KEY production
vercel env add THIRDWEB_SECRET_KEY production
# ... etc
```

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain sensitive keys
2. **Use Vercel's environment variables** - They're encrypted and secure
3. **Separate frontend and backend** - Frontend and backend should be separate Vercel projects
4. **Update API URL** - Make sure `NEXT_PUBLIC_API_URL` points to your deployed backend
5. **Test after deployment** - Verify all services work after setting variables

---

## 🔍 Verification

After deployment, check:

1. ✅ Frontend loads without errors
2. ✅ API calls work (check browser console)
3. ✅ Database connections work (check backend logs)
4. ✅ Email service works (test email verification)
5. ✅ Payment processing works (test facilitator)
6. ✅ AI analysis works (test signal generation)

---

## 📝 Example Vercel Dashboard Setup

### Frontend Project
```
Environment Variables:
├── NEXT_PUBLIC_API_URL
├── NEXT_PUBLIC_THIRDWEB_CLIENT_ID
└── NEXT_PUBLIC_SERVER_WALLET
```

### Backend Project
```
Environment Variables:
├── SUPABASE_URL
├── SUPABASE_KEY
├── SUPABASE_SERVICE_KEY
├── OPENAI_API_KEY
├── RESEND_API_KEY
├── THIRDWEB_SECRET_KEY
├── POLYMARKET_API_URL
├── BASE_RPC_URL
├── USDC_CONTRACT_ADDRESS
├── MIN_PAYMENT_AMOUNT
├── PORT
└── NODE_ENV
```

---

## 🆘 Troubleshooting

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend is deployed and accessible
- Check CORS settings in backend

### Database errors
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set
- Check Supabase project is active
- Verify RLS policies allow service role access

### Payment not working
- Check `THIRDWEB_SECRET_KEY` is set
- Verify `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` is set
- Check wallet addresses are correct (`SERVER_WALLET_ADDRESS`)

### Email not sending
- Verify `RESEND_API_KEY` is set
- Check `EMAIL_FROM` domain is verified in Resend
- Verify email verification flow

