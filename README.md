## App Summary
Compostly is a compost pickup service that helps individuals compost more easily and consistently. In areas where municipalities do not offer compost collection—or for those who prefer a simpler option—users can schedule regular bucket pickups through Compostly and receive rebates for their participation.

## Tech Stack (PERN stack)
Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

Backend:
- Supabase Auth (signup/login from the browser)
- Supabase PostgreSQL (data storage)
- Vercel Serverless Functions in `api/` (legacy — not used by the active signup/login flow)

Legacy Express server is still in `server/` for local development.

## Architecture Diagram

<img src="public/System_Architecture_Diagram.png" alt="Architecture Diagram" width="600">

## Prerequisites
To run this project locally, you need:
- Node.js (v18+)
- npm (comes with Node)
- Git (to clone the repository)
- A modern web browser (Chrome, Edge, Safari, etc.)
- PostgreSQL installed and running (local dev) **or** a Supabase project (production)

## Installation and Setup

### Step 1: Clone the repository
```
git clone <https://github.com/ethanhousley1/compostly-home-hub.git>
```

### Step 2: Install dependencies
```
npm install
```

### Step 3: Database setup

**Option A — Local PostgreSQL (for development)**
- Create a database named `compostly` (e.g. `createdb compostly`).
- Run the schema: `psql -d compostly -f db/schema.sql`
- Run the seed: `psql -d compostly -f db/seed.sql`

**Option B — Supabase (for production / Vercel)**
1. Create a Supabase project at https://supabase.com.
2. In the Supabase SQL Editor, paste and run the contents of `db/schema.sql`.
3. (Optional) Run `db/seed.sql` for sample data.
4. Copy the connection string from **Settings → Database → Connection string (URI)**.

### Step 4: Environment
Copy `.env.example` to `.env` and fill in your values:
```
cp .env.example .env
```

Required for signup/login (both local and production):
- `VITE_SUPABASE_URL` — your Supabase project URL (Settings → API)
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key (Settings → API)

For local dev with the legacy Express server, also set `PGPASSWORD` (and other PG* vars).

## Running Locally

### Frontend + backend via Vite proxy (recommended)
1. **Start the Express backend** (in one terminal):
   ```
   cd server && npm install && npm run dev
   ```
   The API runs at http://localhost:3000.

2. **Start the frontend** (in another terminal, from project root):
   ```
   npm run dev
   ```
   Vite proxies `/api/*` requests to the Express server automatically.
   Open http://localhost:8080 in your browser.

## Deploying to Vercel

Everything — the React app, the docs, and the API — ships from a **single Vercel project**.

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the following environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public key
4. Set the build command to `npm run build` and the output directory to `dist`.
5. `npm run build` runs the unified build script (`scripts/build.mjs`) which:
   - Builds the Vite SPA → `dist/`
   - Installs docs dependencies (if needed) and builds the Astro docs → `dist/docs/`
6. `vercel.json` handles SPA rewrites so React Router deep links work, while docs and API routes are served directly.

Note: The `api/` directory still deploys as serverless functions, but the active signup/login flow uses Supabase Auth directly from the browser — no `DATABASE_URL` is required for that.

| Path | What it serves |
|---|---|
| `/` | React SPA |
| `/docs` | Astro/Starlight documentation |
| `/api/*` | Serverless functions |

To run the docs locally: `cd docs && npm install && npm run dev`.

## Verifying the Vertical Slice (Sign Up)
1. **Trigger the feature:** Open the app, go to Sign Up, fill in first name, last name, email, and password (≥6 chars), then click **Create Account**.
2. **Confirm the UI:** You should be redirected to the thank-you page and see "Welcome, [First Name]!"
3. **Confirm the database:** In the Supabase dashboard, go to **Authentication → Users** and verify the new user appears with the correct email and metadata (first_name, last_name, etc.).
4. **Confirm persistence:** Refresh the page — the session should persist via Supabase Auth. Sign out and sign back in to verify login works.
5. **Confirm network:** In browser DevTools → Network, verify that signup/login requests go to your Supabase URL (`*.supabase.co`), not to `/api/signup`.

## EARS Requirements
### Complete
- When a user clicks 'Create Account' with valid details, the system shall create a new user in Supabase and redirect to the thank-you page.
- While the user is logged in, the system shall persist the session across apge refreshes using Supabase Auth.
- The system shall support a unified build process that ships the React SPA, Astro docs, and serverless functions from a single Vercel project.
- The system shall provide a composting education page.
- The system shall provide an 'About Us' page.
- The system shall clarify on the Homepage that users are signing up for a subscription service.
- While a user is signed in, the system shall hide sign-up options from the interface.
- The system shall only allow users existing in the database to log in.
- The system shall provide a consistent header with a navigation menu bar across all pages.
### Not Complete
- When a user signs up, the system shall gather a specific pick-up/drop-off address.
- The system shall provide an Admin page for managing service operations.
- The system shall provide a Profile Details page that allows users to edit their information.
- When a user accesses the Admin Page, the system shall display a Map Dashboard with live pins representing user addresses.
- The system shall provide a Finance dashboard to track rebates and payments.
- Where a user prefers a specific schedule, the system shall allow them to choose when they want their compost waste to be picked up.
- If the database or authentication service is unavailable, the system shall prevent interactionand notify the user. 
