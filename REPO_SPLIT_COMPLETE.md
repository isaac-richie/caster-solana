# Repository Split Complete ✅

Successfully split the monorepo into two separate repositories for easier deployment!

---

## 📦 New Repository Structure

### Frontend Repository
- **URL**: https://github.com/isaac-richie/cater-frontend.git
- **Contents**: All frontend code from `polycasterz/`
- **Status**: ✅ Pushed to GitHub
- **Deploy on**: Vercel (recommended)

### Backend Repository
- **URL**: https://github.com/isaac-richie/caster-backend.git
- **Contents**: All backend code from `backend-ts/`
- **Status**: ✅ Pushed to GitHub
- **Deploy on**: Render (recommended) or Vercel

---

## 🚀 Deployment Instructions

### Deploy Backend (Render)

1. Go to [render.com](https://render.com)
2. **New → Web Service**
3. **Connect Repository**: `isaac-richie/caster-backend`
4. **Configure**:
   - Root Directory: (leave empty - repo root is backend)
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. **Add Environment Variables** (see `ENV_VARIABLES_COPY.txt`)
6. **Deploy** → Copy URL

### Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. **New Project**
3. **Import Repository**: `isaac-richie/cater-frontend`
4. **Configure**:
   - Root Directory: (leave empty - repo root is frontend)
   - Framework: Next.js (auto-detected)
5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
   NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
   ```
6. **Deploy** → Copy URL

---

## 🔄 Future Updates

### To Update Frontend:
```bash
cd /Users/0xhardhat/PolyCaster/polycasterz
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Then push to frontend repo
cd /tmp/polycaster-split/frontend-repo
git pull  # or copy changes manually
git push origin main
```

### To Update Backend:
```bash
cd /Users/0xhardhat/PolyCaster/backend-ts
# Make changes
git add .
git commit -m "Update backend"
git push origin main

# Then push to backend repo
cd /tmp/polycaster-split/backend-repo
git pull  # or copy changes manually
git push origin main
```

---

## 📝 Repository Links

- **Frontend**: https://github.com/isaac-richie/cater-frontend
- **Backend**: https://github.com/isaac-richie/caster-backend
- **Main (Development)**: https://github.com/isaac-richie/casterz

---

## ✅ What Was Done

1. ✅ Created separate frontend repository
2. ✅ Created separate backend repository
3. ✅ Copied all relevant files
4. ✅ Added appropriate `.gitignore` files
5. ✅ Added README files
6. ✅ Pushed both to GitHub
7. ✅ Both repositories are ready for deployment

---

## 🎯 Next Steps

1. **Deploy Backend on Render** using `caster-backend` repo
2. **Deploy Frontend on Vercel** using `cater-frontend` repo
3. **Update environment variables** with deployment URLs
4. **Test both deployments**
5. **Set up auto-deploy** (both platforms auto-deploy on push)

---

## 💡 Pro Tips

- Keep the main `casterz` repo for development
- Push to separate repos when ready to deploy
- Both Render and Vercel will auto-deploy on push
- Monitor both deployments separately

---

**Both repositories are now ready for deployment!** 🚀


