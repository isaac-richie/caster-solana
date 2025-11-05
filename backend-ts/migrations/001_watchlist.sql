-- Watchlist table for Phase 1
-- This table stores users' saved/watched markets

CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  market_id TEXT NOT NULL,
  market_question TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  alert_enabled BOOLEAN DEFAULT FALSE,
  alert_price DECIMAL(10, 4),
  
  -- Indexes for fast lookups
  CONSTRAINT watchlist_unique UNIQUE (user_wallet, market_id)
);

-- Create indexes
CREATE INDEX idx_watchlist_user_wallet ON watchlist(user_wallet);
CREATE INDEX idx_watchlist_market_id ON watchlist(market_id);
CREATE INDEX idx_watchlist_added_at ON watchlist(added_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Users can only see their own watchlist
CREATE POLICY "Users can view their own watchlist"
  ON watchlist FOR SELECT
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only insert their own watchlist items
CREATE POLICY "Users can insert their own watchlist items"
  ON watchlist FOR INSERT
  WITH CHECK (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only update their own watchlist items
CREATE POLICY "Users can update their own watchlist items"
  ON watchlist FOR UPDATE
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

-- Users can only delete their own watchlist items
CREATE POLICY "Users can delete their own watchlist items"
  ON watchlist FOR DELETE
  USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);

