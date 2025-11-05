'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { alertsApi } from '@/lib/api/alerts'
import { PriceAlert } from '@/types'
import { useToast } from '@/components/ui/toast'

const POLL_INTERVAL = 30000 // 30 seconds

export function useAlertNotifications() {
  const account = useActiveAccount()
  const [triggeredAlerts, setTriggeredAlerts] = useState<PriceAlert[]>([])
  const [triggeredCount, setTriggeredCount] = useState(0)
  const [isPolling, setIsPolling] = useState(false)
  const lastCheckedRef = useRef<string | null>(null)
  const { addToast } = useToast()

  const checkForTriggeredAlerts = useCallback(async () => {
    if (!account?.address || isPolling) return

    setIsPolling(true)
    try {
      const result = await alertsApi.get(account.address, 'triggered')
      
      if (result.success && result.alerts) {
        const newAlerts = result.alerts.filter((alert) => {
          // Only show alerts that were triggered after we last checked
          if (!alert.triggered_at) return false
          if (lastCheckedRef.current && alert.triggered_at <= lastCheckedRef.current) {
            return false
          }
          return true
        })

        // Update last checked timestamp
        if (result.alerts.length > 0) {
          const latestTriggered = result.alerts
            .filter(a => a.triggered_at)
            .sort((a, b) => 
              new Date(b.triggered_at!).getTime() - new Date(a.triggered_at!).getTime()
            )[0]
          
          if (latestTriggered?.triggered_at) {
            lastCheckedRef.current = latestTriggered.triggered_at
          }
        }

        // Show notifications for new alerts
        newAlerts.forEach((alert) => {
          const conditionText = alert.condition === 'above' ? 'above' : 
                               alert.condition === 'below' ? 'below' : 'equals'
          
          addToast({
            type: 'alert',
            title: '🔔 Price Alert Triggered!',
            description: `${alert.market_question.substring(0, 60)}... - Price is ${conditionText} ${(alert.target_price * 100).toFixed(0)}¢`,
            duration: 8000,
          })
        })

        // Update state
        setTriggeredAlerts(result.alerts)
        setTriggeredCount(result.alerts.length)
      }
    } catch (error) {
      console.error('Error checking for triggered alerts:', error)
    } finally {
      setIsPolling(false)
    }
  }, [account?.address, isPolling, addToast])

  // Poll for triggered alerts
  useEffect(() => {
    if (!account?.address) {
      setTriggeredAlerts([])
      setTriggeredCount(0)
      return
    }

    // Initial check
    checkForTriggeredAlerts()

    // Set up polling interval
    const interval = setInterval(() => {
      checkForTriggeredAlerts()
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [account?.address, checkForTriggeredAlerts])

  return {
    triggeredCount,
    triggeredAlerts,
    isPolling,
    refresh: checkForTriggeredAlerts,
  }
}

