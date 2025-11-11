import { FacilitatorResponse } from '../types'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

/**
 * Solana Facilitator Service
 * Uses PayAI Facilitator for Solana X402 payments
 * 
 * This service runs alongside the existing Thirdweb facilitator
 * and does NOT interfere with existing EVM payments
 */
export class SolanaFacilitatorService {
  private facilitatorUrl: string
  private serverWallet: string

  constructor() {
    // PayAI Facilitator URL (no API key required)
    this.facilitatorUrl = process.env.SOLANA_FACILITATOR_URL || 
      'https://facilitator.payai.network'
    
    // Solana server wallet address (for receiving payments)
    this.serverWallet = process.env.SOLANA_SERVER_WALLET || ''
    
    if (!this.serverWallet) {
      console.warn('⚠️  SOLANA_SERVER_WALLET not configured - Solana payments will be disabled')
    }
  }

  /**
   * Settle payment via PayAI Facilitator (Solana)
   * 
   * @param resourceUrl - The resource being paid for
   * @param paymentData - Payment transaction data from client
   * @param price - Price string (e.g., '$0.30')
   * @returns FacilitatorResponse
   */
  async settlePayment(
    resourceUrl: string,
    paymentData: string,
    price: string = '$0.30'
  ): Promise<FacilitatorResponse> {
    try {
      // If server wallet not configured, return ERROR (not mock success)
      if (!this.serverWallet || this.serverWallet.trim() === '') {
        console.error('❌ Solana facilitator not configured - SOLANA_SERVER_WALLET is missing')
        return {
          status: 500,
          responseBody: {
            success: false,
            message: 'Solana payment facilitator not configured',
            error: 'SOLANA_SERVER_WALLET environment variable is not set. Please configure it in your backend .env file.',
            transaction_hash: undefined,
          },
          responseHeaders: {},
        }
      }

      // Call PayAI Facilitator API
      const response = await fetch(`${this.facilitatorUrl}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceUrl,
          paymentData,
          price,
          payTo: this.serverWallet,
          chain: 'solana',
        }),
      })

      const data = await response.json() as {
        error?: string
        transactionHash?: string
        transaction_hash?: string
        [key: string]: unknown
      }

      if (!response.ok) {
        throw new Error(data.error || 'Solana payment settlement failed')
      }

      return {
        status: 200,
        responseBody: {
          success: true,
          message: 'Solana payment settled successfully',
          transaction_hash: data.transactionHash || data.transaction_hash || '',
          result: data,
        },
        responseHeaders: {},
      }
    } catch (error) {
      console.error('Solana payment settlement failed:', error)
      return {
        status: 500,
        responseBody: {
          success: false,
          message: 'Solana payment settlement failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        responseHeaders: {},
      }
    }
  }

  /**
   * Get supported payment methods for Solana
   * 
   * @returns Supported tokens and chains
   */
  async getSupportedPaymentMethods() {
    try {
      if (!this.serverWallet) {
        return {
          USDC: {
            chain: 'solana',
            tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
            decimals: 6,
            supported: false, // Disabled until configured
            note: 'SOLANA_SERVER_WALLET not configured'
          }
        }
      }

      // Query PayAI Facilitator for supported methods
      const response = await fetch(`${this.facilitatorUrl}/supported?chain=solana`)
      const data = await response.json() as {
        methods?: Record<string, unknown>
        [key: string]: unknown
      }

      return data.methods || {
        USDC: {
          chain: 'solana',
          tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC on Solana
          decimals: 6,
          supported: true
        }
      }
    } catch (error) {
      console.error('Failed to get Solana payment methods:', error)
      return {
        USDC: {
          chain: 'solana',
          tokenAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          decimals: 6,
          supported: false
        }
      }
    }
  }
}

export const solanaFacilitatorService = new SolanaFacilitatorService()

