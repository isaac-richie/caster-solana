# 🚀 Quick Deployment Checklist

## Deployment Order: Backend → Frontend → Update Backend

---

## ✅ Step 1: Deploy Backend

1. **Vercel Dashboard** → Add New Project
2. **Import**: `https://github.com/isaac-richie/caster-solana.git`
3. **Root Directory**: `backend-ts`
4. **Environment Variables**: Add all backend env vars
   - ⚠️ Set `FRONTEND_URL` to placeholder: `https://your-frontend.vercel.app`
5. **Deploy** → Get backend URL: `https://your-backend-xyz.vercel.app`
6. **Test**: `curl https://your-backend-xyz.vercel.app/health`

---

## ✅ Step 2: Deploy Frontend

1. **Vercel Dashboard** → Add New Project (separate project)
2. **Import**: Same repo: `https://github.com/isaac-richie/caster-solana.git`
3. **Root Directory**: `polycasterz`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-xyz.vercel.app` (from Step 1)
   - `NEXT_PUBLIC_SOLANA_RPC_URL` = your Solana RPC
   - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` = your Thirdweb ID
5. **Deploy** → Get frontend URL: `https://your-frontend-abc.vercel.app`

---

## ✅ Step 3: Update Backend CORS

1. **Backend Vercel Project** → Settings → Environment Variables
2. **Update** `FRONTEND_URL` = `https://your-frontend-abc.vercel.app` (from Step 2)
3. **Redeploy** backend

---

## 🔗 Connection Flow

```
Frontend (polycasterz)
    ↓
NEXT_PUBLIC_API_URL = https://your-backend.vercel.app
    ↓
Backend (backend-ts)
    ↓
FRONTEND_URL = https://your-frontend.vercel.app (for CORS)
```

---

## 📋 Critical Environment Variables

### Backend (`backend-ts`)
```env
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=...
OPENAI_API_KEY=...
# ... all other backend vars
```

### Frontend (`polycasterz`)
```env
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_SOLANA_RPC_URL=...
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=...
```

---

## 🧪 Verification

1. ✅ Backend health: `curl https://your-backend.vercel.app/health`
2. ✅ Frontend loads: Open `https://your-frontend.vercel.app`
3. ✅ API connection: Check browser console for API requests
4. ✅ Full flow: Connect wallet → Search → Analyze

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `FRONTEND_URL` in backend and redeploy |
| 404 on API calls | Verify `NEXT_PUBLIC_API_URL` matches backend URL |
| Build fails | Check all environment variables are set |
| Backend not responding | Check Vercel function logs |

---

**See `DEPLOYMENT_GUIDE.md` for detailed instructions.**

