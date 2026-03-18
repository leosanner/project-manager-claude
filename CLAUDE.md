# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Documentation

- [`project_spec.md`](./project_spec.md) — full requirements, API specs, entities, tech stack
- [`docs/architecture.md`](./docs/architecture.md) — system design, data flow, directory structure
- [`docs/project_status.md`](./docs/project_status.md) — current progress, open questions, risks
- [`docs/changelog.md`](./docs/changelog.md) — version history

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Next.js)                 │
│  React 19 + App Router + Tailwind CSS v4            │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / Server Actions
┌────────────────────▼────────────────────────────────┐
│               Next.js API Routes                     │
│  Auth │ Projects │ Features │ Documents │ Calendar   │
└──┬─────────┬──────────────────────┬─────────────────┘
   │         │                      │
   ▼         ▼                      ▼
Google    Prisma                AI Service
OAuth     (ORM)               (Whisper + LangGraph)
          │
          ▼
       Neon DB
     (PostgreSQL)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript |
| Auth | Better Auth + Google OAuth |
| Database | Neon (PostgreSQL) + Prisma ORM |
| AI / Audio | OpenAI Whisper (transcription), LangGraph (Markdown structuring) |
| Testing | Jest (TDD) |

### Layers

| Layer | Location |
|---|---|
| Interface | `src/app/` — pages and components |
| Application / Use Cases | `src/lib/` — business logic |
| Data Access | `src/lib/db/` — Prisma client and queries |
| External Integrations | `src/lib/auth/`, `src/lib/ai/`, `src/lib/calendar/` |

### Planned directory structure

```
src/
  app/
    (auth)/
    (dashboard)/
      projects/[id]/features/[featureId]/
    api/
      auth/         # Better Auth handler
      projects/
      features/
      calendar/
  lib/
    db/             # Prisma client
    auth/           # Better Auth config
    ai/             # LangGraph pipelines
    calendar/       # Google Calendar client
  components/
    ui/
    editor/
    calendar/
  types/
prisma/
  schema.prisma
```

### Key files

- `src/app/layout.tsx` — root layout, sets fonts and global metadata
- `src/app/page.tsx` — home page (currently boilerplate)
- `src/app/globals.css` — global styles
- `next.config.ts` — Next.js config

## Development Approach

- **TDD** with Jest
- API routes under `src/app/api/`
- Business logic in `src/lib/` (db, auth, ai, calendar)
