# Pre-Launch Checklist

## 🎯 Implementation Status

### ✅ Backend (COMPLETE)
- [x] Admin routes created (`/api/admin/*`)
- [x] Admin middleware (JWT + role verification)
- [x] PageContent model for CMS
- [x] Image upload with multer
- [x] Admin bootstrap script
- [x] Server configuration complete

### ✅ Frontend (COMPLETE)
- [x] AuthContext updated for role-based routing
- [x] API service extended with adminAPI
- [x] Login/Signup screens updated
- [x] Admin route group created `(admin)`
- [x] AdminDashboard screen
- [x] AdminUsers screen (full CRUD)
- [x] AdminContent screen (CMS)
- [x] AdminMedia screen (image upload)
- [x] Root layout updated with (admin) registration
- [x] Navigation guards implemented

### ✅ Documentation (COMPLETE)
- [x] Implementation summary
- [x] Testing guide
- [x] Quick reference guide
- [x] Pre-launch checklist (this file)

---

## 🔧 Pre-Testing Setup

### Step 1: Install Dependencies
```bash
cd MyExpoApp
npm install
```

**Verify packages installed:**
- expo-image-picker ✅
- expo-clipboard (part of expo SDK) ✅

### Step 2: Backend Setup
```bash
cd backend
npm install
```

**Check environment variables in `.env`:**
```env
PORT=3001
MONGODB_URI=mongodb+srv://chauhanavi843_db_user:***@cluster0.5qspsln.mongodb.net/SamajApp
JWT_SECRET=your_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Admin Bootstrap
ENABLE_ADMIN_BOOTSTRAP=true
ADMIN_BOOTSTRAP_EMAIL=chauhanavi843@gmail.com
ADMIN_BOOTSTRAP_PASSWORD=Admin@123!ChangeMe
```

### Step 3: Start Backend
```bash
cd backend
npm start
```

**Expected console output:**
```
MongoDB Connected: cluster0.5qspsln.mongodb.net
✓ Admin user verified/created: chauhanavi843@gmail.com
Server running on port 3001
```

### Step 4: Start Frontend
```bash
cd MyExpoApp
npx expo start
```

**Choose platform:**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code for physical device

---

## 🧪 Essential Tests Before Launch

### Test 1: Admin Authentication ⭐ CRITICAL
1. Open app
2. Go to Login
3. Enter: `chauhanavi843@gmail.com` / `Admin@123!ChangeMe`
4. **MUST**: Redirect to Admin Dashboard (not user tabs)
5. **MUST**: See 4 admin tabs at bottom

**Status**: [ ] PASS [ ] FAIL

---

### Test 2: User Authentication ⭐ CRITICAL
1. Logout from admin
2. Create new user OR login as existing user
3. **MUST**: Redirect to User tabs (not admin)
4. **MUST**: See user tabs (Home, Explore, Family Tree)

**Status**: [ ] PASS [ ] FAIL

---

### Test 3: Admin Dashboard Load
1. Login as admin
2. View Dashboard tab
3. **MUST**: Stats cards display numbers
4. **MUST**: Recent signups list appears
5. Pull to refresh
6. **MUST**: Stats update

**Status**: [ ] PASS [ ] FAIL

---

### Test 4: User CRUD Operations ⭐ CRITICAL
1. Go to Users tab
2. **Search**: Type a name, verify filtering
3. **View**: Tap eye icon, see user details modal
4. **Edit**: Tap pencil, change name, save successfully
5. **Role**: Change user to admin, verify badge appears
6. **Delete**: Delete a test user (careful!)

**Status**: [ ] PASS [ ] FAIL

---

### Test 5: Content Management
1. Go to Content tab
2. **Create Page**:
   - Tap "+" button
   - Page Name: `test-page`
   - Display Name: `Test Page`
   - Add section with title and text
   - Toggle Published ON
   - Save successfully
3. **Edit Page**: Modify page, add section, save
4. **Delete Page**: Remove test page

**Status**: [ ] PASS [ ] FAIL

---

### Test 6: Media Upload ⭐ IMPORTANT
1. Go to Media tab
2. **Gallery Upload**:
   - Tap "Choose from Gallery"
   - Grant permissions (first time)
   - Select image
   - Wait for upload
   - **MUST**: Success alert + image URL displayed
3. **Copy URL**: Tap copy, verify "Copied" alert
4. Paste URL in Content section → Image URL field

**Status**: [ ] PASS [ ] FAIL

---

### Test 7: Navigation Guards ⭐ CRITICAL
1. Login as regular user
2. Try to access admin routes (if possible)
3. **MUST**: Blocked or redirected
4. Login as admin
5. **MUST**: Access granted

**Status**: [ ] PASS [ ] FAIL

---

### Test 8: Family Tree Protection ⭐ CRITICAL
1. Login as admin
2. Go to Users → View Details on a user with family tree
3. **MUST**: See family tree COUNT only (read-only)
4. **MUST NOT**: See edit/delete buttons for family tree
5. Logout, login as that user
6. Go to Family Tree tab
7. **MUST**: User can edit their own family tree

**Status**: [ ] PASS [ ] FAIL

---

## 🐛 Known Issues to Watch For

### Issue 1: "Unauthorized" on first load
**Symptom**: Admin sees "Unauthorized" immediately after login  
**Cause**: Token not yet stored in SecureStore  
**Solution**: Already handled in AuthContext with token parameter  
**Verify**: Login should work smoothly without errors

---

### Issue 2: Image upload permissions
**Symptom**: "Permission denied" on iOS  
**Cause**: Info.plist missing camera/photo permissions  
**Solution**: Add to `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos for uploading images.",
          "cameraPermission": "The app accesses your camera to take photos."
        }
      ]
    ]
  }
}
```
**Verify**: Permissions requested correctly

---

### Issue 3: expo-clipboard import error
**Symptom**: `Cannot find module 'expo-clipboard'`  
**Cause**: Not explicitly installed  
**Solution**: 
```bash
cd MyExpoApp
npx expo install expo-clipboard
```
**Verify**: Import works without errors

---

### Issue 4: Clipboard.setStringAsync is not a function
**Symptom**: Error when copying image URL  
**Alternative Solution**: Use `Clipboard` from `react-native`:
```typescript
import { Clipboard } from 'react-native';
Clipboard.setString(url);
```
**Verify**: Copy URL works and shows "Copied" alert

---

## 📱 Platform-Specific Testing

### iOS Testing
- [ ] Login/logout works
- [ ] All 4 admin screens load
- [ ] Image picker opens
- [ ] Camera access works
- [ ] Copy to clipboard works
- [ ] Navigation smooth
- [ ] No console errors

### Android Testing
- [ ] Login/logout works
- [ ] All 4 admin screens load
- [ ] Image picker opens
- [ ] Camera access works
- [ ] Copy to clipboard works
- [ ] Navigation smooth
- [ ] No console errors

### Web Testing (Optional)
- [ ] Basic functionality works
- [ ] Image upload may need polyfill
- [ ] Camera not available (expected)

---

## 🔒 Security Verification

### Before Production Launch

1. **Change Admin Password** ⭐ CRITICAL
   ```bash
   # Login to backend, run:
   cd backend
   node scripts/changeAdminPassword.js
   ```
   Or change via Users screen in admin panel

2. **Update API URL**
   File: `MyExpoApp/config/api.ts`
   ```typescript
   const API_BASE_URL = 'https://your-production-api.com/api';
   ```

3. **Verify HTTPS** ⭐ CRITICAL
   - [ ] Production backend uses HTTPS
   - [ ] SSL certificate valid
   - [ ] Mixed content warnings resolved

4. **Environment Variables**
   - [ ] JWT_SECRET changed from default
   - [ ] MONGODB_URI uses production database
   - [ ] Admin bootstrap disabled in production (set ENABLE_ADMIN_BOOTSTRAP=false)

5. **CORS Configuration**
   - [ ] CORS allows production domain only
   - [ ] Wildcard (*) removed in production

---

## 📊 Performance Benchmarks

Test on actual devices and record:

| Operation | Target Time | Actual Time | Status |
|-----------|-------------|-------------|--------|
| Login | <2s | ___s | ☐ |
| Dashboard Load | <2s | ___s | ☐ |
| User List (10) | <1s | ___s | ☐ |
| Search Users | <500ms | ___ms | ☐ |
| Image Upload (1MB) | <3s | ___s | ☐ |
| Create Page | <1s | ___s | ☐ |
| Edit Page | <1s | ___s | ☐ |

**All operations should be under target times.**

---

## 🚀 Go-Live Checklist

### Final Steps Before Launch

1. **Code Review**
   - [ ] All console.logs removed or commented
   - [ ] No hardcoded credentials
   - [ ] Error handling complete
   - [ ] Loading states implemented

2. **Testing**
   - [ ] All 8 essential tests PASS
   - [ ] Tested on iOS device
   - [ ] Tested on Android device
   - [ ] Network error handling verified
   - [ ] Token expiration handled

3. **Documentation**
   - [ ] Admin users trained
   - [ ] Documentation accessible
   - [ ] Support contact available
   - [ ] FAQ prepared

4. **Monitoring**
   - [ ] Error logging active
   - [ ] Performance monitoring setup
   - [ ] Backend health checks configured
   - [ ] Alerts for critical errors

5. **Backup**
   - [ ] Database backup scheduled
   - [ ] Code repository backed up
   - [ ] Environment variables documented
   - [ ] Rollback plan ready

6. **Deploy**
   - [ ] Backend deployed to production
   - [ ] Frontend built for production
   - [ ] App submitted to stores (if applicable)
   - [ ] DNS/domain configured

---

## 📋 Post-Launch Monitoring (First Week)

### Daily Checks
- [ ] Check error logs
- [ ] Monitor user signups
- [ ] Verify admin operations
- [ ] Check image uploads
- [ ] Review API response times

### User Feedback
- [ ] Collect admin user feedback
- [ ] Document reported issues
- [ ] Track feature requests
- [ ] Monitor support tickets

---

## 🆘 Emergency Contacts

**Technical Issues:**
- Developer: [Name] - [Email] - [Phone]
- Backend: [Server Admin] - [Email]
- Database: [MongoDB Support] - [Email]

**Business Issues:**
- Admin Lead: [Name] - [Email] - [Phone]
- App Owner: [Name] - [Email]

---

## 📝 Sign-Off

### Development Team
- [ ] Developer confirms all features implemented
- [ ] QA confirms all tests pass
- [ ] Security review complete

**Developer Signature**: _________________ Date: _______

### Admin Team
- [ ] Admin users trained on all features
- [ ] Documentation reviewed
- [ ] Test accounts verified

**Admin Lead Signature**: _________________ Date: _______

### Final Approval
- [ ] All checklist items complete
- [ ] Ready for production launch

**Approved By**: _________________ Date: _______

---

## 🎉 Success Criteria

**Launch is successful when:**
1. ✅ Admin can login and access all 4 tabs
2. ✅ Users can login and access user tabs only
3. ✅ All CRUD operations work correctly
4. ✅ No critical errors in logs
5. ✅ Response times meet benchmarks
6. ✅ Security measures verified
7. ✅ Admin users can perform daily tasks
8. ✅ Zero data loss or corruption

---

**Checklist Version**: 1.0  
**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Status**: READY FOR TESTING

---

## 📞 Need Help?

If you encounter issues during testing:

1. Check console logs (frontend and backend)
2. Review error messages carefully
3. Consult ADMIN_TESTING_GUIDE.md
4. Check ADMIN_QUICK_REFERENCE.md for common operations
5. Contact development team with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/logs
   - Device/platform information

---

**Good luck with launch! 🚀**
