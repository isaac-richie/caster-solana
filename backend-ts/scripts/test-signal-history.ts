// Test signal purchase and history update
import dotenv from 'dotenv'
import { resolve } from 'path'
import axios from 'axios'

dotenv.config({ path: resolve(__dirname, '../.env') })

const API_URL = process.env.API_URL || 'http://localhost:8000'
const TEST_WALLET = '0x1234567890123456789012345678901234567890'

async function testSignalHistory() {
  console.log('🧪 Testing Signal Purchase & History Update...\n')

  // Step 1: Get a real market
  console.log('1️⃣  Fetching a test market...')
  let testMarketId: string
  try {
    const marketsResponse = await axios.get(`${API_URL}/markets?limit=1`)
    if (!marketsResponse.data.markets || marketsResponse.data.markets.length === 0) {
      console.error('   ❌ No markets available')
      return
    }
    testMarketId = marketsResponse.data.markets[0].id
    console.log(`   ✅ Using market: ${testMarketId}`)
    console.log(`   Question: ${marketsResponse.data.markets[0].question}\n`)
  } catch (error: any) {
    console.error('   ❌ Failed to fetch markets:', error.message)
    return
  }

  // Step 2: Check initial signal count
  console.log('2️⃣  Checking initial signal count...')
  let initialCount = 0
  try {
    const signalsResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}/signals?limit=100`)
    initialCount = signalsResponse.data.signals?.length || 0
    console.log(`   ✅ Initial signals: ${initialCount}\n`)
  } catch (error: any) {
    console.log(`   ⚠️  Could not fetch initial signals (user may not exist): ${error.message}`)
    console.log(`   Assuming 0 initial signals\n`)
  }

  // Step 3: Purchase a signal (with payment verified)
  console.log('3️⃣  Purchasing AI analysis (with payment verified)...')
  let purchasedSignal: any = null
  try {
    const analysisResponse = await axios.post(
      `${API_URL}/ai/analyze/${testMarketId}`,
      {
        payment_verified: true,
        user_wallet: TEST_WALLET,
        transaction_hash: `0xtest${Date.now()}`
      },
      {
        timeout: 60000 // 60 second timeout
      }
    )

    if (analysisResponse.data.success && analysisResponse.data.signal) {
      purchasedSignal = analysisResponse.data.signal
      console.log('   ✅ Signal purchased successfully!')
      console.log(`   Signal ID: ${purchasedSignal.id}`)
      console.log(`   Recommendation: ${purchasedSignal.recommendation}`)
      console.log(`   Confidence: ${(purchasedSignal.confidence_score * 100).toFixed(1)}%\n`)
    } else {
      console.error('   ❌ Signal purchase failed - no signal in response')
      return
    }
  } catch (error: any) {
    console.error('   ❌ Signal purchase failed:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
    return
  }

  // Step 4: Wait a moment for DB to update
  console.log('4️⃣  Waiting for database to update...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Step 5: Check updated signal count
  console.log('5️⃣  Checking updated signal count...')
  try {
    const signalsResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}/signals?limit=100`)
    const updatedCount = signalsResponse.data.signals?.length || 0
    const newSignals = signalsResponse.data.signals || []

    console.log(`   ✅ Updated signals: ${updatedCount}`)
    console.log(`   ✅ New signals added: ${updatedCount - initialCount}`)

    // Check if our purchased signal is in the list
    const foundSignal = newSignals.find((s: any) => s.id === purchasedSignal.id)
    if (foundSignal) {
      console.log('   ✅ Purchased signal found in history!')
      console.log(`   Signal details:`)
      console.log(`     - Market ID: ${foundSignal.market_id}`)
      console.log(`     - Recommendation: ${foundSignal.recommendation}`)
      console.log(`     - Confidence: ${(foundSignal.confidence_score * 100).toFixed(1)}%`)
      console.log(`     - User Wallet: ${foundSignal.user_wallet}`)
      console.log(`     - Created: ${foundSignal.created_at}\n`)
    } else {
      console.log('   ⚠️  Purchased signal NOT found in history')
      console.log('   Available signal IDs:', newSignals.map((s: any) => s.id).join(', '))
    }

    // Check user stats
    console.log('6️⃣  Checking user stats...')
    try {
      const userResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}`)
      const user = userResponse.data.user
      if (user) {
        console.log(`   ✅ User stats updated:`)
        console.log(`     - Total signals purchased: ${user.total_signals_purchased}`)
        console.log(`     - Total spent: $${user.total_spent?.toFixed(2) || '0.00'}`)
        
        if (user.total_signals_purchased > initialCount) {
          console.log('   ✅ User stats correctly updated!\n')
        } else {
          console.log('   ⚠️  User stats may not have updated\n')
        }
      } else {
        console.log('   ⚠️  User not found\n')
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not fetch user stats: ${error.message}\n`)
    }

  } catch (error: any) {
    console.error('   ❌ Failed to fetch updated signals:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
  }

  console.log('✅ Signal history test complete!')
  console.log('\n📊 Summary:')
  console.log(`   - Initial signals: ${initialCount}`)
  console.log(`   - Signal purchased: ${purchasedSignal ? 'Yes' : 'No'}`)
  console.log(`   - Signal stored in DB: ${purchasedSignal ? 'Check above' : 'No'}`)
}

testSignalHistory().catch(console.error)

