'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MarketHeader } from '@/components/market/MarketHeader'
import { MarketCard } from '@/components/market/MarketCard'
import { AIAnalysisModal } from '@/components/ai/AIAnalysisModal'
import { useMarkets, useMarketFilters } from '@/hooks'
import { Market } from '@/types'
import { 
  formatPrice, 
  formatVolume, 
  formatLiquidity, 
  formatTimeRemaining,
  cn
} from '@/lib/utils'
import { 
  TrendingUp, 
  Flame, 
  CircleDot, 
  Target,
  Loader2
} from 'lucide-react'
import { normalizeCategory } from '@/lib/categories'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)

  const { filters, updateFilter } = useMarketFilters()

  // Fetch markets data (category-aware)
  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true)
      setError(null)
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        let url
        
        // If there's a search term, use search API
        if (searchTerm && searchTerm.trim().length > 0) {
          url = `${API_URL}/markets/search?q=${encodeURIComponent(searchTerm)}&limit=50`
          console.log(`Searching markets for: "${searchTerm}"`)
        } else {
          // Otherwise fetch by category
          const isAll = !filters.category || filters.category === 'All'
          const limit = isAll ? 50 : 100
          url = isAll
            ? `${API_URL}/markets?limit=${limit}`
            : `${API_URL}/markets/category/${encodeURIComponent(normalizeCategory(filters.category))}?limit=${limit}`
          console.log(`Fetching markets from: ${url}`)
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        let fetched = data.markets || []

        console.log(`Fetched ${fetched.length} markets`)

        // Fallback: if category endpoint returns empty and not searching, fetch all markets
        if (!searchTerm && (!filters.category || filters.category !== 'All') && fetched.length === 0) {
          console.log('No markets found for category, fetching all markets as fallback')
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
          const allRes = await fetch(`${API_URL}/markets?limit=50`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const allData = await allRes.json()
          fetched = allData.markets || []
        }

        setMarkets(fetched)
      } catch (error) {
        console.error('Backend error:', error)
        setError('Failed to load markets')
        setMarkets([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchMarkets()
    }, searchTerm ? 500 : 0) // 500ms delay for search, immediate for category change

    return () => clearTimeout(timeoutId)
  }, [filters.category, searchTerm])

  // Apply client-side filtering for status, price range, and volume range
  const filteredMarkets = markets.filter(market => {
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !market.active) return false
      if (filters.status === 'closed' && market.active) return false
    }

    // Price range filter (convert to cents for comparison)
    const priceInCents = market.current_price * 100
    if (filters.priceMin !== undefined && priceInCents < filters.priceMin * 100) return false
    if (filters.priceMax !== undefined && priceInCents > filters.priceMax * 100) return false

    // Volume range filter
    if (filters.volumeMin !== undefined && market.volume < filters.volumeMin) return false
    if (filters.volumeMax !== undefined && market.volume > filters.volumeMax) return false

    return true
  })

  // Get trending markets (highest volume)
  const trendingMarkets = [...filteredMarkets]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 6)

  // Get live markets (active and recent) - sorted by most recently updated
  const liveMarkets = filteredMarkets
    .filter(market => market.active && !market.closed)
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at || 0).getTime()
      const dateB = new Date(b.updated_at || b.created_at || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 8)

  // Calculate market stats
  const marketStats = {
    totalMarkets: markets.length,
    totalVolume: markets.reduce((sum, market) => sum + market.volume, 0),
    activeMarkets: markets.filter(market => market.active).length,
    trendingMarkets: trendingMarkets.length
  }

  const handleAnalyze = async (marketId: string) => {
    const market = markets.find(m => m.id === marketId)
    if (market) {
      setSelectedMarket(market)
      setIsAnalysisModalOpen(true)
    }
  }

  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false)
    setSelectedMarket(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading markets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <MarketHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={filters.category || 'All'}
        onCategoryChange={(category) => updateFilter('category', category)}
        sortBy={filters.sortBy || 'volume'}
        onSortChange={(sort) => updateFilter('sortBy', sort)}
        sortOrder={filters.sortOrder || 'desc'}
        onSortOrderChange={(order) => updateFilter('sortOrder', order)}
        marketStats={marketStats}
        filters={{
          status: filters.status,
          priceMin: filters.priceMin,
          priceMax: filters.priceMax,
          volumeMin: filters.volumeMin,
          volumeMax: filters.volumeMax,
        }}
        onFilterChange={(key, value) => updateFilter(key as keyof typeof filters, value)}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Show Trending section only for "All" category */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Trending Markets</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trendingMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={true}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Live Markets Section - For "All" category, show only recent live markets */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-2 mb-6">
              <CircleDot className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Markets</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {liveMarkets.length} live
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={true}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Live Markets Section - For specific categories, show ALL markets under "Live Markets" */}
        {filters.category && filters.category !== 'All' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <CircleDot className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live {filters.category} Markets
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredMarkets.length} markets
              </span>
            </div>
            
            {filteredMarkets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No markets found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map((market) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    compact={false}
                    onAnalyze={handleAnalyze}
                  />
                ))}
              </div>
            )}
          </motion.section>
        )}

        {/* All Markets Section - Only show for "All" category */}
        {(!filters.category || filters.category === 'All') && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <Target className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Markets</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredMarkets.length} markets
            </span>
          </div>
          
          {filteredMarkets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No markets found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  compact={false}
                  onAnalyze={handleAnalyze}
                />
              ))}
            </div>
          )}
          </motion.section>
        )}
      </div>

      {/* AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        market={selectedMarket}
      />
    </div>
  )
}