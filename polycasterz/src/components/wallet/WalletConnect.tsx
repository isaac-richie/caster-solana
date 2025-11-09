'use client'

import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'

export function WalletConnect() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "wide",
        title: "Connect Your Account",
        titleIcon: "",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to PolyCaster",
          subtitle: "Connect with email or wallet to get started",
        },
      }}
      connectButton={{
        label: "Connect",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto",
      }}
    />
  )
}

export function WalletConnectButton() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "wide",
        title: "Connect Your Account",
        titleIcon: "",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to PolyCaster",
          subtitle: "Connect with email or wallet to get started",
        },
      }}
      connectButton={{
        label: "Connect",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 w-full sm:w-auto",
      }}
    />
  )
}

export function WalletConnectCompact() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "wide",
        title: "Connect Your Account",
        titleIcon: "",
        showThirdwebBranding: false,
        welcomeScreen: {
          title: "Welcome to PolyCaster",
          subtitle: "Connect with email or wallet to get started",
        },
      }}
      connectButton={{
        label: "",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
      }}
    />
  )
}
