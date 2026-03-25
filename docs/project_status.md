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
- [x] Middleware uses `__Secure-` prefixed cookie name in production to match Better Auth's behavior
- [x] Prisma migrations initialized and automated in `dev` and `build` scripts
- [x] Security headers added to `next.config.ts` (X-Frame-Options, HSTS, nosniff, Referrer-Policy, Permissions-Policy)

## Completed (design system foundation)

- [x] GitHub-inspired design token system in CSS custom properties (light + dark mode)
- [x] Fonts: Roboto (sans) + Roboto Mono (mono) via `next/font/google`
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

## Completed (feature CRUD & markdown editor)

- [x] Feature data access layer with ownership-scoped queries (`src/lib/db/features.ts`)
- [x] Feature types (`FeatureSummary`, `FeatureDetail`) in `src/types/feature.ts`
- [x] Server Actions for feature create, rename, delete, and document save (`src/app/(dashboard)/projects/[id]/actions.ts`)
- [x] Project detail page with feature grid and empty state (`src/app/(dashboard)/projects/[id]/page.tsx`)
- [x] Feature card component with inline rename, delete dialog, status/priority badges (`feature-card.tsx`)
- [x] Create feature dialog (`create-feature-button.tsx`)
- [x] Project card now links to project detail page
- [x] Feature detail page with breadcrumb navigation (`src/app/(dashboard)/projects/[id]/features/[featureId]/page.tsx`)
- [x] Feature header with inline title editing and delete with server-side redirect (`feature-header.tsx`)
- [x] GitHub-style markdown editor using `@uiw/react-md-editor` with dirty tracking and save (`feature-editor.tsx`)
- [x] Not-found pages for project and feature routes
- [x] `@uiw/react-md-editor` dependency added

## Completed (dashboard design redesign)

- [x] Redesigned dashboard layout: sticky header with backdrop blur, brand icon, wider container (`max-w-6xl`)
- [x] Redesigned dashboard page: personalized greeting, project/active stats bar, improved empty state
- [x] Enhanced project cards: hover lift/shadow, reveal-on-hover action buttons, arrow link indicator
- [x] Added shadow token system with light/dark variants (`shadow-card`, `shadow-card-hover`, `shadow-header`)
- [x] Switched fonts to Roboto/Roboto Mono, increased base font size
- [x] Card component updated with border and hover transitions
- [x] Deeper navy blue accent color, larger header/cards, colored status accent stripes
- [x] Project detail page redesigned with same polish as dashboard
- [x] Feature cards with hover effects, status accent stripes, reveal-on-hover actions
- [x] Due date field added to feature creation (optional, uses existing `endDate` schema field)
- [x] Feature cards display due date with smart formatting (overdue/today/countdown)

## Completed (calendar view)

- [x] Calendar page route (`/calendar`) with monthly grid showing features by due date
- [x] `MonthCalendar` client component with month navigation, priority-colored chips, overflow, and legend
- [x] `getUserFeaturesWithDueDates` data access query (`src/lib/db/features.ts`)
- [x] `CalendarFeature` type (`src/types/feature.ts`)
- [x] Dashboard and Calendar nav links added to dashboard header

## Completed (feature card enhancements)

- [x] Interactive importance/priority selector on feature cards (color-coded: emerald/amber/orange/red)
- [x] `updateFeaturePriority` query + `updateFeaturePriorityAction` server action

## Completed (calendar visual redesign)

- [x] Redesigned calendar with dark sleek aesthetic (Stitch "Octo Slate Calendar" reference)
- [x] Taller cells, pill-shaped priority-colored chips with borders, today accent bar
- [x] Navigation grouped in contained pill, legend with uppercase tracking
- [x] Removed separate page header; month/year is hero heading

## Completed (navbar redesign & orange brand)

- [x] Popup-style navbar with pencil logo, animated menu panel (Motion/framer-motion)
- [x] Navigation, theme toggle, user info, sign-out moved into popup panel
- [x] Brand accent color shifted from navy blue to burnt orange (light: `#c2410c`, dark: `#f97316`)
- [x] Chart color tokens updated to orange/amber hues

## Completed (viewport-fit calendar & feature page redesign)

- [x] Calendar fits entirely within viewport (dynamic 5/6 row grid, flexible cell heights)
- [x] Feature detail page redesigned: viewport-filling markdown editor, modern header with status/priority pills, chevron breadcrumb
- [x] MDEditor toolbar enlarged (32px buttons, 16px icons) with app-matched styling
- [x] Dashboard layout padding reduced (`py-10` → `py-6`) for more content space

## Completed (sign-in page redesign)

- [x] Sign-in page redesigned with card layout, Google icon SVG, Motion stagger animations, and ambient brand glow

## Completed (landing page)

- [x] Landing page with 8 sections: navbar, hero, features, how-it-works, editor showcase, voice AI showcase, CTA, footer
- [x] 11 component files in `src/app/components/landing/`
- [x] Mock editor and animated waveform components
- [x] Motion scroll-triggered reveal animations
- [x] Light/dark theme support via CSS design tokens
- [x] Responsive layout with mobile hamburger menu
- [x] Landing CSS utilities: `text-gradient-brand`, `dot-grid`, `shadow-ember`, `animate-float`
- [x] Updated root metadata (title + description)

## Completed (loading pages)

- [x] Skeleton shimmer animation utilities (`skeleton`, `skeleton-text`) in `globals.css` with brand-tinted ember glow
- [x] Loading page for dashboard (`src/app/(dashboard)/dashboard/loading.tsx`)
- [x] Loading page for calendar (`src/app/(dashboard)/calendar/loading.tsx`)
- [x] Loading page for project detail (`src/app/(dashboard)/projects/[id]/loading.tsx`)
- [x] Loading page for feature editor (`src/app/(dashboard)/projects/[id]/features/[featureId]/loading.tsx`)
- [x] Loading page for auth/sign-in (`src/app/(auth)/loading.tsx`)

## Completed (voice-to-markdown AI pipeline)

- [x] Audio recording via browser MediaRecorder API (`use-audio-recorder.ts` hook)
- [x] OpenAI Whisper transcription integration (`src/lib/ai/transcription.ts`)
- [x] LangChain structuring pipeline — raw text → organized markdown with sections (`src/lib/ai/structuring.ts`)
- [x] API route `POST /api/ai/transcribe-and-structure` with auth, validation, and pipeline orchestration
- [x] Recording dialog component with animated pipeline states (idle → recording → processing → done/error)
- [x] Integration into feature editor toolbar — mic button appends generated markdown to document
- [x] Tests for transcription, structuring, and API route (11 new tests, 71 total)
- [x] Dependencies: `openai`, `@langchain/core`, `@langchain/openai`
- [x] Fixed `Permissions-Policy` header blocking microphone (`microphone=()` → `microphone=(self)`)
- [x] Fixed recording state race condition (pipeline state now gated on actual recording success)
- [x] Added `navigator.mediaDevices` availability check and specific error messages for common failures

## Completed (per-user OpenAI API key)

- [x] `encryptedOpenAIKey` column added to User model with Prisma migration
- [x] AES-256-GCM encryption utility for API key storage (`src/lib/crypto.ts`)
- [x] User settings data access layer (`src/lib/db/user-settings.ts`)
- [x] AI modules refactored to accept per-user API key parameter
- [x] API route fetches user's decrypted key; returns error if missing/invalid
- [x] Settings page (`/settings`) with save, update, remove API key
- [x] Settings nav item added to navbar
- [x] Audio recording dialog shows warning + link to Settings when no key configured
- [x] Skeleton loading page for settings
- [x] `API_KEY_ENCRYPTION_SECRET` env var added to `.env.example`

## Completed (misc polish)

- [x] STT language recognition: structured markdown output now preserves the spoken language (detected via Whisper `verbose_json`)
- [x] Enforced 30-char max length on project/feature names (client + server validation, display truncation, action buttons always visible)
- [x] Delete project button on project detail page with confirmation dialog and redirect to dashboard
- [x] Removed navbar bottom border for cleaner page separation
- [x] Enlarged navbar popup menu items (larger padding, icons, panel width) for better usability
- [x] Dashboard stats bar shows total projects, total features, and next upcoming feature
- [x] `getTotalFeatureCount` and `getNextUpcomingFeature` queries added to features data access
- [x] User name in welcome greeting styled with brand color
- [x] Dashboard stats enlarged with bigger icons and bolder typography
- [x] Feature stats bar on project page with total count and per-status breakdown
- [x] Enlarged navbar (taller bar, bigger logo/title/menu button)
- [x] Button-style "Back to Dashboard" link on project page
- [x] Enlarged delete project button

## In Progress

- [ ] Conclude feature UI (green checkmark button on feature card) and project history section on project page

## Completed (better markdown experience)

- [x] Split feature detail into View page (default) and Edit page (`/edit` subroute)
- [x] Markdown viewer with `react-markdown`, `remark-gfm`, prose typography (`@tailwindcss/typography`)
- [x] Interactive checkboxes on view page — optimistic toggle with `toggleCheckboxAction` server action
- [x] View/Edit tab navigation component (pill-style toggle)
- [x] Edit page preserves existing editor experience unchanged

## Completed (deployment)

- [x] Added `postinstall` script (`prisma generate`) to ensure Prisma client exists on Vercel before build
- [x] Enabled SSL on Prisma database adapter for production environments
- [x] Fixed PrismaPg SSL config (moved to top-level `ssl` property)
- [x] Extracted `db:wait` script; `test` script now auto-starts DB; `db:up` resets volumes
- [x] Fixed CI test workflow: added `test:ci` script, `DATABASE_URL` env, and `prisma migrate deploy` step

## Pending

- [ ] Google Calendar sync

## Open Questions

| Question | Status |
|---|---|
| Markdown editor library choice | Decided: `@uiw/react-md-editor` (GitHub-style toolbar, write/preview toggle) |
| Real-time preview vs split view | Decided: write/preview toggle (built into `@uiw/react-md-editor`) |
| Level of GitHub Markdown compatibility required | Decided: GFM support via `remark-gfm` (bundled with editor) |
| Calendar sync strategy (push vs pull) | Undecided |
| Feature-to-event mapping rules | Undecided |
| Status enum definitions (projects + features) | Defined in schema: `ProjectStatus`, `FeatureStatus`, `FeaturePriority`, `CalendarSyncStatus` |
| Dashboard design | Implemented (project grid with cards) |
| Navigation structure | Implemented: Dashboard → Project → Feature (breadcrumb nav) |

## Known Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Markdown editor UX complexity | High | Mitigated: using `@uiw/react-md-editor` with built-in toolbar |
| Whisper + LangGraph output quality | Medium | Prototype pipeline before full integration |
| Google Calendar sync reliability | Medium | Add sync status tracking + retry logic |
| MVP scope creep | High | Strict prioritization against MVP checklist |
| TDD in full-stack context | Medium | Define testing boundaries early (unit vs integration) |
