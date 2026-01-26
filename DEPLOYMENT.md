# Deployment Guide

## ✅ Current Deployment Status

**Backend**: Deployed on Render  
🔗 **URL**: https://samaj-app-api.onrender.com

**Frontend**: React Native/Expo App (Mobile)  
📱 Currently configured to use production backend

---

## 🔧 Backend Deployment on Render

Your backend is already deployed! Here's the setup:

### Environment Variables on Render

Make sure these are set in your Render dashboard:

```env
MONGODB_URI=mongodb+srv://chauhanavi843_db_user:oolXLWXz7ZXtK1xC@cluster0.5qspsln.mongodb.net/SamajApp?retryWrites=true&w=majority
JWT_SECRET=BKJxvzGiVHLfS7Ik1syciq2+qKrxEdQX+h4FllE/R6g=
PORT=3001
NODE_ENV=production
API_URL=https://samaj-app-api.onrender.com/api/health
ADMIN_EMAILS=chauhanavi212003@gmail.com
```

### ⚠️ IMPORTANT: Set API_URL on Render

The **cron job** needs `API_URL` to self-ping and prevent spin-down. Make sure it's set to:
```
API_URL=https://samaj-app-api.onrender.com/api/health
```

### How the Self-Ping Works

- **Cron job** runs every 14 minutes (in `backend/config/cron.js`)
- Pings `/api/health` endpoint to keep server awake
- Only runs when `NODE_ENV=production`
- Render free tier spins down after 15 minutes of inactivity
- This keeps your server always responsive!

---

## 📱 Frontend Configuration

Your Expo app is configured in `MyExpoApp/config/api.ts`:

### Current Settings
```typescript
const USE_PRODUCTION = true; // Using production backend
const PRODUCTION_URL = 'https://samaj-app-api.onrender.com';
```

### Toggle Between Backends

**Option 1: Production Backend (Default)**
```typescript
const USE_PRODUCTION = true;
```
- Uses Render deployment
- Works from any device/network
- Always available (with cron job)

**Option 2: Local Development Backend**
```typescript
const USE_PRODUCTION = false;
```
- Uses `http://192.168.1.251:3001`
- Requires backend running locally: `cd backend && npm run dev`
- Only works on same Wi-Fi network

**Option 3: Environment Variables (No code changes)**
```bash
# Set in your terminal or .env
EXPO_PUBLIC_API_ORIGIN=https://samaj-app-api.onrender.com

# OR with full path
EXPO_PUBLIC_API_BASE_URL=https://samaj-app-api.onrender.com/api
```

---

## 🚀 Testing Your Deployment

### 1. Test Backend Health
Open in browser:
```
https://samaj-app-api.onrender.com/api/health
```

Should return:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Test from Mobile App
1. Start Expo app: `cd MyExpoApp && npx expo start`
2. Scan QR code with Expo Go
3. Try signing up or logging in
4. Check Expo console for API logs

### 3. Monitor Cron Job
Check Render logs to see cron pings:
```
🔄 Cron: Pinging server to keep alive...
✅ Cron: Server pinged successfully
```

---

## 🐛 Troubleshooting

### Backend Not Responding
1. Check Render dashboard - is service running?
2. Check Render logs for errors
3. Verify MongoDB connection (check IP whitelist in MongoDB Atlas)
4. Ensure all environment variables are set

### Cron Not Working
1. Verify `NODE_ENV=production` is set on Render
2. Verify `API_URL=https://samaj-app-api.onrender.com/api/health` is set
3. Check Render logs for cron messages
4. Restart the service if needed

### Frontend Can't Connect
1. Verify `MyExpoApp/config/api.ts` has correct URL
2. Check mobile device has internet connection
3. Check Expo console logs for exact error
4. Try opening the API URL in mobile browser to test connectivity

### Cold Start Issues
- First request after idle may be slow (~30-50s)
- Cron job should prevent this
- If it still happens, cron might not be running (check logs)

---

## 📊 Monitoring

### Check Server Status
- **Health endpoint**: https://samaj-app-api.onrender.com/api/health
- **Render dashboard**: https://dashboard.render.com
- **Render logs**: View in dashboard for real-time logs

### Expected Log Messages
```
Server running on port 3001
Environment: production
🔄 Cron job started - server will self-ping every 14 minutes
MongoDB connected successfully
🔄 Cron: Pinging server to keep alive...
✅ Cron: Server pinged successfully
```

---

## 💡 Tips

1. **Keep `.env` secure**: Never commit `.env` to Git (it's in `.gitignore`)
2. **Use `.env.example`**: Template for required environment variables
3. **Test locally first**: Set `USE_PRODUCTION=false` when developing
4. **Monitor logs**: Check Render dashboard regularly
5. **Free tier limits**: Render free tier sleeps after 15 min idle, but cron prevents this

---

## 🔄 Updating Deployment

### Update Backend Code
1. Commit changes to Git
2. Push to GitHub
3. Render auto-deploys from `main` branch

### Update Frontend
1. Change `MyExpoApp/config/api.ts` if needed
2. Restart Expo: `npx expo start --clear`
3. Reload app on device

---

## 📝 Next Steps

- [ ] Verify cron job is running (check Render logs)
- [ ] Test signup/login from mobile app
- [ ] Monitor server for a few hours to ensure no spin-down
- [ ] Consider upgrading to Render paid tier ($7/month) for zero cold starts
- [ ] Set up custom domain (optional)
- [ ] Add error monitoring (Sentry, LogRocket, etc.)
