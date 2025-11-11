'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WalletRequirementContextType {
  showModal: () => void
  hideModal: () => void
  isModalOpen: boolean
}

const WalletRequirementContext = createContext<WalletRequirementContextType | undefined>(undefined)

export function useWalletRequirementModal() {
  const context = useContext(WalletRequirementContext)
  if (!context) {
    throw new Error('useWalletRequirementModal must be used within WalletRequirementContextProvider')
  }
  return context
}

interface WalletRequirementContextProviderProps {
  children: ReactNode
}

export function WalletRequirementContextProvider({ children }: WalletRequirementContextProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => setIsModalOpen(true)
  const hideModal = () => setIsModalOpen(false)

  return (
    <WalletRequirementContext.Provider value={{ showModal, hideModal, isModalOpen }}>
      {children}
    </WalletRequirementContext.Provider>
  )
}


