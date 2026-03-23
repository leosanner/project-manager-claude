---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git diff:*), Bash(git commit:*), Bash(git log:*), Bash(npm run lint:*), Bash(npm test:*), Read, Edit
description: Update docs then create a git commit
---

## Context

- Current git status: !`git status`
- Staged and unstaged changes: !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Follow these steps in order:

### Step 1 — Update documentation

Run `git diff HEAD` to understand all pending changes, then update documentation files as needed:

- `CLAUDE.md` — update key files, architecture diagram, directory structure, or commands if the changes affect them
- `docs/project_status.md` — move completed items, update In Progress/Pending
- `docs/changelog.md` — add entries under `[Unreleased]` (Keep a Changelog format, past tense)
- `docs/architecture.md` — only if the architecture actually changed

Rules:
- Keep changelog entries concise and in past tense (e.g. "Added X", "Fixed Y")
- Only edit sections that are actually affected by the changes
- Use today's date (`currentDate` from context) when adding or updating changelog entries, version headers, or any date-stamped documentation

### Step 2 — Run lint and tests

Run `npm run lint` and `npm test`. If either fails, fix the issues and re-run until both pass. Do not proceed to committing until both pass cleanly.

### Step 3 — Commit

Stage all modified files (including the doc updates) and create a single commit.

Commit message format:
- Conventional commit prefix (`feat:`, `fix:`, `ci:`, `chore:`, etc.)
- Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

Use a HEREDOC to pass the commit message.
