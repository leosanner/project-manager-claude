# Architecture — Personal Project Management System

## 1. System Overview

Full-stack Next.js application with server-side API routes, a PostgreSQL database via Neon, and external integrations for Google OAuth, Google Calendar, and AI processing.

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Next.js)                 │
│  React 19 + App Router + Tailwind CSS v4 + next-themes│
└────────────────────┬────────────────────────────────┘
                     │ HTTP / Server Actions
┌────────────────────▼────────────────────────────────┐
│               Next.js API Routes                     │
│  Auth │ Projects │ Features │ Documents │ Calendar   │
└──┬─────────┬──────────────────────┬─────────────────┘
   │         │                      │
   ▼         ▼                      ▼
Google    Prisma                AI Service
OAuth     (ORM)               (Whisper + LangChain)
          │
          ▼
       Neon DB
     (PostgreSQL)
```

## 2. Layers

| Layer | Responsibility |
|---|---|
| **Interface** | React components, pages, UI state |
| **Application / Use Cases** | Business logic, orchestration |
| **Data Access** | Prisma queries, repository pattern |
| **External Integrations** | Google OAuth, Google Calendar API, OpenAI Whisper, LangGraph |

## 3. Modules

| Module | Description |
|---|---|
| `authentication` | Google OAuth login via Better Auth |
| `projects` | CRUD for projects |
| `features` | CRUD for features within projects |
| `markdown-documents` | Markdown content per feature |
| `audio-transcription` | Audio capture and Whisper transcription |
| `ai-generation` | LangChain pipeline — transcription → structured Markdown |
| `calendar` | Feature-to-event mapping and UI |
| `google-sync` | Google Calendar API sync |

## 4. Directory Structure (planned)

```
src/
  app/
    (auth)/
    (dashboard)/
      calendar/           # Calendar page with monthly grid
      projects/
        [id]/
          features/
            [featureId]/
    api/
      auth/
      ai/             # Audio transcription + structuring endpoint
      projects/
      features/
      calendar/
  lib/
    db/           # Prisma client
    auth/         # Better Auth config
    ai/           # Whisper transcription + LangChain structuring
    calendar/     # Google Calendar client
  components/
    ui/
    editor/
    calendar/
  types/
prisma/
  schema.prisma
```

## 5. Core User Flow

```
1. Google Login
       │
       ▼
2. Dashboard — list projects
       │
       ▼
3. Create / open project
       │
       ▼
4. Create feature
       │
       ├── Manual Markdown writing
       │
       └── Record audio
               │
               ▼
         5. Whisper transcription
               │
               ▼
         6. LangGraph → structured Markdown
               │
               ▼
7. Review and edit Markdown
       │
       ▼
8. Set feature dates
       │
       ▼
9. Visualize in calendar
       │
       ▼
10. Sync with Google Calendar
```

## 6. Data Flow — Audio to Markdown

```
User records audio (MediaRecorder API → webm blob)
      │
      ▼
POST /api/ai/transcribe-and-structure (FormData with audio file)
      │
      ▼
Auth check (getSessionOrThrow) + file validation (≤25MB)
      │
      ▼
OpenAI Whisper API (whisper-1) → raw transcription text
      │
      ▼
LangChain chain (ChatOpenAI gpt-4o-mini):
  - Prompt template analyzes content
  - Structures into sections: Overview, Key Points,
    Tasks/Action Items, Technical Notes, Questions
      │
      ▼
Return { transcription, markdown } to client
      │
      ▼
Client appends markdown to editor (user reviews/edits/saves)
```

## 7. Authentication Flow

```
User clicks "Sign in with Google"
      │
      ▼
Better Auth → Google OAuth consent screen
      │
      ▼
Callback with googleId + profile
      │
      ▼
Better Auth upserts User in DB (googleId, name, email, avatar)
      │
      ▼
Session created → Better Auth session (cookie-based)
```

## 8. Google Calendar Sync

```
Feature has startDate + endDate set
      │
      ▼
POST /api/calendar/sync
      │
      ▼
Google Calendar API: create/update event
      │
      ▼
Save CalendarEvent record (googleEventId, syncStatus)
```

## 9. Future Architectural Considerations

* Add WebSockets or polling for real-time Markdown autosave
* Extract AI pipeline into a standalone service if latency becomes an issue
* Add background job queue (e.g. BullMQ) for audio processing
* Possible GitHub integration for syncing docs to repository wikis
