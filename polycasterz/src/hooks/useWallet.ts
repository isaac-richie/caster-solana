'use client'

import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { client } from '@/lib/thirdweb'
import { useState, useEffect } from 'react'

export function useWallet() {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)

  useEffect(() => {
    if (account) {
      setIsConnected(true)
      setAddress(account.address)
    } else {
      setIsConnected(false)
      setAddress(null)
    }
  }, [account])

  const connect = async () => {
    try {
      await wallet?.connect()
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


