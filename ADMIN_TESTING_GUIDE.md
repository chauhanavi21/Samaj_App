# Admin Frontend Testing Guide

## Overview
This guide will help you test the complete admin frontend implementation for the Samaj App.

## Prerequisites
- Backend server running on port 3001
- Admin account created: `chauhanavi843@gmail.com` / `Admin@123!ChangeMe`
- Expo app ready to run

## Setup Steps

### 1. Start Backend Server
```bash
cd backend
npm start
```
Verify the server is running and admin bootstrap completes successfully.

### 2. Start Expo App
```bash
cd MyExpoApp
npx expo start
```

## Testing Checklist

### Phase 1: Authentication & Role-Based Routing

#### Test 1: Admin Login
1. Open the app
2. Navigate to Login screen
3. Enter credentials:
   - Email: `chauhanavi843@gmail.com`
   - Password: `Admin@123!ChangeMe`
4. Tap "Login"
5. **Expected**: Automatically routed to Admin Dashboard (/(admin) route)
6. **Verify**: Should see 4 tabs at bottom: Dashboard, Users, Content, Media

#### Test 2: Regular User Login
1. Logout from admin account
2. Create/login with a regular user account
3. **Expected**: Routed to user tabs (/(tabs) route)
4. **Verify**: Should see user tabs: Home, Explore, Family Tree

#### Test 3: Direct URL Protection
1. While logged in as regular user
2. Try to manually navigate to /(admin) routes
3. **Expected**: Should be redirected back to login or (tabs)

---

### Phase 2: Admin Dashboard

#### Test 4: Dashboard Stats Display
1. Login as admin
2. View Dashboard tab
3. **Verify**:
   - Total Users card displays correct count
   - Total Admins card displays correct count
   - Regular Users card displays correct count
   - Family Trees card displays correct count
4. Pull to refresh
5. **Expected**: Stats update successfully

#### Test 5: Recent Activity Lists
1. On Dashboard
2. **Verify**:
   - "Recent Signups" section shows newest users
   - "Active Users" section shows user list
   - Each user card shows name, email, join date

---

### Phase 3: User Management

#### Test 6: User List & Search
1. Navigate to "Users" tab
2. **Verify**: List of all users displayed
3. Type in search bar: "chauhan"
4. **Expected**: Filtered results showing matching users
5. Clear search
6. **Verify**: All users shown again

#### Test 7: Role Filter Tabs
1. On Users screen
2. Tap "Admin" tab
3. **Verify**: Only admin users shown
4. Tap "User" tab
5. **Verify**: Only regular users shown
6. Tap "All" tab
7. **Verify**: All users shown

#### Test 8: View User Details
1. Find any user in the list
2. Tap "View Details" button (eye icon)
3. **Verify Modal Shows**:
   - Full name
   - Email
   - Member ID
   - Phone number
   - Role
   - Family tree count (view-only)
   - Join date
4. Tap "Close" to dismiss

#### Test 9: Edit User Information
1. Find a user to edit
2. Tap "Edit" button (pencil icon)
3. **Verify Edit Modal Shows** with form fields:
   - Name
   - Email
   - Member ID
   - Phone
4. Modify the name field
5. Tap "Save Changes"
6. **Expected**: Success alert, modal closes, user list refreshes
7. **Verify**: Updated name appears in list

#### Test 10: Change User Role
1. Find a regular user
2. Tap "Change Role" button (shield icon)
3. **Expected**: Confirmation alert appears
4. Tap "Promote" to confirm
5. **Expected**: Success alert, user now has "ADMIN" badge
6. Tap "Change Role" again
7. Tap "Demote" to revert
8. **Expected**: User returns to regular role

#### Test 11: Delete User
1. Find a test user to delete
2. Tap "Delete" button (trash icon)
3. **Expected**: Confirmation alert appears
4. Tap "Cancel" first
5. **Expected**: Nothing happens, user still in list
6. Tap "Delete" again, then "Delete" to confirm
7. **Expected**: Success alert, user removed from list

#### Test 12: Pagination
1. On Users screen
2. Scroll to bottom
3. **Verify**: "Previous" and "Next" buttons visible
4. Tap "Next"
5. **Expected**: Page 2 loads with next 10 users
6. Tap "Previous"
7. **Expected**: Return to page 1

---

### Phase 4: Content Management (CMS)

#### Test 13: View Pages List
1. Navigate to "Content" tab
2. **Verify**: List of existing pages (if any)
3. Each page card should show:
   - Display name
   - Published/Draft badge
   - Page name (URL slug)
   - Section count
   - Last updated date

#### Test 14: Create New Page
1. On Content screen
2. Tap "+" button in header
3. **Verify Create Modal Opens**
4. Fill in fields:
   - Page Name: `test-page`
   - Display Name: `Test Page`
5. Tap "Add Section" button
6. Fill first section:
   - Title: `Welcome Section`
   - Text: `This is the test content`
   - Image URL: `/uploads/test.jpg`
7. Toggle "Published" switch ON
8. Tap "Create Page"
9. **Expected**: Success alert, modal closes
10. **Verify**: New page appears in list with PUBLISHED badge

#### Test 15: Edit Existing Page
1. Find the page you just created
2. Tap "Edit" button (pencil icon)
3. **Verify Edit Modal Opens** with existing data
4. Change Display Name to `Updated Test Page`
5. Tap "Add Section" to add a second section
6. Fill second section:
   - Title: `Second Section`
   - Text: `More content here`
7. Tap "Save Changes"
8. **Expected**: Success alert, modal closes
9. **Verify**: Page updated with new display name and 2 sections

#### Test 16: Toggle Publish Status
1. Edit a page
2. Toggle "Published" switch OFF
3. Save changes
4. **Verify**: Page shows DRAFT badge in list
5. Edit again, toggle ON
6. **Verify**: Page shows PUBLISHED badge

#### Test 17: Remove Section
1. Edit a page with multiple sections
2. Tap trash icon on Section 2
3. **Expected**: Section removed from form
4. Save changes
5. **Verify**: Page now has one fewer section

#### Test 18: Delete Page
1. Find a test page to delete
2. Tap "Delete" button (trash icon)
3. **Expected**: Confirmation alert
4. Tap "Delete" to confirm
5. **Expected**: Success alert
6. **Verify**: Page removed from list

---

### Phase 5: Media Upload

#### Test 19: Upload from Gallery
1. Navigate to "Media" tab
2. Tap "Choose from Gallery" button
3. **Expected**: Permission request appears (first time)
4. Grant permission
5. Select an image from gallery
6. **Expected**: 
   - "Uploading..." indicator appears
   - Success alert when complete
   - Image appears in "Recently Uploaded" section
   - Image URL displayed below thumbnail

#### Test 20: Take Photo
1. On Media screen
2. Tap "Take Photo" button
3. **Expected**: Permission request for camera
4. Grant permission
5. Take a photo
6. Confirm/save the photo
7. **Expected**:
   - Image uploads automatically
   - Success alert
   - Photo appears in recently uploaded

#### Test 21: Copy Image URL
1. After uploading an image
2. Tap "Copy URL" button on an uploaded image
3. **Expected**: "Copied" alert appears
4. Navigate to Content tab
5. Create/edit a page
6. Paste into Image URL field
7. **Verify**: URL pasted correctly (e.g., `/uploads/filename.jpg`)

#### Test 22: Image Validation
1. Try to upload a very large file (>5MB)
2. **Expected**: Error alert about file size
3. Try to upload a non-image file (if possible)
4. **Expected**: Error alert about file type

---

### Phase 6: Navigation & Guards

#### Test 23: Tab Navigation
1. Login as admin
2. Navigate between all 4 admin tabs
3. **Verify**: Each tab loads correctly without errors
4. **Verify**: Tab bar always visible at bottom
5. **Verify**: Active tab highlighted

#### Test 24: Back Navigation
1. While in admin section
2. Use device/browser back button
3. **Expected**: Navigate back through admin screens
4. **Should NOT** accidentally go to user (tabs) routes

#### Test 25: Logout & Re-login
1. From any admin screen
2. Logout (implement logout button if needed)
3. **Expected**: Redirected to login screen
4. Login again as admin
5. **Expected**: Return to admin dashboard
6. **Verify**: Previous state not preserved (fresh load)

---

### Phase 7: Error Handling

#### Test 26: Network Error Handling
1. Disable network/WiFi
2. Try to refresh dashboard
3. **Expected**: Error message displayed with retry button
4. Re-enable network
5. Tap retry
6. **Expected**: Data loads successfully

#### Test 27: Invalid Data Handling
1. On Users edit modal
2. Clear required fields (name, email)
3. Try to save
4. **Expected**: Validation error alert
5. Fill fields correctly
6. **Expected**: Save succeeds

#### Test 28: Unauthorized Access (After Token Expires)
1. Login as admin
2. Wait for token to expire (or manually delete from SecureStore)
3. Try to access any admin endpoint
4. **Expected**: Redirected to login with appropriate message

---

### Phase 8: Data Integrity

#### Test 29: Family Tree Protection (Critical)
1. Login as admin
2. Navigate to Users tab
3. View a user who has family tree entries
4. **Verify**: Family tree count is shown as READ-ONLY
5. **Verify**: No edit/delete options for family tree from admin
6. Logout and login as that user
7. Navigate to Family Tree tab
8. **Verify**: User can still add/edit their own family tree
9. **CRITICAL**: Admin can view count but CANNOT modify user family trees

#### Test 30: Role Changes Don't Break Sessions
1. Login as admin
2. Create a second admin account
3. Login with that new admin account on another device/browser
4. From first admin, demote the second admin to regular user
5. On second device/browser, try to access admin features
6. **Expected**: Should be blocked or redirected after role change

---

## API Endpoints Reference

### Admin Endpoints (All require Authorization: Bearer <token>)

#### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/stats/overview` - Get detailed overview

#### Users
- `GET /api/admin/users?page=1&limit=10&search=query&role=admin` - List users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `PUT /api/admin/users/:id/role` - Change user role (body: { role: 'admin' })
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/users/:id/family-tree` - View user's family tree (READ-ONLY)

#### Content
- `GET /api/admin/pages` - List all pages
- `GET /api/admin/pages/:pageName` - Get specific page
- `POST /api/admin/pages` - Create page (body: { pageName, displayName, sections[], isPublished })
- `PUT /api/admin/pages/:pageName` - Update page
- `DELETE /api/admin/pages/:pageName` - Delete page

#### Media
- `POST /api/admin/upload-image` - Upload image (multipart/form-data, field: 'image')

---

## Common Issues & Solutions

### Issue: "Unauthorized" error
**Solution**: Token may have expired. Logout and login again.

### Issue: Admin route not accessible
**Solution**: Verify user role is exactly 'admin' in database, not 'Admin' or 'ADMIN'.

### Issue: Image upload fails
**Solution**: 
1. Check file size (<5MB)
2. Check file type (JPEG/PNG/GIF/WebP only)
3. Verify backend uploads directory exists and is writable

### Issue: Search not working
**Solution**: Backend needs text index on User model. Run: `User.createIndexes()`

### Issue: Role change not reflecting immediately
**Solution**: Refresh the user list manually or implement WebSocket for real-time updates.

---

## Performance Benchmarks

### Expected Response Times
- Dashboard load: <2s
- User list (10 items): <1s
- Search results: <500ms
- Image upload (1MB): <3s
- Page create/update: <1s

### Known Limitations
- Pagination limited to 100 users per page max
- Image uploads capped at 5MB
- No bulk operations support yet
- No real-time updates (manual refresh required)

---

## Security Checklist

- [ ] Admin routes protected by role-based middleware
- [ ] JWT tokens stored securely in SecureStore
- [ ] Sensitive operations require confirmation alerts
- [ ] Family tree data is read-only for admins
- [ ] User passwords never displayed or editable from admin panel
- [ ] Token expiration handled gracefully
- [ ] HTTPS used for production API calls

---

## Final Verification

After completing all tests:

1. **Admin Functionality**: All CRUD operations work correctly
2. **User Protection**: Regular users cannot access admin routes
3. **Data Integrity**: Family trees remain user-editable only
4. **Navigation**: Role-based routing works correctly
5. **Error Handling**: All errors display user-friendly messages
6. **Performance**: No significant lag or crashes

---

## Reporting Issues

If you encounter issues, collect:
1. Device/platform information
2. Steps to reproduce
3. Expected vs actual behavior
4. Console logs/error messages
5. Screenshots if applicable

---

## Next Steps

After successful testing:
1. Update production backend URL in `config/api.ts`
2. Update admin bootstrap email to production admin
3. Change default admin password
4. Deploy backend to production
5. Build and deploy Expo app
6. Monitor logs for first week

---

**Testing Completed By**: _________________  
**Date**: _________________  
**Result**: PASS / FAIL  
**Notes**: _________________
