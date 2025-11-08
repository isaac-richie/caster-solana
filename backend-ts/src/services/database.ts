import { createClient } from '@supabase/supabase-js'
import { User, Signal, Market, WatchlistItem, PriceAlert } from '../types'

export class DatabaseService {
  private supabase

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  WARNING: Supabase credentials not found in environment variables')
      console.warn('⚠️  SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
      console.warn('⚠️  SUPABASE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing')
      this.supabase = null
      return
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseKey)
      console.log('✅ Supabase client initialized')
      console.log(`✅ Supabase URL: ${supabaseUrl.substring(0, 30)}...`)
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error)
      this.supabase = null
    }
  }

  // User operations
  async createUser(userData: { wallet_address: string }): Promise<User | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock user')
      return this.createMockUser(userData.wallet_address)
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .insert({
          wallet_address: userData.wallet_address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          total_signals_purchased: 0,
          total_spent: 0,
          metadata: {}
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user:', error)
        return null
      }

      return data as User
    } catch (error) {
      console.error('Database error creating user:', error)
      return null
    }
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock user')
      return this.createMockUser(walletAddress)
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle() // Use maybeSingle instead of single to handle 0 rows

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return data as User
    } catch (error) {
      console.error('Database error fetching user:', error)
      return null
    }
  }

  async getUserByEmailVerificationToken(token: string): Promise<User | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - cannot find user by token')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('email_verification_token', token)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user by token:', error)
        return null
      }

      return data as User | null
    } catch (error) {
      console.error('Database error fetching user by token:', error)
      return null
    }
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - cannot update user')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        return null
      }

      return data as User
    } catch (error) {
      console.error('Database error updating user:', error)
      return null
    }
  }

  // Signal operations
  async createSignal(signalData: Signal): Promise<Signal | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock signal')
      return signalData
    }

    try {
      // Remove market_category if it exists since it's not in the database schema
      const { market_category, ...signalToInsert } = signalData
      
      // Convert decimal values to integers for database storage
      // confidence_score: 0.85 -> 85 (percentage)
      // price_target: 0.75 -> 75 (cents)
      const dbSignal = {
        ...signalToInsert,
        confidence_score: Math.round((signalToInsert.confidence_score || 0) * 100),
        price_target: Math.round((signalToInsert.price_target || 0) * 100)
      }
      
      const { data, error } = await this.supabase
        .from('signals')
        .insert(dbSignal)
        .select()
        .single()

      if (error) {
        console.error('Error creating signal:', error)
        return null
      }

      // Convert back to decimals for API response
      const returnSignal = {
        ...data,
        confidence_score: (data.confidence_score || 0) / 100,
        price_target: (data.price_target || 0) / 100
      } as Signal

      return returnSignal
    } catch (error) {
      console.error('Database error creating signal:', error)
      return null
    }
  }

  async getSignalsByUser(walletAddress: string, limit: number = 10): Promise<Signal[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty signals')
      return []
    }

    try {
      // Get user-specific signals
      const { data, error } = await this.supabase
        .from('signals')
        .select('*')
        .eq('user_wallet', walletAddress)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user signals:', error)
        return []
      }

      // Convert integers back to decimals
      return (data || []).map(signal => ({
        ...signal,
        confidence_score: (signal.confidence_score || 0) / 100,
        price_target: (signal.price_target || 0) / 100
      })) as Signal[]
    } catch (error) {
      console.error('Database error fetching user signals:', error)
      return []
    }
  }

  async getSignalsByMarket(marketId: string, limit: number = 10): Promise<Signal[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty signals')
      return []
    }

    try {
      const { data, error } = await this.supabase
        .from('signals')
        .select('*')
        .eq('market_id', marketId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching market signals:', error)
        return []
      }

      // Convert integers back to decimals
      return (data || []).map(signal => ({
        ...signal,
        confidence_score: (signal.confidence_score || 0) / 100,
        price_target: (signal.price_target || 0) / 100
      })) as Signal[]
    } catch (error) {
      console.error('Database error fetching market signals:', error)
      return []
    }
  }

  // Market operations
  async createMarket(marketData: Market): Promise<Market | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock market')
      return marketData
    }

    try {
      const { data, error } = await this.supabase
        .from('markets')
        .insert(marketData)
        .select()
        .single()

      if (error) {
        console.error('Error creating market:', error)
        return null
      }

      return data as Market
    } catch (error) {
      console.error('Database error creating market:', error)
      return null
    }
  }

  async getMarketById(marketId: string): Promise<Market | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning null market')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('markets')
        .select('*')
        .eq('id', marketId)
        .single()

      if (error) {
        console.error('Error fetching market:', error)
        return null
      }

      return data as Market
    } catch (error) {
      console.error('Database error fetching market:', error)
      return null
    }
  }

  async getMarketsByCategory(category: string, limit: number = 20): Promise<Market[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty markets')
      return []
    }

    try {
      const { data, error } = await this.supabase
        .from('markets')
        .select('*')
        .eq('category', category)
        .eq('active', true)
        .order('volume', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching markets by category:', error)
        return []
      }

      return data as Market[]
    } catch (error) {
      console.error('Database error fetching markets by category:', error)
      return []
    }
  }

  // Analytics operations
  async getUserStats(walletAddress: string): Promise<any> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock stats')
      return {
        total_signals: 0,
        total_spent: 0,
        success_rate: 0,
        favorite_categories: []
      }
    }

    try {
      // Get user-specific signals for stats
      const { data: signals, error: signalsError } = await this.supabase
        .from('signals')
        .select('*')
        .eq('user_wallet', walletAddress)

      if (signalsError) {
        console.error('Error fetching user signals for stats:', signalsError)
        return null
      }

      const totalSignals = signals?.length || 0
      const successfulSignals = signals?.filter(s => s.recommendation === 'BUY').length || 0
      const successRate = totalSignals > 0 ? (successfulSignals / totalSignals) * 100 : 0

      // Get favorite categories by analyzing market questions
      const favoriteCategories = ['General', 'Crypto', 'Politics'] // Default categories

      return {
        total_signals: totalSignals,
        total_spent: totalSignals * 0.2, // Assuming $0.20 per signal
        success_rate: Math.round(successRate * 100) / 100,
        favorite_categories: favoriteCategories
      }
    } catch (error) {
      console.error('Database error fetching user stats:', error)
      return null
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    if (!this.supabase) {
      console.warn('Supabase not available for health check')
      return false
    }

    try {
      const { error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1)

      return !error
    } catch (error) {
      console.error('Supabase health check failed:', error)
      return false
    }
  }

  // Watchlist operations
  async addToWatchlist(watchlistData: Omit<WatchlistItem, 'id' | 'added_at'>): Promise<WatchlistItem | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock watchlist item')
      return {
        ...watchlistData,
        id: `watchlist-${Date.now()}`,
        added_at: new Date().toISOString()
      } as WatchlistItem
    }

    try {
      const { data, error } = await this.supabase
        .from('watchlist')
        .insert({
          ...watchlistData,
          added_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error adding to watchlist:', error)
        return null
      }

      return data as WatchlistItem
    } catch (error) {
      console.error('Database error adding to watchlist:', error)
      return null
    }
  }

  async removeFromWatchlist(walletAddress: string, marketId: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn('Supabase not available - cannot remove from watchlist')
      return false
    }

    try {
      const { error } = await this.supabase
        .from('watchlist')
        .delete()
        .eq('user_wallet', walletAddress)
        .eq('market_id', marketId)

      if (error) {
        console.error('Error removing from watchlist:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Database error removing from watchlist:', error)
      return false
    }
  }

  async getWatchlist(walletAddress: string): Promise<WatchlistItem[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty watchlist')
      return []
    }

    try {
      const { data, error } = await this.supabase
        .from('watchlist')
        .select('*')
        .eq('user_wallet', walletAddress)
        .order('added_at', { ascending: false })

      if (error) {
        console.error('Error fetching watchlist:', error)
        return []
      }

      return data as WatchlistItem[]
    } catch (error) {
      console.error('Database error fetching watchlist:', error)
      return []
    }
  }

  async isInWatchlist(walletAddress: string, marketId: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning false')
      return false
    }

    try {
      const { data, error } = await this.supabase
        .from('watchlist')
        .select('id')
        .eq('user_wallet', walletAddress)
        .eq('market_id', marketId)
        .maybeSingle()

      if (error) {
        console.error('Error checking watchlist:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Database error checking watchlist:', error)
      return false
    }
  }

  async updateWatchlistItem(walletAddress: string, marketId: string, updates: Partial<WatchlistItem>): Promise<WatchlistItem | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - cannot update watchlist')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('watchlist')
        .update(updates)
        .eq('user_wallet', walletAddress)
        .eq('market_id', marketId)
        .select()
        .single()

      if (error) {
        console.error('Error updating watchlist item:', error)
        return null
      }

      return data as WatchlistItem
    } catch (error) {
      console.error('Database error updating watchlist item:', error)
      return null
    }
  }

  // Price Alert operations
  async createAlert(alertData: Omit<PriceAlert, 'id' | 'created_at' | 'triggered_at' | 'last_checked_at'>): Promise<PriceAlert | null> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning mock alert')
      return {
        ...alertData,
        id: `alert-${Date.now()}`,
        created_at: new Date().toISOString()
      } as PriceAlert
    }

    try {
      const { data, error } = await this.supabase
        .from('price_alerts')
        .insert({
          ...alertData,
          created_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating alert:', error)
        return null
      }

      return data as PriceAlert
    } catch (error) {
      console.error('Database error creating alert:', error)
      return null
    }
  }

  async getAlerts(walletAddress: string, status?: 'active' | 'triggered' | 'cancelled'): Promise<PriceAlert[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty alerts')
      return []
    }

    try {
      let query = this.supabase
        .from('price_alerts')
        .select('*')
        .eq('user_wallet', walletAddress)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching alerts:', error)
        return []
      }

      return data as PriceAlert[]
    } catch (error) {
      console.error('Database error fetching alerts:', error)
      return []
    }
  }

  async getAlertById(alertId: string): Promise<PriceAlert | null> {
    if (!this.supabase) {
      console.warn('Supabase not available')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('price_alerts')
        .select('*')
        .eq('id', alertId)
        .single()

      if (error) {
        console.error('Error fetching alert:', error)
        return null
      }

      return data as PriceAlert
    } catch (error) {
      console.error('Database error fetching alert:', error)
      return null
    }
  }

  async updateAlert(alertId: string, updates: Partial<PriceAlert>): Promise<PriceAlert | null> {
    if (!this.supabase) {
      console.warn('Supabase not available')
      return null
    }

    try {
      const { data, error } = await this.supabase
        .from('price_alerts')
        .update(updates)
        .eq('id', alertId)
        .select()
        .single()

      if (error) {
        console.error('Error updating alert:', error)
        return null
      }

      return data as PriceAlert
    } catch (error) {
      console.error('Database error updating alert:', error)
      return null
    }
  }

  async deleteAlert(alertId: string): Promise<boolean> {
    if (!this.supabase) {
      console.warn('Supabase not available')
      return false
    }

    try {
      const { error } = await this.supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)

      if (error) {
        console.error('Error deleting alert:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Database error deleting alert:', error)
      return false
    }
  }

  async getActiveAlerts(): Promise<PriceAlert[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty alerts')
      return []
    }

    try {
      const { data, error } = await this.supabase
        .from('price_alerts')
        .select('*')
        .eq('status', 'active')
        .order('last_checked_at', { ascending: true, nullsFirst: true })

      if (error) {
        console.error('❌ Supabase error fetching active alerts:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return []
      }

      return (data || []) as PriceAlert[]
    } catch (error) {
      console.error('❌ Database error fetching active alerts:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : String(error),
        hint: 'Check Supabase connection and credentials',
        code: error instanceof Error && 'code' in error ? String(error.code) : ''
      })
      
      // Check if it's a network/fetch error
      if (error instanceof Error && error.message.includes('fetch')) {
        console.error('⚠️  Network error - Check:')
        console.error('   1. Supabase URL is correct:', process.env.SUPABASE_URL)
        console.error('   2. Internet connection is active')
        console.error('   3. Supabase service is accessible')
      }
      
      return []
    }
  }

  async getAlertsByMarket(marketId: string): Promise<PriceAlert[]> {
    if (!this.supabase) {
      console.warn('Supabase not available - returning empty alerts')
      return []
    }

    try {
      const { data, error } = await this.supabase
        .from('price_alerts')
        .select('*')
        .eq('market_id', marketId)
        .eq('status', 'active')

      if (error) {
        console.error('Error fetching market alerts:', error)
        return []
      }

      return data as PriceAlert[]
    } catch (error) {
      console.error('Database error fetching market alerts:', error)
      return []
    }
  }

  // Mock data helpers
  private createMockUser(walletAddress: string): User {
    return {
      id: `user-${Date.now()}`,
      wallet_address: walletAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      total_signals_purchased: 0,
      total_spent: 0,
      metadata: {}
    }
  }
}

export const databaseService = new DatabaseService()
