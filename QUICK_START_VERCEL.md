# Quick Start: Deploy to Vercel in 5 Minutes

## Prerequisites Checklist

- [ ] GitHub repository with your code
- [ ] MongoDB Atlas account (free tier)
- [ ] Vercel account (free tier)

---

## Step 1: MongoDB Atlas (2 minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster → Create database user → Whitelist IP `0.0.0.0/0`
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/taskflow`

---

## Step 2: Deploy to Vercel (3 minutes)

1. **Go to [Vercel](https://vercel.com)** → "Add New" → "Project"
2. **Import your GitHub repo**
3. **Configure:**
   - Framework: Other (or leave blank)
   - Root Directory: (leave blank)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd backend && npm install && cd ../frontend && npm install`

4. **Add Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=generate-a-random-32-character-string-here
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-project.vercel.app
   NODE_ENV=production
   ```

5. **Click "Deploy"** → Wait 2-5 minutes

6. **After deployment:**
   - Copy your Vercel URL
   - Update `CORS_ORIGIN` env var with your actual URL
   - Redeploy

---

## Done! 🎉

Your app is live at: `https://your-project.vercel.app`

**Test it:**
- Visit `/api/health` - should return `{"status":"ok"}`
- Visit root URL - should show login page
- Register and create tasks!

---

## Troubleshooting

**API not working?**
- Check Vercel function logs
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist

**Frontend errors?**
- Check browser console
- Verify build completed successfully
- Check Vercel deployment logs

**Need help?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guide.

