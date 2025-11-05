'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Clock, 
  DollarSign, 
  BarChart3,
  Target,
  AlertTriangle,
  Activity,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Calculator,
  Star,
  Bell
} from 'lucide-react'
import { ROICalculator } from './ROICalculator'
import { PriceAlertDialog } from './PriceAlertDialog'
import { Market } from '@/types'
import { 
  formatPrice, 
  formatVolume, 
  formatLiquidity, 
  formatTimeRemaining,
  formatTimeAgo, 
  formatPercentageChange,
  getTrendColor,
  getTrendIcon,
  getRiskLevelColor,
  cn
} from '@/lib/utils'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useActiveAccount } from 'thirdweb/react'

interface MarketCardProps {
  market: Market
  compact?: boolean
  onAnalyze?: (marketId: string) => void
  className?: string
}

export function MarketCard({ 
  market, 
  compact = false, 
  onAnalyze,
  className 
}: MarketCardProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showROICalculator, setShowROICalculator] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [showMarketDetails, setShowMarketDetails] = useState(false)
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, loading: watchlistLoading } = useWatchlist()
  const account = useActiveAccount()
  const inWatchlist = isInWatchlist(market.id)

  const handleAnalyze = async () => {
    if (!onAnalyze) return
    
    setIsAnalyzing(true)
    try {
      await onAnalyze(market.id)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleWatchlistToggle = async () => {
    if (!account) {
      alert('Please connect your wallet to save markets')
      return
    }

    if (inWatchlist) {
      await removeFromWatchlist(market.id)
    } else {
      await addToWatchlist(market.id, market.question)
    }
  }

  const TrendIcon = market.price_trend === 'up' ? TrendingUp : 
                   market.price_trend === 'down' ? TrendingDown : Minus

  // Compact card for trending/live sections
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn("polymarket-card-gradient polymarket-hover-lift polymarket-shadow rounded-lg border border-gray-200 dark:border-gray-700", className)}
      >
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
                  {market.question}
                </h3>
                <div className="ml-2 flex items-center space-x-1">
                  <TrendIcon className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">
                    {formatPercentageChange(market.price_change_percent)}
                  </span>
                </div>
              </div>
              
              {/* Visual Probability Bar */}
              <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden mb-2">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                  style={{ width: `${market.current_price * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-bold">
                  <span className="text-white drop-shadow-lg">YES {(market.current_price * 100).toFixed(0)}%</span>
                  <span className="text-white drop-shadow-lg">NO {((1 - market.current_price) * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Price and Volume */}
              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Vol:</span> {formatVolume(market.volume)}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Liq:</span> {formatLiquidity(market.liquidity)}
                </div>
              </div>
              
              {/* Footer */}
              <div className="flex justify-between items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {market.category}
                </Badge>
                <div className="flex gap-2">
                  {market.url && (
                    <Button
                      onClick={() => window.open(market.url, '_blank')}
                      size="sm"
                      variant="outline"
                      className="border border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium px-2 py-1 rounded-md transition-all duration-200 shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  <Button
                    onClick={handleAnalyze}
                    disabled={!market.active || isAnalyzing}
                    size="sm"
                    className="polycaster-gradient hover:opacity-90 text-white text-xs font-medium px-3 py-1 rounded-md transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Full card for main markets section
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("polymarket-card-gradient polymarket-hover-lift polymarket-shadow-lg rounded-lg border border-gray-200 dark:border-gray-700", className)}
    >
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {market.question}
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {market.category}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", getTrendColor(market.price_trend))}
                >
                  {getTrendIcon(market.price_trend)} {formatPercentageChange(market.price_change_percent)}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {market.confidence}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {market.description}
          </p>

          {/* Outcome Prices Display - Yes/No Split */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Prediction Odds</span>
              <span className="font-medium">{market.outcomes || 'Yes/No'}</span>
            </div>
            
            {/* Visual Probability Bar */}
            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-start px-3 transition-all duration-300"
                style={{ width: `${market.current_price * 100}%` }}
              >
                <div className="flex items-center space-x-1 text-white text-xs font-bold">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{(market.current_price * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div 
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-600 flex items-center justify-end px-3"
                style={{ width: `${(1 - market.current_price) * 100}%` }}
              >
                <div className="flex items-center space-x-1 text-white text-xs font-bold">
                  <span>{((1 - market.current_price) * 100).toFixed(1)}%</span>
                  <ThumbsDown className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs text-green-600 dark:text-green-400 mb-1">YES Price</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {formatPrice(market.current_price)}
                </div>
              </div>
              <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-xs text-red-600 dark:text-red-400 mb-1">NO Price</div>
                <div className="text-lg font-bold text-red-700 dark:text-red-300">
                  {formatPrice(1 - market.current_price)}
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Volume 24h
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatVolume(market.volume)}
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Liquidity
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatLiquidity(market.liquidity)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Last Update
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatTimeAgo(market.updated_at)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Market Age
                </span>
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatTimeAgo(market.created_at)}
              </div>
            </div>
          </div>

          {/* Market Status */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {formatTimeRemaining(market.end_date)}
              </span>
            </div>
            <Badge 
              variant={market.active ? "default" : "secondary"}
              className={market.active ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" : ""}
            >
              {market.active ? 'Active' : 'Closed'}
            </Badge>
          </div>

          {/* Risk Warning for Low Confidence */}
          {parseFloat(market.confidence) < 0.6 && (
            <div className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-xs text-yellow-800 dark:text-yellow-200">
                Low confidence market - Higher risk
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Main Action Buttons */}
            <div className="flex gap-2 flex-1">
              <Button
                onClick={handleAnalyze}
                disabled={!market.active || isAnalyzing}
                className="polycaster-gradient hover:opacity-90 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center space-x-1 flex-1"
              >
                <Target className="w-4 h-4" />
                <span className="text-xs">AI</span>
              </Button>
              
              <Button
                onClick={() => setShowROICalculator(true)}
                variant="outline"
                className="border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 py-3 px-4 rounded-lg transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center space-x-1 flex-1"
              >
                <Calculator className="w-4 h-4" />
                <span className="text-xs">ROI</span>
              </Button>
            </div>

            {/* Icon-Only Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAlertDialog(true)}
                variant="ghost"
                size="icon"
                className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-200"
                title="Set Price Alert"
              >
                <Bell className="w-5 h-5" />
              </Button>

              <Button
                onClick={handleWatchlistToggle}
                disabled={watchlistLoading}
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-lg transition-all duration-200",
                  inWatchlist
                    ? "text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
                title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              >
                <Star className={cn("w-5 h-5", inWatchlist && "fill-yellow-500")} />
              </Button>
            </div>
          </div>
          
          {/* View Market Button - Full Width */}
          {market.url && (
            <Button
              onClick={() => setShowMarketDetails(true)}
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 rounded-lg transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="text-sm">View Market Details</span>
            </Button>
          )}
          
          {/* ROI Calculator Dialog */}
          <Dialog open={showROICalculator} onOpenChange={setShowROICalculator}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <ROICalculator market={market} onClose={() => setShowROICalculator(false)} />
            </DialogContent>
          </Dialog>

          {/* Price Alert Dialog */}
          <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <PriceAlertDialog market={market} onClose={() => setShowAlertDialog(false)} />
            </DialogContent>
          </Dialog>

          {/* Market Details Dialog */}
          <Dialog open={showMarketDetails} onOpenChange={setShowMarketDetails}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Market Details</DialogTitle>
                <DialogDescription>
                  Full market information and external link
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Market Question */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {market.question}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {market.description}
                  </p>
                </div>

                {/* Market Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-xs text-green-600 dark:text-green-400 mb-1">YES Probability</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {(market.current_price * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-xs text-red-600 dark:text-red-400 mb-1">NO Probability</div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                      {((1 - market.current_price) * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">24h Volume</div>
                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatVolume(market.volume)}
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Liquidity</div>
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                      {formatLiquidity(market.liquidity)}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <Badge variant="outline">{market.category}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <Badge variant={market.active ? "default" : "secondary"}>
                      {market.active ? 'Active' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">End Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatTimeRemaining(market.end_date)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Market ID</span>
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                      {market.id.substring(0, 20)}...
                    </span>
                  </div>
                </div>

                {/* View on Polymarket Button */}
                {market.url && (
                  <Button
                    onClick={() => window.open(market.url, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>View on Polymarket</span>
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}
