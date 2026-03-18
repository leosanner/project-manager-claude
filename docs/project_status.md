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
- [x] Middleware switched to Edge-compatible cookie-based session check (fixes Edge Runtime crash with `pg` driver)
- [x] Middleware validates sessions via fetch to `/api/auth/get-session`; stale cookies are auto-deleted
- [x] Prisma migrations initialized and automated in `dev` and `build` scripts
- [x] Security headers added to `next.config.ts` (X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy)

## Completed (design system foundation)

- [x] GitHub-inspired design token system in CSS custom properties (light + dark mode)
- [x] Fonts: Inter (sans) + JetBrains Mono (mono) via `next/font/google`
- [x] Dark mode infrastructure with `next-themes` (class-based toggle, system preference, persisted state)
- [x] `ThemeProvider` component wrapping app layout
- [x] `ThemeToggle` component (light/dark/system) with Lucide icons
- [x] Tailwind v4 `@theme inline` registration for all design tokens

## Completed (component library)

- [x] shadcn/ui initialized with Tailwind v4 and CSS variables (`components.json`)
- [x] `cn()` utility (`src/lib/utils.ts`) with `clsx` + `tailwind-merge`
- [x] Core shadcn components: Button, Input, Card, Table, Tabs, Dialog, Badge
- [x] Brand tokens mapped into shadcn variable names (e.g. `--primary` → `--accent-primary`)
- [x] Custom brand utilities renamed to avoid shadcn collisions (`--color-brand-*`)

## Completed (page migration)

- [x] Sign-in page migrated to design tokens and shadcn `Button` component
- [x] Home page replaced with branded placeholder using `ThemeToggle`

## Completed (documentation)

- [x] Design system docs split into `docs/design-system/` (principles, colors, typography, spacing-layout, components)
- [x] Removed `brainstorm.md` and `branding-brainstorm.md` (content preserved in `project_spec.md` and `docs/design-system/`)

## Completed (dashboard & project CRUD)

- [x] Server-side session helper (`src/lib/auth/session.ts`)
- [x] Project data access layer with CRUD operations (`src/lib/db/projects.ts`)
- [x] Dashboard layout with header, user info, theme toggle, sign-out (`src/app/(dashboard)/layout.tsx`)
- [x] Dashboard page with project grid and empty state (`src/app/(dashboard)/dashboard/page.tsx`)
- [x] Server Actions for create, rename, and delete projects (`src/app/(dashboard)/dashboard/actions.ts`)
- [x] Create project dialog (`create-project-button.tsx`)
- [x] Project card with inline rename and delete confirmation (`project-card.tsx`)
- [x] Tests for data access, server actions, and UI components (11 new tests, 49 total)
- [x] `/commit` command updated to include CLAUDE.md in documentation checks

## In Progress

## Pending

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
| Dashboard design | Implemented (project grid with cards) |
| Navigation structure | Undecided |

## Known Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Markdown editor UX complexity | High | Evaluate existing libraries early |
| Whisper + LangGraph output quality | Medium | Prototype pipeline before full integration |
| Google Calendar sync reliability | Medium | Add sync status tracking + retry logic |
| MVP scope creep | High | Strict prioritization against MVP checklist |
| TDD in full-stack context | Medium | Define testing boundaries early (unit vs integration) |
