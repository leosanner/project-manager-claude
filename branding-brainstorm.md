# Branding Guidelines — GitHub-Inspired Design System

This document defines the visual and experience standards for the product interface. It serves as a reference for any LLM, agent, designer, or developer creating, adjusting, or reviewing UI.

The goal is to reproduce the clarity, restraint, and efficiency of a GitHub-inspired product, with native support for **light mode** and **dark mode**, ensuring consistency, readability, and productivity.

---

## 1. Brand Intent

The interface should communicate:

* clarity
* trust
* organization
* restraint
* technical efficiency
* maturity

The UI should not feel promotional, overly flashy, or decorative. It must prioritize content, navigation, and readability.

---

## 2. Visual Direction

### Core Principles

* GitHub-inspired: clean, technical, restrained, and functional.
* Neutral surfaces, subtle borders, controlled hierarchy.
* Emphasis on contrast, spacing, and typography.
* Components should feel utilitarian and professional.
* Must work equally well in light and dark modes.

### Avoid

* strong gradients as primary identity
* heavy shadows
* glassmorphism
* excessive blur
* thick borders
* oversaturation
* unnecessary animations
* neon or overly futuristic visuals

---

## 3. Visual Personality

The product should feel:

* technical
* modern
* reliable
* minimal
* product-oriented

Tone:

* closer to a working tool than marketing
* closer to a system than a portfolio
* clarity over aesthetic experimentation

---

## 4. Color System

### 4.1 Light Mode

```txt
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

### 4.2 Dark Mode

```txt
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

### 4.3 Rules

* Neutral background dominates.
* Accent color used sparingly.
* Semantic colors only for feedback.
* UI must work even with minimal color.

---

## 5. Typography

Typography must be highly legible, technical, and consistent with developer tooling aesthetics.

### 5.1 Font Family

Primary font:

```txt
font-family: "JetBrains Sans", "JetBrains Mono", system-ui, -apple-system, sans-serif;
```

Code and technical elements:

```txt
font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

### 5.2 Hierarchy

#### Page Title

* 28–32px
* weight: 600

#### Section Title

* 20–24px
* weight: 600

#### Subtitle

* 16–18px
* weight: 500

#### Body Text

* 14–16px
* weight: 400

#### Secondary Text

* 12–14px

#### Code / Labels

* 12–14px
* weight: 500

### 5.3 Rules

* Use weights 400, 500, 600
* Avoid dense blocks
* Avoid oversized text
* Prioritize readability over style
* Use contrast (weight/color) over size exaggeration

---

## 6. Spacing & Layout

### Scale

```txt
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

### Rules

* generous spacing between sections
* clear grouping
* avoid clutter
* precise alignment
* readable content width

---

## 7. Borders, Radius & Surfaces

### Borders

* subtle, thin
* primary separation mechanism

### Radius

* inputs/buttons: 6–8px
* cards: 8–12px
* modals: 12px

### Shadows

* minimal usage
* often unnecessary

---

## 8. Components

### Buttons

Primary:

* accent color

Secondary:

* neutral background + border

Ghost:

* transparent

Rules:

* limit primary actions
* clear states

### Inputs

* neutral background
* visible border
* subtle focus accent

### Cards

* subtle elevation via background
* border + padding

### Tables

* clean rows
* subtle headers

### Sidebar

* structured groups
* clear active state

### Tabs

* minimal
* underline or subtle highlight

### Modals

* clean
* focused content

### Badges

* small
* semantic

---

## 9. Icons

* simple
* linear
* consistent

Suggested libraries:

* Lucide
* Heroicons
* Octicons

---

## 10. Light & Dark Mode

### Rules

* not simple inversion
* intentional contrast adjustments
* parity across themes

### Behavior

* manual toggle
* respects system preference
* persisted state

---

## 11. Interaction States

* default
* hover
* active
* focus
* disabled
* selected

Rules:

* subtle but clear
* accessible focus

---

## 12. Accessibility

* proper contrast
* keyboard navigation
* readable labels
* semantic structure

---

## 13. Density

* compact but breathable
* optimized for productivity

---

## 14. Content Style

* concise
* clear
* neutral tone

Examples:

* “Save changes”
* “Create repository”
* “Settings”

---

## 15. LLM Behavior Rules

Agents must:

1. prioritize structure
2. maintain restrained design
3. use accent sparingly
4. support both themes
5. prefer borders over effects
6. ensure typography clarity
7. maintain consistency

Avoid:

* flashy UI
* excessive gradients
* inconsistent styles

---

## 16. Design Tokens

```txt
radius-sm: 6px
radius-md: 8px
radius-lg: 12px

space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 20px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px

text-xs: 12px
text-sm: 14px
text-md: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px

accent-light: #0969da
accent-dark: #2f81f7
```

---

## 17. Summary

The final UI should be:

* GitHub-inspired
* highly readable
* restrained and professional
* productivity-focused
* consistent across light/dark
* neutral with controlled accents

The reference is a mature, clean, and efficient product experience.
