# Email Integration Guide for Thali Yuva Sangh

## 📧 Email Service Setup

I've implemented a flexible email service that works with **5 different email providers**. Choose the one that works best for you!

---

## 🚀 Quick Start - Recommended Providers

### **Option 1: BREVO (Formerly Sendinblue)** ⭐ BEST FREE TIER

**Why Choose Brevo:**
- ✅ **300 emails/day FREE forever** (Best free tier!)
- ✅ No credit card required
- ✅ Easy setup, great for small communities
- ✅ Includes email templates and analytics

**Setup Steps:**

1. **Sign up**: https://www.brevo.com
2. **Get your SMTP credentials**:
   - Go to Settings → SMTP & API
   - Copy your SMTP username and password
3. **Add to your `.env` file**:
   ```env
   BREVO_SMTP_KEY=xkeysib-your-key-here
   BREVO_SMTP_USER=your-email@example.com
   EMAIL_FROM=noreply@thaliyuvasangh.org
   EMAIL_FROM_NAME=Thali Yuva Sangh
   ```

**That's it!** The backend will automatically use Brevo.

---

### **Option 2: RESEND** ⭐ BEST FOR DEVELOPERS

**Why Choose Resend:**
- ✅ 100 emails/day free
- ✅ Modern API, great documentation
- ✅ No credit card required
- ✅ Built for developers

**Setup Steps:**

1. **Sign up**: https://resend.com
2. **Get API Key**:
   - Go to API Keys
   - Create a new API key
3. **Add to your `.env` file**:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_FROM_NAME=Thali Yuva Sangh
   ```

---

### **Option 3: GMAIL** ⭐ EASIEST TO TEST

**Why Choose Gmail:**
- ✅ Free (500 emails/day)
- ✅ You already have a Gmail account
- ✅ Perfect for testing

**Setup Steps:**

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Copy the 16-character password
3. **Add to your `.env` file**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Thali Yuva Sangh
   ```

⚠️ **Note**: Gmail is great for testing but has stricter limits for production use.

---

## 📦 Installation

Install nodemailer (already standard in most Node.js projects):

```bash
cd backend
npm install nodemailer
```

---

## 🔧 Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Choose ONE email provider** from the options above and add the credentials to `.env`

3. **Restart your backend:**
   ```bash
   npm run dev
   ```

---

## ✨ What's Included

The email service automatically sends:

### 1. **Password Reset Emails**
- ✅ Beautiful HTML email with your branding
- ✅ Reset token that expires in 10 minutes
- ✅ Fallback to plain text for email clients without HTML
- ✅ Security warnings included
- ✅ Works with deep links in the mobile app

### 2. **Welcome Emails** (Bonus!)
- ✅ Sent automatically when user signs up
- ✅ Includes their Member ID
- ✅ Lists all member benefits
- ✅ Non-critical (won't break signup if it fails)

---

## 🧪 Testing

### Test Password Reset:

1. **Start your backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Request password reset** through the app:
   - Open app → Login → "Forgot Password?"
   - Enter email and Member ID

3. **Check your email inbox** for the reset link/token

4. **Use the token** to reset your password

### Development Mode:
If email service isn't configured, the backend will:
- ✅ Still generate the token
- ✅ Return it in the API response (development only)
- ✅ Show it in console logs
- ✅ Let you test the flow without email

---

## 📊 Comparison Table

| Provider | Free Emails/Day | Credit Card | Best For | Setup Difficulty |
|----------|----------------|-------------|----------|-----------------|
| **Brevo** | 300 | ❌ No | Production | ⭐ Easy |
| **Resend** | 100 | ❌ No | Developers | ⭐ Easy |
| **Gmail** | 500 | ❌ No | Testing | ⭐⭐ Medium |
| **SendGrid** | 100 | ✅ Yes | Production | ⭐⭐ Medium |
| **Mailgun** | 5,000 (3mo) | ✅ Yes | High Volume | ⭐⭐⭐ Advanced |

---

## 🎨 Email Templates

Both email templates are fully customizable in `backend/utils/emailService.js`:

- **Colors**: Match your app's branding (#1A3A69, #FF8C00)
- **Logo**: Can add your logo image
- **Content**: Easy to modify text and styling
- **Mobile-friendly**: Responsive design

---

## 🔒 Security Features

- ✅ Tokens expire in 10 minutes
- ✅ Hashed tokens in database (not plain text)
- ✅ Requires both email AND Member ID for verification
- ✅ Clear security warnings in emails
- ✅ Automatic token cleanup on use/expire

---

## 🐛 Troubleshooting

### Email not sending?

1. **Check console logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test with Gmail first** (easiest to set up)
4. **Check spam folder** in your email

### Gmail App Password not working?

- Make sure 2FA is enabled
- Use the 16-character password (with or without spaces)
- Try regenerating the app password

### Brevo/Resend errors?

- Verify your API key is correct
- Check your account is verified
- Ensure `EMAIL_FROM` matches your verified domain

---

## 🚀 Production Checklist

Before going live:

- [ ] Choose a production email provider (Brevo/Resend recommended)
- [ ] Verify your sending domain
- [ ] Update `FRONTEND_URL` in `.env` to your production URL
- [ ] Test reset flow end-to-end
- [ ] Monitor email delivery rates
- [ ] Set up SPF/DKIM records (provider will guide you)

---

## 💡 Pro Tips

1. **Start with Brevo** - Best free tier, easy setup
2. **Use Gmail for testing** - Quick to set up, no signup needed
3. **Set up proper FROM address** - Use noreply@yourdomain.com
4. **Monitor your quotas** - Check provider dashboard regularly
5. **Keep backup provider** - Have credentials ready for another service

---

## 📞 Support

If you need help:
1. Check the console logs in your backend
2. Verify your `.env` file has the correct credentials
3. Test with Gmail first to isolate issues
4. Check provider status pages for outages

---

## 🎉 You're All Set!

Your password reset system is now fully functional with email delivery. Users will receive professional emails with reset links that work seamlessly with your mobile app!

Choose your provider, add the credentials, and you're done! 🚀
