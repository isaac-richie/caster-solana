'use client'

import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { useState, useEffect } from 'react'

export function useWallet() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      if (account) {
        setIsConnected(true)
        setAddress(account.address)
      } else {
        setIsConnected(false)
        setAddress(null)
      }
    }, 0)
  }, [account])

  const connect = async () => {
    try {
      // Thirdweb handles connection via ConnectButton component
      // This function is kept for compatibility but wallet.connect() requires parameters
      // Use ConnectButton component instead for wallet connection
      console.warn('useWallet.connect() is deprecated. Use ConnectButton component instead.')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnect = async () => {
    try {
      await wallet?.disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const getShortAddress = (addr?: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return {
    account,
    wallet,
    isConnected,
    address,
    connect,
    disconnect,
    getShortAddress,
  }
}


