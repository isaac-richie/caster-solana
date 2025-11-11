# 🔧 Solana RPC Setup Guide

## **Problem: 403 Access Forbidden Error**

The error `failed to get recent blockhash: Error: 403 : {"jsonrpc":"2.0","error":{"code": 403, "message":"Access forbidden"}}` occurs when:

1. **Public RPC endpoints are rate-limited** - The default Solana public RPC has strict rate limits
2. **RPC endpoint is blocking requests** - Some endpoints require authentication or have IP restrictions
3. **Network congestion** - High traffic can cause endpoints to reject requests

---

## **Solution: Use a Reliable RPC Provider**

### **Option 1: Helius (Recommended - Free Tier Available)** ✅

1. **Sign up**: https://www.helius.dev/
2. **Get API key**: Free tier includes 100,000 requests/month
3. **Add to `.env`**:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
   ```

**Benefits**:
- ✅ Free tier available
- ✅ High reliability
- ✅ Good performance
- ✅ No rate limiting on free tier (within limits)

---

### **Option 2: QuickNode (Free Tier Available)** ✅

1. **Sign up**: https://www.quicknode.com/
2. **Create Solana endpoint**: Select "Solana Mainnet"
3. **Get HTTP endpoint URL**
4. **Add to `.env`**:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=https://YOUR_ENDPOINT_NAME.solana-mainnet.quiknode.pro/YOUR_API_KEY/
   ```

**Benefits**:
- ✅ Free tier available
- ✅ High reliability
- ✅ Good performance
- ✅ Easy setup

---

### **Option 3: Alchemy (Free Tier Available)** ✅

1. **Sign up**: https://www.alchemy.com/
2. **Create Solana app**: Select "Solana Mainnet"
3. **Get HTTP endpoint URL**
4. **Add to `.env`**:
   ```bash
   NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   ```

**Benefits**:
- ✅ Free tier available
- ✅ High reliability
- ✅ Good performance

---

### **Option 4: Public Endpoints (Not Recommended for Production)** ⚠️

**Current default**: `https://api.mainnet-beta.solana.com`

**Issues**:
- ❌ Rate limited
- ❌ Can return 403 errors
- ❌ Unreliable under load
- ❌ Not suitable for production

**Only use for testing/development!**

---

## **Setup Instructions**

### **Step 1: Get RPC Endpoint**

Choose one of the providers above and get your RPC endpoint URL.

### **Step 2: Add to `.env` File**

Add the RPC URL to `polycasterz/.env`:

```bash
# Solana RPC Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

### **Step 3: Restart Dev Server**

**Important**: Next.js requires a restart to load new environment variables!

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd polycasterz
npm run dev
```

### **Step 4: Verify**

1. Open browser console
2. Connect Solana wallet
3. Try making a payment
4. Check console logs for RPC endpoint being used

---

## **Code Changes Made**

### **1. Updated `SolanaWalletProvider.tsx`**

- ✅ Added fallback to more reliable public endpoint
- ✅ Better error handling for RPC issues
- ✅ Clear instructions in code comments

### **2. Updated `Facilitator.tsx`**

- ✅ Added retry logic for `getLatestBlockhash()`
- ✅ Better error messages for 403 errors
- ✅ Instructions to configure RPC endpoint

---

## **Testing**

After setting up your RPC endpoint:

1. ✅ Restart the dev server
2. ✅ Connect a Solana wallet (Phantom or Solflare)
3. ✅ Try making a payment
4. ✅ Check browser console for any errors
5. ✅ Verify transaction goes through

---

## **Production Deployment**

For production (Vercel), add the environment variable:

1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - **Name**: `NEXT_PUBLIC_SOLANA_RPC_URL`
   - **Value**: Your RPC endpoint URL (e.g., Helius, QuickNode)
4. Redeploy

---

## **Troubleshooting**

### **Still Getting 403 Errors?**

1. ✅ Verify `NEXT_PUBLIC_SOLANA_RPC_URL` is set correctly
2. ✅ Restart the dev server after adding the variable
3. ✅ Check that your RPC provider API key is valid
4. ✅ Verify you're not exceeding rate limits
5. ✅ Try a different RPC provider

### **Connection Timeout?**

1. ✅ Check your internet connection
2. ✅ Verify the RPC endpoint URL is correct
3. ✅ Try a different RPC provider
4. ✅ Check RPC provider status page

### **Transaction Still Fails?**

1. ✅ Check Solana wallet has sufficient USDC balance
2. ✅ Verify server wallet address is correct
3. ✅ Check browser console for detailed error messages
4. ✅ Ensure RPC endpoint supports the operations needed

---

## **Recommended Setup**

**For Development**:
- Use Helius free tier (100k requests/month)

**For Production**:
- Use Helius paid tier OR
- Use QuickNode paid tier OR
- Use Alchemy paid tier

**All three providers offer reliable, fast RPC endpoints suitable for production use.**

---

## **Summary**

✅ **Problem**: Public Solana RPC endpoints are rate-limited and return 403 errors

✅ **Solution**: Use a reliable RPC provider (Helius, QuickNode, or Alchemy)

✅ **Action**: Add `NEXT_PUBLIC_SOLANA_RPC_URL` to `.env` and restart the dev server

✅ **Result**: Solana payments will work reliably without 403 errors


