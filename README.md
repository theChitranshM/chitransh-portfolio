# dialed in

one evening at my desk in vancouver, 4:47 pm to 1:12 am, as a website. scroll and the clock moves, the sun sets behind the north shore, the city lights come on and the caffeine meter drains. click the espresso machine to refill it. there's an AI twin of me on the laptop. it replies faster than i do 😭

**Live:** https://chitransh-portfolio-brown.vercel.app · **Recruiter mode** (the 30-second version, no 3D): https://chitransh-portfolio-brown.vercel.app/recruiter

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4
- three.js with React Three Fiber, drei and postprocessing. Every object in the room is built from primitives in code, no model files.
- GSAP (ScrollTrigger, SplitText) + Lenis for the scroll story
- zustand for state, detect-gpu for quality tiers
- Claude API (`claude-haiku-5-5`) for the AI twin
- Vercel hosting + Vercel Analytics

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Useful URL flags:

| Flag | What it does |
|---|---|
| `/?quality=low` / `medium` / `high` | force a graphics tier |
| `/?full=1` | open the experience even with reduced motion or no WebGL (otherwise those go to recruiter mode) |
| `/?reel=1&dur=12` | auto-plays the whole evening for recording a portrait reel |

## The AI twin

On Vercel the twin goes through **Vercel AI Gateway**: zero-priced models first (`nvidia/nemotron-3.5-lightning-free`, `reflection/beam-free`, $0 per message), then Claude Haiku on the free credit, set with `TWIN_MODELS`. It authenticates using the project's built-in OIDC token: no API key to manage. The gateway's free monthly credit unlocks once a card is on file in Vercel (AI Gateway tab); the card is only charged if you buy credits or enable auto top-up. Until then, or if the gateway ever fails, the twin answers from canned replies in `content/twin-fallback.ts`, so the site always works.

Prefer your own Anthropic key? Set `ANTHROPIC_API_KEY` and it takes priority. Set a monthly spend limit in the Anthropic Console.

The twin is rate limited to 15 messages per IP per 10 minutes. That limit is in memory per server instance; set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to share it across instances. Message contents are never logged or stored.

## Editing the content

Every fact and every line of copy lives in `content/`:

- `site.ts`: all copy, experience, projects, leadership, links
- `twin-knowledge.md`: everything the twin is allowed to know
- `achievements.ts`: the 8 achievements
- Event photos go in `public/photos/<name>.jpg`; uncomment the matching `photo` line in `site.ts`

## Scripts

| Command | What it does |
|---|---|
| `npm run resume` | prints `/recruiter` to `public/resume.pdf` with headless Chrome (start the site first) |
| `node scripts/shots.mjs` | screenshots every chapter at 390×844 and 1440×900 |
| `node scripts/check.mjs` | plays through the site and checks every achievement and easter egg |

## Sounds

Every sound (ambience, espresso pour, printer ticks, achievement chime, robot beep) is synthesized in the browser with the Web Audio API. No sample files, nothing to credit or license.

## Credits

Built with [Claude Code](https://claude.com/claude-code), three.js and too much espresso.

## License

The code is MIT licensed (see `LICENSE`). The copy, photos, name and likeness are © Chitransh Motwani and are not covered by the MIT license.
