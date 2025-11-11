'use client'

import { useMemo, ReactNode, useEffect } from 'react'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Component to track wallet state changes
function WalletStateTracker() {
  const { 
    publicKey, 
    connected, 
    connecting, 
    wallet,
    wallets
  } = useWallet()

  useEffect(() => {
    console.log('🔍 Wallet State Changed:', {
      connected,
      connecting,
      publicKey: publicKey?.toString(),
      walletName: wallet?.adapter?.name,
      availableWallets: wallets.map(w => ({
        name: w.adapter.name,
        readyState: w.readyState,
        installed: w.readyState === 'Installed'
      }))
    })
  }, [connected, connecting, publicKey, wallet, wallets])

  // Track when wallet is selected and auto-connect if needed
  useEffect(() => {
    if (wallet?.adapter && !connected && !connecting) {
      console.log('🎯 Wallet Selected:', {
        walletName: wallet.adapter.name,
        connected,
        connecting,
        publicKey: publicKey?.toString()
      })
      
      // If wallet is selected but not connected, and we're not already connecting,
      // it might mean the modal closed without connecting
      // We'll let the user manually trigger connection via the button
    }
  }, [wallet, connected, connecting, publicKey])

  // Track connection attempts
  useEffect(() => {
    if (connecting) {
      console.log('🔄 Connection Attempt Started:', {
        walletName: wallet?.adapter?.name,
        timestamp: new Date().toISOString()
      })
    }
  }, [connecting, wallet])

  // Track successful connections
  useEffect(() => {
    if (connected && publicKey) {
      console.log('✅ Wallet Connected Successfully:', {
        walletName: wallet?.adapter?.name,
        publicKey: publicKey.toString(),
        timestamp: new Date().toISOString()
      })
    }
  }, [connected, publicKey, wallet])

  // Track Phantom detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const phantom = (window as unknown as Record<string, unknown> & { 
        phantom?: { 
          solana?: {
            isConnected?: boolean
            publicKey?: { toString: () => string }
            isPhantom?: boolean
          }
        } 
      }).phantom?.solana
      console.log('👻 Phantom Detection:', {
        detected: !!phantom,
        isConnected: phantom?.isConnected,
        publicKey: phantom?.publicKey?.toString(),
        isPhantom: phantom?.isPhantom
      })
    }
  }, [])

  // Note: We removed the adapter modification code as it violates React hooks immutability rules
  // The wallet adapter's connect method should not be modified directly

  // Monitor for connection state changes that might indicate auto-connect
  useEffect(() => {
    if (connected && !connecting && publicKey) {
      console.log('🚨 Potential Auto-Connect Detected:', {
        walletName: wallet?.adapter?.name,
        publicKey: publicKey.toString(),
        timestamp: new Date().toISOString(),
        note: 'Connection happened without visible connection attempt'
      })
    }
  }, [connected, connecting, publicKey, wallet])

  return null
}

interface SolanaWalletProviderProps {
  children: ReactNode
}

export function SolanaWalletProvider({ children }: SolanaWalletProviderProps) {
  // Get RPC endpoint from environment or use default
  const endpoint = useMemo(() => {
    // If custom RPC URL is provided, use it
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL
    }
    
    // Fallback to public endpoint (use Helius or QuickNode for production)
    return 'https://api.mainnet-beta.solana.com'
  }, [])

  // Configure supported Solana wallets
  // PhantomWalletAdapter automatically detects if Phantom extension is installed
  // We always add it - the adapter handles detection internally
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )

  useEffect(() => {
    console.log('🔧 SolanaWalletProvider initialized:', {
      endpoint,
      wallets: wallets.map(w => w.name || w.constructor.name),
      autoConnect: false
    })
  }, [endpoint, wallets])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => {
          console.error('❌ Wallet adapter error:', error)
        }}
      >
        <WalletModalProvider>
          <WalletStateTracker />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
