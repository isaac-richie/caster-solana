/**
 * Wallet utility functions to detect wallet type and handle multi-chain support
 */

/**
 * Detect if an address is a Solana address
 * Solana addresses are base58 encoded and typically 32-44 characters
 */
export function isSolanaAddress(address: string): boolean {
  // Solana addresses are base58 encoded, typically 32-44 characters
  // They don't start with '0x' like EVM addresses
  if (address.startsWith('0x')) {
    return false
  }
  
  // Basic check: Solana addresses are usually 32-44 characters
  // More accurate would be to validate base58 encoding, but this is a quick check
  return address.length >= 32 && address.length <= 44
}

/**
 * Detect if an address is an EVM address
 * EVM addresses start with '0x' and are 42 characters
 */
export function isEVMAddress(address: string): boolean {
  return address.startsWith('0x') && address.length === 42
}

/**
 * Get wallet chain type from address
 */
export function getWalletChainType(address: string | null | undefined): 'evm' | 'solana' | 'unknown' {
  if (!address) return 'unknown'
  
  if (isEVMAddress(address)) {
    return 'evm'
  }
  
  if (isSolanaAddress(address)) {
    return 'solana'
  }
  
  return 'unknown'
}


