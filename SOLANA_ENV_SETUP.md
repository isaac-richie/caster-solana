# Solana Environment Variables Setup

## Issue
"Payment failed: Solana server wallet not configured" error occurs even though the wallet is configured in backend env.

## Root Cause
The frontend needs `NEXT_PUBLIC_SOLANA_SERVER_WALLET` (with `NEXT_PUBLIC_` prefix) to access it in the browser. The backend uses `SOLANA_SERVER_WALLET` (without prefix).

## Solution

### Frontend Environment Variables
Add to `polycasterz/.env`:

```bash
# Solana Configuration (REQUIRED for Solana payments)
NEXT_PUBLIC_SOLANA_SERVER_WALLET=your_solana_wallet_address_here

# Optional: Custom Solana RPC URL (defaults to mainnet if not set)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### Backend Environment Variables
Add to `backend-ts/.env`:

```bash
# Solana Configuration (REQUIRED for Solana payments)
SOLANA_SERVER_WALLET=your_solana_wallet_address_here

# Optional: Solana Facilitator URL (if using PayAI facilitator)
SOLANA_FACILITATOR_URL=https://your-facilitator-url.com
```

## Important Notes

1. **Frontend variables MUST have `NEXT_PUBLIC_` prefix** - This is required by Next.js to expose variables to the browser
2. **Backend variables do NOT have `NEXT_PUBLIC_` prefix** - These are server-side only
3. **Both need to be set** - Frontend needs it for payment transactions, backend needs it for facilitator verification
4. **Same wallet address** - Both should use the same Solana wallet address

## Quick Fix

1. Open `polycasterz/.env` (create if it doesn't exist)
2. Add: `NEXT_PUBLIC_SOLANA_SERVER_WALLET=your_solana_wallet_address`
3. Restart the frontend dev server: `npm run dev`

## Verification

After adding the variable, check the browser console when attempting a Solana payment. You should see:
- `To: your_solana_wallet_address` in the console logs
- No "Solana server wallet not configured" error


