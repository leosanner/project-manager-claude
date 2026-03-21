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
    page.tsx                # Landing page (public)
    components/landing/     # Landing page section components
    (auth)/
    (dashboard)/
      calendar/             # Calendar page with monthly grid
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

- `src/app/page.tsx` — landing page (composes section components from `components/landing/`)
- `src/app/layout.tsx` — root layout, sets fonts and global metadata
- `src/app/(dashboard)/layout.tsx` — dashboard layout (server component, passes session to Navbar)
- `src/app/(dashboard)/components/navbar.tsx` — popup-style navbar with pencil logo, nav links, theme toggle, sign-out (client component, uses Motion)
- `src/app/(dashboard)/dashboard/page.tsx` — dashboard page (project list)
- `src/app/(dashboard)/dashboard/actions.ts` — server actions for project CRUD
- `src/lib/auth/session.ts` — server-side session helper (`getSessionOrThrow`)
- `src/lib/db/projects.ts` — project data access layer (CRUD queries)
- `src/lib/db/features.ts` — feature + document data access layer (includes `getUserFeaturesWithDueDates`)
- `src/app/(dashboard)/calendar/page.tsx` — calendar page (server component)
- `src/app/(dashboard)/calendar/components/month-calendar.tsx` — month grid calendar (client component)
- `src/app/(dashboard)/projects/[id]/page.tsx` — project detail page (feature list)
- `src/app/(dashboard)/projects/[id]/actions.ts` — server actions for feature CRUD + document save
- `src/app/(dashboard)/projects/[id]/features/[featureId]/page.tsx` — feature detail page with markdown editor
- `src/app/globals.css` — global styles
- `next.config.ts` — Next.js config

## Development Approach

- **TDD** with Jest
- Server Actions for mutations (project CRUD in `dashboard/actions.ts`, feature CRUD in `projects/[id]/actions.ts`)
- API routes under `src/app/api/` for external integrations
- Business logic in `src/lib/` (db, auth, ai, calendar)
