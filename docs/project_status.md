# Project Status

## Current Phase

**Phase 1 — Infrastructure Setup**

Core infrastructure is being established: local DB, testing, and auth/ORM configuration.

## Completed

- [x] Project brainstorm (`brainstorm.md`)
- [x] Project spec (`project_spec.md`)
- [x] Architecture doc (`docs/architecture.md`)
- [x] Next.js 16 scaffold with React 19, Tailwind CSS v4, TypeScript
- [x] Docker Compose for local PostgreSQL (configurable via env vars)
- [x] Jest configured with Next.js SWC transformer + `@testing-library/react`
- [x] DB connectivity check (`waitForDb`) wired into Jest `globalSetup`
- [x] `.env.example` documenting all environment variables

## Completed (continued)

- [x] Prisma 7 schema with Better Auth tables + app models (project, feature, feature_document, calendar_event)
- [x] Prisma singleton client (`src/lib/db/prisma.ts`) using `@prisma/adapter-pg`
- [x] Better Auth configured with Prisma adapter and Google OAuth (`src/lib/auth/auth.ts`)
- [x] Auth catch-all API route (`src/app/api/auth/[...all]/route.ts`)
- [x] `dev` script resets DB on each start (fresh state guaranteed)
- [x] `scripts/wait-for-db.ts` runner for the dev flow
- [x] GitHub Actions CI: test workflow (`npm test` on push/PR to main) with Postgres service container and `pg_isready` health check
- [x] GitHub Actions CI: lint workflow (`npm run lint` on push/PR to main)

## Completed (auth UI)

- [x] Better Auth client-side instance (`src/lib/auth/auth-client.ts`) using `better-auth/react`
- [x] Sign-in page with Google OAuth button (`src/app/(auth)/signin/page.tsx`)
- [x] Auth middleware for route protection (`src/middleware.ts`) — redirects unauthenticated users to `/signin`, authenticated users away from `/signin`
- [x] Tests for auth client, sign-in page, and middleware (17 tests passing)
- [x] Jest config updated to transform Better Auth ESM dependencies
- [x] Middleware upgraded to server-side session validation via `auth.api.getSession()` (replaces cookie-only check)
- [x] Security headers added to `next.config.ts` (X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy)

## In Progress

## Pending

- [ ] Project CRUD
- [ ] Feature CRUD
- [ ] Markdown editor integration
- [ ] Audio recording + Whisper transcription
- [ ] LangGraph AI pipeline
- [ ] Calendar view
- [ ] Google Calendar sync

## Open Questions

| Question | Status |
|---|---|
| Markdown editor library choice | Undecided |
| Real-time preview vs split view | Undecided |
| Level of GitHub Markdown compatibility required | Undecided |
| Calendar sync strategy (push vs pull) | Undecided |
| Feature-to-event mapping rules | Undecided |
| Status enum definitions (projects + features) | Defined in schema: `ProjectStatus`, `FeatureStatus`, `FeaturePriority`, `CalendarSyncStatus` |
| Dashboard design | Undecided |
| Navigation structure | Undecided |

## Known Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Markdown editor UX complexity | High | Evaluate existing libraries early |
| Whisper + LangGraph output quality | Medium | Prototype pipeline before full integration |
| Google Calendar sync reliability | Medium | Add sync status tracking + retry logic |
| MVP scope creep | High | Strict prioritization against MVP checklist |
| TDD in full-stack context | Medium | Define testing boundaries early (unit vs integration) |
