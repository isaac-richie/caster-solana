import { createWallet } from 'thirdweb/wallets'
import { client } from '@/app/client'

// Configure supported wallets
export const wallets = [
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
  createWallet('com.trustwallet.app'),
]

// Default wallet (MetaMask)
export const defaultWallet = createWallet('io.metamask')

// Export the client
export { client }
