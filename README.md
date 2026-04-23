# AI Test Case Generator

## Project Overview

This project is a full-stack AI-powered test case generator. Phase 1 used a mock generator and local JSON storage. Phase 2 adds a PostgreSQL-ready persistence layer and an OpenAI-backed generation path with a safe fallback to the mock generator when configuration is missing.

## Phase 1 Features

- Requirement input with a generate action
- Mock AI-based test case generation
- Display of generated test cases before saving
- Save all generated test cases to local JSON storage
- View all saved test cases
- Delete saved test cases
- Beginner-friendly, modular code structure

## Phase 2 Features

- PostgreSQL-ready persistence layer
- Storage mode switch between JSON and PostgreSQL
- OpenAI-backed generation when `OPENAI_API_KEY` is configured
- Automatic fallback to the mock generator when OpenAI is unavailable
- Shared API contract so the frontend does not need to change

## Tech Stack

- Frontend: React.js, functional components, hooks, Vite
- Backend: Node.js, Express
- Storage: local JSON file or PostgreSQL
- AI: mock generator service with optional OpenAI integration

## Folder Structure

- `server/`
  - `routes/`
  - `controllers/`
  - `services/`
  - `config/`
  - `sql/`
  - `data/`
  - `app.js`
- `client/`
  - `src/components/`
  - `src/services/`
  - `src/App.jsx`

## Install Dependencies

Run these commands from the project root:

```bash
cd server
npm install

cd ../client
npm install
```

If you want to enable the Phase 2 PostgreSQL/OpenAI path, copy `server/.env.example` to `server/.env` and fill in your values.

## Run the Backend

```bash
cd server
npm start
```

The backend runs on `http://localhost:5000` by default.

To use PostgreSQL, set `STORAGE_MODE=postgres` and `DATABASE_URL` in `server/.env`.

## Run the Frontend

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Local JSON Storage

Phase 1 uses `server/data/testcases.json` for persistence. If the file is empty or missing, the backend falls back to an empty array and recreates the file when needed.

## PostgreSQL Mode

When `STORAGE_MODE=postgres`, the backend uses the `test_cases` table defined in `server/sql/schema.sql`. In that mode, saved test cases are persisted in PostgreSQL instead of the JSON file.

## OpenAI Mode

When `OPENAI_API_KEY` is set, generated test cases come from OpenAI. If the key is missing or the request fails, the backend automatically falls back to the mock generator so the app keeps working.

## API Endpoints

- `POST /api/generate-testcases` - generate structured test cases from a requirement
- `GET /api/testcases` - fetch all saved test cases
- `POST /api/testcases` - save one or more test cases
- `DELETE /api/testcases/:id` - delete a saved test case by ID

## Future Enhancements

- Authentication
- Edit flow for saved test cases
- Export to Excel or CSV
- Filters and pagination
- JIRA or qTest integration
