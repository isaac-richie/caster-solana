// Environment configuration for TypeScript backend
// Copy this to .env and update with your actual values

export const config = {
  // Server Configuration
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Thirdweb Configuration
  THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY || '',
  SERVER_WALLET_ADDRESS: process.env.SERVER_WALLET_ADDRESS || '0x2983D066D42a79295dFAC0F752EA2FA7940C33dA',

  // Supabase Configuration
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://jejfuksuzmsvqmgweopi.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || '',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || '',

  // Polymarket API
  POLYMARKET_API_URL: process.env.POLYMARKET_API_URL || 'https://gamma-api.polymarket.com/markets',

  // AI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'llama3.2:latest',

  // Base Chain Configuration
  BASE_RPC_URL: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
  USDC_CONTRACT_ADDRESS: process.env.USDC_CONTRACT_ADDRESS || '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  MIN_PAYMENT_AMOUNT: parseFloat(process.env.MIN_PAYMENT_AMOUNT || '0.5')
}



