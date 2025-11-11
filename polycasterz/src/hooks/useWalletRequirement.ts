'use client'

import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useWallet } from '@solana/wallet-adapter-react'

/**
 * Hook to check if any wallet is connected (EVM or Solana)
 * Returns connection status and whether wallet is required
 */
export function useWalletRequirement() {
  const evmAccount = useActiveAccount()
  const solanaWallet = useWallet()
  
  const [isEVMConnected, setIsEVMConnected] = useState(false)
  const [isSolanaConnected, setIsSolanaConnected] = useState(false)
  const [isAnyWalletConnected, setIsAnyWalletConnected] = useState(false)

  useEffect(() => {
    const evmConnected = !!evmAccount?.address
    const solanaConnected = solanaWallet.connected && !!solanaWallet.publicKey
    
    setTimeout(() => {
      setIsEVMConnected(evmConnected)
      setIsSolanaConnected(solanaConnected)
      setIsAnyWalletConnected(evmConnected || solanaConnected)
    }, 0)
  }, [evmAccount, solanaWallet.connected, solanaWallet.publicKey])

  return {
    isEVMConnected,
    isSolanaConnected,
    isAnyWalletConnected,
    evmAccount,
    solanaWallet,
  }
}

