'use client'

import { useState, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { getUserSignals, type Signal } from '@/lib/api/signals'

export function useSignals() {
  const account = useActiveAccount()
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = account?.address

  useEffect(() => {
    if (!walletAddress) {
      setSignals([])
      return
    }

    const fetchSignals = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUserSignals(walletAddress, 100)
        setSignals(data)
      } catch (err) {
        console.error('Error fetching signals:', err)
        setError('Failed to load signal history')
        setSignals([])
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
  }, [walletAddress])

  return {
    signals,
    loading,
    error,
    walletAddress,
  }
}

