// List available OpenAI models
import dotenv from 'dotenv'
import { resolve } from 'path'
import OpenAI from 'openai'

dotenv.config({ path: resolve(__dirname, '../.env') })

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error('❌ OPENAI_API_KEY not found')
  process.exit(1)
}

const openai = new OpenAI({ apiKey })

async function listModels() {
  console.log('🔍 Fetching available OpenAI models...\n')
  
  try {
    const models = await openai.models.list()
    
    // Filter to chat/completion models
    const chatModels = models.data
      .filter(m => m.id.includes('gpt') || m.id.includes('o1'))
      .sort((a, b) => a.id.localeCompare(b.id))
    
    console.log(`✅ Found ${chatModels.length} GPT models:\n`)
    
    chatModels.forEach(model => {
      const isNano = model.id.toLowerCase().includes('nano')
      const marker = isNano ? ' 🆕' : ''
      console.log(`   • ${model.id}${marker}`)
    })
    
    // Check specifically for nano variants
    const nanoModels = chatModels.filter(m => 
      m.id.toLowerCase().includes('nano') || 
      m.id.toLowerCase().includes('gpt-5')
    )
    
    if (nanoModels.length > 0) {
      console.log('\n🎯 Nano/New Models Found:')
      nanoModels.forEach(m => console.log(`   • ${m.id}`))
    } else {
      console.log('\n⚠️  No "nano" or "gpt-5" models found in API')
      console.log('   Available models are: gpt-4o, gpt-4o-mini, gpt-3.5-turbo, etc.')
    }
    
  } catch (error: any) {
    console.error('❌ Error fetching models:', error.message)
  }
}

listModels()

