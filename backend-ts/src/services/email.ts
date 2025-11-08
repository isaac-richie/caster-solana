import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

export class EmailService {
  private resend: Resend | null = null
  private fromEmail: string
  private fromName: string

  constructor() {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('⚠️  RESEND_API_KEY not found - email notifications disabled')
      console.warn('⚠️  Please set RESEND_API_KEY in your .env file')
      this.resend = null
    } else {
      this.resend = new Resend(apiKey)
      console.log('✅ Email service initialized (Resend)')
      console.log(`✅ API Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`)
    }

    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev'
    this.fromName = process.env.EMAIL_FROM_NAME || 'PolyCaster'
    
    console.log(`📧 Email From: ${this.fromEmail}`)
    console.log(`📧 Email From Name: ${this.fromName}`)
    
    // Warn if using default email (might not be verified)
    if (this.fromEmail === 'alerts@polycaster.com' || !process.env.EMAIL_FROM) {
      console.warn('⚠️  Using default email address. Make sure EMAIL_FROM is set and verified in Resend.')
      console.warn('⚠️  For testing, use: onboarding@resend.dev (pre-verified by Resend)')
    }
  }

  /**
   * Send price alert email notification
   */
  async sendPriceAlert(
    to: string,
    alert: {
      marketQuestion: string
      targetPrice: number
      currentPrice: number
      condition: 'above' | 'below' | 'equals'
      marketId: string
    }
  ): Promise<boolean> {
    if (!this.resend) {
      console.warn('Email service not available - cannot send alert email')
      return false
    }

    try {
      const conditionText = alert.condition === 'above' ? 'above' : 
                           alert.condition === 'below' ? 'below' : 
                           'equals'
      
      const marketUrl = `https://polymarket.com/event/${alert.marketId}`
      const appUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

      const htmlContent = this.generateAlertEmailHTML(alert, marketUrl, appUrl)
      const textContent = this.generateAlertEmailText(alert, marketUrl, appUrl)

      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject: `🔔 Price Alert Triggered: ${alert.marketQuestion.substring(0, 50)}...`,
        html: htmlContent,
        text: textContent,
      })

      if (error) {
        console.error('Error sending email:', error)
        return false
      }

      console.log(`✅ Price alert email sent to ${to} (ID: ${data?.id})`)
      return true
    } catch (error) {
      console.error('Error sending price alert email:', error)
      return false
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(
    to: string,
    verificationToken: string
  ): Promise<boolean> {
    if (!this.resend) {
      console.warn('⚠️  Email service not available - cannot send verification email')
      console.warn('⚠️  RESEND_API_KEY is missing or invalid')
      return false
    }

    try {
      const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`

      console.log(`📧 Attempting to send verification email to: ${to}`)
      console.log(`📧 From: ${this.fromEmail}`)
      console.log(`📧 Verification URL: ${verificationUrl}`)

      const { data, error } = await this.resend.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject: 'Verify Your Email - PolyCaster',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">PolyCaster</h1>
                <p style="color: #e0e7ff; margin: 5px 0 0 0;">AI-Powered Prediction Markets</p>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1e40af; margin-top: 0;">Verify Your Email Address</h2>
                <p>Thank you for signing up! Please verify your email address to enable email notifications for price alerts.</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
                </div>
                <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="color: #3b82f6; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
                <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't sign up for PolyCaster, you can safely ignore this email.</p>
              </div>
            </body>
          </html>
        `,
        text: `Verify your email address: ${verificationUrl}`,
      })

      if (error) {
        console.error('❌ Resend API Error:', error)
        console.error('❌ Error details:', JSON.stringify(error, null, 2))
        return false
      }

      if (data?.id) {
        console.log(`✅ Verification email sent successfully!`)
        console.log(`✅ Email ID: ${data.id}`)
        console.log(`✅ Recipient: ${to}`)
        return true
      } else {
        console.warn('⚠️  Email sent but no ID returned from Resend')
        return true // Still return true if no error
      }
    } catch (error) {
      console.error('❌ Exception sending verification email:', error)
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message)
        console.error('❌ Error stack:', error.stack)
      }
      return false
    }
  }

  /**
   * Generate HTML email template for price alerts
   */
  private generateAlertEmailHTML(
    alert: {
      marketQuestion: string
      targetPrice: number
      currentPrice: number
      condition: 'above' | 'below' | 'equals'
      marketId: string
    },
    marketUrl: string,
    appUrl: string
  ): string {
    const conditionText = alert.condition === 'above' ? 'above' : 
                         alert.condition === 'below' ? 'below' : 
                         'equals'
    
    const priceChange = alert.currentPrice - alert.targetPrice
    const priceChangePercent = ((priceChange / alert.targetPrice) * 100).toFixed(1)
    const isPositive = priceChange >= 0

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Price Alert Triggered</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Price Alert Triggered!</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Your market alert has been activated</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px;">
              <!-- Market Question -->
              <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">${this.escapeHtml(alert.marketQuestion)}</h2>
              
              <!-- Price Comparison -->
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                  <div>
                    <p style="margin: 0; color: #666; font-size: 14px;">Target Price</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #1e40af;">${(alert.targetPrice * 100).toFixed(1)}¢</p>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">(${conditionText})</p>
                  </div>
                  <div style="font-size: 30px; color: #cbd5e1;">→</div>
                  <div>
                    <p style="margin: 0; color: #666; font-size: 14px;">Current Price</p>
                    <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: ${isPositive ? '#10b981' : '#ef4444'};">${(alert.currentPrice * 100).toFixed(1)}¢</p>
                    <p style="margin: 5px 0 0 0; color: ${isPositive ? '#10b981' : '#ef4444'}; font-size: 12px;">${isPositive ? '+' : ''}${priceChangePercent}%</p>
                  </div>
                </div>
              </div>

              <!-- Alert Status -->
              <div style="background: ${isPositive ? '#d1fae5' : '#fee2e2'}; border-left: 4px solid ${isPositive ? '#10b981' : '#ef4444'}; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: ${isPositive ? '#065f46' : '#991b1b'}; font-weight: bold;">
                  ✅ Alert Condition Met: Price is ${conditionText} ${(alert.targetPrice * 100).toFixed(1)}¢
                </p>
              </div>

              <!-- Action Buttons -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${marketUrl}" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin-right: 10px;">View on Polymarket</a>
                <a href="${appUrl}/?market=${alert.marketId}" style="background: #f3f4f6; color: #1e40af; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; border: 2px solid #1e40af;">View in PolyCaster</a>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  You're receiving this email because you set up a price alert on PolyCaster.<br>
                  <a href="${appUrl}/alerts" style="color: #3b82f6;">Manage your alerts</a>
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }

  /**
   * Generate plain text email for price alerts
   */
  private generateAlertEmailText(
    alert: {
      marketQuestion: string
      targetPrice: number
      currentPrice: number
      condition: 'above' | 'below' | 'equals'
      marketId: string
    },
    marketUrl: string,
    appUrl: string
  ): string {
    const conditionText = alert.condition === 'above' ? 'above' : 
                         alert.condition === 'below' ? 'below' : 
                         'equals'

    return `
🔔 Price Alert Triggered!

Market: ${alert.marketQuestion}

Target Price: ${(alert.targetPrice * 100).toFixed(1)}¢ (${conditionText})
Current Price: ${(alert.currentPrice * 100).toFixed(1)}¢

Your alert has been triggered!

View on Polymarket: ${marketUrl}
View in PolyCaster: ${appUrl}/?market=${alert.marketId}

Manage your alerts: ${appUrl}/alerts
    `.trim()
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  /**
   * Check if email service is available
   */
  isAvailable(): boolean {
    return this.resend !== null
  }
}

export const emailService = new EmailService()

