// Load environment variables FIRST before any imports
import dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env from the backend-ts directory
dotenv.config({ path: resolve(__dirname, '../.env') })

// Verify env is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in environment variables')
  console.log('   Make sure .env file exists in backend-ts directory')
  process.exit(1)
}

// Now import services after env is loaded
import { AIEngineService } from '../src/services/ai-engine'
import { Market } from '../src/types'

// Create a new instance after env is loaded
const aiEngineService = new AIEngineService()

// Test market data
const testMarket: Market = {
  id: 'test-market-123',
  question: 'Will Bitcoin reach $100,000 by the end of 2024?',
  description: 'This market tracks whether Bitcoin will reach $100,000 USD by December 31, 2024.',
  category: 'crypto',
  current_price: 0.65,
  volume: 50000,
  liquidity: 250000,
  end_date: '2024-12-31T23:59:59Z',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

async function testOpenAI() {
  console.log('🧪 Testing OpenAI Integration...\n')
  console.log('📊 Test Market:')
  console.log(`   Question: ${testMarket.question}`)
  console.log(`   Current Price: $${testMarket.current_price}`)
  console.log(`   Volume: $${testMarket.volume.toLocaleString()}`)
  console.log(`   Liquidity: $${testMarket.liquidity.toLocaleString()}\n`)

  // Test health check
  console.log('🔍 Testing health check...')
  const isHealthy = await aiEngineService.healthCheck()
  console.log(`   Health Status: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`)

  if (!isHealthy) {
    console.error('❌ OpenAI service is not healthy. Please check your API key.')
    process.exit(1)
  }

  // Test signal generation
  console.log('🤖 Generating AI signal...')
  console.log('   This may take 10-30 seconds...\n')

  try {
    const startTime = Date.now()
    const signal = await aiEngineService.generateSignal(testMarket)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('✅ Signal Generated Successfully!\n')
    console.log('📈 Signal Details:')
    console.log(`   Recommendation: ${signal.recommendation}`)
    console.log(`   Confidence: ${(signal.confidence_score * 100).toFixed(1)}%`)
    console.log(`   Price Target: $${signal.price_target.toFixed(3)}`)
    console.log(`   Risk Level: ${signal.risk_level}`)
    console.log(`   Generation Time: ${duration}s\n`)

    if (signal.executive_summary) {
      console.log('📝 Executive Summary:')
      console.log(`   ${signal.executive_summary}\n`)
    }

    if (signal.reasoning) {
      console.log('💭 Reasoning:')
      console.log(`   ${signal.reasoning}\n`)
    }

    if (signal.key_factors && signal.key_factors.length > 0) {
      console.log('🔑 Key Factors:')
      signal.key_factors.forEach((factor, i) => {
        console.log(`   ${i + 1}. ${factor}`)
      })
      console.log()
    }

    if (signal.market_context) {
      console.log('📊 Market Context:')
      console.log(`   ${signal.market_context}\n`)
    }

    if (signal.fundamental_analysis) {
      console.log('💡 Fundamental Analysis:')
      console.log(`   ${signal.fundamental_analysis}\n`)
    }

    if (signal.technical_analysis) {
      console.log('📈 Technical Analysis:')
      console.log(`   ${signal.technical_analysis}\n`)
    }

    if (signal.opportunity_analysis) {
      console.log('🎯 Opportunity Analysis:')
      console.log(`   ${signal.opportunity_analysis}\n`)
    }

    if (signal.price_analysis) {
      console.log('💰 Price Analysis:')
      console.log(`   ${signal.price_analysis}\n`)
    }

    if (signal.risk_assessment) {
      console.log('⚠️  Risk Assessment:')
      console.log(`   ${signal.risk_assessment}\n`)
    }

    if (signal.action_plan) {
      console.log('📋 Action Plan:')
      console.log(`   ${signal.action_plan}\n`)
    }

    console.log('✅ OpenAI integration test completed successfully!')
  } catch (error: any) {
    console.error('❌ Error generating signal:', error.message)
    console.error(error)
    process.exit(1)
  }
}

testOpenAI()

