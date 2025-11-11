'use client'

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth'
import { ReactNode } from 'react'

interface PrivyProviderProps {
  children: ReactNode
}

export function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

  if (!appId) {
    console.warn('⚠️ NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env file')
    console.warn('⚠️ Get your Privy App ID from https://dashboard.privy.io/')
    return <>{children}</>
  }

  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        // Enable embedded wallets
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // Login methods
        loginMethods: ['email', 'wallet'],
        // Appearance
        appearance: {
          theme: 'dark',
          accentColor: '#1e40af',
          logo: '/favicon.ico',
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  )
}

