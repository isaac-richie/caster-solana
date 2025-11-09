# Deploying Both Backend and Frontend on Vercel

Since your repository has two separate projects (`backend-ts` and `polycasterz`), you need to create **two separate Vercel projects** - one for each.

---

## 🚀 Deployment Strategy

### Option 1: Two Separate Vercel Projects (Recommended)

Create two projects in Vercel:
1. **Backend Project** → Points to `backend-ts/` directory
2. **Frontend Project** → Points to `polycasterz/` directory

### Option 2: Monorepo with Workspaces

Configure Vercel to handle both as a monorepo (more complex, not recommended for this setup)

---

## 📋 Step-by-Step Deployment Guide

### Step 1: Deploy Backend First

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click **"Add New Project"**

2. **Import Repository**
   - Select your GitHub repository: `isaac-richie/casterz`
   - Click **"Import"**

3. **Configure Backend Project**
   - **Project Name**: `polycaster-backend` (or your preferred name)
   - **Root Directory**: Click "Edit" and set to `backend-ts`
   - **Framework Preset**: Select **"Other"**
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty (or `dist` if you want)
   - **Install Command**: `npm install`
   - **Development Command**: `npm run dev`

4. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add all backend variables (see `ENV_VARIABLES_COPY.txt`)
   - Make sure to set environment to **"Production"**

5. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete
   - **Copy the deployment URL** (e.g., `https://polycaster-backend.vercel.app`)

---

### Step 2: Deploy Frontend

1. **Add Another Project**
   - In Vercel Dashboard, click **"Add New Project"** again
   - Select the **same repository**: `isaac-richie/casterz`

2. **Configure Frontend Project**
   - **Project Name**: `polycaster-frontend` (or your preferred name)
   - **Root Directory**: Click "Edit" and set to `polycasterz`
   - **Framework Preset**: **"Next.js"** (auto-detected)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)
   - **Install Command**: `npm install` (auto)

3. **Add Environment Variables**
   - Click **"Environment Variables"**
   - Add frontend variables:
     ```
     NEXT_PUBLIC_API_URL=https://polycaster-backend.vercel.app
     NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
     NEXT_PUBLIC_SERVER_WALLET=0x2983D066D42a79295dFAC0F752EA2FA7940C33dA
     ```
   - **Important**: Replace `https://polycaster-backend.vercel.app` with your actual backend URL from Step 1

4. **Deploy**
   - Click **"Deploy"**
   - Wait for deployment to complete
   - **Copy the deployment URL** (e.g., `https://polycaster-frontend.vercel.app`)

---

### Step 3: Update Backend with Frontend URL

1. **Go back to Backend Project**
   - Open your backend project in Vercel
   - Go to **Settings → Environment Variables**

2. **Update FRONTEND_URL**
   - Find `FRONTEND_URL`
   - Update to your frontend URL: `https://polycaster-frontend.vercel.app`
   - Save

3. **Redeploy Backend**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - This ensures CORS is configured correctly

---

## 🔄 Automatic Deployments

Once set up, both projects will automatically deploy when you push to GitHub:

- **Push to `main` branch** → Both projects auto-deploy
- **Backend changes** → Only backend redeploys
- **Frontend changes** → Only frontend redeploys

---

## 📁 Project Structure in Vercel

```
Vercel Dashboard
├── polycaster-backend (Project 1)
│   ├── Root: backend-ts/
│   ├── Framework: Other
│   ├── URL: https://polycaster-backend.vercel.app
│   └── Env Vars: Backend variables
│
└── polycaster-frontend (Project 2)
    ├── Root: polycasterz/
    ├── Framework: Next.js
    ├── URL: https://polycaster-frontend.vercel.app
    └── Env Vars: Frontend variables
```

---

## ⚙️ Vercel Configuration Files

### Backend: `backend-ts/vercel.json` ✅ (Already created)

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

### Frontend: `polycasterz/vercel.json` (Optional - Next.js auto-detects)

Next.js is automatically detected, but you can create this for custom settings:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

---

## 🔗 Connecting Frontend to Backend

After both are deployed:

1. **Backend URL**: `https://polycaster-backend.vercel.app`
2. **Frontend URL**: `https://polycaster-frontend.vercel.app`

3. **Update Frontend Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://polycaster-backend.vercel.app
   ```

4. **Update Backend Environment Variable**:
   ```
   FRONTEND_URL=https://polycaster-frontend.vercel.app
   ```

5. **Redeploy both** to pick up the new URLs

---

## 🎯 Quick Deployment Checklist

### Backend Deployment
- [ ] Create new Vercel project
- [ ] Set root directory to `backend-ts`
- [ ] Set framework to "Other"
- [ ] Add all backend environment variables
- [ ] Deploy and copy URL

### Frontend Deployment
- [ ] Create new Vercel project
- [ ] Set root directory to `polycasterz`
- [ ] Framework auto-detected as Next.js
- [ ] Add frontend environment variables
- [ ] Set `NEXT_PUBLIC_API_URL` to backend URL
- [ ] Deploy and copy URL

### Final Configuration
- [ ] Update `FRONTEND_URL` in backend with frontend URL
- [ ] Redeploy backend
- [ ] Test both deployments
- [ ] Verify CORS works
- [ ] Test API calls from frontend

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
- **Solution**: Make sure root directory is set correctly (`backend-ts` or `polycasterz`)

### Issue: Frontend can't connect to backend
- **Solution**: 
  1. Verify `NEXT_PUBLIC_API_URL` is set correctly
  2. Check backend CORS settings
  3. Verify backend is deployed and accessible

### Issue: Environment variables not working
- **Solution**:
  1. Make sure variables are set for "Production" environment
  2. Redeploy after adding variables
  3. Check variable names match exactly (case-sensitive)

### Issue: Build fails
- **Solution**:
  1. Check build logs in Vercel
  2. Verify `package.json` has correct build scripts
  3. Check for TypeScript errors locally first

---

## 📝 Alternative: Using Vercel CLI

You can also deploy using Vercel CLI:

```bash
# Deploy backend
cd backend-ts
vercel --prod

# Deploy frontend
cd ../polycasterz
vercel --prod
```

But the dashboard method is easier for first-time setup.

---

## ✅ Summary

1. **Two separate Vercel projects** (one for each directory)
2. **Deploy backend first** → Get backend URL
3. **Deploy frontend** → Use backend URL in `NEXT_PUBLIC_API_URL`
4. **Update backend** → Add frontend URL to `FRONTEND_URL`
5. **Redeploy both** → Everything connected!

Both projects will auto-deploy on every GitHub push! 🚀

