# Ethara (NebulaBento) — MERN demo

This workspace contains a small MERN demo app (React client + Express API + MongoDB) with basic project/task management and role-based controls.

## Repository layout
- `server/` — Express API, Mongoose models
- `client/` — React app (Vite)

## Prerequisites
- Node.js 18+ / npm
- MongoDB (local or cloud)

## Environment
Create a `.env` file in `server/` with these values (example):

```
MONGODB_URI=mongodb://localhost:27017/nebula_bento
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Local development

1. Install dependencies

```powershell
# from workspace root
cd server
npm install
cd ../client
npm install
```

2. Start server and client in separate terminals

```powershell
# server (auto-restarts with nodemon)
cd server
npm run dev

# client (Vite)
cd client
npm run dev
```

3. Open the client in your browser (Vite will show the `localhost` port). Use the header buttons to `Seed Demo` and `Demo Login`.

## Useful commands

- Seed demo data (creates demo users/projects/tasks): `POST /api/seed` (button available in UI header)
- Demo login (returns an admin JWT): `GET /api/auth/demo` (button available in UI header)
- Run a quick API smoke test (server must be running):

```powershell
cd server
node test_api.js
# or
npm run test-api
```

## Building for production

1. Build the client

```powershell
cd client
npm run build
```

2. Deploy the client build to any static host (Netlify, Vercel, Azure Static Web Apps) or serve it with the server.

3. Start the server with production env

```powershell
cd server
NODE_ENV=production npm start
```

Tip: to serve the client build from the Express server you can add static middleware in `server/index.js` (I can add this for you if desired).

## Railway deployment

Railway can now detect the repo using the root `railway.json` and `start.sh` files.

The startup script installs dependencies, builds the client, and starts the server:

```bash
bash start.sh
```

Set the required environment variables in Railway:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`
- `NODE_ENV=production`

## API highlights

- `POST /api/seed` — seed demo data
- `GET /api/auth/demo` — demo admin JWT
- `POST /api/auth/signup`, `POST /api/auth/login` — auth
- `GET /api/projects`, `POST /api/projects` — list/create projects (auth required)
- `GET /api/projects/:id`, `POST /api/projects/:id/members`, `DELETE /api/projects/:id/members/:memberId` — member management
- `POST /api/projects/:id/admins`, `DELETE /api/projects/:id/admins/:memberId` — project admin management
- `GET /api/users?email=...` — lookup user (used by invite flow)

Notes:
- The client stores tokens at `localStorage.demo_token` and sets axios default `Authorization: Bearer <token>`.
- Project creators are added to `Project.admins` on creation; per-project admin checks are enforced server-side.

## Troubleshooting

- If you see `401` responses: ensure server is running and client has a valid token (`Demo Login` or login screen).
- Check server logs for Mongo connection errors when starting `npm run dev`.

## Next improvements (optional)

- Add automated API tests (Jest + supertest)
- Implement email invitation flows
- Add UI to manage per-project admin roles

If you'd like, I can add an Express static route to serve the client `build/` output from `server/` for a single-process deployment — tell me if you'd like that implemented.
