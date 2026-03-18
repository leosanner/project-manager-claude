---
name: update-docs-before-commit
description: Reviews staged changes and updates project documentation before committing
disable-model-invocation: true
---

Review the staged changes (via `git diff --staged`) and update the documentation files if needed before committing.

## Docs to consider updating

- `docs/project_status.md` — reflects current progress: move completed items, update In Progress, update Pending
- `docs/changelog.md` — add entries for new features, fixes, or changes under `[Unreleased]` following Keep a Changelog format
- `docs/architecture.md` — update only if the system design, layers, modules, or directory structure changed

## Process

1. Run `git diff --staged` to understand what is being committed
2. For each doc file, determine if the staged changes require an update:
   - New feature added → update `project_status.md` (move to Completed) + `changelog.md` (add entry)
   - Infrastructure or config change → update `project_status.md` + `changelog.md`
   - Architectural change (new module, new layer, new integration) → update `architecture.md` too
   - Pure refactor or bug fix → update `changelog.md` only if meaningful
3. Apply only the necessary edits — do not rewrite sections that are still accurate
4. After updating, show a summary of what changed in the docs

## Rules

- Do not commit anything — only prepare the docs for the user to commit alongside their changes
- Keep changelog entries concise and in past tense (e.g. "Added X", "Fixed Y")
- Today's date is available via the `currentDate` context in CLAUDE.md
- Do not touch `docs/architecture.md` unless the architecture actually changed
