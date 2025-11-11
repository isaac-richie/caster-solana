import { createWallet, inAppWallet } from 'thirdweb/wallets'
import { client } from '@/app/client'

// Configure supported wallets - EVM only (Thirdweb doesn't support Solana wallets)
// Solana wallets will be handled separately via Solana Wallet Adapter
// IMPORTANT: Phantom wallet is explicitly EXCLUDED - it should only be used via Solana adapter
const allWallets = [
  // In-App Wallet with email login (must be first for better UX)
  inAppWallet({
    auth: {
      options: ['email', 'google', 'apple', 'facebook'], // Email + social logins
    },
  }),
  // EVM Wallets - explicitly excluding Phantom (com.phantom.app)
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.trustwallet.app'),
  // Note: Phantom wallet (com.phantom.app) is NOT included here
  // Phantom supports both EVM and Solana, but for Solana payments,
  // users must connect via the Solana Wallet Adapter (purple button)
]

// Export wallets - Phantom is NOT included in this array
// Thirdweb may auto-detect Phantom, but by only passing this array,
// we limit what's shown. If Phantom still appears, it's due to browser extension detection.
export const wallets = allWallets

// Default wallet (MetaMask)
export const defaultWallet = createWallet('io.metamask')

// Export the client
export { client }
