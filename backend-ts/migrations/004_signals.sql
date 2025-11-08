-- Signals table for storing AI analysis signals
-- This table stores purchased AI analysis signals for users
-- Safe to run multiple times (idempotent)

CREATE TABLE IF NOT EXISTS public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id TEXT NOT NULL,
  market_question TEXT NOT NULL,
  signal_type TEXT NOT NULL DEFAULT 'PRICE_PREDICTION',
  recommendation TEXT NOT NULL CHECK (recommendation IN ('BUY', 'SELL', 'HOLD')),
  confidence_score INTEGER NOT NULL, -- Stored as percentage (0-100)
  price_target INTEGER NOT NULL, -- Stored as cents (0-100)
  reasoning TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  raw_analysis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_wallet TEXT
);

-- Add premium $100 analysis fields if they don't exist (idempotent)
DO $$
BEGIN
  -- executive_summary
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'executive_summary'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN executive_summary TEXT;
  END IF;

  -- market_context
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'market_context'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN market_context TEXT;
  END IF;

  -- fundamental_analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'fundamental_analysis'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN fundamental_analysis TEXT;
  END IF;

  -- technical_analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'technical_analysis'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN technical_analysis TEXT;
  END IF;

  -- market_microstructure
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'market_microstructure'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN market_microstructure TEXT;
  END IF;

  -- key_factors
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'key_factors'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN key_factors JSONB;
  END IF;

  -- risk_assessment
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'risk_assessment'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN risk_assessment TEXT;
  END IF;

  -- opportunity_analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'opportunity_analysis'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN opportunity_analysis TEXT;
  END IF;

  -- price_analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'price_analysis'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN price_analysis TEXT;
  END IF;

  -- competitive_analysis
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'competitive_analysis'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN competitive_analysis TEXT;
  END IF;

  -- action_plan
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'action_plan'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN action_plan TEXT;
  END IF;
END $$;

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_signals_user_wallet ON public.signals(user_wallet);
CREATE INDEX IF NOT EXISTS idx_signals_market_id ON public.signals(market_id);
CREATE INDEX IF NOT EXISTS idx_signals_created_at ON public.signals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_recommendation ON public.signals(recommendation);

-- Composite index for user signal history
CREATE INDEX IF NOT EXISTS idx_signals_user_created ON public.signals(user_wallet, created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Users can view their own signals (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'signals' 
    AND policyname = 'Users can view their own signals'
  ) THEN
    CREATE POLICY "Users can view their own signals"
      ON public.signals FOR SELECT
      USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);
  END IF;
END $$;

-- Service role can insert signals (for backend) - idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'signals' 
    AND policyname = 'Service can insert signals'
  ) THEN
    CREATE POLICY "Service can insert signals"
      ON public.signals FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Users can update their own signals (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'signals' 
    AND policyname = 'Users can update their own signals'
  ) THEN
    CREATE POLICY "Users can update their own signals"
      ON public.signals FOR UPDATE
      USING (auth.uid()::text = user_wallet OR user_wallet IS NOT NULL);
  END IF;
END $$;

-- Add comments
COMMENT ON TABLE public.signals IS 'AI analysis signals purchased by users';
COMMENT ON COLUMN public.signals.user_wallet IS 'Wallet address of the user who purchased this signal';
COMMENT ON COLUMN public.signals.confidence_score IS 'Confidence score as percentage (0-100)';
COMMENT ON COLUMN public.signals.price_target IS 'Price target as cents (0-100)';
COMMENT ON COLUMN public.signals.key_factors IS 'Array of key factors (JSONB)';

