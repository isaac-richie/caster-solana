import axios from 'axios'

const BASE_URL = 'https://gamma-api.polymarket.com'

// List of potential endpoints to test
const endpointsToTest = [
  // Market-related (we know these work)
  '/markets',
  '/markets?limit=5',
  
  // Potential new endpoints
  '/traders',
  '/traders?limit=10',
  '/leaderboard',
  '/leaderboard?limit=10',
  '/stats',
  '/analytics',
  '/events',
  '/positions',
  '/trades',
  '/trades?limit=10',
  '/outcomes',
  '/liquidity',
  '/users',
  '/users?limit=10',
  '/user',
  '/portfolio',
  '/history',
  '/volume',
  '/trending',
  '/winners',
  '/top-traders',
  '/top-traders?limit=10',
  '/market-stats',
  '/platform-stats',
  '/global-stats',
  
  // Market-specific endpoints
  '/markets/stats',
  '/markets/trending',
  '/markets/volume',
  
  // Alternative base paths
  '/api/markets',
  '/api/traders',
  '/api/leaderboard',
  '/api/stats',
  '/v1/markets',
  '/v1/traders',
  '/v1/leaderboard',
  '/v1/stats',
]

interface TestResult {
  endpoint: string
  status: number
  success: boolean
  data: any
  error?: string
  hasData: boolean
  dataType: string
}

async function testEndpoint(endpoint: string): Promise<TestResult> {
  const url = `${BASE_URL}${endpoint}`
  
  try {
    console.log(`Testing: ${url}`)
    const response = await axios.get(url, {
      timeout: 5000,
      validateStatus: () => true, // Don't throw on any status
    })
    
    const hasData = response.data !== null && response.data !== undefined
    let dataType = 'unknown'
    let data = null
    
    if (hasData) {
      if (Array.isArray(response.data)) {
        dataType = `array[${response.data.length}]`
        data = response.data.slice(0, 2) // Sample first 2 items
      } else if (typeof response.data === 'object') {
        dataType = 'object'
        data = Object.keys(response.data).slice(0, 10) // Sample keys
      } else {
        dataType = typeof response.data
        data = response.data
      }
    }
    
    return {
      endpoint,
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      data: data,
      hasData,
      dataType,
    }
  } catch (error: any) {
    return {
      endpoint,
      status: 0,
      success: false,
      data: null,
      hasData: false,
      dataType: 'error',
      error: error.message || 'Unknown error',
    }
  }
}

async function exploreAPI() {
  console.log('🔍 Exploring Polymarket API...\n')
  console.log(`Base URL: ${BASE_URL}\n`)
  console.log(`Testing ${endpointsToTest.length} endpoints...\n`)
  
  const results: TestResult[] = []
  
  // Test endpoints sequentially (to avoid rate limiting)
  for (const endpoint of endpointsToTest) {
    const result = await testEndpoint(endpoint)
    results.push(result)
    
    // Log progress
    if (result.success && result.hasData) {
      console.log(`✅ ${endpoint} - Status: ${result.status} - Data: ${result.dataType}`)
    } else if (result.success) {
      console.log(`⚠️  ${endpoint} - Status: ${result.status} - No data`)
    } else {
      console.log(`❌ ${endpoint} - Status: ${result.status} - ${result.error || 'Failed'}`)
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SUMMARY')
  console.log('='.repeat(60))
  
  const successful = results.filter(r => r.success && r.hasData)
  const successfulNoData = results.filter(r => r.success && !r.hasData)
  const failed = results.filter(r => !r.success)
  
  console.log(`\n✅ Successful with data: ${successful.length}`)
  successful.forEach(r => {
    console.log(`   - ${r.endpoint} (${r.dataType})`)
  })
  
  console.log(`\n⚠️  Successful but no data: ${successfulNoData.length}`)
  successfulNoData.forEach(r => {
    console.log(`   - ${r.endpoint} (Status: ${r.status})`)
  })
  
  console.log(`\n❌ Failed: ${failed.length}`)
  
  // Detailed results for successful endpoints
  if (successful.length > 0) {
    console.log('\n' + '='.repeat(60))
    console.log('📋 DETAILED RESULTS (Successful Endpoints)')
    console.log('='.repeat(60))
    
    successful.forEach(result => {
      console.log(`\n📍 ${result.endpoint}`)
      console.log(`   Status: ${result.status}`)
      console.log(`   Data Type: ${result.dataType}`)
      console.log(`   Sample Data:`, JSON.stringify(result.data, null, 2).slice(0, 500))
    })
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Exploration complete!')
  console.log('='.repeat(60))
}

// Run the exploration
exploreAPI().catch(console.error)

