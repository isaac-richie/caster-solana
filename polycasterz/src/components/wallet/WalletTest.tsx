'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function WalletTest() {
  const { 
    wallet, 
    publicKey, 
    connected, 
    connecting, 
    wallets,
    disconnect
  } = useWallet()
  const { setVisible } = useWalletModal()
  const [phantomDetected, setPhantomDetected] = useState(false)
  const [walletInfo, setWalletInfo] = useState<Record<string, unknown> | null>(null)

  // Check if Phantom is available in window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkPhantom = () => {
        const phantom = (window as unknown as Record<string, unknown> & { 
          phantom?: { 
            solana?: {
              isPhantom?: boolean
              publicKey?: { toString: () => string }
              isConnected?: boolean
            }
          } 
        }).phantom?.solana
        setPhantomDetected(!!phantom)
        if (phantom) {
          setWalletInfo({
            isPhantom: phantom.isPhantom,
            publicKey: phantom.publicKey?.toString(),
            isConnected: phantom.isConnected
          })
        }
      }
      
      checkPhantom()
      
      // Listen for Phantom events
      window.addEventListener('load', checkPhantom)
      return () => window.removeEventListener('load', checkPhantom)
    }
  }, [])

  // Log wallet adapter state
  useEffect(() => {
    console.log('🔍 Wallet Adapter State:', {
      wallet: wallet?.adapter?.name,
      publicKey: publicKey?.toString(),
      connected,
      connecting,
      wallets: wallets.map(w => ({ name: w.adapter.name, readyState: w.readyState })),
      adapter: wallet?.adapter?.name
    })
  }, [wallet, publicKey, connected, connecting, wallets])

  const handleConnect = () => {
    // Just open the modal - let user select and approve connection
    console.log('🔌 Opening wallet modal for user selection...')
    setVisible(true)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Wallet Adapter Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phantom Detection */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Phantom Detection</h3>
          <p>Phantom in window: {phantomDetected ? '✅ Yes' : '❌ No'}</p>
          {walletInfo && (
            <div className="mt-2 text-sm">
              <p>isPhantom: {walletInfo.isPhantom ? '✅' : '❌'}</p>
              <p>Public Key: {String(walletInfo.publicKey || 'Not available')}</p>
              <p>Is Connected: {walletInfo.isConnected ? '✅' : '❌'}</p>
            </div>
          )}
        </div>

        {/* Wallet Adapter State */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Wallet Adapter State</h3>
          <div className="space-y-1 text-sm">
            <p>Current Wallet: {wallet?.adapter?.name || 'None'}</p>
            <p>Public Key: {publicKey?.toString() || 'None'}</p>
            <p>Connected: {connected ? '✅' : '❌'}</p>
            <p>Connecting: {connecting ? '⏳' : '❌'}</p>
            <p>Adapter: {wallet?.adapter?.name || 'None'}</p>
          </div>
        </div>

        {/* Available Wallets */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Available Wallets ({wallets.length})</h3>
          <ul className="space-y-1 text-sm">
            {wallets.map((w, i) => (
              <li key={i}>
                {w.adapter.name} - {w.readyState}
                {w.adapter.name.toLowerCase().includes('phantom') && ' 👻'}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleConnect} disabled={connecting}>
            {connecting ? 'Connecting...' : connected ? 'Reconnect' : 'Connect'}
          </Button>
          <Button onClick={() => setVisible(true)} variant="outline">
            Open Modal
          </Button>
          {connected && (
            <Button onClick={disconnect} variant="destructive">
              Disconnect
            </Button>
          )}
        </div>

        {/* Debug Info */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              windowPhantom: !!((window as unknown as Record<string, unknown> & { phantom?: { solana?: unknown } }).phantom?.solana),
              walletsCount: wallets.length,
              walletNames: wallets.map(w => w.adapter.name),
              currentWallet: wallet?.adapter?.name,
              connected,
              publicKey: publicKey?.toString()
            }, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  )
}

