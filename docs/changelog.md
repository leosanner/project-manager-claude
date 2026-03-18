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
