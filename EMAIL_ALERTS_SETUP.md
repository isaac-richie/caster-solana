# Email Alert System - Setup Guide

## Overview

The email alert system allows users to receive email notifications when their price alerts are triggered. The system includes:

1. **Email Collection**: Users can add/update their email address
2. **Email Verification**: Users must verify their email before receiving alerts
3. **Email Notifications**: When a price alert is triggered, an email is automatically sent

---

## How It Works

### 1. User Flow

```
User → Adds Email → Receives Verification Email → Clicks Link → Email Verified → Receives Alerts
```

### 2. Alert Triggering Flow

```
Alert Created → Backend Checks Every 30s → Price Matches → Alert Triggered → Email Sent
```

---

## Setup Instructions

### 1. Apply Database Migration

Apply the migration to add email fields to the `users` table:

```sql
-- Run this in Supabase SQL Editor
-- File: backend-ts/migrations/003_add_user_email.sql
```

### 2. Set Up Resend Email Service

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your domain (or use their test domain for development)

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key

3. **Add to Backend Environment**
   ```bash
   # backend-ts/.env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=alerts@yourdomain.com
   EMAIL_FROM_NAME=PolyCaster
   FRONTEND_URL=http://localhost:3000  # or your production URL
   ```

### 3. Verify Domain (Production)

For production, you need to:
- Add DNS records to verify your domain
- Use a verified domain as the sender email
- This ensures emails don't go to spam

---

## Backend Components

### Email Service (`backend-ts/src/services/email.ts`)

- **`sendPriceAlert()`**: Sends price alert email when triggered
- **`sendVerificationEmail()`**: Sends email verification link
- **HTML Templates**: Beautiful, responsive email templates

### Alert Checker (`backend-ts/src/services/alert-checker.ts`)

- Checks active alerts every 30 seconds
- Fetches current market prices
- Triggers alerts when conditions are met
- Calls `emailService.sendPriceAlert()` to send emails

### API Endpoints

- **`PATCH /users/:walletAddress/email`**: Update user email
- **`GET /users/verify-email?token=xxx`**: Verify email address

---

## Frontend Components

### Email Settings Modal (`polycasterz/src/components/user/EmailSettings.tsx`)

- Users can add/update their email
- Shows verification status
- Resend verification email option

### Verification Page (`polycasterz/src/app/verify-email/page.tsx`)

- Handles email verification when user clicks link
- Shows success/error states

### Alerts Page Integration

- "Email Settings" button added to alerts page
- Opens email settings modal

---

## Email Template Features

### Price Alert Email Includes:

- ✅ Market question
- ✅ Target price vs current price
- ✅ Price change percentage
- ✅ Links to Polymarket and PolyCaster
- ✅ Beautiful gradient design
- ✅ Mobile-responsive

---

## Testing

### 1. Test Email Collection

1. Go to `/alerts` page
2. Click "Email Settings"
3. Enter your email
4. Click "Save Email"
5. Check your inbox for verification email

### 2. Test Email Verification

1. Click verification link in email
2. Should redirect to `/verify-email?token=xxx`
3. Should show success message

### 3. Test Price Alert Email

1. Create a price alert
2. Wait for price to match condition (or manually trigger)
3. Check email inbox for alert notification

---

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**
   ```bash
   echo $RESEND_API_KEY  # Should not be empty
   ```

2. **Check Backend Logs**
   ```bash
   # Look for:
   ✅ Email service initialized (Resend)
   ✅ Email notification sent to user@example.com
   ```

3. **Check Email Service Status**
   - Backend logs will show: `⚠️ RESEND_API_KEY not found - email notifications disabled`
   - If you see this, add the API key to `.env`

### Verification Not Working

1. **Check Token**
   - Token is generated when email is saved
   - Token is cleared after verification
   - If token is invalid, resend verification email

2. **Check Database**
   - Ensure `email_verification_token` column exists
   - Check that token matches in database

### Emails Going to Spam

1. **Verify Domain** (Production)
   - Use verified domain in `EMAIL_FROM`
   - Add SPF/DKIM records

2. **Use Professional Sender**
   - Avoid generic emails like `noreply@example.com`
   - Use `alerts@yourdomain.com`

---

## Next Steps (Optional)

### SMS/WhatsApp Integration

The email alert system is designed to be extensible. You can add:

1. **SMS Alerts** (Twilio)
2. **WhatsApp Alerts** (WhatsApp Business API)
3. **Browser Push Notifications** (Web Push API)

The `sendNotification()` method in `alert-checker.ts` can be extended to support these channels.

---

## Environment Variables Summary

```bash
# Backend (.env)
RESEND_API_KEY=re_xxxxxxxxxxxxx          # Required
EMAIL_FROM=alerts@yourdomain.com         # Required
EMAIL_FROM_NAME=PolyCaster               # Optional (default: PolyCaster)
FRONTEND_URL=http://localhost:3000       # Required for verification links

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
```

---

## Support

For issues or questions:
1. Check backend logs for error messages
2. Verify Resend dashboard for email delivery status
3. Check Supabase database for user email status

---

**Status**: ✅ Email alerts fully implemented and ready for production use!


