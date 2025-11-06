-- Add email field to users table for email notifications
-- This migration adds email support to the users table
-- Safe to run multiple times (idempotent)
-- 
-- IMPORTANT: Run migration 000_users.sql FIRST if users table doesn't exist

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'email'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email TEXT;
    COMMENT ON COLUMN public.users.email IS 'User email address for notifications';
  END IF;
END $$;

-- Add email_verified column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    COMMENT ON COLUMN public.users.email_verified IS 'Whether the email has been verified';
  END IF;
END $$;

-- Add email_verification_token column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'email_verification_token'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email_verification_token TEXT;
    COMMENT ON COLUMN public.users.email_verification_token IS 'Token for email verification';
  END IF;
END $$;

-- Create index for email lookups (idempotent)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email) 
  WHERE email IS NOT NULL;

-- Note: Uncomment below if you want to enforce unique emails per user
-- This prevents multiple users from using the same email
-- DO $$ 
-- BEGIN
--   IF NOT EXISTS (
--     SELECT 1 FROM pg_constraint 
--     WHERE conname = 'unique_user_email'
--   ) THEN
--     ALTER TABLE public.users ADD CONSTRAINT unique_user_email UNIQUE (email);
--   END IF;
-- END $$;

