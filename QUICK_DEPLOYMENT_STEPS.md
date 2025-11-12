# RC Filter Simulator - Quick Deployment Steps

## ✅ Prerequisites
- [ ] GitHub account with your repository pushed
- [ ] Render account (https://render.com)
- [ ] Netlify account (https://netlify.com)
- [ ] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

---

## 🔧 Step 1: Setup MongoDB Atlas (Database)

```bash
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project: "RC-Filter"
4. Create a free cluster (M0 Shared)
5. Create a database user:
   - Username: your_username
   - Password: your_strong_password
6. Get connection string:
   - Click "Connect" → "Drivers"
   - Copy MongoDB connection string
   - Replace <username> and <password> with your credentials
   - Example: mongodb+srv://user:pass@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority
7. Whitelist IP: Click "Network Access" → "Allow access from anywhere" (0.0.0.0/0)
```

**Store this connection string - you'll need it for Render!**

---

## 🚀 Step 2: Deploy Backend to Render

### Option A: Using GitHub (Recommended)

```bash
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - Name: rc-filter-backend
   - Environment: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   - Plan: Free (or Starter for better uptime)
6. Click "Create Web Service"
7. Wait for deployment (2-5 minutes)
```

### Add Environment Variables to Render:

```bash
1. Go to your service dashboard
2. Click "Environment" tab
3. Add these variables:
   MONGO_URL=<your_mongodb_connection_string>
   DB_NAME=rc_filter_db
   CORS_ORIGINS=*
4. Click "Save Changes"
5. Service will redeploy automatically
```

**After deployment:**
- Your backend URL will be: `https://rc-filter-backend.onrender.com`
- You can test it: `https://rc-filter-backend.onrender.com/health`

---

## 🌐 Step 3: Deploy Frontend to Netlify

### Option A: Using GitHub (Recommended)

```bash
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select GitHub → Choose your repository
5. Configure build settings:
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: frontend/build
   - Node version: 18
6. Click "Deploy site"
7. Wait for build (3-5 minutes)
```

### Add Environment Variables to Netlify:

```bash
1. Go to Site Settings
2. Build & deploy → Environment
3. Click "Edit variables"
4. Add this variable:
   REACT_APP_BACKEND_URL=https://rc-filter-backend.onrender.com
5. Click "Save"
6. Trigger a new deploy:
   - Deploys → Trigger deploy → Deploy site
```

**After deployment:**
- Your frontend URL will be: `https://your-site-name.netlify.app`
- Check Netlify for the exact URL assigned

---

## ✅ Step 4: Verify Deployment

```bash
1. Open your Netlify URL in browser
2. You should see the RC Filter Simulator interface
3. Try these actions:
   ✓ Click "Low-Pass Filter" tab
   ✓ Enter frequency: 1000
   ✓ Click "Calculate Gain"
   ✓ Check if results appear
   ✓ Check if graph loads with 100 points
   ✓ Switch to "High-Pass Filter" and repeat
```

**If not working:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Common issue: Backend URL is wrong → Update .env.production
- Common issue: MongoDB not connected → Check MongoDB Atlas IP whitelist

---

## 📝 File Structure for Deployment

```
rc-filter-project/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── .env
│   ├── Procfile                 ← Created ✓
│   └── render.yaml              ← Created ✓
│
├── frontend/
│   ├── package.json
│   ├── netlify.toml             ← Created ✓
│   ├── .env.production          ← Created ✓
│   ├── public/
│   ├── src/
│   └── build/                   ← Created after npm run build
│
└── DEPLOYMENT_GUIDE.md          ← Created ✓
```

---

## 🔄 Continuous Deployment

**After first deployment:**

```bash
# Every time you push to GitHub:
git add .
git commit -m "Update project"
git push origin main

# Netlify and Render automatically:
# ✓ Pull latest code
# ✓ Build the project
# ✓ Deploy updated version
# ✓ Your app updates in 2-5 minutes!
```

---

## 🆘 Troubleshooting

### Backend not connecting
```
1. Check Render service is running: https://dashboard.render.com
2. Test backend directly: https://rc-filter-backend.onrender.com/health
3. Check environment variables in Render
4. Check logs: Render dashboard → Logs tab
```

### Frontend showing old version
```
1. Hard refresh: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Or: Clear browser cache
3. Check Netlify build status: https://app.netlify.com
```

### Graph not loading
```
1. Check browser console for errors (F12)
2. Verify REACT_APP_BACKEND_URL is correct
3. Check CORS settings in backend (should be *)
4. Verify backend is responding: https://rc-filter-backend.onrender.com/api/sweep
```

### MongoDB connection fails
```
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string format
3. Check username/password (URL encode special characters)
4. Test connection: mongosh "your-connection-string"
```

---

## 💾 Backup & Cleanup

```bash
# Your project is now live at:
# Frontend: https://your-site.netlify.app
# Backend: https://rc-filter-backend.onrender.com
# Database: MongoDB Atlas

# Keep these safe:
- GitHub repository (source code)
- MongoDB Atlas credentials
- Render and Netlify dashboard access
```

---

## 🎉 Congratulations!

Your RC Filter Simulator is now deployed and accessible worldwide!

**Share your app:**
```
Frontend URL: https://your-site.netlify.app
Backend API: https://rc-filter-backend.onrender.com
```

---

**Need help?**
- Render docs: https://render.com/docs
- Netlify docs: https://docs.netlify.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
