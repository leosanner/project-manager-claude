# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** app using the **App Router** (`src/app/`) with:

- **React 19** with the React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- **TypeScript**
- Fonts: Geist Sans and Geist Mono loaded via `next/font/google`

### Key files

- `src/app/layout.tsx` — root layout, sets fonts and global metadata
- `src/app/page.tsx` — home page (currently boilerplate)
- `src/app/globals.css` — global styles
- `next.config.ts` — Next.js config
