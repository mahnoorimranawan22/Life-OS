# LifeOS

A personal productivity and life-management platform for students, developers, and early-career professionals.

## Status

**Foundation build** — the project skeleton and infrastructure are in place. Application features (auth, tasks, planner, projects, internship tracker, notes, habits, calendar, AI assistant, analytics) are built phase by phase on top of this foundation.

## Stack

| Layer    | Tech                                            |
| -------- | ----------------------------------------------- |
| Frontend | React 19, Vite, React Router, Axios, Lucide, Recharts |
| Backend  | Node.js, Express, Mongoose, Socket.IO, JWT, bcryptjs, cookie-parser |
| Database | MongoDB (via Mongoose)                          |

## Structure

```
LifeOS/
├── backend/                 # Express API
│   ├── server.js            # entry point (HTTP + Socket.IO)
│   ├── config/              # env.js, db.js (Mongoose connection)
│   ├── controllers/         # request handlers
│   ├── middleware/          # error + not-found middleware
│   ├── models/              # Mongoose models (added per feature)
│   ├── routes/              # Express routers
│   └── services/            # business logic (added per feature)
├── frontend/                # React + Vite app
│   └── src/
│       ├── App.jsx          # router setup
│       ├── pages/           # route pages
│       ├── layouts/         # page layout shells
│       ├── components/      # reusable UI (added per feature)
│       ├── context/         # React context (added per feature)
│       ├── hooks/           # custom hooks (added per feature)
│       ├── services/        # api.js (Axios instance)
│       └── utils/           # helpers (added per feature)
├── .gitignore
└── README.md
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env        # set MONGODB_URI when models are added
npm install
npm run dev                 # http://localhost:4000
```

Health check: `GET http://localhost:4000/api/health`

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # optional; "/api" default works via Vite proxy
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend on port 4000.

## Environment variables

| Variable       | Purpose                                        | Required |
| -------------- | ---------------------------------------------- | -------- |
| `PORT`         | Backend port (default 4000)                    | No       |
| `MONGODB_URI`  | MongoDB connection string                      | Yes (once models exist) |
| `JWT_SECRET`   | Signing secret for auth (no fallback is used)  | Yes (auth phase) |
| `CLIENT_URL`   | Allowed CORS origin (default `http://localhost:5173`) | No |
| `VITE_API_URL` | API base URL for the frontend (default `/api`) | No       |

Real values go in `.env` files (git-ignored); use `.env.example` as a template. No secrets are hardcoded.

## Production builds

```bash
cd frontend && npm run build   # outputs to frontend/dist
```