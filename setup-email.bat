@echo off
REM Quick Email Setup Script for Thali Yuva Sangh (Windows)

echo =============================================
echo  Email Service Setup for Thali Yuva Sangh
echo =============================================
echo.
echo Choose your email provider:
echo.
echo 1. BREVO (Recommended - 300 emails/day FREE)
echo 2. RESEND (100 emails/day, best for developers)
echo 3. GMAIL (Easy testing, 500 emails/day)
echo 4. SENDGRID (100 emails/day)
echo 5. MAILGUN (5,000 emails/month first 3 months)
echo 6. Skip for now (will use dev mode)
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto brevo
if "%choice%"=="2" goto resend
if "%choice%"=="3" goto gmail
if "%choice%"=="4" goto sendgrid
if "%choice%"=="5" goto mailgun
if "%choice%"=="6" goto skip
goto invalid

:brevo
echo.
echo Setting up BREVO...
echo 1. Sign up at: https://www.brevo.com
echo 2. Go to Settings - SMTP and API
echo 3. Copy your SMTP credentials
echo.
set /p brevo_key="Enter your BREVO SMTP key: "
set /p brevo_user="Enter your SMTP username/email: "
set /p from_email="Enter your FROM email (e.g., noreply@thaliyuvasangh.org): "

(
echo.
echo # Email Configuration - BREVO
echo BREVO_SMTP_KEY=%brevo_key%
echo BREVO_SMTP_USER=%brevo_user%
echo EMAIL_FROM=%from_email%
echo EMAIL_FROM_NAME=Thali Yuva Sangh
echo FRONTEND_URL=exp://192.168.1.100:8081
) >> backend\.env

echo.
echo ✅ BREVO configured! Check backend\.env
goto end

:resend
echo.
echo Setting up RESEND...
echo 1. Sign up at: https://resend.com
echo 2. Go to API Keys
echo 3. Create a new API key
echo.
set /p resend_key="Enter your RESEND API key: "
set /p from_email="Enter your FROM email: "

(
echo.
echo # Email Configuration - RESEND
echo RESEND_API_KEY=%resend_key%
echo EMAIL_FROM=%from_email%
echo EMAIL_FROM_NAME=Thali Yuva Sangh
echo FRONTEND_URL=exp://192.168.1.100:8081
) >> backend\.env

echo.
echo ✅ RESEND configured! Check backend\.env
goto end

:gmail
echo.
echo Setting up GMAIL...
echo 1. Enable 2-Factor Authentication
echo 2. Go to: https://myaccount.google.com/apppasswords
echo 3. Generate an app password
echo.
set /p gmail_user="Enter your Gmail address: "
set /p gmail_pass="Enter your 16-character app password: "

(
echo.
echo # Email Configuration - GMAIL
echo GMAIL_USER=%gmail_user%
echo GMAIL_APP_PASSWORD=%gmail_pass%
echo EMAIL_FROM=%gmail_user%
echo EMAIL_FROM_NAME=Thali Yuva Sangh
echo FRONTEND_URL=exp://192.168.1.100:8081
) >> backend\.env

echo.
echo ✅ GMAIL configured! Check backend\.env
goto end

:sendgrid
echo.
echo Setting up SENDGRID...
echo 1. Sign up at: https://sendgrid.com
echo 2. Go to Settings - API Keys
echo 3. Create a new API key
echo.
set /p sendgrid_key="Enter your SENDGRID API key: "
set /p from_email="Enter your FROM email: "

(
echo.
echo # Email Configuration - SENDGRID
echo SENDGRID_API_KEY=%sendgrid_key%
echo EMAIL_FROM=%from_email%
echo EMAIL_FROM_NAME=Thali Yuva Sangh
echo FRONTEND_URL=exp://192.168.1.100:8081
) >> backend\.env

echo.
echo ✅ SENDGRID configured! Check backend\.env
goto end

:mailgun
echo.
echo Setting up MAILGUN...
echo 1. Sign up at: https://www.mailgun.com
echo 2. Get your SMTP credentials
echo.
set /p mailgun_login="Enter your MAILGUN SMTP login: "
set /p mailgun_pass="Enter your MAILGUN SMTP password: "
set /p from_email="Enter your FROM email: "

(
echo.
echo # Email Configuration - MAILGUN
echo MAILGUN_SMTP_LOGIN=%mailgun_login%
echo MAILGUN_SMTP_PASSWORD=%mailgun_pass%
echo EMAIL_FROM=%from_email%
echo EMAIL_FROM_NAME=Thali Yuva Sangh
echo FRONTEND_URL=exp://192.168.1.100:8081
) >> backend\.env

echo.
echo ✅ MAILGUN configured! Check backend\.env
goto end

:skip
echo.
echo Skipping email setup...
echo The app will work in development mode.
echo Reset tokens will be returned in API responses.
goto end

:invalid
echo.
echo Invalid choice. Please run the script again.
exit /b 1

:end
echo.
echo =============================================
echo  ✨ Setup Complete!
echo =============================================
echo.
echo Next steps:
echo 1. cd backend
echo 2. npm install nodemailer
echo 3. npm run dev
echo.
echo Test your setup by requesting a password reset in the app!
echo =============================================
pause
