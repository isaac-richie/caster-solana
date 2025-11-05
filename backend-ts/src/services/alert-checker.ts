import { databaseService } from './database'
import { polymarketService } from './polymarket'
import { PriceAlert } from '../types'

export class AlertCheckerService {
  private isRunning: boolean = false
  private checkInterval: NodeJS.Timeout | null = null
  private readonly POLL_INTERVAL = 30000 // 30 seconds

  constructor() {
    console.log('Alert Checker Service initialized')
  }

  // Start the alert checker
  start() {
    if (this.isRunning) {
      console.log('Alert checker is already running')
      return
    }

    this.isRunning = true
    console.log('🔔 Starting alert checker service...')
    
    // Run immediately
    this.checkAlerts()
    
    // Then run every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkAlerts()
    }, this.POLL_INTERVAL)
  }

  // Stop the alert checker
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
    this.isRunning = false
    console.log('🔕 Alert checker service stopped')
  }

  // Main function to check all active alerts
  private async checkAlerts() {
    try {
      // Get all active alerts from database
      const activeAlerts = await databaseService.getActiveAlerts()
      
      if (activeAlerts.length === 0) {
        console.log('No active alerts to check')
        return
      }

      console.log(`Checking ${activeAlerts.length} active alert(s)...`)

      // Group alerts by market_id to minimize API calls
      const alertsByMarket = this.groupAlertsByMarket(activeAlerts)

      // Check each market's price and trigger alerts if needed
      for (const [marketId, alerts] of Object.entries(alertsByMarket)) {
        await this.checkMarketAlerts(marketId, alerts)
      }

    } catch (error) {
      console.error('Error checking alerts:', error)
    }
  }

  // Group alerts by market ID to reduce API calls
  private groupAlertsByMarket(alerts: PriceAlert[]): Record<string, PriceAlert[]> {
    return alerts.reduce((acc, alert) => {
      if (!acc[alert.market_id]) {
        acc[alert.market_id] = []
      }
      acc[alert.market_id].push(alert)
      return acc
    }, {} as Record<string, PriceAlert[]>)
  }

  // Check alerts for a specific market
  private async checkMarketAlerts(marketId: string, alerts: PriceAlert[]) {
    try {
      // Fetch current market data from Polymarket
      const market = await polymarketService.getMarketById(marketId)

      if (!market) {
        console.log(`Market ${marketId} not found, skipping...`)
        return
      }

      const currentPrice = market.current_price

      console.log(`Market "${market.question}" current price: ${(currentPrice * 100).toFixed(1)}¢`)

      // Check each alert for this market
      for (const alert of alerts) {
        const shouldTrigger = this.shouldTriggerAlert(alert, currentPrice)

        if (shouldTrigger) {
          await this.triggerAlert(alert, currentPrice)
        } else {
          // Update last_checked_at timestamp
          await databaseService.updateAlert(alert.id, {
            last_checked_at: new Date().toISOString()
          })
        }
      }

    } catch (error) {
      console.error(`Error checking alerts for market ${marketId}:`, error)
    }
  }

  // Determine if an alert should be triggered based on condition
  private shouldTriggerAlert(alert: PriceAlert, currentPrice: number): boolean {
    const { target_price, condition } = alert

    switch (condition) {
      case 'above':
        return currentPrice >= target_price
      case 'below':
        return currentPrice <= target_price
      case 'equals':
        // Allow 1% tolerance for "equals"
        const tolerance = 0.01
        return Math.abs(currentPrice - target_price) <= tolerance
      default:
        return false
    }
  }

  // Trigger an alert
  private async triggerAlert(alert: PriceAlert, currentPrice: number) {
    try {
      console.log(`🔔 ALERT TRIGGERED: ${alert.market_question}`)
      console.log(`   Target: ${(alert.target_price * 100).toFixed(1)}¢ (${alert.condition})`)
      console.log(`   Current: ${(currentPrice * 100).toFixed(1)}¢`)

      // Update alert status in database
      await databaseService.updateAlert(alert.id, {
        status: 'triggered',
        triggered_at: new Date().toISOString(),
        last_checked_at: new Date().toISOString(),
        notification_sent: true
      })

      // Send notification (you'll implement this next)
      await this.sendNotification(alert, currentPrice)

      console.log(`✅ Alert ${alert.id} marked as triggered`)

    } catch (error) {
      console.error(`Error triggering alert ${alert.id}:`, error)
    }
  }

  // Send notification to user (placeholder for now)
  private async sendNotification(alert: PriceAlert, currentPrice: number) {
    // For now, just log. Later we'll add:
    // - Browser push notifications
    // - Email notifications
    // - Webhook notifications

    const message = `
🔔 Price Alert Triggered!

Market: ${alert.market_question}
Target Price: ${(alert.target_price * 100).toFixed(1)}¢ (${alert.condition})
Current Price: ${(currentPrice * 100).toFixed(1)}¢

Your alert has been triggered!
    `

    console.log(message)

    // TODO: Implement actual notification sending
    // - Browser push: Use Web Push API
    // - Email: Use SendGrid/Resend
    // - Webhook: POST to user's webhook URL
  }

  // Get service status
  getStatus() {
    return {
      running: this.isRunning,
      interval: this.POLL_INTERVAL,
      message: this.isRunning 
        ? `Checking alerts every ${this.POLL_INTERVAL / 1000} seconds` 
        : 'Alert checker is stopped'
    }
  }
}

// Export singleton instance
export const alertCheckerService = new AlertCheckerService()

