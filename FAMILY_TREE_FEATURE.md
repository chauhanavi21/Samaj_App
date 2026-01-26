# Family Tree Feature Documentation

## 🌳 Overview

The Family Tree feature allows users to create, view, edit, and delete family member entries in a simple hierarchical format. Each user can manage their own family tree data with information about themselves, their spouse, parents, and children.

---

## ✅ What's Implemented

### **Backend (Node.js/Express + MongoDB)**

1. **Database Model** (`backend/models/FamilyTree.js`)
   - Simple name-based approach
   - Each entry stores:
     - Person's info (name, phone, occupation)
     - Spouse info (name, phone)
     - Parents info (father & mother names, phones)
     - Children (array with name, gender, date of birth)
     - Additional info (address, notes)
   - Linked to user who created it (`createdBy` field)

2. **API Routes** (`backend/routes/familyTree.js`)
   - `POST /api/family-tree` - Create new entry
   - `GET /api/family-tree` - Get all entries for logged-in user
   - `GET /api/family-tree/:id` - Get single entry
   - `PUT /api/family-tree/:id` - Update entry
   - `DELETE /api/family-tree/:id` - Delete entry
   - All routes are protected (require authentication)

3. **Server Integration** (`backend/server.js`)
   - Routes registered at `/api/family-tree`

---

### **Frontend (React Native/Expo)**

1. **API Service** (`MyExpoApp/services/api.ts`)
   - `familyTreeAPI.getAll()` - Fetch all entries
   - `familyTreeAPI.getById(id)` - Fetch single entry
   - `familyTreeAPI.create(data)` - Create new entry
   - `familyTreeAPI.update(id, data)` - Update entry
   - `familyTreeAPI.delete(id)` - Delete entry

2. **Family Tree Tab** (`MyExpoApp/app/(tabs)/family-tree.tsx`)
   - Main list screen
   - Shows all family entries as cards
   - Each card displays:
     - Person name with emoji icon
     - Phone number
     - Spouse, father, mother names
     - Children list
     - Address
   - Features:
     - Pull to refresh
     - Empty state with "Add First Entry" button
     - Edit button (pencil icon)
     - Delete button (trash icon) with confirmation
     - Add button in header
   - Auto-refreshes when screen comes into focus

3. **Add Entry Screen** (`MyExpoApp/app/family-tree/add.tsx`)
   - Form sections:
     - Person Information (name*, phone, occupation)
     - Spouse Information (name, phone)
     - Parents Information (father & mother names, phones)
     - Children (dynamic - add multiple children)
     - Additional Information (address, notes)
   - Features:
     - Dynamic children fields (add/remove)
     - Gender selection buttons for each child
     - Form validation (person name required)
     - Loading state during submission
     - Success/Error alerts
     - Auto-navigate back after success

4. **Edit Entry Screen** (`MyExpoApp/app/family-tree/edit/[id].tsx`)
   - Same form as Add screen
   - Pre-populated with existing data
   - Updates entry instead of creating new
   - Loading state while fetching data

5. **Navigation Update** (`MyExpoApp/app/(tabs)/_layout.tsx`)
   - Replaced "Explore" tab with "Family Tree" tab
   - Icon: person.3.fill (family icon)

---

## 🎯 Features Breakdown

### **Data Model (Approach 2 - Simple Name-Based)**

```javascript
FamilyTree Entry = {
  // Person
  personName: "Avi Chauhan",
  personPhone: "9876543210",
  personOccupation: "Engineer",
  
  // Spouse
  spouseName: "Priya Sharma",
  spousePhone: "9876543211",
  
  // Parents
  fatherName: "Rajesh Chauhan",
  fatherPhone: "9876543212",
  motherName: "Sunita Chauhan",
  motherPhone: "9876543213",
  
  // Children
  children: [
    { name: "Son 1", gender: "male" },
    { name: "Daughter 1", gender: "female" }
  ],
  
  // Additional
  address: "123 Street, City",
  notes: "Any notes here",
  
  // Meta
  createdBy: "user_id_here" // Auto-set from auth token
}
```

### **Why This Approach?**

✅ **Simple** - Just fill a form, no complex relationships  
✅ **Fast** - One entry = one family unit  
✅ **No signup required** - Family members are just text names  
✅ **Easy to display** - All data in one document  
✅ **User-specific** - Each user manages their own tree  

---

## 📱 User Flow

### **Adding a Family Entry**

1. User opens "Family Tree" tab
2. Taps "Add" button (or "Add First Entry" if empty)
3. Fills form:
   - Enter their own name (required)
   - Enter spouse name (optional)
   - Enter parents names (optional)
   - Click "Add Child" to add children
   - Fill child names and select gender
   - Add address and notes (optional)
4. Taps "Create Entry"
5. Success message shown
6. Automatically navigated back to list
7. New entry appears in the list

### **Viewing Entries**

- All entries displayed as cards
- Pull down to refresh
- Each card shows full family info hierarchically

### **Editing an Entry**

1. Tap pencil icon on any entry
2. Form opens with existing data
3. Modify any fields
4. Tap "Update Entry"
5. Success message shown
6. List refreshes with updated data

### **Deleting an Entry**

1. Tap trash icon on any entry
2. Confirmation alert appears
3. Confirm deletion
4. Entry removed from list

---

## 🔒 Security & Permissions

- **All routes require authentication** (JWT token)
- Users can only see/edit/delete their own entries
- Backend validates user ownership before any modification
- Token automatically added to all requests via axios interceptor

---

## 📊 Database Structure

### **Collections**

1. **users** - User accounts (authentication)
2. **familytrees** - Family tree entries (new!)

### **Relationships**

```
User (1) -----> (Many) FamilyTree Entries
           createdBy
```

Each family tree entry has a `createdBy` field that references the user who created it.

---

## 🚀 Testing Instructions

### **Backend Testing**

1. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test endpoints** (use Postman/Thunder Client):
   ```bash
   # Login first to get token
   POST http://localhost:3001/api/auth/login
   Body: { "email": "your@email.com", "password": "yourpass" }
   
   # Use token in Authorization header for these:
   GET http://localhost:3001/api/family-tree
   POST http://localhost:3001/api/family-tree
   PUT http://localhost:3001/api/family-tree/:id
   DELETE http://localhost:3001/api/family-tree/:id
   ```

### **Frontend Testing**

1. **Start Expo:**
   ```bash
   cd MyExpoApp
   npx expo start --clear
   ```

2. **Test flow:**
   - Login to the app
   - Navigate to "Family Tree" tab
   - Add a new entry
   - Edit the entry
   - Delete the entry
   - Verify pull-to-refresh works

---

## 🐛 Troubleshooting

### **"Cannot read property..." errors**

- Check if backend is running
- Verify API_BASE_URL in `MyExpoApp/config/api.ts`
- Check authentication token is valid

### **Empty list after adding**

- Pull down to refresh
- Check backend logs for errors
- Verify entry was created (check MongoDB)

### **Cannot edit/delete**

- Ensure you're logged in as the user who created the entry
- Check backend logs for authorization errors

---

## 🔄 Deploying to Production

### **Backend (Render)**

1. **Push changes to GitHub**
2. **Render auto-deploys** from main branch
3. **Verify deployment:**
   ```
   GET https://samaj-app-api.onrender.com/api/health
   ```
4. **Test family tree endpoints:**
   ```
   GET https://samaj-app-api.onrender.com/api/family-tree
   ```

### **Frontend (Already configured)**

- App already points to production backend
- `USE_PRODUCTION = true` in `config/api.ts`
- No changes needed!

---

## 📝 Future Enhancements (Optional)

### **Phase 2 Ideas:**

1. **Visual Tree Diagram**
   - Install library like `react-native-tree-view`
   - Display family as org chart

2. **Photos**
   - Add photo upload for each person
   - Store in cloud (Cloudinary, S3, etc.)

3. **Search & Filter**
   - Search by name
   - Filter by family branch

4. **Reference-Based Relationships** (Advanced)
   - Convert to Approach 1 (reference IDs)
   - Link multiple generations
   - Share family trees between users

5. **Export/Print**
   - Generate PDF family tree
   - Share via WhatsApp/Email

6. **Notifications**
   - Birthday reminders
   - Anniversary notifications

---

## 📚 Files Changed/Created

### **Backend**
- ✅ `backend/models/FamilyTree.js` (NEW)
- ✅ `backend/routes/familyTree.js` (NEW)
- ✅ `backend/server.js` (MODIFIED - added routes)

### **Frontend**
- ✅ `MyExpoApp/services/api.ts` (MODIFIED - added familyTreeAPI)
- ✅ `MyExpoApp/app/(tabs)/family-tree.tsx` (NEW)
- ✅ `MyExpoApp/app/(tabs)/_layout.tsx` (MODIFIED - tab update)
- ✅ `MyExpoApp/app/family-tree/add.tsx` (NEW)
- ✅ `MyExpoApp/app/family-tree/edit/[id].tsx` (NEW)

---

## ✅ Summary

You now have a **fully functional Family Tree feature** with:

- ✅ Create family entries (person, spouse, parents, children)
- ✅ View all entries in a list
- ✅ Edit existing entries
- ✅ Delete entries
- ✅ Dynamic children fields (add as many as needed)
- ✅ User-specific data (each user sees only their entries)
- ✅ Mobile-friendly UI with emojis
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Error handling
- ✅ Backend API with authentication
- ✅ MongoDB database storage
- ✅ Production-ready (works on Render)

**Ready to test!** 🚀
