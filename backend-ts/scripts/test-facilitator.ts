// Test the facilitator payment flow
import dotenv from 'dotenv'
import { resolve } from 'path'
import axios from 'axios'

dotenv.config({ path: resolve(__dirname, '../.env') })

const API_URL = process.env.API_URL || 'http://localhost:8000'

async function testFacilitator() {
  console.log('🧪 Testing Facilitator Service...\n')

  // Test 1: Health Check
  console.log('1️⃣  Testing Health Check...')
  try {
    const healthResponse = await axios.get(`${API_URL}/health`)
    console.log('   ✅ Health check passed')
    console.log(`   Services:`, healthResponse.data.services)
    console.log(`   Facilitator status: ${healthResponse.data.services.facilitator}\n`)
  } catch (error: any) {
    console.error('   ❌ Health check failed:', error.message)
    return
  }

  // Test 2: Payment Methods
  console.log('2️⃣  Testing Payment Methods Endpoint...')
  try {
    const methodsResponse = await axios.get(`${API_URL}/api/payment/methods`)
    console.log('   ✅ Payment methods endpoint works')
    console.log(`   Methods:`, JSON.stringify(methodsResponse.data, null, 2))
    console.log()
  } catch (error: any) {
    console.error('   ❌ Payment methods failed:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
  }

  // Test 3: Payment Settlement (Mock)
  console.log('3️⃣  Testing Payment Settlement...')
  try {
    const settleResponse = await axios.post(`${API_URL}/api/payment/settle`, {
      resourceUrl: 'https://test-resource.com',
      paymentData: '0x1234567890abcdef',
      price: '$0.20'
    })
    console.log('   ✅ Payment settlement endpoint works')
    console.log(`   Response:`, JSON.stringify(settleResponse.data, null, 2))
    console.log()
  } catch (error: any) {
    console.error('   ❌ Payment settlement failed:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
  }

  // Test 4: AI Analysis with Payment Required
  console.log('4️⃣  Testing AI Analysis (Payment Required)...')
  try {
    // First, get a real market ID
    const marketsResponse = await axios.get(`${API_URL}/markets?limit=1`)
    if (!marketsResponse.data.markets || marketsResponse.data.markets.length === 0) {
      console.log('   ⚠️  No markets available for testing')
      return
    }

    const testMarketId = marketsResponse.data.markets[0].id
    console.log(`   Using market: ${testMarketId}`)

    // Try without payment (should return 402)
    try {
      const analysisResponse = await axios.post(
        `${API_URL}/ai/analyze/${testMarketId}`,
        {
          payment_verified: false,
          user_wallet: '0x1234567890123456789012345678901234567890'
        }
      )
      console.log('   ⚠️  Payment check bypassed (unexpected)')
    } catch (error: any) {
      if (error.response?.status === 402) {
        console.log('   ✅ Payment required check works (402 returned)')
        console.log(`   Error message: ${error.response.data.error}`)
      } else {
        console.error('   ❌ Unexpected error:', error.message)
      }
    }

    // Try with payment verified (should work)
    console.log('\n5️⃣  Testing AI Analysis (With Payment)...')
    try {
      const analysisResponse = await axios.post(
        `${API_URL}/ai/analyze/${testMarketId}`,
        {
          payment_verified: true,
          user_wallet: '0x1234567890123456789012345678901234567890',
          transaction_hash: '0xtest1234567890abcdef'
        },
        {
          timeout: 60000 // 60 second timeout for AI generation
        }
      )

      if (analysisResponse.data.success) {
        console.log('   ✅ AI Analysis generated successfully!')
        console.log(`   Recommendation: ${analysisResponse.data.signal.recommendation}`)
        console.log(`   Confidence: ${(analysisResponse.data.signal.confidence_score * 100).toFixed(1)}%`)
        console.log(`   Price Target: $${analysisResponse.data.signal.price_target.toFixed(3)}`)
        console.log(`   Risk Level: ${analysisResponse.data.signal.risk_level}`)
        console.log()
      }
    } catch (error: any) {
      console.error('   ❌ AI Analysis failed:', error.message)
      if (error.response) {
        console.error('   Response:', error.response.data)
      }
    }

  } catch (error: any) {
    console.error('   ❌ Market fetch failed:', error.message)
  }

  console.log('\n✅ Facilitator testing complete!')
}

testFacilitator().catch(console.error)

