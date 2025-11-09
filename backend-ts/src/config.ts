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
  BASE_RPC_URL: process.env.BASE_RPC_URL || 'https://sepolia.base.org',
  USDC_CONTRACT_ADDRESS: process.env.USDC_CONTRACT_ADDRESS || '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  MIN_PAYMENT_AMOUNT: parseFloat(process.env.MIN_PAYMENT_AMOUNT || '0.5')
}



