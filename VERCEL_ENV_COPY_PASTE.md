# Environment Variables - Copy & Paste for Vercel

## 🎯 FRONTEND PROJECT (Next.js)

Copy these into **Frontend Project** → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

---

## 🔒 BACKEND PROJECT (Express API)

Copy these into **Backend Project** → Settings → Environment Variables:

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
BASE_RPC_URL=https://mainnet.base.org
USDC_CONTRACT_ADDRESS=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
MIN_PAYMENT_AMOUNT=0.2
X402_API_KEY=your_x402_api_key
X402_FACILITATOR_URL=https://api.x402.io
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

---

## 📋 Variable Descriptions

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (set after backend deploys) | `https://polycaster-api.vercel.app` |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID for wallet connection | `your_client_id_here` |
| `NEXT_PUBLIC_SERVER_WALLET` | Server wallet address for payments | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://jejfuksuzmsvqmgweopi.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (admin) | `eyJhbGciOiJIUzI1NiIs...` |
| `OPENAI_API_KEY` | OpenAI API key for AI analysis | `sk-proj-...` |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` |
| `RESEND_API_KEY` | Resend API key for emails | `re_...` |
| `EMAIL_FROM` | Email sender address | `onboarding@resend.dev` |
| `EMAIL_FROM_NAME` | Email sender name | `PolyCaster` |
| `THIRDWEB_SECRET_KEY` | Thirdweb secret key | `your_secret_key` |
| `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` | Thirdweb client ID | `your_client_id` |
| `SERVER_WALLET_ADDRESS` | Server wallet for receiving payments | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `PAYMENT_RECIPIENT_WALLET` | Payment recipient wallet | `0x2983D066D42a79295dFAC0F752EA2FA7940C33dA` |
| `BASE_RPC_URL` | Base chain RPC endpoint | `https://mainnet.base.org` |
| `USDC_CONTRACT_ADDRESS` | USDC token contract | `0x833589fcd6edb6e08f4c7c32d4f71b54bda02913` |
| `MIN_PAYMENT_AMOUNT` | Minimum payment amount | `0.2` |
| `X402_API_KEY` | X402 facilitator API key | `your_x402_key` |
| `X402_FACILITATOR_URL` | X402 facilitator URL | `https://api.x402.io` |
| `POLYMARKET_API_URL` | Polymarket API endpoint | `https://gamma-api.polymarket.com/markets` |
| `FRONTEND_URL` | Frontend URL for CORS/emails | `https://your-frontend.vercel.app` |
| `PORT` | Server port | `8000` |
| `NODE_ENV` | Environment mode | `production` |

---

## ⚠️ Important Notes

1. **Replace placeholders** like `your_thirdweb_client_id` with actual values
2. **Set `FRONTEND_URL`** to your actual frontend Vercel URL
3. **Set `NEXT_PUBLIC_API_URL`** to your actual backend Vercel URL (after deployment)
4. **All API keys** must be replaced with real values from your service providers
5. **Set environment** to "Production" when adding variables in Vercel

---

## 🚀 Quick Setup Steps

1. **Deploy Backend First**
   - Copy all backend variables
   - Paste into Backend Project → Environment Variables
   - Deploy

2. **Get Backend URL**
   - After backend deploys, copy the Vercel URL
   - Example: `https://polycaster-api.vercel.app`

3. **Deploy Frontend**
   - Copy frontend variables
   - Replace `https://your-backend-api.vercel.app` with actual backend URL
   - Paste into Frontend Project → Environment Variables
   - Deploy

4. **Update FRONTEND_URL**
   - After frontend deploys, copy the frontend URL
   - Update `FRONTEND_URL` in backend variables
   - Redeploy backend

---

## 📝 One-Line Copy Format

### Frontend (3 variables):
```
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
```

### Backend (18 variables):
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
BASE_RPC_URL=https://mainnet.base.org
USDC_CONTRACT_ADDRESS=0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
MIN_PAYMENT_AMOUNT=0.2
X402_API_KEY=your_x402_api_key
X402_FACILITATOR_URL=https://api.x402.io
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
FRONTEND_URL=https://your-frontend.vercel.app
PORT=8000
NODE_ENV=production
```

