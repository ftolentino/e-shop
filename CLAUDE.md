# CLAUDE.md

Guidance for any Claude agent (or subagent) working in the `e-shop` repository. This file documents the tech stack, repo conventions, the agentic/subagent workflow, and the CI/CD pipeline. Keep it up to date as decisions change — it's the source of truth agents read before touching code.

## Project Overview

`e-shop` is an e-commerce web application. It is currently in the planning/scaffolding stage — no application code has been written yet.

## Tech Stack

### Frontend

- React 18 + Vite + TypeScript
- Routing: React Router v6
- Server state: TanStack Query (React Query) for API data fetching/caching
- Client/UI state: React Context, escalate to Zustand only if state complexity grows
- Styling: Ply-CSS https://www.plycss.com/
- Testing: Vitest + React Testing Library (unit/component), Playwright (E2E)

### Backend

- Node.js + Express + TypeScript
- Deployed as Vercel Serverless Functions in the same Vercel project as the frontend
- Firebase Admin SDK for server-side Firestore access
- Testing: Vitest + Supertest

### Database & Auth

- Firestore (NoSQL document database, via Firebase)
- Firebase Authentication (confirmed; pairs naturally with Firestore security rules)

### Payments

- Stripe (confirmed; industry standard for e-commerce checkout + webhooks)

### Hosting / Infra

- Vercel: single project hosting both the frontend static build and the backend serverless functions (confirmed over two separate projects) — one deploy target, one pipeline, one preview URL per PR
- Firebase project: Firestore + Auth only (no Cloud Functions, per the decision to keep the backend on Express/Vercel)
- Secrets: Vercel environment variables (Stripe keys, Firebase service account JSON, etc.)

### Tooling

- Package manager: pnpm workspaces (confirmed; efficient for a frontend+backend monorepo)
- Linting/formatting: ESLint (typescript-eslint) + Prettier
- Git hooks: Husky + lint-staged (pre-commit lint/format)
- GitLens for code orchestration in Visual Studio Code IDE

## Repository Structure

Monorepo, managed as pnpm workspaces:

```
e-shop/
├── apps/
│   ├── frontend/        # React + Vite app
│   └── backend/         # Express API (deployed as Vercel functions)
├── packages/
│   └── shared/          # Types/utils shared between frontend and backend
├── .github/
│   └── workflows/       # CI/CD pipeline definitions
├── CLAUDE.md
└── README.md
```

Rationale: a single repo keeps one CI pipeline and one Vercel project, and lets git worktrees (below) check out the whole stack per feature branch instead of juggling multiple repos.

## Agentic Development Workflow

Three subagent roles are used when multiple Claude agents work this repo in parallel:

1. **Feature agent** — implements one ticket/feature end-to-end (frontend + backend + tests) in its own git worktree and branch.
2. **Review/QA agent** — reviews the diff, checks it against this file's conventions, runs/extends tests, and only then approves merge.
3. **CI/CD pipeline** — the automated gatekeeper; not a chat agent, but the final check before anything reaches `main`.

### Git worktree strategy

Each feature agent works in its own `git worktree`, so multiple agents can run in parallel without fighting over `git checkout`:

```bash
# from the main checkout, create a worktree + branch for a new feature
git worktree add ../e-shop-<feature-slug> -b feature/<feature-slug>

# list active worktrees
git worktree list

# once merged, clean up
git worktree remove ../e-shop-<feature-slug>
```

Rules:

- Worktrees live as sibling directories to the main checkout (e.g. `../e-shop-cart-page`).
- Each worktree is independently installable/runnable (`pnpm install` inside it).
- One feature = one branch = one worktree = one PR. Don't share a worktree across unrelated tickets.
- Agents should run `git worktree list` before creating a new one, to avoid duplicating work already in flight.

### Branch & commit conventions

- Branches: `feature/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
- PRs are the only way into `main` — no direct pushes.

### What each agent should do before starting

1. Read this file.
2. Check `git worktree list` for existing/overlapping work.
3. Create a worktree + branch scoped to a single feature.
4. Run lint + unit tests locally before opening a PR.
5. Fill in the PR description checklist (tests added, docs updated, manual QA notes).

## CI/CD Pipeline (GitHub Actions)

On every PR targeting `main`:

1. Install dependencies (pnpm, cached)
2. Lint (`eslint`) + type-check (`tsc --noEmit`)
3. Unit tests — frontend and backend
4. Build — frontend and backend
5. (optional, once E2E suite exists) Playwright tests against the PR's Vercel Preview Deployment

On merge to `main`:

- Vercel's GitHub integration auto-deploys to production — no separate deploy step needed in Actions.
- Every PR still gets its own Vercel Preview Deployment automatically, which the Review/QA agent (or a human) uses to sanity-check the change before approving.

Required status checks before merge: lint, type-check, unit tests, build. All must be green.

## Local Development

```bash
pnpm install   # install all workspace deps
pnpm dev       # run frontend + backend concurrently
pnpm test      # run all tests
pnpm lint      # lint all workspaces
```

## Decisions Log

All tech stack decisions above are confirmed as of 2026-07-08: React/Vite frontend, Express-on-Vercel backend, Firestore, Firebase Auth, Stripe, ply CSS, pnpm workspaces, single Vercel project. Update this log (and the sections above) if any decision changes later.
