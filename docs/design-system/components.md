# Component Specs

All base components are provided by shadcn/ui (`src/components/ui/`). Customize using the design tokens defined in `globals.css`.

## Buttons

Variants (from shadcn):

| Variant | Description |
|---|---|
| `default` | Primary accent color (`bg-primary`) |
| `outline` | Neutral background + border |
| `secondary` | Subtle background |
| `ghost` | Transparent, hover reveals background |
| `destructive` | Danger color for destructive actions |
| `link` | Text-only with underline on hover |

Rules:
- Limit primary actions per view.
- Clear hover/active/focus states.

## Inputs

- Neutral background
- Visible border (`border-input`)
- Subtle focus accent (`ring-ring`)

## Cards

- Subtle elevation via background (`bg-card`)
- Border + padding
- `rounded-lg`

## Tables

- Clean rows
- Subtle headers
- Alternating row styles optional

## Sidebar

- Structured groups
- Clear active state
- Uses `sidebar-*` token family

## Tabs

- Minimal
- Underline or subtle highlight active state

## Modals (Dialog)

- Clean
- Focused content
- Overlay backdrop

## Badges

- Small
- Semantic colors (`success`, `warning`, `danger`, `info`)

## Interaction States

All interactive elements must support:

- default
- hover
- active
- focus
- disabled
- selected (where applicable)

Rules:
- subtle but clear
- accessible focus rings
