# RC Filter Simulator - Quick Deployment Steps (No Database!)

## ✅ Prerequisites
- [ ] GitHub account with your repository pushed
- [ ] Render account (https://render.com)
- [ ] Netlify account (https://netlify.com)

**No database needed!** Your backend only does math calculations.

---

## 🚀 Step 1: Deploy Backend to Render

### Using GitHub (Recommended)

```bash
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository (RC_Filter)
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
3. Add this variable:
   CORS_ORIGINS=*
4. Click "Save Changes"
5. Service will redeploy automatically
```

**After deployment:**
- Your backend URL will be: `https://rc-filter-backend.onrender.com`
- Test it: Open `https://rc-filter-backend.onrender.com/health` in your browser
- You should see: `{"status":"ok","message":"Backend is running"}`

---

## 🌐 Step 2: Deploy Frontend to Netlify

### Using GitHub (Recommended)

```bash
1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select GitHub → Choose your repository (RC_Filter)
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
- Netlify will show you the exact URL

---

## ✅ Step 3: Verify Everything Works

```bash
1. Open your Netlify URL in browser
2. You should see the RC Filter Simulator interface
3. Try these actions:
   ✓ Click "Low-Pass Filter" tab
   ✓ Enter frequency: 1000
   ✓ Click "Calculate Gain"
   ✓ Check if results appear (gain_db, vout)
   ✓ Check if graph loads with 100 points
   ✓ Switch to "High-Pass Filter" and repeat
```

**If not working:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Common issue: Backend URL is wrong → Update REACT_APP_BACKEND_URL in Netlify environment

---

## 📝 Your Project Structure

```
rc-filter-project/
├── backend/
│   ├── server.py         ← FastAPI backend (no database!)
│   ├── requirements.txt   ← Only 4 dependencies now
│   ├── Procfile
│   └── render.yaml
│
├── frontend/
│   ├── package.json
│   ├── netlify.toml
│   ├── .env.production   ← Contains backend URL
│   ├── public/
│   └── src/
```

---

## 🔄 Continuous Deployment

**After first deployment:**

```bash
# Every time you push to GitHub:
git add .
git commit -m "Update project"
git push origin master

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
2. Verify REACT_APP_BACKEND_URL is correct in Netlify
3. Test backend directly: https://rc-filter-backend.onrender.com/health
4. Check Render logs for server errors
```

---

## 💾 Your Deployed App

```
Frontend: https://your-site.netlify.app
Backend API: https://rc-filter-backend.onrender.com
Database: None needed! 🎉
```

---

## 📚 Backend Details (For Reference)

Your FastAPI backend calculates RC filter responses using pure math:

**Endpoints:**
- `POST /api/rc-gain` - Calculate gain at single frequency
  - Input: `{frequency: 1000, filter_type: "low-pass"}`
  - Output: `{frequency, magnitude, gain_db, vout, filter_type}`

- `POST /api/sweep` - Generate 100-point frequency sweep
  - Input: `{frequency: 1000, filter_type: "high-pass"}`
  - Output: `{frequencies: [...], gains_db: [...], filter_type}`

- `GET /health` - Health check
  - Output: `{"status":"ok"}`

**Filter Types:**
- Low-Pass: |H| = 1 / sqrt(1 + (ωRC)²)
- High-Pass: |H| = (ωRC) / sqrt(1 + (ωRC)²)

**Constants:**
- R = 10 kΩ (10,000 Ω)
- C = 0.01 µF (10⁻⁸ F)
- VIN = 10 V

---

## 🎉 Congratulations!

Your RC Filter Simulator is now live worldwide with no database overhead!

**Deploy time:** ~10 minutes  
**Backend size:** ~4 KB (tiny!)  
**Maintenance:** Zero - no database to manage  
**Cost:** Free tier for both services

Enjoy your fast, simple, and reliable deployment! 🚀
