# Day 28 – Authentication state and context

Login, session restore, logout, protected routes, role-aware navigation and expired-session handling.

## How it works

1. **Login**: the backend checks the password, creates a row in the `Session` table and sends its id in an `httpOnly` cookie.
2. **Restore session**: when the page loads, `AuthProvider` calls `GET /api/auth/me`. If the cookie is still valid, the user stays logged in.
3. **Protect routes**: `ProtectedRoute` redirects to `/login` (not logged in) or `/unauthorized` (wrong role).
4. **Real protection is on the backend**: `requireAuth` and `requireRole` check every API request. Hiding a link in React is not security.
5. **Expired session**: when a protected API call returns 401, `apiFetch` fires a `session-expired` event, and `AuthProvider` logs the user out and redirects to login.

## Folders

```
backend/
  prisma/schema.prisma     User + Session tables
  prisma/seed.ts           demo users
  src/
    server.ts              starts the server
    app.ts                 middleware + routes
    config.ts              port, cookie name, session length
    lib/prisma.ts          database client
    routes/                URL → controller
    controllers/           what each endpoint does
    middleware/            requireAuth, requireRole, errorHandler
    services/              session create / find / delete
    utils/                 password hashing, cookie helpers, safe user shape

authentication/  (React)
  src/
    api/                   fetch calls to the backend
    auth/                  AuthContext, AuthProvider, useAuth
    components/            Navbar, ProtectedRoute
    pages/                 Login, Dashboard, Admin, Unauthorized
    types/                 User type
```

## Run it

```bash
# backend
cd backend
# set DATABASE_URL in .env first
npm run db:migrate     # create tables
npm run seed           # admin@example.com / user@example.com, password: password123
npm run dev            # http://localhost:3000

# frontend (new terminal)
cd authentication
npm run dev            # http://localhost:5173  (/api is proxied to the backend)
```

To test expired sessions, set `SESSION_DURATION_MS` in `backend/src/config.ts` to `60 * 1000` (1 minute).
