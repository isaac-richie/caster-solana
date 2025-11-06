-- Users table - Base migration
-- This table stores user accounts linked to wallet addresses
-- Run this BEFORE migration 003_add_user_email.sql

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  total_signals_purchased INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = wallet_address OR wallet_address IS NOT NULL);

-- Users can insert their own profile
CREATE POLICY "Users can create their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid()::text = wallet_address OR wallet_address IS NOT NULL);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid()::text = wallet_address OR wallet_address IS NOT NULL);

-- Add comments
COMMENT ON TABLE public.users IS 'User accounts linked to wallet addresses';
COMMENT ON COLUMN public.users.wallet_address IS 'Unique wallet address identifier';
COMMENT ON COLUMN public.users.is_active IS 'Whether the user account is active';
COMMENT ON COLUMN public.users.total_signals_purchased IS 'Total number of AI signals purchased';
COMMENT ON COLUMN public.users.total_spent IS 'Total amount spent on signals';
COMMENT ON COLUMN public.users.metadata IS 'Additional user metadata (JSON)';

