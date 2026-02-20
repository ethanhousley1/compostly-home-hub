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
- Node.js (v. 18+)
- Express
- PostgreSQL

## Architecture Diagram

<img src="public/System_Architecture_Diagram.png" alt="Architecture Diagram" width="600">

## Prerequisites
To run this project locally, you need:
- Node.js
- npm (comes with Node)
- Git (to clone the repository)
- A modern web browser (Chrome, Edge, Safari, etc.)
- PostgreSQL installed and running
- Created database called 'compostly'
- Database credentials configured in the .env file.

## Installation and Setup

Step 1: Clone the repository
   
```
    git clone <https://github.com/ethanhousley1/compostly-home-hub.git>
```

Step 2: Create the database and load schema/seed (PostgreSQL must be running)
- Create a database named `compostly` (e.g. `createdb compostly`).
- Run the schema: `psql -d compostly -f db/schema.sql`
- Run the seed: `psql -d compostly -f db/seed.sql`

Step 3: Environment
- In the project root, copy `.env.example` to `.env`: `cp .env.example .env`
- Edit `.env` and set `PGPASSWORD` (and other DB settings if needed). The server reads this file from the root.

Step 4: Backend setup
- Navigate to the server: `cd server`
- Install backend dependencies: `npm install`

## Running the Application
1. **Start the backend** (in one terminal): `cd server` then `npm run dev`. The API runs at http://localhost:3000.
2. **Start the frontend** (in another terminal, from project root): `npm run dev`. Open http://localhost:8080 (or the port Vite shows) in your browser.

## Verifying the Vertical Slice (One Working Button — Sign Up)
1. **Trigger the feature:** Open the app, go to Sign Up, fill in first name, last name, email, and password (≥6 chars), then click **Create Account**.
2. **Confirm the UI:** You should be redirected to the thank-you page and see "Welcome, [First Name]! Your account ID is [number]." That text comes from the value the backend returned from the database.
3. **Confirm the database:** In PostgreSQL run: `psql -d compostly -c "SELECT user_id, first_name, last_name, email FROM user_account ORDER BY user_id DESC LIMIT 1;"` You should see the new row you just created.
4. **Confirm persistence:** Refresh the page or sign out and sign in. The account still exists; the Create Account button actually updated the database and the UI shows the returned value.
