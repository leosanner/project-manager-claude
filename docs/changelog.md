# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Fixed
- Fixed `ProjectHistoryEventType` import in `src/lib/db/history.ts` — changed path from `@/generated/prisma` to `@/generated/prisma/client` to resolve Vercel build error
- Wired `createHistoryEvent` into `createFeatureAction` so feature creation events are now recorded in project history

### Changed
- Project History moved from inline timeline section to a popup dialog — "History" button with event count badge appears in the project page header next to "Create Feature"; same timeline content, now in a scrollable modal
- Redesigned history dialog rows with distinct per-event-type color system (sky blue for created, emerald for completed, red for deleted), colored left border accent, icon ring, pill badge label, and more padding; dialog widened to `sm:max-w-lg`; "load more" pagination added (10 events per page, resets on close)

### Added
- Conclude button (green `CheckCircle2Icon`) on feature cards — appears on hover between edit and delete, opens a confirmation dialog with emerald-styled submit button
- `concludeFeatureAction` server action wired to the conclude dialog form
- Project History timeline section on the project detail page — vertical timeline with event icons, labels, and dates; shows FEATURE_CREATED (neutral), FEATURE_CONCLUDED (emerald), and FEATURE_DELETED (red) events; only visible when history exists
- `getProjectHistory` fetched in parallel with features on the project page using `Promise.all`

### Added (previous)
- `ProjectHistoryEventType` enum and `ProjectHistoryEvent` model to Prisma schema; migration `20260325170728_add_project_history`
- `src/lib/db/history.ts` with `createHistoryEvent` and `getProjectHistory` data access functions
- `concludeFeature` DB function in `src/lib/db/features.ts` — hard-deletes a feature and logs a `FEATURE_CONCLUDED` history event in a single transaction
- `concludeFeatureAction` server action in project actions file
- History logging on `createFeature` (`FEATURE_CREATED`) and `deleteFeature` (`FEATURE_DELETED`) using Prisma `$transaction`

### Changed
- `createFeature` and `deleteFeature` now run inside `prisma.$transaction` to atomically write history events alongside the main operation

### Added (previous)
- `getTotalFeatureCount` and `getNextUpcomingFeature` data access queries in `src/lib/db/features.ts`
- Dashboard stats bar now shows total features count and next upcoming feature with relative due date
- Next upcoming feature title links directly to its feature page
- `formatRelativeDate` helper for friendly date labels (Today, Tomorrow, in X days/weeks)
- Feature stats bar on project detail page showing total count and per-status breakdown (Planned, In Progress, Done, Cancelled)

### Changed
- Removed bottom border line between navbar and page content for cleaner visual flow
- Enlarged navbar popup menu buttons with increased padding and icon sizes for better touch targets
- Widened navbar popup panel from 280px to 300px to accommodate larger button sizing
- Increased theme switcher button padding for consistency with other menu items
- Enlarged dashboard stats bar with bigger icons, bolder numbers, and more spacing
- User's first name in welcome greeting now displays in brand color
- Dashboard data fetching now uses `Promise.all` for parallel queries
- Replaced active project count stat with total features and next upcoming feature stats
- Enlarged navbar height, logo icon, title text, and menu button for better visual presence
- Upgraded "Back to Dashboard" link on project page to a button-style element with border and hover effects
- Enlarged delete project button from `icon-sm` to `icon-lg` size

### Added
- Delete project button on project detail page with confirmation dialog and redirect to dashboard
- `deleteProjectFromPageAction` server action in project actions with post-delete redirect
- `DeleteProjectButton` client component (`projects/[id]/components/delete-project-button.tsx`)
- Enforced 30-character max length on project names and feature titles (client-side `maxLength` + server-side validation)
- Text truncation with ellipsis on project/feature card titles and feature header to handle long names gracefully
- `shrink-0` on card action buttons and feature header delete container to prevent buttons disappearing with long names

### Changed
- Structured markdown output now matches the spoken language instead of always defaulting to English
- Whisper transcription uses `verbose_json` response format to detect spoken language (ISO-639-1 code)
- Structuring prompt instructs LLM to write and translate section headers in the detected language

### Added
- Added `react-markdown`, `remark-gfm`, `rehype-raw` dependencies for structured markdown rendering
- Added `@tailwindcss/typography` plugin for prose-styled markdown views
- Added View/Edit tab navigation component (`feature-page-nav.tsx`) for switching between markdown view and edit pages
- Added markdown viewer component (`feature-viewer.tsx`) with `react-markdown` rendering, prose typography, and interactive checkboxes
- Added `toggleCheckboxAction` server action for persisting checkbox state from the view page
- Split feature detail into View page (default at `/features/[featureId]`) and Edit page (`/features/[featureId]/edit`)

### Fixed
- Fixed checkbox toggle not working: replaced index counter with hast node line position to avoid React Strict Mode double-render counter corruption
- Fixed checkbox toggle crashing with "Cannot update component while rendering" by moving server action call outside React state updater

### Added
- Per-user OpenAI API key management: users provide their own key instead of a shared server-side key
- Settings page (`/settings`) with encrypted API key save, update, and remove
- AES-256-GCM encryption utility (`src/lib/crypto.ts`) for secure API key storage
- User settings data access layer (`src/lib/db/user-settings.ts`)
- Warning in audio recording dialog when no API key is configured, with link to Settings
- Settings link in navbar navigation
- Skeleton loading page for settings route
- `API_KEY_ENCRYPTION_SECRET` environment variable for key encryption

### Changed
- AI modules (`transcription.ts`, `structuring.ts`) now accept per-user API key parameter instead of reading from environment
- API route `/api/ai/transcribe-and-structure` fetches user's encrypted key and returns clear error if missing or invalid
- Removed server-side `OPENAI_API_KEY` environment variable (each user provides their own)

### Fixed
- Fixed microphone not recording: `Permissions-Policy` header blocked microphone access site-wide; changed `microphone=()` to `microphone=(self)` in `next.config.ts`
- Fixed recording dialog showing "Recording" state even when microphone access failed; `handleStartRecording` now checks `startRecording()` return value before transitioning pipeline state
- Added explicit `navigator.mediaDevices` availability check with clear error message for non-secure contexts
- Improved audio recorder error messages: specific feedback for permission denied, no microphone found, and other errors

### Added
- Voice-to-markdown AI pipeline: record audio, transcribe via OpenAI Whisper, structure into organized markdown via LangChain
- Audio recording dialog component with animated pipeline states (idle, recording, processing, done, error) using Motion
- `useAudioRecorder` custom hook wrapping browser MediaRecorder API with timer, permissions handling, and cleanup
- `transcribeAudio` function in `src/lib/ai/transcription.ts` using OpenAI Whisper API
- `structureTranscription` function in `src/lib/ai/structuring.ts` using LangChain (ChatOpenAI + prompt template)
- `POST /api/ai/transcribe-and-structure` API route with auth, file validation, and pipeline orchestration
- Mic button in feature editor toolbar that appends AI-generated markdown to existing document content
- `openai`, `@langchain/core`, `@langchain/openai` dependencies
- Tests for transcription, structuring, and API route (11 new tests)

### Added
- Skeleton loading pages for all async routes: dashboard, calendar, project detail, feature editor, and auth sign-in
- `skeleton` and `skeleton-text` CSS utilities with brand-tinted ember shimmer animation and staggered delays
- Loading skeletons match exact page layouts for seamless loading-to-loaded transitions

### Added
- Landing page with 8 sections: navbar, hero, features grid, how-it-works timeline, editor showcase, voice AI showcase, CTA, footer
- 11 landing components in `src/app/components/landing/` (landing-navbar, hero-section, features-section, how-it-works-section, editor-showcase-section, voice-showcase-section, cta-section, landing-footer, mock-editor, mock-waveform, section-reveal)
- Mock split-pane markdown editor component with toolbar, edit/preview panes
- Animated SVG waveform component with 24 oscillating bars using Motion
- Scroll-triggered reveal animations via `SectionReveal` wrapper using `whileInView`
- Landing CSS utilities: `text-gradient-brand`, `dot-grid`, `shadow-ember`, `animate-float`
- Floating status cards with CSS bounce animation on hero and voice sections
- Mobile hamburger menu with Motion slide-down animation on landing navbar

### Fixed
- Added global `cursor: pointer` for all interactive elements (buttons, links, selects, checkboxes, radio inputs)

### Changed
- Redesigned sign-in page with Google icon SVG, card layout, Motion stagger animations, ambient brand glow, and "Back to home" link
- Replaced "Coming soon" placeholder at `/` with full landing page
- Updated root layout metadata: title to "Project Manager — Ship Features Faster" with proper description
- Redesigned feature detail page with viewport-filling layout: breadcrumb, header, and editor fill the screen
- Replaced feature header badges with custom status/priority pills (color-coded with icons: CircleDot, Flag, Calendar)
- Feature editor now expands to fill all remaining viewport space instead of fixed 500px height
- Wrapped editor in rounded card container with custom toolbar (Document label, unsaved/saved indicators, save button with icon)
- Replaced breadcrumb `/` separators with chevron icons and removed redundant "Back to Project" link
- Moved delete button to right side of feature title row
- Calendar grid now uses dynamic row count (5 or 6 rows) based on month, with flexible cell heights to fit viewport
- Reduced dashboard layout padding from `py-10` to `py-6` for more vertical content space
- Enlarged MDEditor toolbar buttons from 20px to 32px with 16px icons, 8px border-radius, and app-matched color tokens

### Added
- MDEditor CSS overrides in `globals.css` for full-height rendering and styled toolbar
- Popup-style navbar component (`navbar.tsx`) with animated menu panel using Motion (framer-motion)
- Pencil logo icon replacing the grid icon in the header
- Staggered reveal animations for nav items, theme switcher, and sign-out in the popup panel
- `motion` (framer-motion) dependency

### Changed
- Replaced inline header markup in dashboard layout with dedicated `Navbar` client component
- Slimmed header height from `h-20` to `h-14` with frosted glass backdrop blur
- Active page shown as a compact pill badge next to the menu button
- Navigation, theme toggle, user info, and sign-out now live inside a popup panel (click to open)
- Shifted brand accent color from navy blue (`#1e3a5f` / `#4a90d9`) to burnt orange (`#c2410c` / `#f97316`)
- Updated chart color tokens from blue hues (~250°) to orange/amber hues (~30-55°)

### Changed
- Redesigned calendar with dark sleek aesthetic inspired by Stitch "Octo Slate Calendar" design
- Taller calendar cells (`min-h-[140px]`), uppercase day headers with wide letter-spacing
- Feature chips now pill-shaped (`rounded-full`) with colored borders matching priority
- Today indicator changed from filled circle to brand-tinted cell background with bottom accent bar
- Outside-month days use opacity instead of background tint
- Navigation controls grouped in a contained pill element with prev/today/next
- Legend moved outside calendar card with uppercase bold styling and wide tracking
- Calendar container uses `rounded-xl` with deep shadow
- Removed separate page header (icon + title); month/year is now the hero heading
- Changed calendar feature chips to use priority-based colors (emerald/amber/orange/red) instead of status-based colors
- Updated calendar legend to show importance levels (Low/Medium/High/Critical) instead of statuses
- Added colored dot indicator to calendar feature chips for quick visual scanning

### Added
- Interactive importance/priority selector on feature cards with color-coded dropdown (emerald/amber/orange/red)
- `updateFeaturePriority` data access query and `updateFeaturePriorityAction` server action

### Changed
- Removed `overflow-hidden` from Card component base styles to allow dropdowns to render outside card bounds
- Replaced static priority and status badges on feature cards with interactive importance selector

### Fixed
- Fixed Roboto font not loading: added explicit weights and moved font CSS variable classes from `<body>` to `<html>` so the `font-sans` rule on `html` can resolve them

### Fixed
- Fixed middleware cookie name mismatch in production: Better Auth uses `__Secure-` prefixed cookie names over HTTPS, but middleware was hardcoded to the non-prefixed name
- Fixed CI test workflow port conflict by using `test:ci` script that skips Docker Compose (service container already provides Postgres)
- Added `DATABASE_URL` env var and `prisma migrate deploy` step to CI test workflow
- Added `postinstall` script to run `prisma generate` after `npm install`, fixing Vercel deployment where generated Prisma client was missing
- Enabled SSL on Prisma database adapter in production (`NODE_ENV === "production"`)
- Moved SSL config from nested `options.ssl` to top-level `ssl` property on PrismaPg adapter

### Added
- `test:ci` npm script for CI environments (skips Docker Compose, uses existing DB)

### Changed
- Extracted `db:wait` npm script for reuse across `dev` and `test` commands
- `test` script now auto-starts and waits for the database before running Jest
- `db:up` script now resets volumes before starting containers (consistent fresh state)
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
