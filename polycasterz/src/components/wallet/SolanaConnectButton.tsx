'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import { useMemo, useCallback, useEffect } from 'react'

interface SolanaConnectButtonProps {
  className?: string
}

export function SolanaConnectButton({ className }: SolanaConnectButtonProps) {
  const { 
    publicKey, 
    connected, 
    connecting, 
    disconnect,
    wallet,
    connect
  } = useWallet()
  const { setVisible, visible } = useWalletModal()

  // Track modal visibility changes
  useEffect(() => {
    console.log('📱 Wallet Modal Visibility Changed:', {
      visible,
      connected,
      connecting,
      publicKey: publicKey?.toString()
    })
    
    // When modal closes, check if connection happened
    if (!visible && !connected && !connecting) {
      console.log('⚠️ Modal closed without connection:', {
        reason: 'User may have clicked outside, pressed ESC, or clicked a wallet that failed to connect',
        walletSelected: wallet?.adapter?.name,
        timestamp: new Date().toISOString()
      })
      
      // If a wallet is selected but not connected, try to connect
      // This handles the case where the modal closes after wallet selection but before connection
      // Use a ref to prevent duplicate connection attempts
      if (wallet?.adapter && !connected && !connecting) {
        console.log('🔄 Wallet selected but not connected, attempting to connect...', {
          walletName: wallet.adapter.name,
          note: 'This will trigger Phantom approval prompt if site is not trusted'
        })
        // Small delay to ensure modal is fully closed
        const timeoutId = setTimeout(async () => {
          try {
            // Check again before connecting to prevent race conditions
            if (!connected && !connecting) {
              await connect()
              console.log('✅ Connection attempt triggered after modal close')
            }
          } catch (error) {
            console.error('❌ Failed to connect after modal close:', error)
          }
        }, 200)
        
        // Return cleanup to prevent duplicate calls
        return () => clearTimeout(timeoutId)
      }
    }
  }, [visible, connected, connecting, publicKey, wallet, connect])

  // Track wallet connection state changes
  useEffect(() => {
    console.log('🔄 Wallet Connection State:', {
      connected,
      connecting,
      publicKey: publicKey?.toString(),
      timestamp: new Date().toISOString()
    })
  }, [connected, connecting, publicKey])

  const handleClick = useCallback(async () => {
    console.log('🔘 Connect button clicked', {
      connected,
      connecting,
      publicKey: publicKey?.toString(),
      walletState: { connected, connecting, publicKey: publicKey?.toString() }
    })
    
    if (connected) {
      // If connected, disconnect
      console.log('🔌 Disconnecting wallet...')
      try {
        await disconnect()
        console.log('✅ Wallet disconnected successfully')
      } catch (error) {
        console.error('❌ Failed to disconnect wallet:', error)
      }
    } else {
      // Use the standard wallet adapter modal
      // This modal properly handles wallet selection and connection
      // It will show the approval prompt when user clicks a wallet
      console.log('🔌 Opening wallet selection modal...')
      console.log('📋 Wallet adapter state before opening modal:', {
        connected,
        connecting,
        publicKey: publicKey?.toString()
      })
      setVisible(true)
      console.log('✅ Modal visibility set to true')
    }
  }, [connected, disconnect, setVisible, connecting, publicKey])

  const buttonText = useMemo(() => {
    if (connecting) return 'Connecting...'
    if (connected && publicKey) {
      // Show shortened address
      const addr = publicKey.toString()
      return `${addr.slice(0, 4)}...${addr.slice(-4)}`
    }
    return 'Connect'
  }, [connecting, connected, publicKey])

  const Icon = connected ? LogOut : Wallet

  return (
    <Button
      onClick={handleClick}
      disabled={connecting}
      className={`bg-white hover:bg-gray-50 text-gray-900 font-medium px-4 py-2 text-sm rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300 ${className || ''}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  )
}
