# TaskFlow Deployment Guide

This guide walks you through deploying TaskFlow to production.

## Prerequisites

- GitHub account (or GitLab/Bitbucket)
- MongoDB Atlas account (free tier works)
- Render account (for backend)
- Netlify or Vercel account (for frontend)

---

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Ensure `.gitignore` excludes sensitive files:**
   - `.env` files should NOT be committed
   - `node_modules/` should be ignored

---

## Step 2: Deploy Backend to Render

### 2.1 Create MongoDB Atlas Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user (username/password)
4. Whitelist IP addresses:
   - For Render: Add `0.0.0.0/0` (allow all) or Render's IP ranges
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`)
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `taskflow` (or your preferred database name)

### 2.2 Deploy to Render

1. **Sign up/Login to [Render](https://render.com)**

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository and branch (usually `main`)

3. **Configure the Service:**
   - **Name:** `taskflow-backend` (or your choice)
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend` ⚠️ **Important!**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free tier works (or choose paid for better performance)

4. **Add Environment Variables:**
   Click "Environment" tab and add:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-random-string-at-least-32-characters-long
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-domain.netlify.app,https://your-frontend-domain.vercel.app
   NODE_ENV=production
   ```
   
   **Important Notes:**
   - Replace `MONGO_URI` with your actual MongoDB Atlas connection string
   - Generate a strong `JWT_SECRET` (use a password generator or `openssl rand -base64 32`)
   - Add your frontend URLs to `CORS_ORIGIN` (comma-separated, no spaces)
   - You'll update `CORS_ORIGIN` after deploying the frontend

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy your backend
   - Wait for deployment to complete (usually 2-5 minutes)
   - Your backend URL will be: `https://taskflow-backend.onrender.com` (or your custom name)

6. **Test the Backend:**
   - Visit `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

---

## Step 3: Deploy Frontend to Netlify

### Option A: Netlify

1. **Sign up/Login to [Netlify](https://netlify.com)**

2. **Import Your Project:**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings:**
   - **Base directory:** `frontend` ⚠️ **Important!**
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `frontend/dist`
   - **Node version:** `18` (or latest LTS)

4. **Add Environment Variables:**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace with your actual Render backend URL

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will build and deploy
   - Your site URL: `https://random-name-123.netlify.app`

6. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `CORS_ORIGIN` environment variable:
     ```
     CORS_ORIGIN=https://your-netlify-site.netlify.app
     ```
   - Redeploy the backend (or it will auto-redeploy)

### Option B: Vercel

1. **Sign up/Login to [Vercel](https://vercel.com)**

2. **Import Your Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` ⚠️ **Important!**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace with your actual Render backend URL

5. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy
   - Your site URL: `https://your-project.vercel.app`

6. **Update Backend CORS:**
   - Go back to Render dashboard
   - Update `CORS_ORIGIN` environment variable:
     ```
     CORS_ORIGIN=https://your-project.vercel.app
     ```
   - Redeploy the backend

---

## Step 4: Custom Domain (Optional)

### Netlify:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

### Vercel:
1. Go to Project settings → Domains
2. Add your custom domain
3. Configure DNS as instructed

**Remember to update `CORS_ORIGIN` in Render with your custom domain!**

---

## Step 5: Verify Deployment

1. **Test Frontend:**
   - Visit your frontend URL
   - Register a new account
   - Create a task
   - Test all features

2. **Test Backend API:**
   - Use browser DevTools → Network tab
   - Check API calls are going to your Render backend
   - Verify CORS is working (no CORS errors)

3. **Common Issues:**
   - **CORS errors:** Update `CORS_ORIGIN` in Render with exact frontend URL
   - **API 404:** Check `VITE_API_URL` in frontend env vars
   - **Database connection:** Verify MongoDB Atlas IP whitelist includes Render IPs
   - **Build failures:** Check build logs in Render/Netlify/Vercel

---

## Step 6: Continuous Deployment

Both Render and Netlify/Vercel automatically deploy when you push to your main branch.

**Workflow:**
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Deployment happens automatically

---

## Environment Variables Summary

### Backend (Render):
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.netlify.app
NODE_ENV=production
```

### Frontend (Netlify/Vercel):
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Troubleshooting

### Backend Issues:

**"MongoDB connection error"**
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for testing)
- Verify connection string format
- Check username/password are correct

**"CORS error"**
- Ensure `CORS_ORIGIN` includes your exact frontend URL (with `https://`)
- No trailing slashes
- Comma-separated for multiple origins

**"Application error"**
- Check Render logs for detailed error messages
- Verify all environment variables are set
- Ensure `NODE_ENV=production` is set

### Frontend Issues:

**"Failed to fetch" or Network errors**
- Verify `VITE_API_URL` is correct
- Check backend is running (visit `/api/health`)
- Ensure CORS is configured correctly

**"Build failed"**
- Check Node version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

**"Blank page"**
- Check browser console for errors
- Verify API URL is correct
- Check if backend is accessible

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use strong `JWT_SECRET` (32+ characters)
- ✅ MongoDB Atlas password is strong
- ✅ CORS is restricted to your frontend domains
- ✅ MongoDB Atlas IP whitelist is configured
- ✅ Environment variables are set in deployment platform

---

## Cost Estimate

**Free Tier:**
- Render: Free tier available (with limitations)
- Netlify: Free tier available
- Vercel: Free tier available
- MongoDB Atlas: Free M0 cluster

**Total: $0/month** (for small projects)

For production with higher traffic, consider paid tiers.

---

## Support

If you encounter issues:
1. Check deployment logs in Render/Netlify/Vercel
2. Verify environment variables are set correctly
3. Test API endpoints directly (use Postman or curl)
4. Check browser console for frontend errors

Happy deploying! 🚀

