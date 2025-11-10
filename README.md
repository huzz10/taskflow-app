# TaskFlow

TaskFlow is a full-stack task management application built with the MERN stack. It helps teams and individuals capture tasks, track progress, prioritise work, and stay organised with an intuitive, responsive UI.

<img width="1566" height="786" alt="image" src="https://github.com/user-attachments/assets/b2f47f4c-5ded-4043-ac2f-c4af8817f7ea" />

<img width="1554" height="798" alt="image" src="https://github.com/user-attachments/assets/775bbc5e-e859-45cc-b965-70cf3978f2d5" />


## Features

- 🔐 JWT authentication with secure password hashing
- ✅ Full CRUD task management scoped to each user
- 🎯 Filtering by status, priority, and due date plus quick title search
- 📅 Sorting tasks by creation time or due date
- 🌓 Dark/light theme toggle with preference persistence
- 🔔 Toast notifications for feedback across all key actions
- 📱 Responsive React UI styled with Tailwind CSS

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Vite, Axios, react-hot-toast
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Tooling:** ESLint, Prettier, Nodemon

## Project Structure

```
.
├── backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .eslintrc.cjs
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── vite.config.js
│   └── .eslintrc.cjs
└── README.md
```

## Setup & Run

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB instance (local or cloud)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# update .env with your values
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# set VITE_API_URL to your deployed backend or local API
npm run dev
```

The Vite dev server runs on `http://localhost:5173`.

## Environment Variables

See `.env.example` files in both `backend` and `frontend` directories for the required variables.

### Backend

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=changeme
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```
VITE_API_URL=http://localhost:5000/api
```

## Linting & Formatting

Run ESLint:

```bash
npm run lint
```

Run Prettier:

```bash
npm run format
```

Each package (frontend/backend) has its own scripts. Execute commands from the respective directory.

## Deployment

### Option 1: Full-Stack on Vercel (Recommended for Simplicity)

📖 **See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete guide**

Deploy both frontend and backend on Vercel using serverless functions:
- ✅ Single platform, one domain
- ✅ No CORS configuration needed
- ✅ Serverless auto-scaling
- ✅ Free tier available

**Quick Steps:**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
4. Deploy!

### Option 2: Separate Deployment (Render + Netlify/Vercel)

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide**

**Backend (Render):**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: See `backend/.env.example`

**Frontend (Netlify/Vercel):**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL` (pointing to your Render backend URL)

## API Endpoints

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login existing user |
| GET    | `/api/auth/me`       | Fetch authenticated user |
| GET    | `/api/tasks`         | List tasks with filters |
| POST   | `/api/tasks`         | Create a new task |
| GET    | `/api/tasks/:id`     | Get single task |
| PUT    | `/api/tasks/:id`     | Update a task |
| DELETE | `/api/tasks/:id`     | Delete a task |

## Testing

Manual smoke tests:

- Register and login
- Create new tasks and validate list refresh
- Edit, mark complete, and delete tasks
- Apply filters, search, and sorting
- Toggle dark mode and ensure persistence across reloads

## Roadmap Ideas

- Collaborative workspaces with invitations
- Calendar view and reminders
- File attachments per task

---

Happy shipping! 🚀

