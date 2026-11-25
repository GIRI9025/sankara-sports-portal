
# Sankara Sports Portal (MERN)

Premium college sports portal starter built with React + Vite, Node/Express, MongoDB + Mongoose.

## Features
- Premium dark sports UI (lime + gold accent), responsive layouts
- Home dashboard stats, events, latest winners, champions
- Sports / Events catalog
- Department points table
- Winners list with filters
- Overall champions history
- Downloads center (registration/rules/results/schedule PDF links)
- Admin dashboard: CRUD events, record results/winners, update downloadable documents
- MongoDB models + seed sample data
- Result entry automatically updates department points by medal position (default 10/7/5/3)

## Requirements
- Node.js 18+
- MongoDB local or Atlas connection string

## Setup
### 1) Backend
```bash
cd server
cp .env.example .env
# Edit MONGO_URI and ADMIN_PASSWORD if needed
npm install
npm run seed
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2) Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Open the Vite URL (usually http://localhost:5173).

## Admin
Go to `/admin`. Login with values from `.env`:
- username: `admin`
- password: default `ChangeMe123!` (change before use)

Admin login uses a simple JWT. This starter is for local/demo use; before public production deployment, configure HTTPS, strong credentials, secure secret, CORS domain, validation, and backups.

## Data
Seed data is fictional demo data. Replace with actual college departments, event records, winners, champions, and documents.
