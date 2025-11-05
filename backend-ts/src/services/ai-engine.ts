import axios from 'axios'
import { randomUUID } from 'crypto'
import { Signal, Market } from '../types'

export class AIEngineService {
  private ollamaUrl: string
  private model: string

  constructor() {
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL || 'llama3.2:latest'
  }

  async generateSignal(market: Market, userWallet?: string): Promise<Signal> {
    try {
      const prompt = this.buildAnalysisPrompt(market)
      
      const response = await axios.post(`${this.ollamaUrl}/api/generate`, {
        model: this.model,
        prompt,
        stream: false
      })

      const analysis = response.data.response
      const signal = this.parseAnalysis(analysis, market)

      return signal
    } catch (error) {
      console.error('AI analysis failed:', error)
      return this.generateFallbackSignal(market)
    }
  }

  private buildAnalysisPrompt(market: Market): string {
    // Calculate days until end date
    const daysUntilEnd = market.end_date ? 
      Math.ceil((new Date(market.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
      'Unknown'
    
    // Calculate volume trend
    const volumeIndicator = market.volume > 10000 ? 'High' : market.volume > 1000 ? 'Medium' : 'Low'
    
    // Calculate implied probability
    const impliedProb = (market.current_price * 100).toFixed(1)
    
    // Liquidity assessment
    const liquidityLevel = market.liquidity 
      ? (market.liquidity > 50000 ? 'Excellent' : market.liquidity > 10000 ? 'Good' : 'Limited')
      : 'Unknown'
    
    return `
You are a TOP-TIER prediction market analyst with deep expertise in probability theory, market psychology, and quantitative analysis. Your job is to provide SHARP, DATA-DRIVEN insights that retail traders miss.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 MARKET INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 QUESTION: ${market.question}

📝 CONTEXT: ${market.description || 'No additional context provided'}

💰 CURRENT METRICS:
   • YES Price: $${market.current_price} → Implied Probability: ${impliedProb}%
   • 24h Volume: $${market.volume.toLocaleString()} (${volumeIndicator} activity)
   • Liquidity Pool: $${market.liquidity?.toLocaleString() || 'Unknown'} (${liquidityLevel})
   • Time to Resolution: ${daysUntilEnd} days
   • Market Category: ${market.category || 'General'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 ANALYSIS FRAMEWORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THINK LIKE A PRO:
1. 📈 VALUE ANALYSIS: Is the ${impliedProb}% probability realistic? What does fundamentals say?
2. ⏰ TIME DECAY: With ${daysUntilEnd} days left, is there edge in current pricing?
3. 💧 LIQUIDITY CHECK: ${liquidityLevel} liquidity - can you enter/exit easily?
4. 📊 VOLUME SIGNAL: ${volumeIndicator} volume - is smart money moving?
5. 🎲 RISK/REWARD: What's the asymmetric opportunity here?
6. 🔍 MISPRICING: Is market psychology creating inefficiency?

PROVIDE YOUR EDGE:
Your reasoning MUST be:
✅ Specific and quantitative (reference actual numbers)
✅ Action-oriented (why THIS move, why NOW)
✅ Risk-aware (acknowledge what could go wrong)
✅ Differentiated (what are others missing?)

EXAMPLES OF STRONG REASONING:
✅ "Volume spike + ${impliedProb}% undervalues 70% base rate - strong BUY at current discount"
✅ "Overheated at ${impliedProb}% vs 40% historical precedent - take profit before reality check"
✅ "Fair value detected: ${impliedProb}% aligns with consensus + ${liquidityLevel} liquidity"
✅ "Mispriced urgency: ${daysUntilEnd}d runway gives ${impliedProb}% price room to normalize"

❌ BAD REASONING (don't do this):
❌ "Market looks interesting"
❌ "Could go either way"
❌ "Decent opportunity"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RETURN ONLY THIS JSON (no markdown, no backticks, pure JSON):
{
  "recommendation": "BUY|SELL|HOLD",
  "confidence_score": 0.85,
  "price_target": 0.72,
  "reasoning": "Sharp, data-driven insight with specific numbers - make it CONVINCING",
  "risk_level": "LOW|MEDIUM|HIGH"
}

CRITICAL RULES:
• recommendation: BUY if undervalued edge exists | SELL if overpriced | HOLD if efficient
• confidence_score: 0.0-1.0 (be bold when data is clear, cautious when uncertain)
• price_target: Your fair value estimate 0.0-1.0 (must differ from current if BUY/SELL)
• reasoning: ONE powerful sentence that sells your thesis (reference ${impliedProb}% or ${daysUntilEnd}d or volume)
• risk_level: LOW = <30d + high liq | MEDIUM = 30-90d or medium liq | HIGH = >90d or low liq

MAKE YOUR REASONING SHARP, QUANTITATIVE, AND ACTIONABLE. 🎯
    `.trim()
  }

  private parseAnalysis(analysis: string, market: Market): Signal {
    try {
      // Try to extract JSON from the response
      let jsonMatch = analysis.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        let jsonString = jsonMatch[0]
        
        // Clean up common AI response issues
        jsonString = jsonString
          .replace(/'/g, '"')  // Replace single quotes with double quotes
          .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
          .replace(/(\w+):/g, '"$1":')  // Quote unquoted keys
          .replace(/""+/g, '"')  // Fix double-double quotes
          .replace(/\n/g, ' ')  // Replace newlines with spaces
          .replace(/\r/g, '')  // Remove carriage returns
          .replace(/\t/g, ' ')  // Replace tabs with spaces
          .replace(/\s+/g, ' ')  // Collapse multiple spaces
        
        // Try to extract just the fields we need if full parse fails
        try {
          const parsed = JSON.parse(jsonString)
          return {
            id: randomUUID(),
            market_id: market.id,
            market_question: market.question,
            signal_type: 'PRICE_PREDICTION',
            recommendation: String(parsed.recommendation || 'HOLD').toUpperCase(),
            confidence_score: Math.min(Math.max(Number(parsed.confidence_score) || 0.5, 0), 1),
            price_target: Number(parsed.price_target) || market.current_price,
            reasoning: String(parsed.reasoning || 'AI analysis completed').substring(0, 500),
            risk_level: String(parsed.risk_level || 'MEDIUM').toUpperCase(),
            raw_analysis: analysis,
            created_at: new Date().toISOString()
          }
        } catch (parseError) {
          console.error('JSON parse error after cleanup:', parseError)
          console.log('Attempted to parse:', jsonString.substring(0, 300))
          
          // Try manual extraction as last resort
          const recommendation = jsonString.match(/"recommendation":\s*"(\w+)"/)?.[1] || 'HOLD'
          const confidence = jsonString.match(/"confidence_score":\s*([\d.]+)/)?.[1] || '0.5'
          const priceTarget = jsonString.match(/"price_target":\s*([\d.]+)/)?.[1] || String(market.current_price)
          const reasoning = jsonString.match(/"reasoning":\s*"([^"]+)"/)?.[1] || 'Analysis completed'
          const riskLevel = jsonString.match(/"risk_level":\s*"(\w+)"/)?.[1] || 'MEDIUM'
          
          console.log('Using manual extraction:', { recommendation, confidence, priceTarget })
          
          return {
            id: randomUUID(),
            market_id: market.id,
            market_question: market.question,
            signal_type: 'PRICE_PREDICTION',
            recommendation: recommendation.toUpperCase(),
            confidence_score: Math.min(Math.max(Number(confidence), 0), 1),
            price_target: Number(priceTarget),
            reasoning: reasoning.substring(0, 500),
            risk_level: riskLevel.toUpperCase(),
            raw_analysis: analysis,
            created_at: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      console.error('Failed to parse AI analysis:', error)
    }

    // Fallback if parsing fails
    return {
      id: randomUUID(),
      market_id: market.id,
      market_question: market.question,
      signal_type: 'PRICE_PREDICTION',
      recommendation: 'HOLD',
      confidence_score: 0.5,
      price_target: market.current_price,
      reasoning: 'AI analysis completed with fallback response',
      risk_level: 'MEDIUM',
      raw_analysis: analysis,
      created_at: new Date().toISOString()
    }
  }

  private generateFallbackSignal(market: Market): Signal {
    return {
      id: randomUUID(),
      market_id: market.id,
      market_question: market.question,
      signal_type: 'PRICE_PREDICTION',
      recommendation: 'HOLD',
      confidence_score: 0.3,
      price_target: market.current_price,
      reasoning: 'Fallback signal due to AI service unavailability',
      risk_level: 'HIGH',
      raw_analysis: 'AI service unavailable',
      created_at: new Date().toISOString()
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await axios.get(`${this.ollamaUrl}/api/tags`)
      return true
    } catch (error) {
      console.error('AI Engine health check failed:', error)
      return false
    }
  }
}

export const aiEngineService = new AIEngineService()


