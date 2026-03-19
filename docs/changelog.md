# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Left sidebar navigation component (`src/components/sidebar.tsx`) with user avatar, nav links, sign-out, and mobile slide-in toggle
- Dropdown menu shadcn component (`src/components/ui/dropdown-menu.tsx`)
- Search input and notification bell placeholders in top header
- "View Calendar" button on dashboard page
- Progress bar on project cards showing status-based completion
- 3-dot dropdown menu on project cards (replaces hover-reveal edit/delete buttons)
- Status icon circle on project cards (folder, checkmark, archive icons)
- Allowed Google profile image domain (`lh3.googleusercontent.com`) in `next.config.ts`

### Changed
- Restructured dashboard layout from top-only header to sidebar + simplified top bar
- Dashboard heading changed from "Welcome back, {name}" to "Project Dashboard"
- Dashboard subtitle simplified to active project count
- Removed stats bar section from dashboard page
- Project cards redesigned: removed colored left border, merged badge + feature count into subtitle line
- Content area offset by sidebar width on large screens, full-width on mobile
- Moved sign-out from top header to sidebar bottom section

### Fixed
- Updated dashboard page tests to match redesigned UI (welcome heading, multiple New Project buttons, capitalized status labels)

### Added
- Calendar page (`/calendar`) with monthly grid view showing features on their due dates
- `MonthCalendar` client component with prev/next/today navigation, status-colored feature chips, and overflow indicator
- `CalendarFeature` type for serialized calendar data (`src/types/feature.ts`)
- `getUserFeaturesWithDueDates` query fetching all features with due dates across projects (`src/lib/db/features.ts`)
- Dashboard and Calendar nav links in the dashboard header

### Added
- Due date field (optional) in create feature dialog, stored as `endDate` on the Feature model
- Due date display on feature cards with smart formatting (overdue in red, countdown for upcoming)
- Colored left accent stripe on project and feature cards based on status

### Changed
- Redesigned dashboard layout with sticky header, backdrop blur, brand icon, and wider container
- Redesigned dashboard page with personalized greeting, project stats bar, and improved empty state
- Enhanced project cards with hover lift/shadow transitions, reveal-on-hover actions, and arrow indicator
- Added `variant` prop to `CreateProjectButton` for inline usage in empty state
- Applied dashboard design polish to project detail page (larger heading, improved empty state, wider grid)
- Applied dashboard design polish to feature cards (hover effects, reveal-on-hover actions, arrow indicator)
- Shifted accent color to deeper navy blue (`#1e3a5f` light / `#4a90d9` dark)
- Increased header height, logo size, and card padding/title size across dashboard and project pages
- Upgraded Card component with shadow tokens and hover transitions
- Switched fonts from Inter/JetBrains Mono to Roboto/Roboto Mono
- Increased base font size to 16.5px
- Added card border using `border-border-default` instead of subtle ring
- Added shadow token system (`shadow-card`, `shadow-card-hover`, `shadow-header`) with light/dark variants via CSS custom properties and Tailwind v4 `@utility`

### Added
- Feature data access layer with ownership-scoped queries (`src/lib/db/features.ts`)
- Feature types `FeatureSummary` and `FeatureDetail` (`src/types/feature.ts`)
- Server Actions for feature create, rename, delete, and document save (`src/app/(dashboard)/projects/[id]/actions.ts`)
- Project detail page with feature grid, back link, and empty state (`src/app/(dashboard)/projects/[id]/page.tsx`)
- Feature card component with inline rename, delete dialog, and status/priority badges
- Create feature dialog component
- Feature detail page with breadcrumb navigation
- Feature header with inline title editing and delete with server-side redirect
- GitHub-style markdown editor using `@uiw/react-md-editor` with dirty tracking and save button
- Not-found pages for project and feature routes
- `@uiw/react-md-editor` dependency

### Changed
- Project card now links to project detail page (`/projects/:id`)
- Feature delete uses server-side `redirect()` instead of client-side `router.push()` to avoid Next.js re-render race condition
- Updated `CLAUDE.md` with new key files and updated development approach

### Added (previous)
- Dashboard layout with header, user greeting, theme toggle, and sign-out button (`src/app/(dashboard)/layout.tsx`)
- Dashboard page displaying project grid with empty state (`src/app/(dashboard)/dashboard/page.tsx`)
- Server Actions for project CRUD: create, rename, delete (`src/app/(dashboard)/dashboard/actions.ts`)
- Create project dialog component (`create-project-button.tsx`)
- Project card component with inline rename and delete confirmation dialog (`project-card.tsx`)
- Server-side session helper (`src/lib/auth/session.ts`)
- Project data access layer with authorization-scoped queries (`src/lib/db/projects.ts`)
- `ProjectSummary` type for serialized project data (`src/types/project.ts`)
- Sign-out button component (`src/app/(dashboard)/components/sign-out-button.tsx`)
- Tests for data access, server actions, dashboard page, and UI components (11 new tests)

### Fixed
- Added post-TCP settling delay in `wait-for-db.ts` to prevent Prisma migration failures when Postgres is still initializing

### Changed
- Updated `/commit` command to also check and update `CLAUDE.md` during documentation step
- Updated `CLAUDE.md` with new key files and Server Actions development approach

### Fixed
- Fixed stale cookie redirect loop: middleware now validates sessions via `fetch()` to `/api/auth/get-session` instead of only checking cookie presence; stale cookies are deleted automatically
- Fixed "Failed to get session" crash on `/signin` by replacing DB-dependent `auth.api.getSession()` with Edge-compatible cookie check in middleware
- Removed invalid `runtime: "nodejs"` from middleware config (not a valid Next.js middleware option)
- Added explicit `baseURL` to auth client to prevent API discovery issues

### Changed
- Automated Prisma migrations in `dev` (runs `prisma migrate dev`) and `build` (runs `prisma migrate deploy`) scripts
- Simplified middleware tests to use cookie-based auth simulation instead of mocking `next/headers` and `auth` internals

### Added
- Initial Prisma migration (`prisma/migrations/20260318215551_init`)
- GitHub-inspired design token system with full light/dark color palettes in CSS custom properties
- Dark mode infrastructure via `next-themes` with class-based toggling, system preference detection, and persisted state
- `ThemeProvider` component (`src/components/theme-provider.tsx`)
- `ThemeToggle` component (`src/components/theme-toggle.tsx`) with light/dark/system modes using Lucide icons
- Branding brainstorm document (`branding-brainstorm.md`) defining visual direction, color system, typography, and component specs
- Tailwind v4 `@theme inline` registration for all design tokens (backgrounds, text, borders, accent, semantic colors, radius)
- `lucide-react` and `next-themes` dependencies
- Initialized shadcn/ui with Tailwind v4 CSS variables support (`components.json`)
- `cn()` utility function (`src/lib/utils.ts`) using `clsx` and `tailwind-merge`
- Core shadcn components: Button, Input, Card, Table, Tabs, Dialog, Badge (`src/components/ui/`)
- Design system documentation split into `docs/design-system/`: principles, colors, typography, spacing-layout, components

### Removed
- Deleted `brainstorm.md` (content preserved in `project_spec.md`)
- Deleted `branding-brainstorm.md` (content split into `docs/design-system/`)

### Changed
- Migrated sign-in page to use design tokens and shadcn `Button` component
- Replaced boilerplate home page with branded placeholder including `ThemeToggle`
- Mapped brand design tokens into shadcn variable names for component compatibility
- Renamed custom accent utilities to `--color-brand-*` to avoid shadcn naming collisions
- Replaced Geist/Geist Mono fonts with Inter (sans) and JetBrains Mono (mono)
- Rewrote `globals.css` from minimal boilerplate to full design token system
- Wrapped app layout with `ThemeProvider` for dark mode support

### Added (previous)
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
