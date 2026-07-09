// Vercel serverless function entrypoint. Vercel auto-detects any file
// under a root-level `api/` directory as a serverless function. Express
// apps are valid (req, res) request handlers, so we hand every /api/*
// request straight to the Express app defined in apps/backend.
//
// This keeps the frontend (built from apps/frontend) and the backend
// (this function) in ONE Vercel project — see CLAUDE.md > Hosting/Infra.
import app from '../apps/backend/src/app';

export default app;
