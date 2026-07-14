# CLAUDE.md

Guidance for any Claude agent (or subagent) working in the `e-shop` repository. This file documents the tech stack, repo conventions, the agentic/subagent workflow, and the CI/CD pipeline. Keep it up to date as decisions change — it's the source of truth agents read before touching code.

## Project Overview

`e-shop` is an e-commerce web application. The core browse-to-cart flow (Home, Product Listing, Product Detail, Cart) is implemented against dummyjson.com as dev/seed catalog data; Firestore-backed catalog data, Search, Checkout, and Account are not yet built.

## Tech Stack

### Frontend

- React 18 + Vite + TypeScript
- Routing: React Router v6
- Server state: TanStack Query (React Query) for API data fetching/caching
- Client/UI state: Zustand (confirmed — e.g. `apps/frontend/src/store/cartStore.ts` with the `persist` middleware for localStorage-backed state)
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

**When to remove a worktree vs. keep it:**

- **Dangling** (the worktree's directory was deleted from disk without running `git worktree remove` first, so `git worktree list` shows it as `prunable`) — always clean up immediately with `git worktree prune`. There's no tradeoff here: a reference to a folder that no longer exists has no value.
- **Still active** (the feature isn't merged yet, a subagent working in it may be resumed, or a PR has open review comments) — keep the worktree. Removing it mid-iteration means re-paying the `pnpm install` cost, losing any local gitignored files (e.g. a worktree-local `.env` copied from `.env.example`), and breaking the ability to resume a subagent in that same working directory.
- **Merged and done** (the branch is merged into `main` and no further commits are expected) — remove it, per the command above. This is the actual trigger for cleanup, not "the agent finished a single turn" — a worktree that outlives its merged branch is what creates the stale/dangling clutter this section warns against.

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

## Infrastructure Roadmap

Planned infrastructure work beyond the current CI/CD baseline. Items here are not live yet — this section exists so implementation follows an agreed approach instead of getting improvised later, by whichever agent or person picks it up.

### Staging environment (planned)

**Decision:** decouple git branch from deploy target, rather than introducing a `develop` branch. `main` stays the single integration branch — fed by `feature/*` PRs, gated by the same required CI checks and review as today — and becomes the staging deploy target. A separate `production` branch becomes Vercel's production-domain target; promoting a release is a deliberate `main` → `production` merge (or Vercel's manual "Promote to Production" action).

**Why not a `develop` branch:** git-flow's `develop` branch solves a different problem than the one we have — batching many features into scheduled releases. Adopting it here would add a second long-lived branch every feature PR has to pass through, plus a second merge that re-tests what CI already verified once, without a corresponding safety gain — Vercel already gives every PR its own preview deployment before anything reaches `main`. It would also add friction for the parallel Claude subagent workflow above, where each feature agent's PR should merge straight into `main` once its own CI run and review pass.

**To implement, when ready:**

1. Create a `production` branch from `main`.
2. In Vercel project settings, change the Production Branch from `main` to `production` (Settings → Git). `main` then deploys to a stable, non-production URL — the staging environment — on every merge, same behavior as today just retargeted.
3. Promote a staging build to production by merging (or fast-forwarding) `main` into `production`. Keep this manual at first; automate later (e.g. a manually-triggered GitHub Action) once the release cadence is predictable.
4. Update this file's "CI/CD Pipeline" section once this is actually live — right now `main` still deploys straight to production, unchanged.

### Observability / error tracking (planned, not yet scoped)

Error tracking (e.g. Sentry or similar) for both `apps/frontend` and `apps/backend`, so production issues surface automatically instead of being discovered by users first. Revisit once the staging split above exists, since staging is also where this should get validated before touching production.

### Security review (planned, not yet scoped)

A focused security pass once there's auth/payments code to review — Firestore security rules, Stripe webhook signature verification, secret/env var handling. Scoped specifically to what this app touches, not a generic audit; see the `security-reviewer` subagent discussed for the agentic workflow.

## Local Development

```bash
pnpm install   # install all workspace deps
pnpm dev       # run frontend + backend concurrently
pnpm test      # run all tests
pnpm lint      # lint all workspaces
```

## Decisions Log

All tech stack decisions above are confirmed as of 2026-07-08: React/Vite frontend, Express-on-Vercel backend, Firestore, Firebase Auth, Stripe, ply CSS, pnpm workspaces, single Vercel project. Update this log (and the sections above) if any decision changes later.

**2026-07-13** — Zustand confirmed as the client/UI state tool (superseding the earlier "Context, escalate to Zustand" guidance) for the new cart store. Core browse-to-cart flow (Home, Product Listing, Product Detail, Cart) implemented from a Claude Design wireframe pass, using dummyjson.com as a swappable dev/seed data source behind `apps/frontend/src/lib/catalog.ts` — swap that file's fetch calls for `/api/products` + Firestore when the real backend catalog is ready; no page/component changes needed.

**2026-07-14** — Decided against a git-flow-style `develop` branch. Staging/production separation will instead be handled by a `production` branch that Vercel's production domain targets, while `main` (fed directly by feature PRs) becomes the staging deploy target — see "Infrastructure Roadmap" below for the reasoning and implementation steps. Not yet implemented; `main` still deploys straight to production today.
