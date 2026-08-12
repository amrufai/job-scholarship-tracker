# TrackerHub — Job & Scholarship Application Tracker

TrackerHub is a full-stack web app for keeping track of job applications, scholarships, and PhD-direct opportunities in one place. Instead of juggling spreadsheets, it gives you a single dashboard with deadlines, statuses (Wishlist → Applied → Interview → Offer/Rejected), and quick stats, all tied to your own account.

**Live demo:** https://job-scholarship-tracker.vercel.app/

---

## Why I built this

I was tracking job and scholarship applications across notes apps and spreadsheets and kept losing track of deadlines. I built TrackerHub to solve that problem for myself: one login, one list, sorted by what's due soonest, with separate views for jobs vs. academic opportunities.

## Features

- 🔐 **Authentication** — email/password signup and login with hashed passwords (bcrypt) and JWT-based sessions
- 📋 **Application tracking** — create, edit, and delete entries with title, organization, type, status, dates, a link to the posting, and free-form notes
- 📊 **Dashboard** — auto-sorted by nearest deadline, with at-a-glance counts of total applications, interviews, and offers
- 🧭 **Filtered views** — separate `Jobs` and `Scholarships` pages, each with their own stats
- 🔒 **Per-user data isolation** — every query is scoped to `user_id` from the verified JWT, so users can only ever see or modify their own applications
- 🌐 **Deployed as two services** — a React SPA and a standalone Express/MySQL REST API, communicating over CORS with an explicit origin allowlist

## Tech stack

**Frontend:** React 19, React Router 7, Axios
**Backend:** Node.js, Express 5, MySQL (via `mysql2`), JWT (`jsonwebtoken`), `bcryptjs`
**Tooling:** nodemon, Create React App

## Architecture

```
frontend/                React SPA (Create React App)
  src/pages/              Dashboard, Jobs, Scholarships, Add/Edit, Login, Signup, Settings
  src/components/         Sidebar / nav
  src/api/client.js        Axios instance + auth header helper

backend/                 Express REST API
  server.js                App entry: CORS, JSON body parsing, route mounting
  routes/                  authRoutes.js, applicationRoutes.js
  controllers/             authController.js, applicationController.js
  middleware/              authMiddleware.js — verifies JWT, attaches req.user.id
  config/db.js             MySQL connection pool
  utils/                   validateEnv.js (fails fast on missing secrets),
                            corsOrigins.js (builds the CORS allowlist)
  migrate.js               Creates the `users` and `applications` tables
```

The API is stateless and scoped by user: `authMiddleware` verifies the JWT on every protected route and sets `req.user.id`, and every controller query filters `WHERE user_id = ?` (or `AND user_id = ?` on updates/deletes) so one user can never read or mutate another user's rows.

## Getting started

### Prerequisites
- Node.js 18+
- A MySQL database (local, or a free-tier host like PlanetScale/Railway/Aiven)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values below
npm run migrate        # creates the users + applications tables
npm run dev            # starts the API on http://localhost:5000
```

`.env` values:

| Variable | Description |
|---|---|
| `JWT_SECRET` | Random secret used to sign auth tokens |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | MySQL connection details |
| `DB_SSL` | Set to `false` for local MySQL without SSL |
| `PORT` | API port (defaults to 5000) |
| `ALLOWED_ORIGINS` | Comma-separated list of extra frontend origins allowed by CORS |

### 2. Frontend

```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:5000" > .env
npm start               # http://localhost:3000
```

## API overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create an account | – |
| POST | `/api/auth/login` | Log in, returns a JWT | – |
| GET | `/api/applications` | List the current user's applications | ✅ |
| POST | `/api/applications` | Create an application | ✅ |
| PUT | `/api/applications/:id` | Update an application | ✅ |
| DELETE | `/api/applications/:id` | Delete an application | ✅ |

Protected routes expect `Authorization: Bearer <token>`.

## Testing

Run `npm test` inside `backend/` to run the Jest suite covering the application controller (input validation, per-user scoping, and error handling).

## What I'd add next

- Wire up the "Delete account" button in Settings to a real `DELETE /api/users/me` endpoint
- Move the display name from `localStorage` into the JWT/DB so it doesn't need a full page reload to update
- Add pagination/search now that the applications list can grow
- Write integration tests for the controllers (currently untested)
- Add refresh tokens so sessions can outlive the 1-hour JWT expiry without forcing a re-login

## License

MIT
