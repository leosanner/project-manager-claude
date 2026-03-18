# Typography

Typography must be highly legible, technical, and consistent with developer tooling aesthetics.

## Font Family

Primary font:

```
font-family: "Inter", system-ui, -apple-system, sans-serif;
```

Code and technical elements:

```
font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

Both fonts are loaded via `next/font/google` in `src/app/layout.tsx`.

## Hierarchy

| Level | Size | Weight |
|---|---|---|
| Page Title | 28–32px (`text-3xl`) | 600 |
| Section Title | 20–24px (`text-xl`/`text-2xl`) | 600 |
| Subtitle | 16–18px (`text-md`/`text-lg`) | 500 |
| Body Text | 14–16px (`text-sm`/`text-base`) | 400 |
| Secondary Text | 12–14px (`text-xs`/`text-sm`) | 400 |
| Code / Labels | 12–14px (`text-xs`/`text-sm`) | 500 |

## Rules

- Use weights 400, 500, 600 only.
- Avoid dense blocks of text.
- Avoid oversized text.
- Prioritize readability over style.
- Use contrast (weight/color) over size exaggeration.
