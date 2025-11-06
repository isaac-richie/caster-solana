'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useActiveAccount } from 'thirdweb/react'
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Dynamically import react-joyride to avoid SSR issues
const Joyride = dynamic(() => import('react-joyride'), { ssr: false })

interface OnboardingTourProps {
  onComplete?: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(true) // Start immediately when component mounts
  const [stepIndex, setStepIndex] = useState(0)

  const steps = [
    {
      target: 'body',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Welcome to PolyCaster! 👋
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your AI-powered analytics platform for Polymarket prediction markets. 
            Let's take a quick tour to show you around!
          </p>
        </div>
      ),
      placement: 'center' as const,
      disableBeacon: true,
    },
    {
      target: '[data-onboarding="search"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🔍 Search Markets
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Search for any market by question, category, or keyword. 
            Get instant results from Polymarket's live markets.
          </p>
        </div>
      ),
      placement: 'bottom' as const,
    },
    {
      target: '[data-onboarding="categories"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            📊 Browse by Category
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Filter markets by Sports, Crypto, Politics, Tech, Science, and more. 
            Find markets that interest you quickly.
          </p>
        </div>
      ),
      placement: 'bottom' as const,
    },
    {
      target: '[data-onboarding="market-card"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            📈 Market Cards
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Each card shows market details, current prices, volume, and more. 
            Use the buttons to analyze, save, or set alerts.
          </p>
        </div>
      ),
      placement: 'top' as const,
    },
    {
      target: '[data-onboarding="watchlist"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            ⭐ Save to Watchlist
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the star icon to save markets you're interested in. 
            Access them anytime from the Watchlist page.
          </p>
        </div>
      ),
      placement: 'left' as const,
    },
    {
      target: '[data-onboarding="alerts"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🔔 Price Alerts
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set alerts to get notified when prices hit your target. 
            You'll receive email notifications when alerts trigger.
          </p>
        </div>
      ),
      placement: 'left' as const,
    },
    {
      target: '[data-onboarding="ai-analysis"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            🤖 AI Analysis
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get AI-powered insights and recommendations for any market. 
            Understand market dynamics with intelligent analysis.
          </p>
        </div>
      ),
      placement: 'top' as const,
    },
    {
      target: '[data-onboarding="wallet"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            💼 Connect Your Wallet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your wallet or use email login to access all features. 
            Save markets, set alerts, and track your activity.
          </p>
        </div>
      ),
      placement: 'left' as const,
    },
  ]

  const handleJoyrideCallback = useCallback((data: any) => {
    const { status, type } = data

    if (status === 'finished' || status === 'skipped') {
      localStorage.setItem('polycaster_onboarding_completed', 'true')
      setRun(false)
      if (onComplete) {
        onComplete()
      }
    }
  }, [onComplete])

  if (!run) return null

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          color: '#6b7280',
          borderRadius: '8px',
          padding: '10px 20px',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  )
}

