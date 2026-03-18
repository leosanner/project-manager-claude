# Color System

## Light Mode

```css
--bg-canvas: #ffffff
--bg-subtle: #f6f8fa
--bg-muted: #f3f4f6
--bg-elevated: #ffffff

--text-primary: #1f2328
--text-secondary: #59636e
--text-muted: #6e7781

--border-default: #d0d7de
--border-muted: #d8dee4
--border-subtle: #eaeef2

--accent-primary: #0969da
--accent-primary-hover: #0860ca
--accent-primary-active: #0757ba

--success: #1a7f37
--warning: #9a6700
--danger: #cf222e
--info: #0969da
```

## Dark Mode

```css
--bg-canvas: #0d1117
--bg-subtle: #161b22
--bg-muted: #111827
--bg-elevated: #161b22

--text-primary: #e6edf3
--text-secondary: #9da7b3
--text-muted: #7d8590

--border-default: #30363d
--border-muted: #21262d
--border-subtle: #262c36

--accent-primary: #2f81f7
--accent-primary-hover: #388bfd
--accent-primary-active: #1f6feb

--success: #3fb950
--warning: #d29922
--danger: #f85149
--info: #2f81f7
```

## Rules

- Neutral background dominates.
- Accent color used sparingly.
- Semantic colors only for feedback.
- UI must work even with minimal color.

## Tailwind Utility Mapping

Brand tokens are available as Tailwind utilities via `@theme inline`:

| Token | Tailwind class examples |
|---|---|
| `--bg-canvas` | `bg-canvas` |
| `--bg-subtle` | `bg-subtle` |
| `--text-primary` | `text-fg-primary` |
| `--text-muted` | `text-fg-muted` |
| `--border-default` | `border-border-default` |
| `--accent-primary` | `bg-brand`, `text-brand` |
| `--semantic-success` | `bg-success`, `text-success` |

shadcn components use their own variable names (`bg-primary`, `bg-muted`, etc.) which are mapped to the same brand values in `globals.css`.
