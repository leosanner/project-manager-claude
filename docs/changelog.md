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

### Fixed
- Added Postgres service container with `pg_isready` health check to CI test workflow
- Converted `jest.config.js` from CommonJS to ESM to fix lint error
