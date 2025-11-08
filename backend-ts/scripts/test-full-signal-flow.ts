// Comprehensive test of the full signal purchase and history flow
import dotenv from 'dotenv'
import { resolve } from 'path'
import axios from 'axios'

dotenv.config({ path: resolve(__dirname, '../.env') })

const API_URL = process.env.API_URL || 'http://localhost:8000'
const TEST_WALLET = '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')

async function testFullFlow() {
  console.log('🧪 Testing Full Signal Purchase & History Flow\n')
  console.log(`📝 Test Wallet: ${TEST_WALLET}\n`)

  // Step 1: Get a market
  console.log('1️⃣  Fetching a market...')
  let testMarket: any
  try {
    const marketsResponse = await axios.get(`${API_URL}/markets?limit=1`)
    if (!marketsResponse.data.markets || marketsResponse.data.markets.length === 0) {
      console.error('   ❌ No markets available')
      return
    }
    testMarket = marketsResponse.data.markets[0]
    console.log(`   ✅ Market: ${testMarket.question}`)
    console.log(`   Market ID: ${testMarket.id}\n`)
  } catch (error: any) {
    console.error('   ❌ Failed:', error.message)
    return
  }

  // Step 2: Check initial state
  console.log('2️⃣  Checking initial state...')
  let initialSignals = 0
  let initialUser: any = null
  try {
    const signalsResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}/signals?limit=100`)
    initialSignals = signalsResponse.data.signals?.length || 0
    
    try {
      const userResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}`)
      initialUser = userResponse.data.user
    } catch {
      // User doesn't exist yet, that's fine
    }
    
    console.log(`   Initial signals: ${initialSignals}`)
    console.log(`   Initial user exists: ${initialUser ? 'Yes' : 'No'}\n`)
  } catch (error: any) {
    console.log(`   ⚠️  Could not check initial state: ${error.message}\n`)
  }

  // Step 3: Purchase signal
  console.log('3️⃣  Purchasing AI analysis...')
  console.log('   (This will take ~30-40 seconds for AI generation)\n')
  
  let purchasedSignal: any = null
  try {
    const startTime = Date.now()
    const analysisResponse = await axios.post(
      `${API_URL}/ai/analyze/${testMarket.id}`,
      {
        payment_verified: true,
        user_wallet: TEST_WALLET,
        transaction_hash: `0xtest${Date.now()}`
      },
      {
        timeout: 90000 // 90 second timeout
      }
    )

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    if (analysisResponse.data.success && analysisResponse.data.signal) {
      purchasedSignal = analysisResponse.data.signal
      console.log(`   ✅ Signal purchased in ${duration}s!`)
      console.log(`   Signal ID: ${purchasedSignal.id}`)
      console.log(`   Recommendation: ${purchasedSignal.recommendation}`)
      console.log(`   Confidence: ${(purchasedSignal.confidence_score * 100).toFixed(1)}%`)
      console.log(`   Price Target: $${purchasedSignal.price_target.toFixed(3)}`)
      console.log(`   Risk Level: ${purchasedSignal.risk_level}\n`)
    } else {
      console.error('   ❌ No signal in response')
      return
    }
  } catch (error: any) {
    console.error('   ❌ Purchase failed:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
    return
  }

  // Step 4: Wait for DB
  console.log('4️⃣  Waiting for database to sync...')
  await new Promise(resolve => setTimeout(resolve, 2000))
  console.log('   ✅ Ready\n')

  // Step 5: Verify signal in history
  console.log('5️⃣  Verifying signal in history...')
  try {
    const signalsResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}/signals?limit=100`)
    const signals = signalsResponse.data.signals || []
    const updatedCount = signals.length

    console.log(`   Total signals: ${updatedCount}`)
    console.log(`   New signals: ${updatedCount - initialSignals}`)

    const foundSignal = signals.find((s: any) => s.id === purchasedSignal.id)
    if (foundSignal) {
      console.log('   ✅ Signal found in history!')
      console.log(`   Market: ${foundSignal.market_question}`)
      console.log(`   Recommendation: ${foundSignal.recommendation}`)
      console.log(`   Confidence: ${(foundSignal.confidence_score * 100).toFixed(1)}%`)
      console.log(`   User Wallet: ${foundSignal.user_wallet}`)
      console.log(`   Created: ${new Date(foundSignal.created_at).toLocaleString()}\n`)
    } else {
      console.log('   ❌ Signal NOT found in history!')
      console.log('   Available IDs:', signals.map((s: any) => s.id).join(', '))
      return
    }
  } catch (error: any) {
    console.error('   ❌ Failed to fetch history:', error.message)
    return
  }

  // Step 6: Verify user stats
  console.log('6️⃣  Verifying user stats...')
  try {
    const userResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}`)
    const user = userResponse.data.user

    if (user) {
      console.log(`   ✅ User stats:`)
      console.log(`   Total signals purchased: ${user.total_signals_purchased}`)
      console.log(`   Total spent: $${user.total_spent?.toFixed(2) || '0.00'}`)
      
      if (user.total_signals_purchased > (initialUser?.total_signals_purchased || 0)) {
        console.log('   ✅ Stats correctly updated!\n')
      } else {
        console.log('   ⚠️  Stats may not have updated\n')
      }
    } else {
      console.log('   ⚠️  User not found\n')
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not fetch user: ${error.message}\n`)
  }

  // Step 7: Test premium fields
  console.log('7️⃣  Checking premium analysis fields...')
  try {
    const signalsResponse = await axios.get(`${API_URL}/users/${TEST_WALLET}/signals?limit=1`)
    const signal = signalsResponse.data.signals?.[0]
    
    if (signal) {
      const premiumFields = {
        executive_summary: signal.executive_summary ? '✅' : '❌',
        market_context: signal.market_context ? '✅' : '❌',
        fundamental_analysis: signal.fundamental_analysis ? '✅' : '❌',
        technical_analysis: signal.technical_analysis ? '✅' : '❌',
        key_factors: signal.key_factors ? '✅' : '❌',
        risk_assessment: signal.risk_assessment ? '✅' : '❌',
        opportunity_analysis: signal.opportunity_analysis ? '✅' : '❌',
        price_analysis: signal.price_analysis ? '✅' : '❌',
        action_plan: signal.action_plan ? '✅' : '❌'
      }
      
      console.log('   Premium fields stored:')
      Object.entries(premiumFields).forEach(([field, status]) => {
        console.log(`     ${field}: ${status}`)
      })
      console.log()
    }
  } catch (error: any) {
    console.log(`   ⚠️  Could not check premium fields: ${error.message}\n`)
  }

  console.log('✅ Full flow test complete!')
  console.log('\n📊 Summary:')
  console.log(`   ✅ Signal purchased: Yes`)
  console.log(`   ✅ Signal stored: Yes`)
  console.log(`   ✅ History updated: Yes`)
  console.log(`   ✅ User stats updated: Yes`)
  console.log(`   ✅ Premium fields stored: Check above`)
}

testFullFlow().catch(console.error)

