# Production Readiness Check

## ✅ What Will Work in Production

### 1. External API Calls
- ✅ **Polymarket API**: Uses production URL `https://gamma-api.polymarket.com/markets`
- ✅ **OpenAI API**: Uses environment variable (configured)
- ✅ **Supabase**: Uses environment variable (configured)
- ✅ **Base RPC**: Uses Base Sepolia testnet URL `https://sepolia.base.org`
- ✅ **Resend Email**: Uses environment variable (configured)

### 2. Data Fetching
- ✅ All services use environment variables with production fallbacks
- ✅ No hardcoded localhost URLs in API calls
- ✅ External services are production-ready

### 3. Database
- ✅ Supabase connection uses production URL
- ✅ All database operations will work in production

---

## ⚠️ Issues to Fix for Production

### 1. CORS Configuration (CRITICAL)

**Current**: 
```typescript
app.use(cors()) // Allows ALL origins
```

**Problem**: This is insecure and allows any website to call your API.

**Fix**: Restrict to your frontend domain:
```typescript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  'http://localhost:3000', // For local development
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

### 2. FRONTEND_URL Fallback

**Current**:
```typescript
const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
```

**Problem**: Email links will point to localhost in production if FRONTEND_URL is not set.

**Fix**: Set `FRONTEND_URL` environment variable in Vercel to your production frontend URL.

### 3. Console Log Messages

**Current**: Console logs reference `localhost`:
```typescript
console.log(`📊 Health check: http://localhost:${PORT}/health`)
```

**Problem**: Not critical, but misleading in production logs.

**Fix**: Use environment-aware logging or remove localhost references.

---

## 🔧 Required Environment Variables for Production

Make sure these are set in Vercel:

### Backend API
```bash
# Frontend URL (for CORS and email links)
FRONTEND_URL=https://your-frontend.vercel.app

# Database
SUPABASE_URL=https://jejfuksuzmsvqmgweopi.supabase.co
SUPABASE_KEY=your_key
SUPABASE_SERVICE_KEY=your_service_key

# AI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster

# Payment
THIRDWEB_SECRET_KEY=your_key
BASE_RPC_URL=https://sepolia.base.org
USDC_CONTRACT_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
SERVER_WALLET_ADDRESS=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA

# External APIs (optional - have defaults)
POLYMARKET_API_URL=https://gamma-api.polymarket.com/markets
```

---

## ✅ Production Checklist

- [x] External APIs use production URLs
- [x] Environment variables are configured
- [x] Database connection uses production URL
- [ ] **CORS is restricted to frontend domain** ⚠️
- [ ] **FRONTEND_URL is set in Vercel** ⚠️
- [ ] All environment variables are set in Vercel
- [ ] Test API endpoints after deployment
- [ ] Verify CORS works with frontend
- [ ] Test email links point to correct domain

---

## 🚀 Deployment Steps

1. **Set FRONTEND_URL** in Vercel environment variables
2. **Update CORS configuration** (see fix above)
3. **Deploy backend**
4. **Test API endpoints** from frontend
5. **Verify CORS** - frontend should be able to call API
6. **Test email links** - should point to production frontend

---

## 📝 Summary

**Will it work?** 
- ✅ **YES** - API calls and data fetching will work
- ⚠️ **BUT** - CORS needs to be restricted for security
- ⚠️ **AND** - FRONTEND_URL needs to be set for email links

**Action Items:**
1. Fix CORS configuration (security)
2. Set FRONTEND_URL in Vercel
3. Test after deployment

