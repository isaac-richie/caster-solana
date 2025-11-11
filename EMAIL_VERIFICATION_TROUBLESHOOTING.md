# Email Verification Troubleshooting Guide

## Common Issues & Solutions

### 1. **Email Not Sending - Check Backend Logs**

The backend now has detailed logging. Check your backend console for:

**✅ Success logs:**
```
✅ Email service initialized (Resend)
✅ API Key: re_xxxxx...xxxx
📧 Email From: onboarding@resend.dev
📧 Email From Name: PolyCaster
📧 Attempting to send verification email to: user@example.com
✅ Verification email sent successfully!
✅ Email ID: abc123...
```

**❌ Error logs:**
```
⚠️  RESEND_API_KEY not found - email notifications disabled
❌ Resend API Error: {...}
❌ Failed to send verification email
```

---

### 2. **RESEND_API_KEY Not Set**

**Problem:** `RESEND_API_KEY` is missing from `.env` file

**Solution:**
1. Get your API key from [Resend Dashboard](https://resend.com/api-keys)
2. Add to `backend-ts/.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
   ```
3. Restart backend server

---

### 3. **EMAIL_FROM Domain Not Verified**

**Problem:** The sender email domain is not verified in Resend

**Solution:**
- **For Testing:** Use Resend's pre-verified domain:
  ```
  EMAIL_FROM=onboarding@resend.dev
  ```
- **For Production:** 
  1. Go to [Resend Domains](https://resend.com/domains)
  2. Add and verify your domain
  3. Set `EMAIL_FROM=alerts@yourdomain.com`

---

### 4. **Check Environment Variables**

Make sure these are set in `backend-ts/.env`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=PolyCaster
FRONTEND_URL=http://localhost:3000
```

---

### 5. **Backend Not Restarted**

After changing `.env` file, **restart the backend server**:

```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Start backend
cd backend-ts
npm run dev
```

---

### 6. **Check Resend Dashboard**

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Check "Emails" tab for sent emails
3. Check for any errors or bounces
4. Verify API key is active

---

### 7. **Email in Spam Folder**

- Check spam/junk folder
- Add `onboarding@resend.dev` to contacts
- For production, set up SPF/DKIM records

---

### 8. **Frontend Not Showing Errors**

The frontend now shows better error messages:
- If `emailSent: false`, user sees warning
- Check browser console for API errors
- Check network tab for failed requests

---

## Debugging Steps

### Step 1: Check Backend Logs
```bash
# Look for these in backend console:
✅ Email service initialized
📧 Attempting to send verification email
✅ Verification email sent successfully!
```

### Step 2: Test Email Service
```bash
# Check backend health
curl http://localhost:8000/health
```

### Step 3: Check Resend API
1. Go to Resend Dashboard
2. Check "Emails" → "Sent"
3. Look for your verification email
4. Check for any errors

### Step 4: Verify Environment Variables
```bash
# In backend-ts directory
cat .env | grep RESEND
cat .env | grep EMAIL_FROM
```

---

## Quick Fix Checklist

- [ ] `RESEND_API_KEY` is set in `backend-ts/.env`
- [ ] `EMAIL_FROM` is set (use `onboarding@resend.dev` for testing)
- [ ] Backend server is restarted after `.env` changes
- [ ] Check backend console for error messages
- [ ] Check Resend Dashboard for sent emails
- [ ] Check spam folder
- [ ] Verify API key is active in Resend

---

## Testing

1. **Add email in frontend:**
   - Go to Alerts page
   - Click "Email Settings"
   - Enter email and click "Save Email"

2. **Check backend logs:**
   - Should see: `📧 Attempting to send verification email`
   - Should see: `✅ Verification email sent successfully!`

3. **Check email inbox:**
   - Look for email from `onboarding@resend.dev`
   - Check spam folder if not in inbox

4. **Click verification link:**
   - Should redirect to `/verify-email?token=...`
   - Should show success message

---

## Still Not Working?

1. **Check backend console** for detailed error messages
2. **Check Resend Dashboard** for API errors
3. **Verify API key** is correct and active
4. **Test with Resend's test domain** (`onboarding@resend.dev`)
5. **Check network tab** in browser for failed API calls


