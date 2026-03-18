# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Initial project scaffold with Next.js 16, React 19, Tailwind CSS v4, TypeScript
- Project brainstorm and documentation structure (`brainstorm.md`, `project_spec.md`, `docs/`)
- Docker Compose with Postgres 16 for local development; configurable via `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` env vars
- `.env.example` documenting all environment variables
- `db:up`, `db:down`, `db:logs` npm scripts
- Jest configured with `next/jest` SWC transformer, `@testing-library/react`, and `@testing-library/jest-dom`
- `waitForDb` utility that checks TCP connectivity to the DB before the test suite runs (Jest `globalSetup`)
- `test` and `test:watch` npm scripts
- Prisma 7 schema (`prisma/schema.prisma`) with Better Auth tables and app models; client generated to `src/generated/prisma`
- Prisma singleton client (`src/lib/db/prisma.ts`) using `@prisma/adapter-pg`
- Better Auth with Google OAuth and Prisma adapter (`src/lib/auth/auth.ts`)
- Auth catch-all API route for Next.js App Router (`src/app/api/auth/[...all]/route.ts`)
- `dev` script now resets volumes and starts a fresh DB on every run (`docker compose down -v && up -d && wait-for-db && next dev`)
- `scripts/wait-for-db.ts` runner used in the dev flow
- `.env.example` updated with `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- GitHub Actions workflow to run Jest tests on push and pull requests to `main`
- GitHub Actions workflow to run ESLint on push and pull requests to `main`

- Better Auth client-side instance (`src/lib/auth/auth-client.ts`) with `createAuthClient` from `better-auth/react`
- Sign-in page (`src/app/(auth)/signin/page.tsx`) with "Sign in with Google" button using `signIn.social`
- Auth middleware (`src/middleware.ts`) protecting `/dashboard` routes and redirecting authenticated users from `/signin`
- Tests for auth client, sign-in page component, and middleware (17 tests)
- `@testing-library/user-event` dev dependency for simulating user interactions in tests

### Changed
- Upgraded auth middleware to validate sessions server-side via `auth.api.getSession()` instead of cookie-only check
- Updated middleware tests to mock `auth.api.getSession` and `next/headers`

### Security
- Added security headers to `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`

### Fixed
- Added Postgres service container with `pg_isready` health check to CI test workflow
- Converted `jest.config.js` from CommonJS to ESM to fix lint error
- Overrode `next/jest` `transformIgnorePatterns` to allow Better Auth and its ESM dependencies (`@better-auth`, `nanostores`, `nanoevents`) through the Jest transform
