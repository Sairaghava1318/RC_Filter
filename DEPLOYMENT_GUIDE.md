# RC Filter Simulator - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying:
- **Backend (FastAPI)** → Render
- **Frontend (React)** → Netlify

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

#### 1.1 Create a `Procfile` (for Render)
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

#### 1.2 Update `requirements.txt`
Make sure all dependencies are listed:
```
fastapi==0.110.1
uvicorn==0.25.0
python-dotenv>=1.0.1
pydantic>=2.6.4
```

#### 1.3 Modify `backend/server.py` for Production
Update the MongoDB connection to use environment variables properly:

```python
# Get MongoDB URL from environment
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
if not mongo_url:
    raise ValueError("MONGO_URL environment variable is not set")
```

### Step 2: Deploy to Render

#### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

#### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository (or paste repo URL)
3. Fill in the details:
   - **Name**: `rc-filter-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

#### 2.3 Set Environment Variables in Render
Go to "Environment" tab and add:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=rc_filter_db
CORS_ORIGINS=*
```

**Get MongoDB URL from MongoDB Atlas:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace with your username and password

#### 2.4 Deploy
- Click "Create Web Service"
- Render will automatically deploy

**Your backend URL will be like:**
```
https://rc-filter-backend.onrender.com
```

---

## Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Frontend for Deployment

#### 1.1 Create `.env.production` file
```
REACT_APP_BACKEND_URL=https://rc-filter-backend.onrender.com
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

#### 1.2 Update Frontend Build Files
Make sure `package.json` has correct build script:
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

#### 1.3 Create `netlify.toml` in frontend root
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"
  CI = "false"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy to Netlify

#### 2.1 Create Netlify Account
1. Go to https://netlify.com
2. Sign up with GitHub (recommended)

#### 2.2 Connect Your Repository
1. Click "Add new site" → "Import an existing project"
2. Choose GitHub and select your repository
3. Authorize Netlify to access your GitHub

#### 2.3 Configure Build Settings
1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `frontend/build`
4. **Node version**: `18`

#### 2.4 Set Environment Variables
In Netlify dashboard:
1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Add environment variable:
   - **Key**: `REACT_APP_BACKEND_URL`
   - **Value**: `https://rc-filter-backend.onrender.com`

#### 2.5 Deploy
1. Click "Deploy site"
2. Netlify will build and deploy automatically

**Your frontend URL will be like:**
```
https://rc-filter-simulator.netlify.app
```

---

## Part 3: Post-Deployment Verification

### Test the Deployed App

1. **Open your Netlify URL**: https://rc-filter-simulator.netlify.app
2. **Check console for errors**: Right-click → Inspect → Console
3. **Test features**:
   - Try calculating gain for different frequencies
   - Switch between low-pass and high-pass filters
   - Check if graphs are loading and updating

### Troubleshooting

#### Issue: "Cannot connect to backend"
- ✓ Verify Render backend URL is correct in `.env.production`
- ✓ Check Render logs: https://dashboard.render.com
- ✓ Verify MongoDB URL is correct
- ✓ Check CORS settings in backend

#### Issue: "Build failed on Netlify"
- ✓ Check Netlify build logs
- ✓ Verify `npm run build` works locally
- ✓ Check Node version (should be 18+)
- ✓ Verify all dependencies are in `package.json`

#### Issue: "MongoDB connection error"
- ✓ Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
- ✓ Verify connection string format
- ✓ Check username/password are URL-encoded

---

## Part 4: Optional - Custom Domain

### Add Custom Domain on Netlify
1. Go to "Site settings" → "Domain management"
2. Click "Add custom domain"
3. Enter your domain (e.g., `rcfilter.com`)
4. Follow DNS configuration steps

### Add Custom Domain on Render
1. Go to your Render service
2. Click "Settings"
3. Add custom domain under "Custom Domains"
4. Follow DNS configuration steps

---

## Part 5: Continuous Deployment

Both Render and Netlify support automatic deployment on code push:

- **When you push to GitHub**: 
  - Netlify automatically builds and deploys frontend
  - Render automatically builds and deploys backend

### To enable:
1. ✓ Netlify: Already enabled by default
2. ✓ Render: Already enabled by default

Just push to your repository and deployment happens automatically! 🎉

---

## Summary

| Service | Purpose | URL Pattern | Cost |
|---------|---------|------------|------|
| **Render** | Backend API | `https://rc-filter-backend.onrender.com` | Free tier available |
| **Netlify** | Frontend App | `https://rc-filter-simulator.netlify.app` | Free tier available |
| **MongoDB Atlas** | Database | Cloud-hosted MongoDB | Free tier available |

---

## Quick Deployment Checklist

- [ ] Backend: Updated `requirements.txt`
- [ ] Backend: Created `Procfile`
- [ ] Backend: Set MongoDB connection in `.env`
- [ ] Frontend: Created `.env.production`
- [ ] Frontend: Created `netlify.toml`
- [ ] Render: Account created and configured
- [ ] Netlify: Account created and configured
- [ ] MongoDB Atlas: Cluster created and URL obtained
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set in both services
- [ ] Tested deployed application

---

**After deployment, your app will be live and accessible worldwide!** 🌍
