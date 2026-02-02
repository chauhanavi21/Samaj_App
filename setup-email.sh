#!/bin/bash

# Quick Email Setup Script for Thali Yuva Sangh
# This script helps you choose and configure your email provider

echo "📧 Email Service Setup for Thali Yuva Sangh"
echo "=========================================="
echo ""
echo "Choose your email provider:"
echo ""
echo "1. BREVO (Recommended - 300 emails/day FREE)"
echo "2. RESEND (100 emails/day, best for developers)"
echo "3. GMAIL (Easy testing, 500 emails/day)"
echo "4. SENDGRID (100 emails/day)"
echo "5. MAILGUN (5,000 emails/month first 3 months)"
echo "6. Skip for now (will use dev mode)"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
  1)
    echo ""
    echo "Setting up BREVO..."
    echo "1. Sign up at: https://www.brevo.com"
    echo "2. Go to Settings → SMTP & API"
    echo "3. Copy your SMTP credentials"
    echo ""
    read -p "Enter your BREVO SMTP key: " brevo_key
    read -p "Enter your SMTP username/email: " brevo_user
    read -p "Enter your FROM email (e.g., noreply@thaliyuvasangh.org): " from_email
    
    cat >> backend/.env << EOF

# Email Configuration - BREVO
BREVO_SMTP_KEY=$brevo_key
BREVO_SMTP_USER=$brevo_user
EMAIL_FROM=$from_email
EMAIL_FROM_NAME=Thali Yuva Sangh
FRONTEND_URL=exp://192.168.1.100:8081
EOF
    echo "✅ BREVO configured! Check backend/.env"
    ;;
    
  2)
    echo ""
    echo "Setting up RESEND..."
    echo "1. Sign up at: https://resend.com"
    echo "2. Go to API Keys"
    echo "3. Create a new API key"
    echo ""
    read -p "Enter your RESEND API key: " resend_key
    read -p "Enter your FROM email: " from_email
    
    cat >> backend/.env << EOF

# Email Configuration - RESEND
RESEND_API_KEY=$resend_key
EMAIL_FROM=$from_email
EMAIL_FROM_NAME=Thali Yuva Sangh
FRONTEND_URL=exp://192.168.1.100:8081
EOF
    echo "✅ RESEND configured! Check backend/.env"
    ;;
    
  3)
    echo ""
    echo "Setting up GMAIL..."
    echo "1. Enable 2-Factor Authentication"
    echo "2. Go to: https://myaccount.google.com/apppasswords"
    echo "3. Generate an app password"
    echo ""
    read -p "Enter your Gmail address: " gmail_user
    read -p "Enter your 16-character app password: " gmail_pass
    
    cat >> backend/.env << EOF

# Email Configuration - GMAIL
GMAIL_USER=$gmail_user
GMAIL_APP_PASSWORD=$gmail_pass
EMAIL_FROM=$gmail_user
EMAIL_FROM_NAME=Thali Yuva Sangh
FRONTEND_URL=exp://192.168.1.100:8081
EOF
    echo "✅ GMAIL configured! Check backend/.env"
    ;;
    
  4)
    echo ""
    echo "Setting up SENDGRID..."
    echo "1. Sign up at: https://sendgrid.com"
    echo "2. Go to Settings → API Keys"
    echo "3. Create a new API key"
    echo ""
    read -p "Enter your SENDGRID API key: " sendgrid_key
    read -p "Enter your FROM email: " from_email
    
    cat >> backend/.env << EOF

# Email Configuration - SENDGRID
SENDGRID_API_KEY=$sendgrid_key
EMAIL_FROM=$from_email
EMAIL_FROM_NAME=Thali Yuva Sangh
FRONTEND_URL=exp://192.168.1.100:8081
EOF
    echo "✅ SENDGRID configured! Check backend/.env"
    ;;
    
  5)
    echo ""
    echo "Setting up MAILGUN..."
    echo "1. Sign up at: https://www.mailgun.com"
    echo "2. Get your SMTP credentials"
    echo ""
    read -p "Enter your MAILGUN SMTP login: " mailgun_login
    read -p "Enter your MAILGUN SMTP password: " mailgun_pass
    read -p "Enter your FROM email: " from_email
    
    cat >> backend/.env << EOF

# Email Configuration - MAILGUN
MAILGUN_SMTP_LOGIN=$mailgun_login
MAILGUN_SMTP_PASSWORD=$mailgun_pass
EMAIL_FROM=$from_email
EMAIL_FROM_NAME=Thali Yuva Sangh
FRONTEND_URL=exp://192.168.1.100:8081
EOF
    echo "✅ MAILGUN configured! Check backend/.env"
    ;;
    
  6)
    echo ""
    echo "Skipping email setup..."
    echo "The app will work in development mode."
    echo "Reset tokens will be returned in API responses."
    ;;
    
  *)
    echo "Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "=========================================="
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm install nodemailer"
echo "3. npm run dev"
echo ""
echo "Test your setup by requesting a password reset in the app!"
echo "=========================================="
