'use client'

import { useEffect, useState, ReactNode } from 'react'
import { WalletRequirementModal } from './WalletRequirementModal'
import { useWalletRequirement } from '@/hooks/useWalletRequirement'
import { WalletRequirementContextProvider, useWalletRequirementModal } from './WalletRequirementContext'

interface WalletRequirementProviderProps {
  children: ReactNode
  /**
   * Whether to show the modal immediately on mount if wallet is not connected
   * @default true
   */
  showOnMount?: boolean
  /**
   * Whether to allow closing the modal (users can still browse but features are locked)
   * @default true
   */
  allowClose?: boolean
}

function WalletRequirementModalManager({ 
  showOnMount = true,
  allowClose = true 
}: Omit<WalletRequirementProviderProps, 'children'>) {
  const { isAnyWalletConnected } = useWalletRequirement()
  const { showModal, hideModal, isModalOpen } = useWalletRequirementModal()
  const [hasChecked, setHasChecked] = useState(false)

  // Show modal on mount if wallet is not connected
  useEffect(() => {
    if (showOnMount && !hasChecked) {
      // Small delay to ensure wallet providers are initialized
      const timer = setTimeout(() => {
        if (!isAnyWalletConnected) {
          showModal()
        }
        setHasChecked(true)
      }, 1000) // 1 second delay to allow wallet providers to initialize

      return () => clearTimeout(timer)
    }
  }, [showOnMount, hasChecked, isAnyWalletConnected, showModal])

  // Auto-show modal when wallet disconnects
  useEffect(() => {
    if (hasChecked && !isAnyWalletConnected) {
      showModal()
    }
  }, [isAnyWalletConnected, hasChecked, showModal])

  // Auto-hide modal when wallet connects
  useEffect(() => {
    if (isAnyWalletConnected && isModalOpen) {
      const timer = setTimeout(() => {
        hideModal()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnyWalletConnected, isModalOpen, hideModal])

  const handleClose = () => {
    if (allowClose) {
      hideModal()
    }
  }

  return (
    <WalletRequirementModal 
      isOpen={isModalOpen} 
      onClose={allowClose ? handleClose : undefined}
    />
  )
}

export function WalletRequirementProvider({ 
  children, 
  showOnMount = true,
  allowClose = true 
}: WalletRequirementProviderProps) {
  return (
    <WalletRequirementContextProvider>
      {children}
      <WalletRequirementModalManager showOnMount={showOnMount} allowClose={allowClose} />
    </WalletRequirementContextProvider>
  )
}

