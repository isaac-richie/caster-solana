# Fixing "Endpoint not found" Error on Vercel

## ✅ Solutions Applied

### Solution 1: Updated Export Format ✓
Changed the export to use a handler variable:
```typescript
const handler = app
module.exports = handler
export default handler
```

### Solution 2: Added Rewrites to vercel.json ✓
Added rewrites section to ensure all routes are properly handled:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/src/index.ts"
  }
]
```

## 🔍 Additional Troubleshooting Steps

### 1. Verify Vercel Project Settings

In Vercel Dashboard → Your Backend Project → Settings → General:

- ✅ **Root Directory**: Must be set to `backend-ts`
- ✅ **Framework Preset**: Should be "Other" (not Next.js)
- ✅ **Build Command**: `npm run build` (or leave empty)
- ✅ **Output Directory**: Leave empty
- ✅ **Install Command**: `npm install`

### 2. Check Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check "Build Logs" tab:
   - Should see: `npm run build` completing successfully
   - Should see: TypeScript compilation succeeding
   - No errors about missing files

### 3. Check Function Logs

1. In the deployment, click "Functions" tab
2. You should see `src/index.ts` listed as a serverless function
3. Click on it to see runtime logs
4. Check for any runtime errors

### 4. Test Endpoints

Try these URLs after deployment:

```bash
# Health check (should return JSON)
https://your-backend.vercel.app/health

# Markets endpoint
https://your-backend.vercel.app/markets

# Root path (should return 404 with "Endpoint not found" message)
https://your-backend.vercel.app/
```

### 5. If Still Not Working - Alternative Solution

If the above doesn't work, try creating an `api` directory structure:

1. Create `backend-ts/api/index.ts`
2. Copy all code from `src/index.ts` to `api/index.ts`
3. Update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

## 🐛 Common Issues

### Issue: "Endpoint not found" for all routes
**Cause**: Routes not matching or handler not exported correctly
**Fix**: Applied Solution 1 & 2 above

### Issue: Build succeeds but endpoints don't work
**Cause**: Root directory not set correctly in Vercel
**Fix**: Set Root Directory to `backend-ts` in project settings

### Issue: Function not found in Vercel
**Cause**: vercel.json not being read or incorrect path
**Fix**: Ensure vercel.json is in the `backend-ts` directory (not root)

### Issue: CORS errors
**Cause**: FRONTEND_URL not set or incorrect
**Fix**: Set FRONTEND_URL environment variable to your frontend URL

## 📝 Next Steps

1. **Commit and push** these changes:
   ```bash
   git add backend-ts/src/index.ts backend-ts/vercel.json
   git commit -m "Fix Vercel serverless function handler export"
   git push
   ```

2. **Redeploy on Vercel**:
   - Vercel should auto-deploy on push
   - Or manually trigger a redeploy

3. **Test the endpoints** after deployment

4. **Check logs** if still having issues

## 🔗 Useful Vercel Documentation

- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Express on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js#using-express)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)


