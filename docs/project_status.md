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

## In Progress

- [ ] Prisma schema + client setup
- [ ] Better Auth with Google OAuth

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
| Status enum definitions (projects + features) | Undecided |
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
