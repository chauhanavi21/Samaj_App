# PowerShell Installation and Setup Script
# MongoDB to Firebase Migration
# Run this in PowerShell in the project root

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  FIREBASE MIGRATION - INSTALLATION SCRIPT  " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in correct directory
if (-not (Test-Path "backend")) {
    Write-Host "ERROR: backend folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Step 1: Check Node.js installation
Write-Host "[1/8] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Step 2: Uninstall Mongoose
Write-Host ""
Write-Host "[2/8] Removing MongoDB dependencies..." -ForegroundColor Yellow
Set-Location backend
try {
    npm uninstall mongoose --save 2>$null
    Write-Host "✓ Mongoose removed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Mongoose may not have been installed" -ForegroundColor DarkYellow
}

# Step 3: Install Firebase Admin
Write-Host ""
Write-Host "[3/8] Installing Firebase Admin SDK..." -ForegroundColor Yellow
try {
    npm install firebase-admin --save
    Write-Host "✓ Firebase Admin SDK installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install Firebase Admin SDK" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 4: Install all dependencies
Write-Host ""
Write-Host "[4/8] Installing all backend dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✓ All dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Step 5: Check for .env file
Write-Host ""
Write-Host "[5/8] Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    if (Test-Path ".env.example") {
        Write-Host "⚠ .env file not found, copying from .env.example" -ForegroundColor DarkYellow
        Copy-Item ".env.example" ".env"
        Write-Host "✓ .env file created" -ForegroundColor Green
        Write-Host "⚠ IMPORTANT: Edit backend/.env with your actual values!" -ForegroundColor Red
    } else {
        Write-Host "✗ .env.example not found!" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Step 6: Check for serviceAccountKey.json
Write-Host ""
Write-Host "[6/8] Checking Firebase service account key..." -ForegroundColor Yellow
if (Test-Path "serviceAccountKey.json") {
    Write-Host "✓ serviceAccountKey.json found" -ForegroundColor Green
} else {
    Write-Host "✗ serviceAccountKey.json not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "REQUIRED: Download serviceAccountKey.json from Firebase Console:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "  2. Select your project" -ForegroundColor White
    Write-Host "  3. Go to Project Settings > Service Accounts" -ForegroundColor White
    Write-Host "  4. Click 'Generate new private key'" -ForegroundColor White
    Write-Host "  5. Save the file as 'serviceAccountKey.json' in backend/ folder" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to continue when done, or Ctrl+C to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    if (Test-Path "serviceAccountKey.json") {
        Write-Host "✓ serviceAccountKey.json found" -ForegroundColor Green
    } else {
        Write-Host "✗ Still not found. Exiting..." -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

# Step 7: Remove MongoDB files
Write-Host ""
Write-Host "[7/8] Cleaning up MongoDB files..." -ForegroundColor Yellow
try {
    if (Test-Path "config\db.js") {
        Remove-Item "config\db.js" -Force
        Write-Host "✓ Removed config\db.js" -ForegroundColor Green
    }
    
    if (Test-Path "models") {
        Remove-Item "models" -Recurse -Force
        Write-Host "✓ Removed models\ folder" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Some files may not have existed" -ForegroundColor DarkYellow
}

# Step 8: Frontend dependencies
Write-Host ""
Write-Host "[8/8] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..
Set-Location MyExpoApp
try {
    npm install
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ Failed to install frontend dependencies" -ForegroundColor DarkYellow
    Write-Host "You may need to run 'npm install' manually in MyExpoApp/" -ForegroundColor Yellow
}

Set-Location ..

# Summary
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "          INSTALLATION COMPLETE!           " -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Edit backend/.env with your actual values:" -ForegroundColor White
Write-Host "   - JWT_SECRET (generate with: node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`")" -ForegroundColor Gray
Write-Host "   - ADMIN_EMAIL and ADMIN_PASSWORD" -ForegroundColor Gray
Write-Host "   - EMAIL configuration (for password reset)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy Firestore security rules:" -ForegroundColor White
Write-Host "   Option A: firebase deploy --only firestore:rules" -ForegroundColor Gray
Write-Host "   Option B: Copy backend\firestore.rules to Firebase Console manually" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the backend:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Import data (optional):" -ForegroundColor White
Write-Host "   npm run import-members path\to\members.xlsx" -ForegroundColor Gray
Write-Host "   npm run import-info path\to\information.xlsx" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Start the frontend:" -ForegroundColor White
Write-Host "   cd MyExpoApp" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Read the complete guide:" -ForegroundColor White
Write-Host "   FIREBASE_MIGRATION_GUIDE.txt" -ForegroundColor Gray
Write-Host "   MIGRATION_CHECKLIST.txt" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
