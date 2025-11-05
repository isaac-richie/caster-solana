-- Price Alerts table for Phase 1
-- This table stores user-defined price alerts for markets

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  market_id TEXT NOT NULL,
  market_question TEXT NOT NULL,
  target_price DECIMAL(10, 4) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below', 'equals')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  
  -- Additional metadata
  notes TEXT,
  
  -- Ensure valid price
  CONSTRAINT valid_target_price CHECK (target_price >= 0 AND target_price <= 1)
);

-- Create indexes for fast lookups
CREATE INDEX idx_price_alerts_user_wallet ON price_alerts(user_wallet);
CREATE INDEX idx_price_alerts_market_id ON price_alerts(market_id);
CREATE INDEX idx_price_alerts_status ON price_alerts(status);
CREATE INDEX idx_price_alerts_created_at ON price_alerts(created_at DESC);

-- Composite index for active alerts polling
CREATE INDEX idx_price_alerts_active ON price_alerts(status, last_checked_at) 
  WHERE status = 'active';

-- Add RLS (Row Level Security) policies
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own alerts
CREATE POLICY "Users can view their own alerts"
  ON price_alerts FOR SELECT
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only create their own alerts
CREATE POLICY "Users can create their own alerts"
  ON price_alerts FOR INSERT
  WITH CHECK (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only update their own alerts
CREATE POLICY "Users can update their own alerts"
  ON price_alerts FOR UPDATE
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only delete their own alerts
CREATE POLICY "Users can delete their own alerts"
  ON price_alerts FOR DELETE
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

