'use client'

import { ConnectButton } from 'thirdweb/react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { client, wallets } from '@/lib/thirdweb'

export function WalletConnect() {
  // EVM functionality is disabled in UI but code remains intact for future use
  // To re-enable: uncomment the EVM section below
  const showEVMButton = false // Set to true to re-enable EVM button

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center w-full">
        {/* EVM Wallets (Thirdweb) - DISABLED BUT CODE RETAINED */}
        {showEVMButton && (
          <div className="w-full sm:flex-1">
            <ConnectButton
              client={client}
              wallets={wallets}
              theme="dark"
              connectModal={{
                size: "wide",
                title: "Connect EVM Wallet",
                titleIcon: "",
                showThirdwebBranding: false,
                welcomeScreen: {
                  title: "Welcome to PolyCaster",
                  subtitle: "Connect with email or EVM wallet (MetaMask, Coinbase, Trust Wallet only - Phantom not included)",
                },
              }}
              connectButton={{
                label: "Connect EVM",
                className: "polycaster-gradient hover:opacity-90 text-white font-medium px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg w-full",
              }}
            />
          </div>
        )}
        {/* Solana Wallets */}
        <div className={showEVMButton ? "w-full sm:flex-1" : "w-full"}>
          <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!opacity-90 !text-white !font-medium !px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-sm sm:text-base !rounded-lg !transition-all !duration-200 !shadow-md hover:!shadow-lg !w-full" />
        </div>
      </div>
      {/* Important Note - Updated for Solana only */}
      {!showEVMButton && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left px-1">
          💡 <strong>Connect your Solana wallet</strong> (Phantom, Solflare) to get started with AI-powered market analysis.
        </p>
      )}
      {showEVMButton && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-left px-1">
          💡 <strong>Phantom users:</strong> Use the purple &quot;Connect Solana&quot; button above, not the EVM button. Phantom supports both chains, but for Solana payments, connect via the Solana button.
        </p>
      )}
    </div>
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
