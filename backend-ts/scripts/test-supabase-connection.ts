/**
 * Test Supabase connection for alerts
 */

import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables FIRST
dotenv.config({ path: resolve(__dirname, '../.env') })

import { databaseService } from '../src/services/database'

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection for Alerts\n')

  // Check health
  console.log('1️⃣  Database Health Check...')
  const healthy = await databaseService.healthCheck()
  console.log(`   ${healthy ? '✅' : '❌'} Database: ${healthy ? 'Connected' : 'Not Connected'}\n`)

  if (!healthy) {
    console.log('⚠️  Supabase is not connected. Alerts will use mock data.')
    console.log('\n📝 To fix:')
    console.log('   1. Check SUPABASE_URL in .env')
    console.log('   2. Check SUPABASE_KEY or SUPABASE_SERVICE_KEY in .env')
    console.log('   3. Verify Supabase project is active')
    console.log('   4. Check internet connection')
    return
  }

  // Test alert operations
  console.log('2️⃣  Testing Alert Operations...')
  
  try {
    // Test getActiveAlerts
    const activeAlerts = await databaseService.getActiveAlerts()
    console.log(`   ✅ getActiveAlerts(): Found ${activeAlerts.length} active alert(s)`)
    
    // Test createAlert (with cleanup)
    const testAlert = await databaseService.createAlert({
      user_wallet: '0xTEST1234567890123456789012345678901234567890',
      market_id: 'test-market-123',
      market_question: 'Test Alert - Delete Me',
      target_price: 0.5,
      condition: 'above',
      status: 'active',
      notification_sent: false,
      notes: 'Test alert - will be deleted'
    })
    
    if (testAlert) {
      console.log(`   ✅ createAlert(): Created alert ${testAlert.id}`)
      
      // Clean up test alert
      await databaseService.deleteAlert(testAlert.id)
      console.log(`   ✅ deleteAlert(): Cleaned up test alert`)
    } else {
      console.log('   ❌ createAlert(): Failed to create alert')
    }
    
    console.log('\n✅ Supabase connection is working! Alerts will use real database.')
    
  } catch (error) {
    console.error('   ❌ Error:', error instanceof Error ? error.message : String(error))
    console.log('\n⚠️  Alerts will fall back to mock data')
  }
}

testSupabaseConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })

