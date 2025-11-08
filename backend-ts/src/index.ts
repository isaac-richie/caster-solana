import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { facilitatorService } from './services/facilitator'
import { polymarketService } from './services/polymarket'
import { aiEngineService } from './services/ai-engine'
import { databaseService } from './services/database'
import { alertCheckerService } from './services/alert-checker'
import { emailService } from './services/email'
import { Market, Signal, User, AIAnalysisRequest, WatchlistItem, PriceAlert } from './types'
import { randomUUID } from 'crypto'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
// CORS configuration - allow frontend and localhost for development
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.length === 0 || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.warn('⚠️  WARNING: FRONTEND_URL not set - CORS allows all origins (INSECURE)')
  console.warn('⚠️  Set FRONTEND_URL in environment variables for production')
}

app.use(express.json())

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const polymarketHealthy = await polymarketService.healthCheck()
    const aiHealthy = await aiEngineService.healthCheck()
    const databaseHealthy = await databaseService.healthCheck()
    
    res.json({
      status: 'healthy',
      services: {
        api: 'running',
        polymarket: polymarketHealthy ? 'healthy' : 'unhealthy',
        ai_engine: aiHealthy ? 'healthy' : 'unhealthy',
        facilitator: 'healthy',
        database: databaseHealthy ? 'healthy' : 'unhealthy'
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed'
    })
  }
})

// Facilitator endpoints
app.post('/api/payment/settle', async (req, res) => {
  try {
    const { resourceUrl, paymentData, price } = req.body

    if (!resourceUrl || !paymentData) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required parameters: resourceUrl and paymentData' 
      })
    }

    const result = await facilitatorService.settlePayment(resourceUrl, paymentData, price)
    res.status(result.status).json(result.responseBody)
  } catch (error) {
    console.error('Payment settlement error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Payment settlement failed' 
    })
  }
})

app.get('/api/payment/methods', async (req, res) => {
  try {
    const chainId = req.query.chainId ? parseInt(req.query.chainId as string) : undefined
    const methods = await facilitatorService.getSupportedPaymentMethods(chainId)
    res.json({ success: true, methods })
  } catch (error) {
    console.error('Get payment methods error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to get payment methods' 
    })
  }
})

// Markets endpoints
app.get('/markets', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    // Fetch latest markets (sorted by updated date) just like Polymarket
    const markets = await polymarketService.getMarketsByCategory('all', limit)
    res.json({ 
      success: true, 
      count: markets.length, 
      markets 
    })
  } catch (error) {
    console.error('Error fetching markets:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch markets' 
    })
  }
})

// Search markets
app.get('/markets/search', async (req, res) => {
  try {
    const searchTerm = req.query.q as string
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20

    if (!searchTerm || searchTerm.trim().length === 0) {
      return res.json({
        success: true,
        count: 0,
        markets: [],
        message: 'No search term provided'
      })
    }

    const markets = await polymarketService.searchMarkets(searchTerm, limit)

    res.json({
      success: true,
      count: markets.length,
      markets,
      searchTerm
    })
  } catch (error) {
    console.error('Error searching markets:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search markets'
    })
  }
})

// Markets by category
app.get('/markets/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 24
    const year = req.query.year ? parseInt(req.query.year as string) : undefined
    const fromDays = req.query.fromDays ? parseInt(req.query.fromDays as string) : undefined

    // Fetch from Polymarket service with resilient filtering
    let markets = await polymarketService.getMarketsByCategory(category, limit)
    const originalMarkets = markets

    // Optional year filter (checks created_at, updated_at, end_date)
    if (year) {
      const isYear = (iso?: string) => {
        if (!iso) return false
        const d = new Date(iso)
        return !isNaN(d.getTime()) && d.getUTCFullYear() === year
      }
      markets = markets.filter(m =>
        isYear(m.created_at) || isYear(m.updated_at) || isYear(m.end_date)
      )
    }

    // Optional recency filter (fromDays)
    if (fromDays && fromDays > 0) {
      const now = Date.now()
      const horizon = now - fromDays * 24 * 60 * 60 * 1000
      const isRecent = (iso?: string) => {
        if (!iso) return false
        const t = new Date(iso).getTime()
        return !isNaN(t) && t >= horizon
      }
      markets = markets.filter(m =>
        isRecent(m.updated_at) || isRecent(m.created_at) || isRecent(m.end_date)
      )
      // Fallback: if recency filter yields nothing, serve the original list
      if (markets.length === 0) {
        markets = originalMarkets
      }
    }

    res.json({
      success: true,
      count: markets.length,
      markets,
    })
  } catch (error) {
    console.error(`Error fetching markets for category ${req.params.category}:`, error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category markets'
    })
  }
})

app.get('/markets/active', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const markets = await polymarketService.getActiveMarkets(limit)
    res.json({ 
      success: true, 
      count: markets.length, 
      markets,
      type: 'active'
    })
  } catch (error) {
    console.error('Error fetching active markets:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch active markets' 
    })
  }
})

app.get('/markets/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 24
    const markets = await polymarketService.getRecentMarkets(limit)
    res.json({ 
      success: true, 
      count: markets.length, 
      markets,
      type: 'recent'
    })
  } catch (error) {
    console.error('Error fetching recent markets:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent markets' 
    })
  }
})

app.get('/markets/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20
    const markets = await polymarketService.getHighVolumeMarkets(limit)
    res.json({ 
      success: true, 
      count: markets.length, 
      markets,
      type: 'trending'
    })
  } catch (error) {
    console.error('Error fetching trending markets:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch trending markets' 
    })
  }
})

app.get('/markets/overview', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    
    const [activeMarkets, recentMarkets, trendingMarkets] = await Promise.all([
      polymarketService.getActiveMarkets(limit),
      polymarketService.getRecentMarkets(limit),
      polymarketService.getHighVolumeMarkets(limit)
    ])
    
    res.json({ 
      success: true,
      overview: {
        active: {
          count: activeMarkets.length,
          markets: activeMarkets
        },
        recent: {
          count: recentMarkets.length,
          markets: recentMarkets
        },
        trending: {
          count: trendingMarkets.length,
          markets: trendingMarkets
        }
      }
    })
  } catch (error) {
    console.error('Error fetching market overview:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch market overview' 
    })
  }
})

app.get('/markets/categories', async (req, res) => {
  try {
    const categories = await polymarketService.getCategories()
    res.json({ 
      success: true, 
      categories,
      count: categories.length
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch categories' 
    })
  }
})

app.get('/markets/category/:category/analytics', async (req, res) => {
  try {
    const { category } = req.params
    const limit = parseInt(req.query.limit as string) || 20
    
    // Get markets for the category
    const markets = await polymarketService.getMarketsByCategory(category, limit * 2)
    
    // Separate into recent and active markets
    const activeMarkets = markets.filter(market => market.active && !market.closed)
    const recentMarkets = markets
      .filter(market => market.created_at)
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, limit)
    
    // Calculate category statistics
    const totalVolume = markets.reduce((sum, market) => sum + market.volume, 0)
    const totalLiquidity = markets.reduce((sum, market) => sum + market.liquidity, 0)
    const avgPrice = markets.reduce((sum, market) => sum + market.current_price, 0) / markets.length
    
    // Price trend analysis
    const upTrends = markets.filter(market => market.price_trend === 'up').length
    const downTrends = markets.filter(market => market.price_trend === 'down').length
    const stableTrends = markets.filter(market => market.price_trend === 'stable').length
    
    // Volume leaders
    const volumeLeaders = markets
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5)
    
    // Price movers (biggest changes)
    const priceMovers = markets
      .sort((a, b) => Math.abs(b.price_change_percent) - Math.abs(a.price_change_percent))
      .slice(0, 5)
    
    res.json({
      success: true,
      category,
      analytics: {
        overview: {
          total_markets: markets.length,
          active_markets: activeMarkets.length,
          recent_markets: recentMarkets.length,
          total_volume: totalVolume,
          total_liquidity: totalLiquidity,
          average_price: Math.round(avgPrice * 1000) / 1000
        },
        trends: {
          up: upTrends,
          down: downTrends,
          stable: stableTrends,
          trend_distribution: {
            up_percent: Math.round((upTrends / markets.length) * 100),
            down_percent: Math.round((downTrends / markets.length) * 100),
            stable_percent: Math.round((stableTrends / markets.length) * 100)
          }
        },
        leaders: {
          volume_leaders: volumeLeaders.map(market => ({
            id: market.id,
            question: market.question,
            volume: market.volume,
            liquidity: market.liquidity,
            current_price: market.current_price,
            price_trend: market.price_trend
          })),
          price_movers: priceMovers.map(market => ({
            id: market.id,
            question: market.question,
            price_change_24h: market.price_change_24h,
            price_change_percent: market.price_change_percent,
            price_trend: market.price_trend,
            current_price: market.current_price
          }))
        },
        markets: {
          active: activeMarkets.slice(0, limit),
          recent: recentMarkets.slice(0, limit)
        }
      }
    })
  } catch (error) {
    console.error(`Error fetching analytics for category ${req.params.category}:`, error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category analytics'
    })
  }
})

app.get('/markets/:id', async (req, res) => {
  try {
    const { id } = req.params
    const market = await polymarketService.getMarketById(id)
    
    if (!market) {
      return res.status(404).json({
        success: false,
        error: 'Market not found'
      })
    }
    
    res.json({ success: true, market })
  } catch (error) {
    console.error('Error fetching market:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market'
    })
  }
})


// AI Analysis endpoint
app.post('/ai/analyze/:marketId', async (req, res) => {
  try {
    const { marketId } = req.params
    const { payment_verified, user_wallet, transaction_hash }: AIAnalysisRequest = req.body

    // Always require payment verification
    if (!payment_verified) {
      return res.status(402).json({ 
        success: false,
        error: 'Payment required. Please verify payment via frontend.' 
      })
    }

    // If transaction hash provided, verify it on-chain
    if (transaction_hash && user_wallet) {
      // TODO: Add on-chain verification of the payment transaction
      // For now, we trust the frontend verification
      console.log(`✅ Payment verified: ${transaction_hash} from ${user_wallet}`)
    }

    // Get market data
    const market = await polymarketService.getMarketById(marketId)
    if (!market) {
      return res.status(404).json({ 
        success: false,
        error: 'Market not found' 
      })
    }

    // Generate AI signal
    const signal = await aiEngineService.generateSignal(market, user_wallet)

    // Store signal in database if user wallet provided
    if (user_wallet) {
      try {
        // Ensure user exists
        let user = await databaseService.getUserByWallet(user_wallet)
        if (!user) {
          user = await databaseService.createUser({ wallet_address: user_wallet })
        }

        // Store the signal with user wallet
        console.log(`💾 Storing signal for user ${user_wallet}...`)
        const storedSignal = await databaseService.createSignal({
          ...signal,
          user_wallet: user_wallet
        })

        if (storedSignal) {
          console.log(`✅ Signal stored successfully: ${storedSignal.id}`)
          // Update user stats
          await databaseService.updateUser(user_wallet, {
            total_signals_purchased: (user.total_signals_purchased || 0) + 1,
            total_spent: (user.total_spent || 0) + 0.2
          })
          console.log(`✅ User stats updated for ${user_wallet}`)
        } else {
          console.warn(`⚠️  Signal storage returned null for user ${user_wallet}`)
        }
      } catch (dbError) {
        console.error('❌ Database error storing signal:', dbError)
        // Continue without failing the request
      }
    }

    res.json({ 
      success: true, 
      signal,
      market: {
        id: market.id,
        question: market.question,
        current_price: market.current_price
      }
    })
  } catch (error) {
    console.error('AI analysis error:', error)
    res.status(500).json({ 
      success: false,
      error: 'AI analysis failed' 
    })
  }
})

// User endpoints
app.post('/users', async (req, res) => {
  try {
    const { wallet_address } = req.body

    if (!wallet_address) {
      return res.status(400).json({ 
        success: false,
        error: 'Wallet address is required' 
      })
    }

    // Check if user already exists
    let user = await databaseService.getUserByWallet(wallet_address)
    if (user) {
      return res.json({ 
        success: true, 
        user,
        message: 'User already exists'
      })
    }

    // Create new user
    user = await databaseService.createUser({ wallet_address })
    if (!user) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create user' 
      })
    }

    res.json({ 
      success: true, 
      user,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('User creation error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to create user' 
    })
  }
})

app.get('/users/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const user = await databaseService.getUserByWallet(walletAddress)
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error('User fetch error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user' 
    })
  }
})

app.get('/users/:walletAddress/stats', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const stats = await databaseService.getUserStats(walletAddress)
    
    if (!stats) {
      return res.status(404).json({ 
        success: false,
        error: 'User stats not found' 
      })
    }

    res.json({ success: true, stats })
  } catch (error) {
    console.error('User stats error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user stats' 
    })
  }
})

app.get('/users/:walletAddress/signals', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const limit = parseInt(req.query.limit as string) || 10
    const signals = await databaseService.getSignalsByUser(walletAddress, limit)
    
    res.json({ 
      success: true, 
      signals,
      count: signals.length
    })
  } catch (error) {
    console.error('User signals error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch user signals' 
    })
  }
})

// Update user email
app.patch('/users/:walletAddress/email', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { email } = req.body

    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid email address is required' 
      })
    }

    // Get or create user
    let user = await databaseService.getUserByWallet(walletAddress)
    if (!user) {
      user = await databaseService.createUser({ wallet_address: walletAddress })
      if (!user) {
        return res.status(500).json({ 
          success: false,
          error: 'Failed to create user' 
        })
      }
    }

    // Generate verification token
    const verificationToken = randomUUID()

    // Update user with email (unverified)
    const updatedUser = await databaseService.updateUser(walletAddress, {
      email,
      email_verified: false,
      email_verification_token: verificationToken,
    })

    if (!updatedUser) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update user email' 
      })
    }

    // Send verification email
    console.log(`📧 Sending verification email to: ${email}`)
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken)
    
    if (!emailSent) {
      console.error('❌ Failed to send verification email')
      // Still return success for user update, but indicate email wasn't sent
      return res.json({ 
        success: true, 
        user: updatedUser,
        emailSent: false,
        message: 'Email updated, but verification email failed to send. Please try resending verification.',
        warning: 'Verification email could not be sent. Please check Resend configuration.'
      })
    }

    console.log(`✅ Verification email sent successfully to: ${email}`)
    res.json({ 
      success: true, 
      user: updatedUser,
      emailSent: true,
      message: 'Email updated. Please check your inbox to verify your email address.'
    })
  } catch (error) {
    console.error('Email update error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to update email' 
    })
  }
})

// Verify email
app.get('/users/verify-email', async (req, res) => {
  try {
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ 
        success: false,
        error: 'Verification token is required' 
      })
    }

    // Find user by verification token
    const user = await databaseService.getUserByEmailVerificationToken(token)
    
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired verification token' 
      })
    }

    // Verify email
    const updatedUser = await databaseService.updateUser(user.wallet_address, {
      email_verified: true,
      email_verification_token: null, // Clear token after verification
    })

    if (!updatedUser) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to verify email' 
      })
    }

    res.json({ 
      success: true, 
      user: updatedUser,
      message: 'Email verified successfully! You will now receive email notifications for price alerts.'
    })
  } catch (error) {
    console.error('Email verification error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify email' 
    })
  }
})

// Watchlist endpoints
app.post('/watchlist', async (req, res) => {
  try {
    const { user_wallet, market_id, market_question, notes, alert_enabled, alert_price } = req.body

    if (!user_wallet || !market_id || !market_question) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: user_wallet, market_id, market_question' 
      })
    }

    // Check if already in watchlist
    const exists = await databaseService.isInWatchlist(user_wallet, market_id)
    if (exists) {
      return res.status(409).json({ 
        success: false,
        error: 'Market already in watchlist' 
      })
    }

    const watchlistItem = await databaseService.addToWatchlist({
      user_wallet,
      market_id,
      market_question,
      notes: notes || '',
      alert_enabled: alert_enabled || false,
      alert_price: alert_price || null
    })

    if (!watchlistItem) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add to watchlist' 
      })
    }

    res.json({ 
      success: true, 
      watchlistItem,
      message: 'Added to watchlist successfully'
    })
  } catch (error) {
    console.error('Watchlist add error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to add to watchlist' 
    })
  }
})

app.get('/watchlist/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const watchlist = await databaseService.getWatchlist(walletAddress)
    
    res.json({ 
      success: true, 
      watchlist,
      count: watchlist.length
    })
  } catch (error) {
    console.error('Watchlist fetch error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch watchlist' 
    })
  }
})

app.delete('/watchlist/:walletAddress/:marketId', async (req, res) => {
  try {
    const { walletAddress, marketId } = req.params
    const success = await databaseService.removeFromWatchlist(walletAddress, marketId)
    
    if (!success) {
      return res.status(404).json({ 
        success: false,
        error: 'Watchlist item not found' 
      })
    }

    res.json({ 
      success: true,
      message: 'Removed from watchlist successfully'
    })
  } catch (error) {
    console.error('Watchlist remove error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove from watchlist' 
    })
  }
})

app.patch('/watchlist/:walletAddress/:marketId', async (req, res) => {
  try {
    const { walletAddress, marketId } = req.params
    const updates = req.body

    const watchlistItem = await databaseService.updateWatchlistItem(walletAddress, marketId, updates)
    
    if (!watchlistItem) {
      return res.status(404).json({ 
        success: false,
        error: 'Watchlist item not found' 
      })
    }

    res.json({ 
      success: true,
      watchlistItem,
      message: 'Watchlist item updated successfully'
    })
  } catch (error) {
    console.error('Watchlist update error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to update watchlist item' 
    })
  }
})

app.get('/watchlist/:walletAddress/check/:marketId', async (req, res) => {
  try {
    const { walletAddress, marketId } = req.params
    const isInWatchlist = await databaseService.isInWatchlist(walletAddress, marketId)
    
    res.json({ 
      success: true,
      isInWatchlist
    })
  } catch (error) {
    console.error('Watchlist check error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to check watchlist' 
    })
  }
})

// Price Alerts endpoints
app.post('/alerts', async (req, res) => {
  try {
    const { user_wallet, market_id, market_question, target_price, condition, notes } = req.body

    if (!user_wallet || !market_id || !market_question || target_price == null || !condition) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: user_wallet, market_id, market_question, target_price, condition' 
      })
    }

    // Validate target price (must be between 0 and 1)
    if (target_price < 0 || target_price > 1) {
      return res.status(400).json({ 
        success: false,
        error: 'target_price must be between 0 and 1' 
      })
    }

    // Validate condition
    if (!['above', 'below', 'equals'].includes(condition)) {
      return res.status(400).json({ 
        success: false,
        error: 'condition must be one of: above, below, equals' 
      })
    }

    const alert = await databaseService.createAlert({
      user_wallet,
      market_id,
      market_question,
      target_price,
      condition,
      status: 'active',
      notification_sent: false,
      notes: notes || ''
    })

    if (!alert) {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to create alert' 
      })
    }

    res.json({ 
      success: true, 
      alert,
      message: 'Alert created successfully'
    })
  } catch (error) {
    console.error('Alert creation error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to create alert' 
    })
  }
})

app.get('/alerts/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { status } = req.query

    const alerts = await databaseService.getAlerts(
      walletAddress,
      status as 'active' | 'triggered' | 'cancelled' | undefined
    )
    
    res.json({ 
      success: true, 
      alerts,
      count: alerts.length
    })
  } catch (error) {
    console.error('Alerts fetch error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch alerts' 
    })
  }
})

app.get('/alerts/active/all', async (req, res) => {
  try {
    const alerts = await databaseService.getActiveAlerts()
    
    res.json({ 
      success: true, 
      alerts,
      count: alerts.length
    })
  } catch (error) {
    console.error('Active alerts fetch error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch active alerts' 
    })
  }
})

app.patch('/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params
    const updates = req.body

    const alert = await databaseService.updateAlert(alertId, updates)
    
    if (!alert) {
      return res.status(404).json({ 
        success: false,
        error: 'Alert not found' 
      })
    }

    res.json({ 
      success: true,
      alert,
      message: 'Alert updated successfully'
    })
  } catch (error) {
    console.error('Alert update error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to update alert' 
    })
  }
})

app.delete('/alerts/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params
    const success = await databaseService.deleteAlert(alertId)
    
    if (!success) {
      return res.status(404).json({ 
        success: false,
        error: 'Alert not found' 
      })
    }

    res.json({ 
      success: true,
      message: 'Alert deleted successfully'
    })
  } catch (error) {
    console.error('Alert deletion error:', error)
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete alert' 
    })
  }
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found' 
  })
})

// Start server
app.listen(PORT, () => {
  const baseUrl = process.env.FRONTEND_URL || `http://localhost:${PORT}`
  console.log(`🚀 PolyCaster TypeScript backend running on port ${PORT}`)
  console.log(`📊 Health check: ${baseUrl}/health`)
  console.log(`💳 Facilitator: ${baseUrl}/api/payment/settle`)
  console.log(`📈 Markets: ${baseUrl}/markets`)
  console.log(`🤖 AI Analysis: ${baseUrl}/ai/analyze/:marketId`)
  console.log(`🔔 Alerts: ${baseUrl}/alerts`)
  
  // Start alert checker service
  alertCheckerService.start()
  console.log(`🔔 Alert checker service started (checks every 30s)`)
})
