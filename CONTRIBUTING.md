# Contributing to e-shop

This repo is built to be worked on by multiple people — and multiple Claude
agents — in parallel. This doc covers getting access and getting set up.
The actual working conventions (branch naming, git worktrees, CI checks) live
in [CLAUDE.md](./CLAUDE.md) — read that too, whether you're a human or an agent.

## Getting access

1. **GitHub** — ask the repo owner to add you as a collaborator (repo →
   Settings → Collaborators and teams → Add people). You'll need this before
   you can push branches or open PRs.
2. **Vercel** — ask to be added to the Vercel team/project (Vercel dashboard →
   Team Settings → Members). This gets you preview-deployment links and build
   logs on your own PRs, not just the owner's.
3. **Firestore access for local dev** — don't ask for the production
   `FIREBASE_SERVICE_ACCOUNT`. Instead, use one of:
   - The **Firebase Local Emulator Suite** (recommended — no real credentials
     needed, safe to run offline), or
   - A separate **dev/staging** Firebase project's service account, if the
     team has set one up.

## Local setup

```bash
git clone https://github.com/ftolentino/e-shop.git
cd e-shop
pnpm install
cp apps/backend/.env.example apps/backend/.env   # fill in your own values
pnpm dev
```

`pnpm dev` runs the frontend (Vite, port 5173) and backend (Express, port 3001) together; the frontend proxies `/api/*` to the backend in dev.

## Working in this repo with a Claude agent

If you're using Claude Code, Cowork, or another Claude agent to work on this
repo, no special integration step is needed — Claude automatically reads
`CLAUDE.md` at the repo root before making changes, so every agent (yours,
mine, anyone else's) follows the same conventions out of the box. Concretely,
your agent should:

1. Read `CLAUDE.md` first (it will do this automatically).
2. Run `git worktree list` to see what other agents/collaborators already
   have in flight, so it doesn't duplicate work.
3. Create its own worktree + branch for a single feature — see
   CLAUDE.md > "Git worktree strategy". Worktrees are local to each
   collaborator's own clone; they don't need to sync across machines, but
   branch names (`feature/<slug>`) should stay unique so PRs don't collide.
4. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` locally before opening
   a PR — this is exactly what CI will re-run, so catching failures early
   saves a round trip.
5. Fill in the PR template checklist (added automatically when you open a
   PR on GitHub).

## CI/CD — what has to pass before merge

Every PR against `main` runs three required GitHub Actions checks (see
`.github/workflows/ci.yml`): **Lint & type-check**, **Unit tests**, and
**Build**. All three must be green before merge — this is enforced as a
branch protection rule on `main`, so GitHub will block the merge button
until they pass, regardless of who (or which agent) opened the PR.

Once CI passes, check the PR's Vercel Preview Deployment (Vercel comments
the link automatically) before approving — that's the Review/QA step
described in CLAUDE.md.

## Code review

PRs need at least one approving review before merge. Feel free to review
each other's PRs (or have a dedicated review agent do a first pass per
CLAUDE.md's "Review/QA agent" role) — a human should still approve before
anything merges to `main`.
