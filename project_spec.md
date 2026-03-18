# Project Specification — Personal Project Management System

## 1. Overview

A personal project management web application built with Next.js, PostgreSQL, and Prisma, using Google authentication, focused on organizing projects and features documented in GitHub-style Markdown. It integrates with Google Calendar and includes a key feature: transforming user-recorded audio into structured Markdown using Whisper and LangGraph.

## 2. MVP Requirements

### Authentication

* Google login only (OAuth)
* No traditional email/password system
* Simple, single-step authentication flow

### Projects

* Create project
* List all projects
* View project details
* Edit project metadata (name, description, status)

### Features

* Create features within a project
* Each feature represents a functional unit or idea
* Fields: title, summary, status, detailed content

### Markdown Documentation

* Each feature contains a Markdown document
* GitHub-compatible Markdown: headings, lists, checklists, code blocks, tables, links
* Editing + preview experience
* Content can be written manually or generated from audio

### Speech-to-Text and AI Generation

* User records audio describing a feature
* System transcribes audio (Whisper)
* AI organizes transcription into structured Markdown (LangGraph)
* Output includes title, summary, context, requirements, checklist
* Reduces effort of documenting ideas

### Calendar

* Temporal visualization of features
* Events linked to features
* Synchronization with Google Calendar

## 3. Core Entities

### User

| Field | Type |
|---|---|
| id | UUID |
| googleId | string |
| name | string |
| email | string |
| avatar | string (URL) |
| createdAt | timestamp |
| updatedAt | timestamp |

### Project

| Field | Type |
|---|---|
| id | UUID |
| userId | UUID (FK) |
| name | string |
| description | string |
| status | enum |
| createdAt | timestamp |
| updatedAt | timestamp |

### Feature

| Field | Type |
|---|---|
| id | UUID |
| projectId | UUID (FK) |
| title | string |
| summary | string |
| status | enum |
| priority | enum |
| startDate | date |
| endDate | date |
| createdAt | timestamp |
| updatedAt | timestamp |

### FeatureDocument

| Field | Type |
|---|---|
| id | UUID |
| featureId | UUID (FK) |
| markdownContent | text |
| createdAt | timestamp |
| updatedAt | timestamp |

### FeatureGeneration (transient)

Not persisted long-term. Only the final generated Markdown is stored in `FeatureDocument`.

Conceptual fields:
* transcription
* generationStatus
* generatedMarkdown

### CalendarEvent

| Field | Type |
|---|---|
| id | UUID |
| featureId | UUID (FK) |
| googleEventId | string |
| syncStatus | enum |
| lastSync | timestamp |

## 4. API Endpoints (planned)

### Auth

* `GET /api/auth/[...all]` — Better Auth handler

### Projects

* `GET /api/projects` — list user's projects
* `POST /api/projects` — create project
* `GET /api/projects/:id` — get project details
* `PATCH /api/projects/:id` — update project
* `DELETE /api/projects/:id` — delete project

### Features

* `GET /api/projects/:projectId/features` — list features
* `POST /api/projects/:projectId/features` — create feature
* `GET /api/features/:id` — get feature
* `PATCH /api/features/:id` — update feature
* `DELETE /api/features/:id` — delete feature

### Documents

* `GET /api/features/:featureId/document` — get Markdown document
* `PUT /api/features/:featureId/document` — update Markdown document

### Audio / AI

* `POST /api/features/:featureId/generate` — upload audio, transcribe, generate Markdown

### Calendar

* `GET /api/calendar/events` — list synced events
* `POST /api/calendar/sync` — trigger sync with Google Calendar

## 5. Tech Stack

### Frontend

* Next.js 16 (App Router)
* React 19
* Tailwind CSS v4
* TypeScript

### Backend

* Next.js API Routes (full-stack)
* Better Auth (Google OAuth)

### AI & Audio

* OpenAI Whisper — transcription
* LangGraph — AI orchestration and Markdown structuring
* Anthropic Claude API — content generation (optional)

### Database

* Neon (serverless PostgreSQL)
* Prisma ORM

### Testing

* Jest
* TDD approach

### External Integrations

* Google OAuth
* Google Calendar API

## 6. Key Decisions

* Individual-focused product (not team collaboration)
* Google-only authentication
* GitHub-like Markdown editor
* Google Calendar integration for time visualization
* Whisper for transcription
* LangGraph for content structuring pipeline
* TDD development with Jest
