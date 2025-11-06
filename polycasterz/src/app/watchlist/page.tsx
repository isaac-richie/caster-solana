'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useActiveAccount } from 'thirdweb/react'
import { Star, Loader2, Trash2, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatVolume, formatTimeRemaining } from '@/lib/utils'
import Link from 'next/link'

export default function WatchlistPage() {
  const { watchlist, loading, error, removeFromWatchlist, refetch } = useWatchlist()
  const account = useActiveAccount()

  useEffect(() => {
    if (account) {
      refetch()
    }
  }, [account, refetch])

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Connect Your Wallet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please connect your wallet to view your saved markets
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your watchlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-500 fill-yellow-500" />
              Your Watchlist
            </h1>
            <Link href="/">
              <Button variant="outline">
                Back to Markets
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {watchlist.length} saved {watchlist.length === 1 ? 'market' : 'markets'}
          </p>
        </div>

        {/* Empty State */}
        {watchlist.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Star className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Saved Markets Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start saving interesting markets by clicking the <Star className="w-4 h-4 inline" /> button on any market card
              </p>
              <Link href="/">
                <Button>Browse Markets</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Watchlist Grid */}
        {watchlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {watchlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="polymarket-card-gradient hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-3 flex-1">
                        {item.market_question}
                      </CardTitle>
                      <Button
                        onClick={async () => {
                          await removeFromWatchlist(item.market_id)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Notes */}
                    {item.notes && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          📝 {item.notes}
                        </p>
                      </div>
                    )}

                    {/* Alert Status */}
                    {item.alert_enabled && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          🔔 Alert Active
                        </Badge>
                        {item.alert_price && (
                          <span className="text-sm text-green-700 dark:text-green-300">
                            @ {formatPrice(item.alert_price)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Added Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Added {new Date(item.added_at).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/?market=${item.market_id}`} className="w-full">
                        <Button variant="outline" className="w-full" size="sm">
                          View Market
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          // TODO: Integrate with Polymarket URL once available
                          window.open(`https://polymarket.com/event/${item.market_id}`, '_blank')
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Polymarket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

