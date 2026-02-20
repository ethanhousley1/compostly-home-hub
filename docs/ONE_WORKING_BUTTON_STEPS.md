# One Working Button — Step-by-Step

This document shows **exactly** how the Sign Up button satisfies the assignment: connect to backend, update the database, return the value, show it in the UI.

---

## Step 1: Connect to backend server logic

**Where:** Frontend already does this in `src/pages/SignUp.tsx`.

- The "Create Account" button submits the form, which runs `handleSubmit`.
- `handleSubmit` sends a **POST** request to `${apiBaseUrl}/api/signup` (e.g. `http://localhost:3000/api/signup`) with the form data.
- So the frontend **connects to the backend** via that `fetch` call.

**Backend:** The server in `server/` must be running so that request hits real logic.

- Run from project root: `cd server && npm install && npm run dev`.
- The Express app in `server/index.js` listens on port 3000 and mounts routes under `/api`, so `POST /api/signup` is handled by `server/routes/signup.js`.

---

## Step 2: Update something in the database

**Where:** Backend in `server/routes/signup.js`.

- The **POST /api/signup** handler receives `firstName`, `lastName`, `email`, `password` from the request body.
- It validates them (required, password length ≥ 6).
- It hashes the password with `bcrypt` (so the DB stores a hash, not plaintext).
- It runs an **INSERT** into `user_account` with `first_name`, `last_name`, `email`, `password`.
- So the button click **updates the database** by inserting a new row into `user_account`.

The DB connection is in `server/db.js` (uses `pg` and env vars like `PGDATABASE=compostly`, `PGPASSWORD`, etc.). Ensure `db/schema.sql` and `db/seed.sql` have been run so the `user_account` table exists.

---

## Step 3: Return the updated value to the frontend

**Where:** Same handler in `server/routes/signup.js`.

- The INSERT uses **RETURNING user_id, first_name, last_name, email** so the new row is returned.
- The handler builds a `user` object from that row and sends **res.status(201).json({ user })**.
- So the backend **returns the updated value** (the created user) to the frontend in the response body.

---

## Step 4: Show the updated value in the UI

**Where:** Frontend in `src/pages/SignUp.tsx` and `src/pages/SignUpComplete.tsx`.

- In **SignUp.tsx**, after a successful response:
  - Parse JSON: `const data = await response.json();`
  - Read the created user: `const user = data?.user;`
  - Call `signup(...)` with that user’s data so auth state matches the DB.
  - Navigate to the thank-you page and pass the user: `navigate("/signup-complete", { state: { user } });`
- In **SignUpComplete.tsx**:
  - Get the user from location state: `const { state } = useLocation(); const user = state?.user;`
  - Render it: e.g. "Welcome, {user.first_name}! Your account ID is {user.user_id}."
- So the **updated value returned from the backend is shown in the UI** on the thank-you page (name and user_id from the database).

---

## Quick checklist

| Requirement | Where it happens |
|-------------|------------------|
| Connect to backend | `SignUp.tsx`: `fetch(apiBaseUrl + '/api/signup', ...)` |
| Update DB | `server/routes/signup.js`: `pool.query(INSERT INTO user_account ...)` |
| Return updated value | `server/routes/signup.js`: `res.status(201).json({ user })` |
| Show in UI | `SignUpComplete.tsx`: "Welcome, {user.first_name}! Your account ID is {user.user_id}." |

---

## How to run and verify

1. Create DB and run `db/schema.sql` and `db/seed.sql`.
2. In `server/`, copy `.env.example` to `.env`, set `PGPASSWORD`, run `npm install` and `npm run dev`.
3. In project root, run `npm run dev` for the frontend; open the app (e.g. http://localhost:8080).
4. Sign up with a new email. On the thank-you page you should see your first name and new account ID (from the DB).
5. In PostgreSQL: `SELECT * FROM user_account ORDER BY user_id DESC LIMIT 1;` to confirm the new row.
