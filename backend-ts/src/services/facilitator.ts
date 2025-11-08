import { facilitator, settlePayment } from 'thirdweb/x402'
import { createThirdwebClient } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'
import { FacilitatorResponse } from '../types'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

export class FacilitatorService {
  private client
  private thirdwebFacilitator

  constructor() {
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID
    const secretKey = process.env.THIRDWEB_SECRET_KEY
    const serverWallet = process.env.SERVER_WALLET_ADDRESS || process.env.PAYMENT_RECIPIENT_WALLET

    if (!clientId && !secretKey) {
      console.warn('WARNING: Neither NEXT_PUBLIC_THIRDWEB_CLIENT_ID nor THIRDWEB_SECRET_KEY found in environment variables')
      // Create a mock client for development
      this.client = null
      this.thirdwebFacilitator = null
      return
    }

    this.client = createThirdwebClient({
      clientId: clientId,
      secretKey: secretKey,
    })

    this.thirdwebFacilitator = facilitator({
      client: this.client,
      serverWalletAddress: serverWallet || '',
      waitUntil: 'confirmed',
    })
  }

  async settlePayment(
    resourceUrl: string,
    paymentData: string,
    price: string = '$0.20'
  ): Promise<FacilitatorResponse> {
    try {
      // If facilitator is not available (missing secret key), return mock response
      if (!this.thirdwebFacilitator) {
        console.warn('Facilitator not available - returning mock response')
        return {
          status: 200,
          responseBody: {
            success: true,
            message: 'Mock payment settlement (THIRDWEB_SECRET_KEY not configured)',
            transaction_hash: '0x123...mock',
            result: { mock: true }
          },
          responseHeaders: {},
        }
      }

      const result = await settlePayment({
        resourceUrl,
        method: 'GET',
        paymentData,
        payTo: process.env.SERVER_WALLET_ADDRESS || process.env.PAYMENT_RECIPIENT_WALLET || '',
        network: baseSepolia,
        price,
        facilitator: this.thirdwebFacilitator,
      })

      return {
        status: 200,
        responseBody: {
          success: true,
          message: 'Payment settled successfully',
          transaction_hash: result.transactionHash || '',
          result,
        },
        responseHeaders: {},
      }
    } catch (error) {
      console.error('Payment settlement failed:', error)
      return {
        status: 500,
        responseBody: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        responseHeaders: {},
      }
    }
  }

  async getSupportedPaymentMethods(chainId?: number) {
    try {
      // If facilitator is not available, return mock methods
      if (!this.thirdwebFacilitator) {
        console.warn('Facilitator not available - returning mock payment methods')
        return {
          USDC: {
            chainId: 84532, // Base Sepolia
            tokenAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
            decimals: 6,
            supported: true
          }
        }
      }

      if (chainId) {
        return await this.thirdwebFacilitator.supported({ chainId })
      }
      return await this.thirdwebFacilitator.supported()
    } catch (error) {
      console.error('Failed to get supported payment methods:', error)
      return {}
    }
  }
}

export const facilitatorService = new FacilitatorService()
