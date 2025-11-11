'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Brain } from 'lucide-react'
import { Facilitator } from '@/components/ai/Facilitator'
import { Market, MarketAnalysis } from '@/types'
import { formatPrice, cn } from '@/lib/utils'

interface AIAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  market: Market | null
}

export function AIAnalysisModal({ isOpen, onClose, market }: AIAnalysisModalProps) {
  const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null)

  const handleAnalysisComplete = (completedAnalysis: MarketAnalysis) => {
    setAnalysis(completedAnalysis)
  }

  const handleClose = () => {
    setAnalysis(null)
    onClose()
  }

  if (!market) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>AI Market Analysis</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Market Info */}
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">
              {market.question}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <span>Category: {market.category}</span>
              <span className="hidden sm:inline">•</span>
              <span>Current Price: {market.current_price}¢</span>
              <span className="hidden sm:inline">•</span>
              <span>Volume: ${market.volume.toLocaleString()}</span>
            </div>
          </div>

          {/* Facilitator Component */}
          <Facilitator
            marketId={market.id}
            marketQuestion={market.question}
            onAnalysisComplete={handleAnalysisComplete}
          />

          {/* Analysis Summary */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <Separator />
              
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Analysis Summary
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                  <Badge 
                    variant="outline" 
                    className={`text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-1.5 ${
                      analysis.recommendation === 'BUY' 
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                        : analysis.recommendation === 'SELL'
                        ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                    }`}
                  >
                    {analysis.recommendation}
                  </Badge>
                  <Badge 
                    variant="secondary"
                    className={`text-xs sm:text-sm font-semibold px-3 py-1 sm:px-4 sm:py-1.5 ${
                      analysis.riskLevel === 'LOW' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : analysis.riskLevel === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}
                  >
                    {analysis.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              {/* Key Metrics - Confidence, Price Target, Risk Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {/* Confidence Score */}
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {Math.round(analysis.confidence * 100)}%
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-2">
                    Confidence
                  </div>
                  <Progress 
                    value={analysis.confidence * 100} 
                    className="h-1.5 bg-blue-200 dark:bg-blue-900/40 mb-1"
                  />
                  <div className="mt-1 text-[10px] sm:text-xs text-blue-500 dark:text-blue-400 font-medium">
                    {analysis.confidence >= 0.8 ? 'Very High' : 
                     analysis.confidence >= 0.6 ? 'High' : 
                     analysis.confidence >= 0.4 ? 'Moderate' : 'Low'}
                  </div>
                </div>

                {/* Price Target */}
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mb-1">
                    {formatPrice(analysis.priceTarget)}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wide mb-2">
                    Price Target
                  </div>
                  {(() => {
                    const currentPriceDecimal = market.current_price / 100
                    const priceDiff = analysis.priceTarget - currentPriceDecimal
                    const priceDiffPercent = Math.abs((priceDiff / currentPriceDecimal) * 100).toFixed(1)
                    return (
                      <>
                        <div className="text-[10px] sm:text-xs text-green-500 dark:text-green-400 font-medium mb-0.5">
                          {priceDiff > 0.01 ? `↑ +${priceDiffPercent}%` : 
                           priceDiff < -0.01 ? `↓ ${priceDiffPercent}%` : 
                           '= Current'}
                        </div>
                        <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400">
                          Current: {formatPrice(currentPriceDecimal)}
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* Risk Level */}
                <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center overflow-hidden">
                  <div className="w-full flex flex-col items-center justify-center">
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs sm:text-sm font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 mb-1.5 sm:mb-2 whitespace-nowrap inline-block",
                        analysis.riskLevel === 'LOW' 
                          ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                          : analysis.riskLevel === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                          : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                      )}
                    >
                      {analysis.riskLevel} Risk
                    </Badge>
                    <div className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      {analysis.riskLevel === 'LOW' ? 'Conservative' : 
                       analysis.riskLevel === 'MEDIUM' ? 'Moderate' : 
                       'Aggressive'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
