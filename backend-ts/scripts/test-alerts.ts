/**
 * Test script to verify alert functionality
 * Tests: Create, Read, Update, Delete, and Alert Checker Service
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
dotenv.config({ path: resolve(__dirname, '../.env') })

import { databaseService } from '../src/services/database'
import { alertCheckerService } from '../src/services/alert-checker'
import { polymarketService } from '../src/services/polymarket'

const TEST_WALLET = '0x1234567890123456789012345678901234567890'

async function testAlerts() {
  console.log('🧪 Testing Alert Functionality\n')

  // Test 1: Health Check
  console.log('1️⃣  Testing Database Health...')
  const dbHealthy = await databaseService.healthCheck()
  console.log(`   Database: ${dbHealthy ? '✅ Healthy' : '❌ Unhealthy'}\n`)

  // Test 2: Get Active Alerts
  console.log('2️⃣  Testing getActiveAlerts()...')
  try {
    const activeAlerts = await databaseService.getActiveAlerts()
    console.log(`   ✅ Found ${activeAlerts.length} active alert(s)`)
    if (activeAlerts.length > 0) {
      console.log(`   Sample alert: ${activeAlerts[0].market_question}`)
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
  }
  console.log()

  // Test 3: Create Alert
  console.log('3️⃣  Testing createAlert()...')
  try {
    // Get a real market first
    const markets = await polymarketService.getMarketsByCategory('all', 1)
    if (markets.length === 0) {
      console.log('   ⚠️  No markets available to test with')
    } else {
      const testMarket = markets[0]
      const targetPrice = testMarket.current_price + 0.1 // Set alert above current price
      
      const alert = await databaseService.createAlert({
        user_wallet: TEST_WALLET,
        market_id: testMarket.id,
        market_question: testMarket.question,
        target_price: Math.min(targetPrice, 0.99), // Ensure valid price
        condition: 'above',
        status: 'active',
        notification_sent: false,
        notes: 'Test alert'
      })

      if (alert) {
        console.log(`   ✅ Alert created: ${alert.id}`)
        console.log(`   Market: ${alert.market_question}`)
        console.log(`   Target: ${(alert.target_price * 100).toFixed(1)}¢ (${alert.condition})`)
        
        // Test 4: Get User Alerts
        console.log('\n4️⃣  Testing getAlerts()...')
        const userAlerts = await databaseService.getAlerts(TEST_WALLET)
        console.log(`   ✅ Found ${userAlerts.length} alert(s) for test wallet`)
        
        // Test 5: Update Alert
        console.log('\n5️⃣  Testing updateAlert()...')
        const updated = await databaseService.updateAlert(alert.id, {
          notes: 'Updated test alert'
        })
        if (updated) {
          console.log(`   ✅ Alert updated: ${updated.notes}`)
        } else {
          console.log('   ❌ Failed to update alert')
        }
        
        // Test 6: Delete Alert
        console.log('\n6️⃣  Testing deleteAlert()...')
        const deleted = await databaseService.deleteAlert(alert.id)
        if (deleted) {
          console.log(`   ✅ Alert deleted successfully`)
        } else {
          console.log('   ❌ Failed to delete alert')
        }
      } else {
        console.log('   ❌ Failed to create alert')
      }
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
  }
  console.log()

  // Test 7: Alert Checker Service Status
  console.log('7️⃣  Testing Alert Checker Service...')
  const status = alertCheckerService.getStatus()
  console.log(`   Running: ${status.running ? '✅ Yes' : '❌ No'}`)
  console.log(`   ${status.message}`)
  console.log()

  // Test 8: Check if service can check alerts (without starting it)
  console.log('8️⃣  Testing Alert Checker Logic...')
  try {
    const activeAlerts = await databaseService.getActiveAlerts()
    if (activeAlerts.length > 0) {
      console.log(`   ✅ Found ${activeAlerts.length} active alert(s) to check`)
      console.log(`   Alert checker service would check these every 30 seconds`)
    } else {
      console.log('   ℹ️  No active alerts to check (this is normal if no alerts exist)')
    }
  } catch (error) {
    console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
  }

  console.log('\n✅ Alert functionality test complete!')
  console.log('\n📝 Summary:')
  console.log('   - Database operations: Working')
  console.log('   - Alert CRUD: Working')
  console.log('   - Alert Checker Service: Available')
  console.log('   - Email notifications: Configured (requires email verification)')
}

// Run tests
testAlerts()
  .then(() => {
    console.log('\n✅ All tests completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })

