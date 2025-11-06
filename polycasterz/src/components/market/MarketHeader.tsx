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
  Bell,
  History,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { WalletConnectButton } from '@/components/wallet/WalletConnect'
import { RobotLogo } from '@/components/ui/RobotLogo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MARKET_CATEGORIES, SORT_OPTIONS, SORT_ORDER } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAlertNotifications } from '@/hooks/useAlertNotifications'
import { useOnboarding } from '@/components/onboarding/OnboardingProvider'
import { HelpButton } from '@/components/onboarding/HelpButton'

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
  filters?: {
    status?: 'active' | 'closed' | 'all'
    priceMin?: number
    priceMax?: number
    volumeMin?: number
    volumeMax?: number
  }
  onFilterChange?: (key: string, value: any) => void
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
  marketStats,
  filters = {},
  onFilterChange
}: MarketHeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { triggeredCount } = useAlertNotifications()
  
  // Onboarding - only use if available (graceful fallback)
  let onboardingContext: { startTour: () => void } | null = null
  try {
    onboardingContext = useOnboarding()
  } catch {
    // Onboarding not available, continue without it
  }

  const handleFilterChange = (key: string, value: any) => {
    if (onFilterChange) {
      onFilterChange(key, value)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="polycaster-header-gradient sticky top-0 z-50 border-b border-blue-200 dark:border-blue-700"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 polycaster-gradient rounded-lg flex items-center justify-center shadow-lg">
                <RobotLogo size="md" animated={true} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-white polycaster-text-gradient">
                  PolyCaster
                </h1>
                <p className="text-xs text-blue-200 font-medium hidden lg:block">
                  AI-Powered Prediction Markets
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full" data-onboarding="search">
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

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden text-white hover:bg-white/10 p-2"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 text-sm"
              >
                Browse
              </Button>
            </Link>
            <Link href="/watchlist" data-onboarding="watchlist">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
              >
                <Star className="w-4 h-4" />
                <span className="hidden xl:inline">Watchlist</span>
              </Button>
            </Link>
            <Link href="/alerts" data-onboarding="alerts">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 relative text-sm"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden xl:inline">Alerts</span>
                {triggeredCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse text-[10px]">
                    {triggeredCount > 9 ? '9+' : triggeredCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/history">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 text-sm"
              >
                <History className="w-4 h-4" />
                <span className="hidden xl:inline">History</span>
              </Button>
            </Link>
            <ThemeToggle />
            {onboardingContext && (
              <HelpButton onStartTour={onboardingContext.startTour} />
            )}
            <div className="hidden xl:block" data-onboarding="wallet">
              <WalletConnectButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white hover:bg-white/10 p-2"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-3"
          >
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
          </motion.div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 py-3"
          >
            <div className="flex flex-col space-y-2">
              <Link href="/" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                >
                  Browse
                </Button>
              </Link>
              <Link href="/watchlist" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>Watchlist</span>
                </Button>
              </Link>
              <Link href="/alerts" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span>Alerts</span>
                  {triggeredCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {triggeredCount > 9 ? '9+' : triggeredCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/history" onClick={() => setShowMobileMenu(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 flex items-center space-x-2"
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </Button>
              </Link>
              <div className="pt-2 border-t border-white/10">
                <WalletConnectButton />
              </div>
            </div>
          </motion.div>
        )}

        {/* Market Stats */}
        <div className="py-3 sm:py-4 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {marketStats.totalMarkets.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-white/80">Total Markets</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                ${(marketStats.totalVolume / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs sm:text-sm text-white/80">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {marketStats.activeMarkets.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-white/80">Active Markets</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                {marketStats.trendingMarkets.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-white/80">Trending</div>
            </div>
          </div>
        </div>

        {/* Filters and Categories */}
        <div className="py-3 sm:py-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide" data-onboarding="categories">
              {MARKET_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    "whitespace-nowrap transition-all duration-200 text-xs sm:text-sm",
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
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 flex items-center space-x-2 text-xs sm:text-sm"
              >
                <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              <div className="flex items-center space-x-1 sm:space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="bg-white/10 text-white border-white/20 rounded-md px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20 p-1.5 sm:p-2"
                >
                  <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
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
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || 'all'}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full bg-white/10 text-white border-white/20 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all" className="bg-gray-800 text-white">All Markets</option>
                    <option value="active" className="bg-gray-800 text-white">Active Only</option>
                    <option value="closed" className="bg-gray-800 text-white">Closed Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Price Range (¢)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min ¢"
                      value={filters.priceMin !== undefined ? Math.round(filters.priceMin * 100) : ''}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseFloat(e.target.value) / 100 : undefined)}
                      min="0"
                      max="100"
                      step="1"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                    <Input
                      type="number"
                      placeholder="Max ¢"
                      value={filters.priceMax !== undefined ? Math.round(filters.priceMax * 100) : ''}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseFloat(e.target.value) / 100 : undefined)}
                      min="0"
                      max="100"
                      step="1"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Volume Range ($)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.volumeMin || ''}
                      onChange={(e) => handleFilterChange('volumeMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                      min="0"
                      step="100"
                      className="bg-white/10 text-white border-white/20 placeholder-white/50"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.volumeMax || ''}
                      onChange={(e) => handleFilterChange('volumeMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                      min="0"
                      step="100"
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
