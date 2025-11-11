-- Add chain tracking to signals table
-- This migration adds a chain column to track which blockchain (EVM or Solana) was used for each signal purchase
-- Safe to run multiple times (idempotent)

-- Add chain column to signals table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'signals' AND column_name = 'chain'
  ) THEN
    ALTER TABLE public.signals ADD COLUMN chain TEXT CHECK (chain IN ('evm', 'solana'));
    COMMENT ON COLUMN public.signals.chain IS 'Blockchain used for payment: evm (Base Sepolia) or solana (Solana Mainnet)';
  END IF;
END $$;

-- Add chain column to users table if it doesn't exist (for tracking primary chain)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'primary_chain'
  ) THEN
    ALTER TABLE public.users ADD COLUMN primary_chain TEXT CHECK (primary_chain IN ('evm', 'solana'));
    COMMENT ON COLUMN public.users.primary_chain IS 'Primary blockchain used by user: evm or solana';
  END IF;
END $$;

-- Create index for chain lookups in signals
CREATE INDEX IF NOT EXISTS idx_signals_chain ON public.signals(chain);
CREATE INDEX IF NOT EXISTS idx_signals_user_chain ON public.signals(user_wallet, chain);

-- Add comment
COMMENT ON TABLE public.signals IS 'AI analysis signals purchased by users, with chain tracking for payment method';

