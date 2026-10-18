# CLAUDE.md: "Dialed In", the portfolio of Chitransh Motwani

`BUILD.md` is the full brief. Read it before big changes. Also read `AGENTS.md`: this is Next.js 16, check `node_modules/next/dist/docs/` before using an API from memory.

## Rules
1. **Facts only come from `content/`** (`site.ts`, `twin-knowledge.md`, `achievements.ts`). Never invent numbers, dates, employers, clients, results or skills. Unknowns stay `TODO(chitransh)`.
2. **No Insight/company project details.** No client work, no internal project names, no metrics about employer projects. Chitransh said no.
3. Copy is written already. New lines follow the voice rules below and get flagged in your report.
4. Mobile first (Instagram bio traffic, 390x844). Every chapter works in portrait.
5. `/recruiter` always works: static, no three.js, works with JS off, prints as a resume.
6. After each change: `npm run build` and `npm run lint` pass, then commit (conventional commits).
7. Screenshot chapters at 390x844 and 1440x900 before calling visual work done.

## Stack
Next.js 16 (App Router, Turbopack, cacheComponents) + TypeScript + Tailwind v4 · three + @react-three/fiber + drei + postprocessing · gsap (ScrollTrigger, SplitText) + lenis · zustand · detect-gpu · @anthropic-ai/sdk (twin) · @vercel/analytics. Sounds are synthesized with Web Audio (no sample files).

## Voice (playful copy)
lowercase, light punctuation, he's the punchline (never other people), specific numbers, two beats max, emoji only at line end (😭 💀 🫡 ☕) and sparingly, **no em dashes**, never LinkedIn-sounding, never explain the joke. Recruiter mode: formal, warm, full sentences, no jokes, no emoji.

## Folders
`app/` routes (`/`, `/recruiter`, `/api/twin`, OG, sitemap, robots) · `components/experience/` 3D scene + `objects/` · `components/chapters/` DOM sections · `components/hud/` · `components/eggs/` · `components/recruiter/` · `content/` single source of truth · `lib/` store, scroll, quality, storage, sound, analytics, rate limit · `public/` resume.pdf, photos/, detect-gpu benchmarks.
