export interface Market {
  id: string
  question: string
  description: string
  current_price: number
  confidence: string
  end_date: string
  category: string
  volume: number
  liquidity: number
  price_change_24h: number
  price_change_percent: number
  price_trend: 'up' | 'down' | 'stable'
  outcomes: string
  active: boolean
  closed: boolean
  created_at?: string
  updated_at?: string
  raw_data: any
}

export interface Signal {
  id: string
  market_id: string
  market_question: string
  signal_type: string
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence_score: number
  price_target: number
  reasoning: string
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  raw_analysis: string
  created_at: string
  user_wallet?: string
  market_category?: string
  // Premium $100 analysis fields
  executive_summary?: string
  market_context?: string
  fundamental_analysis?: string
  technical_analysis?: string
  market_microstructure?: string
  key_factors?: string[]
  risk_assessment?: string
  opportunity_analysis?: string
  price_analysis?: string
  competitive_analysis?: string
  action_plan?: string
}

export interface User {
  id: string
  wallet_address: string
  email?: string
  email_verified?: boolean
  email_verification_token?: string
  created_at: string
  updated_at: string
  is_active: boolean
  total_signals_purchased: number
  total_spent: number
  metadata: any
}

export interface PaymentData {
  transaction_hash: string
  amount: number
  currency: string
  wallet_address: string
  status: 'pending' | 'verified' | 'failed'
}

export interface FacilitatorResponse {
  status: number
  responseBody: {
    success: boolean
    message: string
    transaction_hash?: string
    result?: any
    error?: string
  }
  responseHeaders: Record<string, string>
}

export interface PolymarketMarket {
  id: string
  question: string
  description: string
  end_date_iso: string
  volume: number
  outcome_prices: number[]
  active: boolean
  closed: boolean
  categories: string[]
  raw_data: any
}

export interface AIAnalysisRequest {
  market_id?: string
  payment_verified: boolean
  user_wallet?: string
  transaction_hash?: string
}

export interface AIAnalysisResponse {
  success: boolean
  signal?: Signal
  error?: string
}

// Watchlist types
export interface WatchlistItem {
  id: string
  user_wallet: string
  market_id: string
  market_question: string
  added_at: string
  notes?: string
  alert_enabled: boolean
  alert_price?: number
}

// Price Alert types
export interface PriceAlert {
  id: string
  user_wallet: string
  market_id: string
  market_question: string
  target_price: number
  condition: 'above' | 'below' | 'equals'
  status: 'active' | 'triggered' | 'cancelled'
  created_at: string
  triggered_at?: string
  last_checked_at?: string
  notification_sent: boolean
  notes?: string
}
