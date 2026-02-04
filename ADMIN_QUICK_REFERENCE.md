# Admin Quick Reference Guide

## Quick Access

### Admin Login Credentials
- **Email**: chauhanavi843@gmail.com
- **Password**: Admin@123!ChangeMe
- ⚠️ **IMPORTANT**: Change password after first login in production

---

## Common Operations

### 1. Create New Admin User

**Via Users Screen:**
1. Go to Users tab
2. Find the user to promote
3. Tap "Change Role" button
4. Confirm promotion
5. User now has admin access

**Via Backend Script:**
```bash
cd backend
node scripts/createAdmins.js
# Follow prompts to add admin email
```

---

### 2. Create New Page (CMS)

**Steps:**
1. Navigate to Content tab
2. Tap "+" button in header
3. Fill form:
   - Page Name: `about-us` (URL-friendly, lowercase, hyphens)
   - Display Name: `About Us` (Human-readable title)
4. Add sections:
   - Tap "Add Section"
   - Fill title, text, and optional image URL
   - Repeat for multiple sections
5. Toggle "Published" ON
6. Tap "Create Page"

**URL Result**: Page accessible at `/pages/about-us` (if frontend implemented)

---

### 3. Upload and Use Images

**Upload:**
1. Go to Media tab
2. Choose "Gallery" or "Take Photo"
3. Select/capture image
4. Wait for upload success
5. Tap "Copy URL" on uploaded image

**Use in Content:**
1. Go to Content tab
2. Edit/create a page
3. In section's "Image URL" field
4. Paste copied URL (e.g., `/uploads/1234567890.jpg`)
5. Save page

---

### 4. Search for User

**Steps:**
1. Go to Users tab
2. Tap search bar at top
3. Type name or email
4. Results filter automatically
5. Clear search to see all

---

### 5. Edit User Information

**Steps:**
1. Find user in list
2. Tap "Edit" button (pencil icon)
3. Modify fields:
   - Name
   - Email
   - Member ID
   - Phone
4. Tap "Save Changes"
5. Confirm success

---

### 6. View User Family Tree Count

**Steps:**
1. Go to Users tab
2. Find user
3. Tap "View Details" button (eye icon)
4. See "Family Tree Entries: X"

**Note**: Admin can VIEW count only, cannot edit family trees

---

### 7. Publish/Unpublish Page

**Steps:**
1. Go to Content tab
2. Find page to modify
3. Tap "Edit" button
4. Toggle "Published" switch
   - ON = PUBLISHED (visible to users)
   - OFF = DRAFT (hidden from users)
5. Tap "Save Changes"

---

### 8. Delete User (Careful!)

**Steps:**
1. Go to Users tab
2. Find user to delete
3. Tap "Delete" button (trash icon)
4. Read confirmation carefully
5. Tap "Delete" to confirm
6. User permanently removed

**⚠️ WARNING**: Cannot undo deletion!

---

### 9. Demote Admin to User

**Steps:**
1. Go to Users tab
2. Filter by "Admin" tab
3. Find admin to demote
4. Tap "Change Role" button
5. Confirm demotion
6. User loses admin access immediately

---

### 10. Navigate Dashboard Stats

**Dashboard View:**
- **Total Users**: Click to see user list
- **Total Admins**: Quick count of admins
- **Regular Users**: Count of non-admin users
- **Family Trees**: Total entries across all users

**Pull to Refresh**: Swipe down on dashboard to update stats

---

## Keyboard Shortcuts

### Search
- **Tap search field**: Start typing immediately
- **Clear (X)**: Remove search query

### Modals
- **Tap outside**: Close modal (on some modals)
- **X button**: Always closes modal

---

## Page Naming Conventions

### Page Name (URL Slug)
- **Lowercase only**: `about-us`, not `About-Us`
- **Hyphens for spaces**: `our-temple`, not `our temple`
- **No special characters**: Only letters, numbers, hyphens
- **Cannot change after creation**: Choose carefully!

### Display Name
- **Any format**: `About Us`, `Our Temple`, etc.
- **User-facing**: Shown to end users
- **Can change anytime**: Edit freely

---

## Image Guidelines

### File Requirements
- **Max size**: 5 MB
- **Formats**: JPEG, PNG, GIF, WebP
- **Recommended**: JPEG for photos, PNG for graphics

### Dimensions
- **Profile images**: 400x400px (1:1)
- **Page headers**: 1200x400px (3:1)
- **Section images**: 800x600px (4:3)
- **Gallery images**: 1000x1000px (1:1)

### Optimization
- Compress before uploading
- Use tools like TinyPNG, ImageOptim
- Backend auto-optimizes further

---

## Error Messages & Solutions

### "Unauthorized"
- **Cause**: Token expired or invalid
- **Solution**: Logout and login again

### "Failed to load users"
- **Cause**: Network issue or backend down
- **Solution**: Check internet, tap retry button

### "Page name already exists"
- **Cause**: Duplicate page name (URL slug)
- **Solution**: Choose different page name

### "Image too large"
- **Cause**: File exceeds 5MB
- **Solution**: Compress image before uploading

### "Invalid file type"
- **Cause**: Uploaded non-image file
- **Solution**: Use JPEG, PNG, GIF, or WebP only

---

## Best Practices

### User Management
✅ **Do:**
- Regularly review user list
- Verify new signups
- Update member IDs promptly
- Keep admin count minimal (2-3)

❌ **Don't:**
- Delete users without confirmation
- Share admin credentials
- Promote untrusted users to admin
- Ignore suspicious accounts

### Content Management
✅ **Do:**
- Use clear, descriptive page names
- Keep sections concise
- Preview before publishing
- Update outdated content regularly

❌ **Don't:**
- Create duplicate pages
- Leave pages in draft forever
- Use broken image URLs
- Publish unfinished content

### Media Management
✅ **Do:**
- Organize images by purpose
- Use descriptive filenames
- Delete unused images periodically
- Compress before uploading

❌ **Don't:**
- Upload copyrighted images
- Use unnecessarily large files
- Forget to copy URLs before closing
- Upload sensitive/private photos

---

## API Rate Limits

### Current Limits
- **User list**: 100 per page max
- **Search**: 50 results max
- **Image upload**: 5MB per file
- **API calls**: 100 per minute per user

### If Exceeded
- Wait 1 minute before retrying
- Reduce page size
- Batch operations when possible

---

## Data Backup

### Automated Backups
- **Frequency**: Daily at 2 AM UTC
- **Retention**: 7 days
- **Location**: MongoDB Atlas automatic backups

### Manual Backup
1. Contact system administrator
2. Request database export
3. Save locally as needed

---

## Getting Help

### In-App Support
- **Dashboard**: Displays system status
- **Error messages**: Provide specific details
- **Retry buttons**: Attempt operation again

### External Support
- **Documentation**: See `ADMIN_IMPLEMENTATION_SUMMARY.md`
- **Testing Guide**: See `ADMIN_TESTING_GUIDE.md`
- **Email**: [Admin Email]
- **Phone**: [Admin Phone]

---

## Keyboard Shortcuts (Web Version)

### Global
- `Ctrl+R` / `Cmd+R`: Refresh current screen
- `Esc`: Close current modal

### Navigation
- `Ctrl+1`: Dashboard
- `Ctrl+2`: Users
- `Ctrl+3`: Content
- `Ctrl+4`: Media

### Search
- `Ctrl+F` / `Cmd+F`: Focus search bar
- `Enter`: Submit search
- `Esc`: Clear search

---

## Status Indicators

### User Status
- **🟢 Active**: Logged in recently
- **⚫ Inactive**: Not logged in >30 days

### Page Status
- **🟢 PUBLISHED**: Live and visible
- **🟠 DRAFT**: Hidden from users

### Upload Status
- **⏳ Uploading...**: In progress
- **✅ Success**: Complete
- **❌ Failed**: Error occurred

---

## Troubleshooting Flowchart

```
Problem?
│
├─ Cannot login
│  └─> Check credentials → Reset password → Contact admin
│
├─ Cannot see admin tabs
│  └─> Verify role is 'admin' → Logout/login → Contact admin
│
├─ Search not working
│  └─> Check spelling → Try different query → Tap retry
│
├─ Upload fails
│  └─> Check file size → Check format → Check network
│
└─ Page not saving
   └─> Check required fields → Verify unique name → Try again
```

---

## Quick Stats Reference

### What Each Metric Means

**Total Users**: All registered accounts (users + admins)

**Total Admins**: Users with admin role only

**Regular Users**: Users with user role only

**Family Trees**: Total entries across all user family trees

**Recent Signups**: Last 5 users who registered (newest first)

**Active Users**: Users sorted by last activity (most recent first)

---

## URL Structure Reference

### Pages
- List all: `/api/admin/pages`
- Get page: `/api/admin/pages/page-name`
- Create: `POST /api/admin/pages`
- Update: `PUT /api/admin/pages/page-name`
- Delete: `DELETE /api/admin/pages/page-name`

### Users
- List: `/api/admin/users?page=1&limit=10`
- Get user: `/api/admin/users/:id`
- Update: `PUT /api/admin/users/:id`
- Change role: `PUT /api/admin/users/:id/role`
- Delete: `DELETE /api/admin/users/:id`

### Media
- Upload: `POST /api/admin/upload-image`
- Access: `https://samaj-app-api.onrender.com/uploads/filename.jpg`

---

## Remember

1. **Always confirm** before deleting users or pages
2. **Test in draft** before publishing pages
3. **Backup important** data regularly
4. **Change default** admin password immediately
5. **Review user activity** regularly for security
6. **Keep admin count** minimal (2-3 trusted users)
7. **Logout when done** to protect your account
8. **Report issues** to support promptly

---

**Last Updated**: ${new Date().toISOString().split('T')[0]}  
**Version**: 1.0  
**Support**: [Contact Information]
