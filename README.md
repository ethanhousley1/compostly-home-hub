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

#TODO

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

Step 2: Navigate into the project directory

```
    cd compostly-home-hub
```

Step 3: Install dependencies

```
    npm install
```

Step 4: 
- Add required environment variables in the .env file to match database setup in PostgreSQL (e.g. database password).

## Running the Application
Step 1: 

Within the program folder, start up the application server using Node.js by entering the following into the terminal:

```
    npm run dev
```
Step 2:

Navigate to your web browser of choice, and type in: localhost:8080. Compostly should now appear.

## Verifying the Vertical Slice
After the application is running, you'll choose the 'Sign Up' button, and register for an account. After completing that, you should be able to log in with your Compostly account.