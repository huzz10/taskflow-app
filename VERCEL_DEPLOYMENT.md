# Deploy TaskFlow on Vercel (Full-Stack Serverless)

This guide walks you through deploying TaskFlow entirely on Vercel using serverless functions for the backend API.

## Why This Approach?

✅ **Single Platform:** Frontend and backend on one platform  
✅ **One Domain:** No CORS issues, simpler configuration  
✅ **Serverless:** Auto-scaling, pay-per-use  
✅ **Easy Deployment:** One command, one dashboard  
✅ **Free Tier:** Generous limits for small projects

---

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier works)
- Vercel account (free tier works)

---

## Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Verify project structure:**
   ```
   .
   ├── api/
   │   └── index.js          # Serverless function (Express app)
   ├── backend/              # Backend code (shared with serverless)
   ├── frontend/             # React frontend
   ├── vercel.json           # Vercel configuration
   └── package.json         # Root package.json
   ```

---

## Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Cluster:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Create a database user (username/password)
   - **Whitelist IP Addresses:**
     - Click "Network Access" → "Add IP Address"
     - Add `0.0.0.0/0` (allow all) for Vercel serverless functions
     - Or add Vercel's IP ranges (less secure but more restrictive)

2. **Get Connection String:**
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `taskflow` (or your preferred name)

---

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. **Sign up/Login to [Vercel](https://vercel.com)**

2. **Import Your Repository:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository and branch (usually `main`)

### 3.2 Configure Project Settings

Vercel should auto-detect settings from `vercel.json`, but verify:

- **Framework Preset:** Other (or leave blank)
- **Root Directory:** Leave blank (root of repo)
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `cd backend && npm install && cd ../frontend && npm install`

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-at-least-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-project.vercel.app
NODE_ENV=production
```

**Important Notes:**
- Replace `MONGO_URI` with your actual MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (use a password generator or `openssl rand -base64 32`)
- `CORS_ORIGIN` should be your Vercel deployment URL (you'll update this after first deploy)
- You can add multiple origins: `https://app1.vercel.app,https://app2.vercel.app`

### 3.4 Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies for both backend and frontend
   - Build the frontend (Vite)
   - Set up serverless functions for `/api/*` routes
3. Wait for deployment (usually 2-5 minutes)
4. Your app will be live at: `https://your-project.vercel.app`

### 3.5 Update CORS (After First Deploy)

1. After deployment, copy your Vercel URL
2. Go to Project Settings → Environment Variables
3. Update `CORS_ORIGIN` with your actual Vercel URL:
   ```
   CORS_ORIGIN=https://your-project.vercel.app
   ```
4. Redeploy (or it will auto-redeploy on next push)

---

## Step 4: Verify Deployment

### 4.1 Test API Endpoints

Visit these URLs in your browser:

- **Health Check:** `https://your-project.vercel.app/api/health`
  - Should return: `{"status":"ok","db":"connected"}`

- **Test Registration:** Use Postman or browser DevTools to test:
  ```
  POST https://your-project.vercel.app/api/auth/register
  Body: { "name": "Test", "email": "test@example.com", "password": "test123" }
  ```

### 4.2 Test Frontend

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Register a new account
3. Create a task
4. Test all features (CRUD, filters, dark mode, etc.)

### 4.3 Check Logs

- Go to Vercel Dashboard → Your Project → "Functions" tab
- Click on any function to see logs
- Check for errors or connection issues

---

## Step 5: Custom Domain (Optional)

1. **Add Domain:**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `taskflow.com`)
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - Update `CORS_ORIGIN` to include your custom domain:
     ```
     CORS_ORIGIN=https://your-project.vercel.app,https://taskflow.com
     ```
   - Redeploy

---

## How It Works

### Architecture

```
User Request
    ↓
Vercel Edge Network
    ↓
┌─────────────────────────────┐
│  /api/* → Serverless Function │
│  (api/index.js)              │
│  - Express app               │
│  - MongoDB connection        │
│  - All backend routes        │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│  /* → Static Frontend       │
│  (frontend/dist)            │
│  - React SPA                │
│  - Vite build output        │
└─────────────────────────────┘
```

### Serverless Function (`api/index.js`)

- Wraps your Express app
- Handles all `/api/*` routes
- Reuses MongoDB connections (optimized for serverless)
- Auto-scales based on traffic

### Frontend

- Built with Vite
- Served as static files
- API calls use relative paths (`/api/*`) when deployed
- Falls back to `VITE_API_URL` env var if set

---

## Environment Variables Reference

### Required:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
```

### Optional:

```
JWT_EXPIRES_IN=7d                    # Default: 7d
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
VITE_API_URL=                        # Leave empty for relative paths
```

---

## Troubleshooting

### API Returns 404

**Problem:** `/api/*` routes not working

**Solutions:**
- Check `vercel.json` has correct rewrites
- Verify `api/index.js` exists
- Check Vercel function logs for errors
- Ensure backend dependencies are installed

### MongoDB Connection Errors

**Problem:** `MongoDB connection error` in logs

**Solutions:**
- Verify `MONGO_URI` is correct in environment variables
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify database user credentials
- Check MongoDB Atlas cluster is running

### CORS Errors

**Problem:** Browser shows CORS errors

**Solutions:**
- Update `CORS_ORIGIN` with exact frontend URL (no trailing slash)
- Add all domains (production, preview, custom domain)
- Check environment variables are set correctly
- Redeploy after changing env vars

### Frontend Can't Reach API

**Problem:** Network errors in browser console

**Solutions:**
- Verify API is working: visit `/api/health` directly
- Check browser console for exact error
- Ensure frontend uses relative paths (no `VITE_API_URL` set in production)
- Check Vercel function logs

### Build Failures

**Problem:** Deployment fails during build

**Solutions:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node version is compatible (18+)
- Check for syntax errors in code

### Cold Start Issues

**Problem:** First API request is slow

**Solutions:**
- This is normal for serverless (cold start)
- Subsequent requests are fast (warm function)
- Consider Vercel Pro for better performance
- Use connection pooling (already implemented)

---

## Local Development

### Run Locally with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link Project:**
   ```bash
   vercel link
   ```

4. **Pull Environment Variables:**
   ```bash
   vercel env pull .env.local
   ```

5. **Run Dev Server:**
   ```bash
   vercel dev
   ```

This runs both frontend and API locally, matching production behavior.

### Or Use Separate Servers (Traditional)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## Continuous Deployment

Vercel automatically deploys when you push to your main branch.

**Workflow:**
1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Vercel auto-deploys
5. Preview URLs for each branch/PR

**Preview Deployments:**
- Every push to a branch creates a preview
- Every PR gets a unique preview URL
- Perfect for testing before merging

---

## Cost Estimate

**Free Tier (Hobby):**
- 100GB bandwidth/month
- 100 serverless function executions/day
- Unlimited deployments
- Perfect for small projects

**Pro Tier ($20/month):**
- 1TB bandwidth/month
- Unlimited function executions
- Better performance
- Team collaboration

**Total Cost:** $0/month (free tier) for small projects

---

## Security Checklist

- ✅ Never commit `.env` files
- ✅ Use strong `JWT_SECRET` (32+ characters)
- ✅ MongoDB Atlas password is strong
- ✅ CORS is restricted to your domains
- ✅ MongoDB Atlas IP whitelist configured
- ✅ Environment variables set in Vercel dashboard
- ✅ Use HTTPS (automatic on Vercel)

---

## Performance Tips

1. **Connection Pooling:** Already implemented in `api/index.js`
2. **Caching:** Consider adding Redis for session caching
3. **CDN:** Vercel automatically uses CDN for static assets
4. **Edge Functions:** Consider moving some logic to Edge Functions
5. **Database Indexing:** Ensure MongoDB indexes are set up

---

## Next Steps

- Set up custom domain
- Configure preview deployments
- Add monitoring (Vercel Analytics)
- Set up error tracking (Sentry)
- Add CI/CD workflows
- Optimize database queries

---

## Support

If you encounter issues:

1. Check Vercel function logs
2. Check MongoDB Atlas logs
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

Happy deploying! 🚀

