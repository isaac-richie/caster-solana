'use client'

import { ConnectButton } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'

export function WalletConnect() {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      theme="dark"
      connectModal={{
        size: "compact",
        title: "Connect Wallet",
        titleIcon: "",
        showThirdwebBranding: false,
      }}
      connectButton={{
        label: "Connect Wallet",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
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
        size: "compact",
        title: "Connect Wallet",
        titleIcon: "",
        showThirdwebBranding: false,
      }}
      connectButton={{
        label: "Connect",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2",
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
        size: "compact",
        title: "Connect Wallet",
        titleIcon: "",
        showThirdwebBranding: false,
      }}
      connectButton={{
        label: "",
        className: "polycaster-gradient hover:opacity-90 text-white font-medium px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
      }}
    />
  )
}
