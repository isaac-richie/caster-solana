import axios from 'axios'
import { Market, PolymarketMarket } from '../types'

export class PolymarketService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.POLYMARKET_API_URL || 'https://gamma-api.polymarket.com/markets'
  }

  async getTrendingMarkets(): Promise<Market[]> {
    try {
      const response = await axios.get(`${this.apiUrl}?active=true&closed=false&limit=40`)
      const markets = response.data || [] // API returns array directly, not wrapped in 'data'

      // Filter out expired markets
      const now = Date.now()
      const activeMarkets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        return market.active === true && market.closed !== true && endDate > now
      })

      if (activeMarkets.length > 0) {
        return activeMarkets.map((market: any) => this.transformMarket(market)).slice(0, 20)
      }

      console.warn('Polymarket API returned no active markets')
      return []
    } catch (error) {
      console.error('Error fetching trending markets:', error)
      return []
    }
  }

  async getMarketById(marketId: string): Promise<Market | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/${marketId}`)
      return this.transformMarket(response.data)
    } catch (error) {
      console.error(`Error fetching market ${marketId}:`, error)
      return null
    }
  }

  async getMarketsByCategory(category: string): Promise<Market[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}?category=${encodeURIComponent(category)}&active=true&closed=false&sortBy=updatedAt&sortOrder=desc&limit=200`
      )
      const markets = response.data || [] // API returns array directly
      
      return markets.map((market: any) => this.transformMarket(market))
    } catch (error) {
      console.error(`Error fetching markets for category ${category}:`, error)
      return []
    }
  }

  async getActiveMarkets(limit: number = 20): Promise<Market[]> {
    try {
      const response = await axios.get(`${this.apiUrl}?active=true&closed=false&sortBy=updatedAt&sortOrder=desc&limit=${limit * 2}`)
      const markets = response.data || []
      
      // Filter out expired markets
      const now = Date.now()
      const activeMarkets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        return market.active === true && market.closed !== true && endDate > now
      })
      
      if (activeMarkets.length > 0) {
        return activeMarkets.map((market: any) => this.transformMarket(market)).slice(0, limit)
      }
      
      console.warn('No active markets found')
      return []
    } catch (error) {
      console.error('Error fetching active markets:', error)
      return []
    }
  }

  async getRecentMarkets(limit: number = 24): Promise<Market[]> {
    try {
      // NOTE: Polymarket rarely creates truly "new" markets (newest are from Dec 2024)
      // Instead, show "Fresh" markets - recently active with good volume
      // Fetch more markets to ensure we have enough after filtering
      const fetchLimit = Math.max(limit * 4, 100)
      const response = await axios.get(`${this.apiUrl}?active=true&closed=false&limit=${fetchLimit}&sortBy=updatedAt&sortOrder=desc`)
      const markets = response.data || []
      
      const now = Date.now()
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000) // 7 days
      
      // Filter for recently updated markets with decent volume (active/fresh markets)
      const freshMarkets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        const updatedDate = new Date(market.updatedAt || market.updated_at_iso || 0).getTime()
        const volume = parseFloat(market.volume || market.volume24hr || '0')
        
        return (
          market.active === true && 
          market.closed !== true && 
          endDate > now &&
          updatedDate > sevenDaysAgo && // Updated in last 7 days
          volume > 1000 // Has some trading activity (>$1000)
        )
      })
      
      // Sort by volume (most active first)
      freshMarkets.sort((a: any, b: any) => {
        const volumeA = parseFloat(a.volume || a.volume24hr || '0')
        const volumeB = parseFloat(b.volume || b.volume24hr || '0')
        return volumeB - volumeA
      })
      
      if (freshMarkets.length > 0) {
        console.log(`Found ${freshMarkets.length} fresh/active markets`)
        return freshMarkets.map((market: any) => this.transformMarket(market)).slice(0, limit)
      }
      
      console.warn('No fresh markets found, returning recently updated ones')
      // Fallback: just return recently updated markets
      const fallbackMarkets = markets
        .filter((market: any) => {
          const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
          return market.active === true && market.closed !== true && endDate > now
        })
        .slice(0, limit)
      
      return fallbackMarkets.map((market: any) => this.transformMarket(market))
    } catch (error) {
      console.error('Error fetching recent markets:', error)
      return []
    }
  }

  async getHighVolumeMarkets(limit: number = 20): Promise<Market[]> {
    try {
      // Get markets with high volume (sorted by volume)
      const response = await axios.get(`${this.apiUrl}?active=true&closed=false&limit=${limit * 2}&sortBy=volume&sortOrder=desc`)
      const markets = response.data || []
      
      // Filter out expired markets
      const now = Date.now()
      const activeMarkets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        return market.active === true && market.closed !== true && endDate > now
      })
      
      if (activeMarkets.length > 0) {
        return activeMarkets.map((market: any) => this.transformMarket(market)).slice(0, limit)
      }
      
      console.warn('No high volume markets found')
      return []
    } catch (error) {
      console.error('Error fetching high volume markets:', error)
      return []
    }
  }

  private transformMarket(market: any): Market {
    // Parse outcome prices from string array
    let outcomePrices: number[] = []
    try {
      if (market.outcomePrices && typeof market.outcomePrices === 'string') {
        outcomePrices = JSON.parse(market.outcomePrices)
      } else if (Array.isArray(market.outcomePrices)) {
        outcomePrices = market.outcomePrices
      }
    } catch (e) {
      console.warn('Failed to parse outcome prices:', market.outcomePrices)
    }

    // Parse outcomes from string array
    let outcomes: string[] = []
    try {
      if (market.outcomes && typeof market.outcomes === 'string') {
        outcomes = JSON.parse(market.outcomes)
      } else if (Array.isArray(market.outcomes)) {
        outcomes = market.outcomes
      }
    } catch (e) {
      console.warn('Failed to parse outcomes:', market.outcomes)
    }

    const currentPrice = outcomePrices[0] || 0.5
    const volume = market.volumeNum || market.volume || 0
    const liquidity = market.liquidityNum || market.liquidity || 0
    
    // Use real price change data from Polymarket API
    const priceChange24h = market.oneDayPriceChange || 0
    const priceChangePercent = priceChange24h * 100 // Convert to percentage
    const priceTrend = this.determinePriceTrend(priceChange24h)

    // Generate Polymarket URL
    const slug = market.slug || market.id
    const marketUrl = slug ? `https://polymarket.com/event/${slug}` : `https://polymarket.com`

    return {
      id: market.id?.toString() || '',
      question: market.question || '',
      description: market.description || '',
      current_price: currentPrice,
      confidence: this.calculateConfidence(outcomePrices),
      end_date: market.endDate || market.end_date_iso || '',
      category: (market.category || 'general').trim(),
      volume: volume,
      liquidity: liquidity,
      price_change_24h: priceChange24h,
      price_change_percent: priceChangePercent,
      price_trend: priceTrend,
      outcomes: outcomes.join('/') || 'Yes/No',
      active: market.active || false,
      closed: market.closed || false,
      created_at: market.createdAt || market.created_at_iso,
      updated_at: market.updatedAt || market.updated_at_iso,
      url: marketUrl,
      raw_data: market
    }
  }

  private calculateConfidence(prices: number[]): string {
    if (!prices || prices.length === 0) return 'Unknown'
    
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const spread = maxPrice - minPrice
    
    if (spread < 0.1) return 'High'
    if (spread < 0.3) return 'Medium'
    return 'Low'
  }

  private determinePriceTrend(priceChange: number): 'up' | 'down' | 'stable' {
    if (priceChange > 0.01) return 'up'
    if (priceChange < -0.01) return 'down'
    return 'stable'
  }

  async searchMarkets(searchTerm: string, limit: number = 20): Promise<Market[]> {
    try {
      if (!searchTerm || searchTerm.trim().length === 0) {
        return []
      }

      console.log(`Searching markets for: "${searchTerm}"`)
      
      // Polymarket API doesn't have a direct search endpoint, so we fetch markets and filter
      // Fetch more markets to increase chances of finding matches
      const response = await axios.get(
        `${this.apiUrl}?active=true&closed=false&sortBy=updatedAt&sortOrder=desc&limit=200`
      )
      const markets = response.data || []
      
      // Filter out expired markets first
      const now = Date.now()
      const activeMarkets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        return market.active === true && market.closed !== true && endDate > now
      })
      
      // Search in question and description
      const searchLower = searchTerm.toLowerCase()
      const matchingMarkets = activeMarkets.filter((market: any) => {
        const question = (market.question || '').toLowerCase()
        const description = (market.description || '').toLowerCase()
        return question.includes(searchLower) || description.includes(searchLower)
      })
      
      console.log(`Found ${matchingMarkets.length} markets matching "${searchTerm}"`)
      
      return matchingMarkets
        .map((market: any) => this.transformMarket(market))
        .slice(0, limit)
    } catch (error) {
      console.error('Error searching markets:', error)
      return []
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.apiUrl}?limit=100`)
      const markets = response.data || []
      
      // Extract unique categories from markets
      const categories = [...new Set(markets.map((market: any) => market.category).filter(Boolean))]
      
      if (categories.length > 0) {
        return categories.sort()
      }
      
      // Return default categories if API fails
      console.warn('No categories found from API, using default categories')
      return ['Crypto', 'Sports', 'Tech', 'Politics', 'Economics', 'Entertainment']
    } catch (error) {
      console.error('Error fetching categories:', error)
      return ['Crypto', 'Sports', 'Tech', 'Politics', 'Economics', 'Entertainment']
    }
  }

  async getMarketsByCategory(category: string, limit: number = 20): Promise<Market[]> {
    try {
      // Polymarket API doesn't properly categorize markets - all return "general"
      // So we'll fetch all active markets and return them regardless of category
      console.log(`Fetching markets for category: ${category}`)
      
      // If "all" category, return recently updated/active markets (most relevant)
      if (!category || category.toLowerCase() === 'all') {
        const response = await axios.get(
          `${this.apiUrl}?active=true&closed=false&sortBy=updatedAt&sortOrder=desc&limit=${limit * 2}`
        )
        const markets = response.data || []
        
        // Filter to only include markets that are:
        // 1. Active and not closed
        // 2. Have future end dates (not expired)
        const now = Date.now()
        const activeMarkets = markets.filter((market: any) => {
          const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
          const isActive = market.active === true
          const isClosed = market.closed === true
          const isStillOpen = endDate > now
          
          return isActive && !isClosed && isStillOpen
        })
        
        return activeMarkets.map((market: any) => this.transformMarket(market)).slice(0, limit)
      }
      
      // For specific categories, fetch the MAXIMUM (500) recently updated markets to ensure we have enough for filtering
      // This gives us the best chance of finding category-specific markets with recent activity
      const response = await axios.get(
        `${this.apiUrl}?active=true&closed=false&sortBy=updatedAt&sortOrder=desc&limit=500`
      )
      let markets = response.data || []
      
      // First filter: Remove expired/closed markets
      const now = Date.now()
      markets = markets.filter((market: any) => {
        const endDate = new Date(market.endDate || market.end_date_iso || 0).getTime()
        const isActive = market.active === true
        const isClosed = market.closed === true
        const isStillOpen = endDate > now
        
        return isActive && !isClosed && isStillOpen
      })
      
      // Second filter: Keyword-based category filtering (STRICT - no fallback)
      let filteredMarkets = markets.filter((market: any) => {
        const question = (market.question || '').toLowerCase()
        const description = (market.description || '').toLowerCase()
        const combined = question + ' ' + description
        const cat = category.toLowerCase()
        
        // Keyword matching for different categories (more specific and non-overlapping)
        switch(cat) {
          case 'crypto':
            // Only crypto-specific terms, exclude generic financial terms
            return /\b(crypto|bitcoin|btc|eth|ethereum|solana|defi|tether|usdt|usdc|blockchain|token|coin|doge|ada|bnb)\b/.test(combined) &&
                   !/\b(stock|fed|inflation|unemployment|gdp)\b/.test(combined)
          
          case 'sports':
            return /\b(nba|nfl|mlb|nhl|premier league|champions league|world cup|super bowl|playoffs|championship|basketball|football|baseball|soccer|tennis|golf|f1|formula 1|verstappen|russell|norris)\b/.test(combined) ||
                   question.includes('sports') || question.includes('athlete')
          
          case 'tech':
            // Include space tech but exclude pure science
            return /\b(ai|openai|chatgpt|gpt|artificial intelligence|tech|apple|google|microsoft|amazon|meta|facebook|tesla|spacex|starship|launch|twitter|x\.com|software|app|iphone|android)\b/.test(combined) &&
                   !/\b(vaccine|pandemic|disease|climate|global warming|nuclear weapon)\b/.test(combined)
          
          case 'economics':
            // Only economics/finance, exclude crypto
            return /\b(fed|federal reserve|inflation|gdp|recession|interest rate|rate cut|rate hike|unemployment|jobs|economy|economic|stock market|dow|nasdaq|s&p)\b/.test(combined) &&
                   !/\b(crypto|bitcoin|ethereum|blockchain)\b/.test(combined)
          
          case 'us-current-affairs':
          case 'politics':
            return /\b(trump|biden|harris|kamala|president|election|vote|congress|senate|republican|democrat|gop|white house|capitol|governor|mayor|putin|netanyahu|khamenei)\b/.test(combined) ||
                   question.includes('politic')
          
          case 'pop-culture':
          case 'culture':
            return /\b(movie|film|oscar|grammy|emmy|music|album|artist|celebrity|actor|actress|box office|netflix|hbo|disney|marvel|star wars|taylor swift|beyonce|kanye)\b/.test(combined)
          
          case 'science':
            // Pure science: health, climate, research - exclude tech/space business
            return /\b(vaccine|pandemic|disease|virus|bird flu|covid|climate|global warming|hottest year|scientific|medical|health)\b/.test(combined) &&
                   !/\b(spacex|launch|tesla|tech|software|recession|election)\b/.test(combined)
          
          default:
            // For unknown categories, return empty array (no matches)
            return false
        }
      })
      
      // Transform and return ONLY filtered markets (no fallback to all markets)
      const transformedMarkets = filteredMarkets.slice(0, limit).map((market: any) => this.transformMarket(market))
      console.log(`Found ${transformedMarkets.length} markets for category: ${category}`)
      
      // If we have very few markets, log a warning but still return them (don't fallback to all)
      if (transformedMarkets.length < 5) {
        console.warn(`Low market count for category ${category}: ${transformedMarkets.length} markets`)
      }
      
      return transformedMarkets
    } catch (error) {
      console.error(`Error fetching markets for category ${category}:`, error)
      return []
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${this.apiUrl}?limit=1`)
      return true
    } catch (error) {
      console.error('Polymarket API health check failed:', error)
      return false
    }
  }

}

export const polymarketService = new PolymarketService()
