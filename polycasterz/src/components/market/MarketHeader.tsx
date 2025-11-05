'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Flame, 
  CircleDot,
  ArrowUpDown,
  SlidersHorizontal,
  Star,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { WalletConnectButton } from '@/components/wallet/WalletConnect'
import { RobotLogo } from '@/components/ui/RobotLogo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MARKET_CATEGORIES, SORT_OPTIONS, SORT_ORDER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAlertNotifications } from '@/hooks/useAlertNotifications'

interface MarketHeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  marketStats: {
    totalMarkets: number
    totalVolume: number
    activeMarkets: number
    trendingMarkets: number
  }
}

export function MarketHeader({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  marketStats
}: MarketHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { triggeredCount } = useAlertNotifications()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="polycaster-header-gradient sticky top-0 z-50 border-b border-blue-200 dark:border-blue-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 polycaster-gradient rounded-lg flex items-center justify-center shadow-lg">
                <RobotLogo size="md" animated={true} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white polycaster-text-gradient">
                  PolyCaster
                </h1>
                <p className="text-xs text-blue-200 font-medium">
                  AI-Powered Prediction Markets
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
              >
                Browse
              </Button>
            </Link>
            <Link href="/watchlist">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Star className="w-4 h-4" />
                <span>Watchlist</span>
              </Button>
            </Link>
            <Link href="/alerts">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 relative"
              >
                <Bell className="w-4 h-4" />
                <span>Alerts</span>
                {triggeredCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {triggeredCount > 9 ? '9+' : triggeredCount}
                  </span>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <WalletConnectButton />
          </div>
        </div>

        {/* Market Stats */}
        <div className="py-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {marketStats.totalMarkets.toLocaleString()}
              </div>
              <div className="text-sm text-white/80">Total Markets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                ${(marketStats.totalVolume / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-white/80">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {marketStats.activeMarkets.toLocaleString()}
              </div>
              <div className="text-sm text-white/80">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {marketStats.trendingMarkets.toLocaleString()}
              </div>
              <div className="text-sm text-white/80">Trending</div>
            </div>
          </div>
        </div>

        {/* Filters and Categories */}
        <div className="py-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {MARKET_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "whitespace-nowrap transition-all duration-200",
                    selectedCategory === category
                      ? "polymarket-gradient text-white shadow-md"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="bg-white/10 text-white border-white/20 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-2"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Status
                  </label>
                  <select className="w-full bg-white/10 text-white border-white/20 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all" className="bg-gray-800 text-white">All Markets</option>
                    <option value="active" className="bg-gray-800 text-white">Active Only</option>
                    <option value="closed" className="bg-gray-800 text-white">Closed Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Volume Range
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
