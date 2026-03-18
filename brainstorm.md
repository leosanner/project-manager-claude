# Brainstorm — Personal Project Management System

## 1. Core Idea

Build a web-based project management application focused on **individual users**, emphasizing practical organization, **GitHub-style Markdown documentation**, integration with **Google Calendar**, and **voice-assisted AI** to accelerate feature specification.

This is not intended to be a collaborative team platform initially. The product starts as a **personal workspace**, where a single user can centralize projects, structure features, document ideas, track execution, and transform **spoken input into structured Markdown documentation**.

## 2. Product Vision

The system should act as a personal execution hub. Instead of relying on multiple tools for notes, planning, scheduling, and idea capture, the user will have a unified environment to:

* create and organize projects;
* define features within projects;
* write detailed specifications in Markdown;
* visualize tasks and events in a calendar;
* sync relevant data with Google Calendar;
* record audio describing a feature and receive a structured Markdown version.

The experience should prioritize clarity, speed, and usability. A key differentiator is reducing friction between **thinking about a feature** and **turning it into usable documentation**.

## 3. Problem Being Solved

Individual users often spread their workflow across multiple tools:

* documentation in Markdown or Notion;
* task management in another platform;
* scheduling in Google Calendar;
* ideas scattered across notes.

This leads to fragmentation. The goal is to unify **projects, features, documentation, and calendar** into a single workflow.

## 4. Target Audience

The initial focus is on users working independently, such as:

* independent developers;
* students with technical projects;
* freelancers;
* digital product builders;
* users who value structured documentation.

## 5. Value Proposition

The product combines:

* **project management**;
* **GitHub-like Markdown documentation**;
* **calendar-based time visualization**;
* **native Google integration**;
* **voice input converted into structured Markdown**.

The differentiation is not competing with complex enterprise tools, but delivering a focused, personal system where AI helps convert raw ideas into usable documentation.

## 6. MVP Scope

### Authentication

* Google login only;
* no traditional email/password system;
* simple authentication flow.

### Projects

* create project;
* list projects;
* view project details;
* edit project metadata.

### Features

* create features within projects;
* each feature represents a functional unit or idea;
* includes title, summary, status, and detailed content.

### Markdown Documentation

* each feature contains a Markdown document;
* GitHub-like Markdown support;
* headings, lists, checklists, code blocks, tables, links, etc.;
* editing + preview experience;
* content can be written manually or generated from audio.

### Speech-to-Text and AI Generation

* user records audio describing a feature;
* system transcribes audio;
* AI organizes transcription into structured Markdown;
* output may include title, summary, context, requirements, checklist;
* reduces effort of documenting ideas.

### Calendar

* temporal visualization of features;
* events linked to features;
* synchronization with Google Calendar.

## 7. Future Evolution

### Feature organization

* priorities;
* tags;
* custom statuses;
* start/end dates;
* internal checklists.

### Documentation improvements

* multiple documents per project;
* templates;
* version history;
* autosave.

### Integrations

* deeper Google Calendar sync;
* Markdown import/export;
* possible GitHub integration.

### AI

* automatic feature generation;
* scope breakdown;
* timeline suggestions;
* project summaries;
* voice-based workflows;
* advanced pipelines with LangGraph.

### Management views

* Kanban board;
* timeline view;
* progress dashboard.

## 8. User Experience Principles

* clean and focused interface;
* fast project creation;
* high-quality Markdown editor;
* seamless calendar integration;
* minimal complexity for individual users.

## 9. Tech Stack

### Frontend

* Next.js;
* React;
* App Router architecture.

### Backend / Full-stack

* Next.js full-stack approach;
* Google authentication;
* optional service layer for AI orchestration.

### AI & Audio Processing

* OpenAI API (Whisper) for transcription;
* LangGraph for structuring pipelines;
* reusable AI workflows.

### Database

* Neon;
* PostgreSQL.

### ORM

* Prisma.

### Testing

* Jest;
* TDD approach.

### External Integrations

* Google OAuth;
* Google Calendar API.

## 10. Architecture Direction

### Layers

* interface;
* application/use cases;
* data access;
* external integrations.

### Modules

* authentication;
* projects;
* features;
* Markdown documents;
* audio capture and transcription;
* AI generation pipeline;
* calendar;
* Google sync.

## 11. Core Entities

### User

* id;
* googleId;
* name;
* email;
* avatar;
* timestamps.

### Project

* id;
* userId;
* name;
* description;
* status;
* timestamps.

### Feature

* id;
* projectId;
* title;
* summary;
* status;
* priority;
* dates;
* timestamps.

### FeatureDocument

* id;
* featureId;
* markdownContent;
* timestamps.

### FeatureGeneration

Represents the transient processing of audio into structured Markdown. This data is not necessarily persisted long-term, only the final generated Markdown is stored.

Possible fields (conceptual, not required to persist):

* transcription;
* generation status;
* generated Markdown.

### CalendarSync / CalendarEvent

* id;
* featureId;
* googleEventId;
* sync status;
* last sync.

## 12. Core User Flow

1. User logs in with Google.
2. Creates a project.
3. Creates a feature.
4. Writes Markdown or records audio.
5. System transcribes audio.
6. AI structures content into Markdown.
7. User edits content.
8. Defines dates.
9. Visualizes in calendar.
10. Syncs with Google Calendar.

## 13. Key Decisions

* individual-focused product;
* Google-only authentication;
* GitHub-like Markdown editor;
* Google Calendar integration;
* speech-to-text workflow;
* Whisper for transcription;
* LangGraph for content structuring;
* Next.js + PostgreSQL + Prisma stack;
* Jest for testing;
* TDD development.

## 14. Open Questions

* Markdown editor choice;
* real-time preview vs split view;
* level of GitHub Markdown compatibility;
* calendar sync strategy;
* feature-to-event mapping;
* status definitions;
* dashboard design;
* navigation structure.

## 15. Risks

### Markdown Editor

Complex UX challenge.

### Speech-to-Text + AI

Quality and consistency of generated content.

### Calendar Integration

Sync reliability.

### MVP Scope

Risk of over-expansion.

### TDD in Full-stack

Testing strategy complexity.

## 16. Positioning

A personal project manager that combines execution, documentation, and scheduling.

Or:

A system that turns ideas into structured, living documentation with calendar context.

## 18. Executive Summary

A personal project management web application built with Next.js, PostgreSQL, and Prisma, using Google authentication, focused on organizing projects and features documented in GitHub-style Markdown. It integrates with Google Calendar and includes a key feature: transforming user-recorded audio into structured Markdown using Whisper and LangGraph. The MVP aims to centralize planning, documentation, scheduling, and idea capture in a single environment.

