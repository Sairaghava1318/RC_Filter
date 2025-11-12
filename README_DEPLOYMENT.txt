# 🚀 QUICK REFERENCE CARD

## Three actions. Fifteen minutes. Done!

---

## 1️⃣ BACKEND DEPLOY (Render)

```
https://render.com → Sign up with GitHub → New Web Service

Name: rc-filter-backend
Environment: Python 3
Build: pip install -r requirements.txt
Start: uvicorn server:app --host 0.0.0.0 --port $PORT
Plan: Free

Click "Create" → Wait 2-5 min → Environment → Add CORS_ORIGINS=*
COPY YOUR BACKEND URL!
```

---

## 2️⃣ FRONTEND DEPLOY (Netlify)

```
https://netlify.com → Sign up with GitHub → Import project

Base: frontend
Build: npm run build
Publish: frontend/build

Click "Deploy" → Wait 3-5 min → Environment → Add REACT_APP_BACKEND_URL=YOUR_URL
COPY YOUR FRONTEND URL!
```

---

## 3️⃣ TEST

```
Open frontend URL → Enter 1000 → Click Calculate → See results + graph ✅
```

---

## Your URLs

**Backend:** https://rc-filter-backend.onrender.com  
**Frontend:** https://YOUR_SITE.netlify.app  
**GitHub:** https://github.com/Sairaghava1318/RC_Filter  

---

## What to Update When Deploying

In Render:
- Add environment variable: `CORS_ORIGINS = *`

In Netlify:
- Add environment variable: `REACT_APP_BACKEND_URL = [your-backend-url]`

---

## File Structure on GitHub

```
backend/
├── server.py
├── requirements.txt
├── Procfile
└── .env

frontend/
├── src/
├── package.json
├── netlify.toml
└── .env.production
```

All files are ready. Just deploy!

---

## Troubleshooting

**Backend not working?**
- Check Render logs
- Test /health endpoint
- Verify CORS_ORIGINS set

**Frontend not connecting?**
- Check F12 Console
- Verify REACT_APP_BACKEND_URL correct
- Hard refresh browser

**Graph not showing?**
- Check backend is running
- Verify API returns data
- Check console for CORS errors

---

## Key Files to Know

- **FINAL_SUMMARY.md** - Read this for overview
- **DEPLOYMENT_READY.md** - Full checklist
- **DEPLOY_NOW.txt** - 15-minute reference
- **DEPLOYMENT_COMPLETE.md** - Complete instructions

---

**Everything is ready. Go deploy! 🎉**

Remember:
1. Render → New Web Service → Configure → Create
2. Netlify → Import Project → Configure → Deploy
3. Test → Done!

**Time:** 15 minutes  
**Cost:** $0  
**Status:** Ready ✅
