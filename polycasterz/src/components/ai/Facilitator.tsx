'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Zap,
  CreditCard,
  Loader2
} from 'lucide-react'
import { MarketAnalysis, Signal } from '@/types'
import { cn, formatPrice, formatPercentageChange } from '@/lib/utils'
import { useWallet } from '@/hooks/useWallet'
import { ConnectButton, useActiveAccount, useSendTransaction } from 'thirdweb/react'
import { client, wallets } from '@/lib/thirdweb'
import { getContract, prepareContractCall, toWei } from 'thirdweb'
import { baseSepolia } from 'thirdweb/chains'

interface FacilitatorProps {
  marketId: string
  marketQuestion: string
  onAnalysisComplete?: (analysis: MarketAnalysis) => void
  className?: string
}

export function Facilitator({ 
  marketId, 
  marketQuestion, 
  onAnalysisComplete,
  className 
}: FacilitatorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [paymentRequired, setPaymentRequired] = useState(false)
  const [paymentData, setPaymentData] = useState<string | null>(null)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  
  const { isConnected, address } = useWallet()
  const account = useActiveAccount()
  const { mutateAsync: sendTransaction } = useSendTransaction()
  
  // USDC Contract on Base Sepolia
  const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
  const SERVER_WALLET = process.env.NEXT_PUBLIC_SERVER_WALLET || '0xYourServerWalletAddress'
  const PAYMENT_AMOUNT = '500000' // 0.5 USDC (6 decimals)

  const handleAnalysis = async () => {
    // Check if wallet is connected first
    if (!isConnected) {
      setError('Please connect your wallet to analyze markets.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setProgress(0)

    try {
      // First, try to get analysis without payment
      const response = await fetch(`http://localhost:8000/ai/analyze/${marketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_verified: false,
        }),
      })

      if (response.status === 402) {
        // Payment required
        setPaymentRequired(true)
        setIsAnalyzing(false)
        return
      }

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      if (data.success && data.signal) {
        // Convert backend signal to frontend analysis format
        const analysis: MarketAnalysis = {
          marketId: marketId,
          analysis: data.signal.raw_analysis || data.signal.reasoning,
          confidence: data.signal.confidence_score,
          recommendation: data.signal.recommendation,
          priceTarget: data.signal.price_target,
          riskLevel: data.signal.risk_level,
          reasoning: [data.signal.reasoning],
          createdAt: data.signal.created_at
        }
        
        setAnalysis(analysis)
        setSignals([data.signal])
        setIsAnalyzing(false)
        
        if (onAnalysisComplete) {
          onAnalysisComplete(analysis)
        }
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze market. Please try again.')
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handlePayment = async () => {
    if (!account) {
      setError('Please connect your wallet first')
      return
    }

    setIsPaymentProcessing(true)
    setError(null)

    try {
      console.log('🔄 Starting USDC payment...')
      console.log('From:', account.address)
      console.log('To:', SERVER_WALLET)
      console.log('Amount:', PAYMENT_AMOUNT, '(0.5 USDC)')

      // Get USDC contract
      const usdcContract = getContract({
        client,
        chain: baseSepolia,
        address: USDC_ADDRESS
      })

      // Prepare USDC transfer transaction
      const transaction = prepareContractCall({
        contract: usdcContract,
        method: 'function transfer(address to, uint256 amount) returns (bool)',
        params: [SERVER_WALLET, BigInt(PAYMENT_AMOUNT)]
      })

      console.log('📝 Transaction prepared, waiting for user signature...')

      // Send transaction (MetaMask will pop up)
      const result = await sendTransaction(transaction)
      
      console.log('✅ Transaction sent! Hash:', result.transactionHash)
      console.log('⏳ Waiting for confirmation...')

      // Wait for transaction to be mined
      // The transaction is already confirmed when sendTransaction resolves

      setPaymentData(result.transactionHash)
      setPaymentRequired(false)
      
      console.log('🎉 Payment confirmed on-chain!')
      
      // Now proceed with analysis
      await handleAnalysisWithPayment(result.transactionHash)

    } catch (error: any) {
      console.error('❌ Payment error:', error)
      
      // User-friendly error messages
      if (error.message?.includes('user rejected')) {
        setError('Transaction rejected. Please try again.')
      } else if (error.message?.includes('insufficient funds')) {
        setError('Insufficient USDC balance. You need 0.5 USDC.')
      } else {
        setError(`Payment failed: ${error.message || 'Unknown error'}`)
      }
      
      setIsPaymentProcessing(false)
    }
  }

  const handleAnalysisWithPayment = async (txHash?: string) => {
    setIsAnalyzing(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Call the AI analysis API with payment verification
      const response = await fetch(`http://localhost:8000/ai/analyze/${marketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_verified: true,
          user_wallet: address || account?.address || '0x0000000000000000000000000000000000000000',
          transaction_hash: txHash || paymentData,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      
      clearInterval(progressInterval)
      setProgress(100)
      
      // Wait a moment for the progress bar to complete
      setTimeout(() => {
        if (data.success && data.signal) {
          // Convert backend signal to frontend analysis format
          const analysis: MarketAnalysis = {
            marketId: marketId,
            analysis: data.signal.raw_analysis || data.signal.reasoning,
            confidence: data.signal.confidence_score,
            recommendation: data.signal.recommendation,
            priceTarget: data.signal.price_target,
            riskLevel: data.signal.risk_level,
            reasoning: [data.signal.reasoning],
            createdAt: data.signal.created_at
          }
          
          setAnalysis(analysis)
          setSignals([data.signal])
          setIsAnalyzing(false)
          setIsPaymentProcessing(false)
          
          if (onAnalysisComplete) {
            onAnalysisComplete(analysis)
          }
        } else {
          throw new Error(data.error || 'Analysis failed')
        }
      }, 500)

    } catch (error) {
      console.error('Analysis error:', error)
      setError('Failed to analyze market. Please try again.')
      setIsAnalyzing(false)
      setIsPaymentProcessing(false)
      setProgress(0)
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'BUY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SELL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-6", className)}
    >
      {/* Analysis Trigger */}
      <Card className="polymarket-card-gradient polymarket-shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>AI Market Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Market Question:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {marketQuestion}
            </p>
          </div>

          {/* Wallet Connection Required */}
          {!isConnected && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  Wallet Connection Required
                </h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Connect your wallet to analyze markets and make payments.
              </p>
              <div className="w-full">
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
                    className: "w-full polycaster-gradient hover:opacity-90 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2",
                  }}
                />
              </div>
            </div>
          )}


          {/* Payment Required UI */}
          {paymentRequired && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CreditCard className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Payment Required
                </h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                AI analysis requires a payment of $0.50 USDC to proceed.
              </p>
              <Button
                onClick={handlePayment}
                disabled={isPaymentProcessing}
                className="w-full polycaster-gradient hover:opacity-90 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:cursor-not-allowed"
              >
                {isPaymentProcessing ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Pay $0.50 USDC</span>
                  </div>
                )}
              </Button>
            </div>
          )}

          {/* Payment Success */}
          {paymentData && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-800 dark:text-green-200">
                  Payment Confirmed
                </h4>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-green-700 dark:text-green-300 break-all font-mono">
                  {paymentData}
                </p>
                <a
                  href={`https://sepolia.basescan.org/tx/${paymentData}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"
                >
                  View on BaseScan →
                </a>
              </div>
            </div>
          )}

          {!analysis && !isAnalyzing && !paymentRequired && isConnected && (
            <Button
              onClick={handleAnalysis}
              className="w-full polycaster-gradient hover:opacity-90 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <Zap className="w-5 h-5" />
              <span>Start AI Analysis</span>
            </Button>
          )}

          {isAnalyzing && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2">
                  <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  AI is analyzing the market...
                </p>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-center text-gray-500">
                {progress}% complete
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Main Analysis Card */}
          <Card className="polymarket-card-gradient polymarket-shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Analysis Complete</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("font-medium", getRecommendationColor(analysis.recommendation))}
                >
                  {analysis.recommendation}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Confidence Score */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {Math.round(analysis.confidence * 100)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Confidence Score
                </div>
                <Progress value={analysis.confidence * 100} className="mt-2" />
              </div>

              {/* Price Target */}
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatPrice(analysis.priceTarget)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Price Target
                </div>
              </div>

              {/* Risk Level */}
              <div className="flex items-center justify-center">
                <Badge 
                  variant="secondary" 
                  className={cn("text-sm font-medium", getRiskLevelColor(analysis.riskLevel))}
                >
                  {analysis.riskLevel} Risk
                </Badge>
              </div>

              {/* Analysis Text */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Analysis Summary:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {analysis.analysis}
                </p>
              </div>

              {/* Reasoning Points */}
              {analysis.reasoning && analysis.reasoning.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Key Reasoning:
                  </h4>
                  <ul className="space-y-2">
                    {analysis.reasoning.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signals */}
          {signals.length > 0 && (
            <Card className="polymarket-card-gradient polymarket-shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span>Market Signals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signals.map((signal, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant="outline" 
                          className={cn("font-medium", getRecommendationColor(signal.recommendation))}
                        >
                          {signal.recommendation}
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {Math.round(signal.confidence_score * 100)}% confidence
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {signal.reasoning}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Target: {formatPrice(signal.price_target)}</span>
                        <span>{new Date(signal.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
