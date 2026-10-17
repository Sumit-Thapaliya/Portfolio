# Sumit Thapaliya — Portfolio

Personal portfolio of **Sumit Thapaliya**, Software Developer & Full Stack Developer from Kathmandu, Nepal.

**Live:** https://www.sumitthapaliya.com.np/

A single-page, cinematic React site: a persistent Three.js scene that choreographs itself to the scroll, GSAP + Framer Motion reveals, Lenis smooth scrolling, a pinned horizontal project gallery, an interactive contact terminal (no backend) and a build-time SEO prerender so crawlers see real content without running JavaScript.

```
Portfolio/
└── frontend/        React 18 + Vite 6 (the whole site — static, no server)
```

---

## Quick start

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

| Script            | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                                       |
| `npm run build`   | Production build → `frontend/dist` (runs the SEO prerender)    |
| `npm run preview` | Serves `dist` locally to check the production bundle           |

Deploy: push to `main` — Vercel builds `frontend` with `npm run build` and serves `dist`. No environment variables are required.

---

## Tech stack

| Layer      | Library                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| UI         | React 18, Vite 6                                                        |
| 3D         | three.js 0.170 + @react-three/fiber 8 (code-split, loaded after paint)  |
| Motion     | GSAP 3 + ScrollTrigger, Framer Motion 11, Lenis smooth scroll           |
| Type       | Bebas Neue (display), Outfit (headings), Instrument Serif italic (accents), Bricolage Grotesque, Inter, JetBrains Mono — via Google Fonts |
| Styling    | Plain CSS per component + design tokens in `src/index.css`              |

No Tailwind, no UI kit, no backend, no analytics.

---

## Project structure

```
frontend/
├── index.html                  Meta tags, Open Graph, JSON-LD, fonts, <!--SEO_PRERENDER--> slot
├── vite.config.js              React plugin + seoPrerender plugin (static HTML injected at build)
├── public/
│   ├── favicon.svg / .ico      Icons — 48/96/192 px PNGs so Google shows the logo in results
│   ├── favicon-{32,48,96,192}.png, apple-touch-icon.png, icon-512.png
│   ├── og-image.png            1200×630 social preview
│   ├── robots.txt, sitemap.xml, site.webmanifest
└── src/
    ├── main.jsx                Entry
    ├── App.jsx                 Composition: scene, preloader, overlays, sections, error boundaries, colour grading
    ├── index.css               Tokens (colours, fonts, easings), global utilities, HUD, grain, vignette
    ├── data/
    │   ├── site.js             Identity, URL, copy, nav, socials  ← single source of truth for app AND prerender
    │   ├── projects.js         Six GitHub projects (title, tagline, one-line description, tech, links)
    │   └── skills.js           Skill groups
    ├── hooks/
    │   ├── useLenis.js         Lenis driven by GSAP ticker; publishes scroll velocity (sceneState + --vel CSS var)
    │   ├── useMagnetic.js      Magnetic hover for buttons
    │   └── useScramble.js      Text scramble on hover
    └── components/
        ├── Preloader.jsx       Counter 0→100, rotating words, flash, 7-column slice curtain, camera dolly-in
        ├── Navbar.jsx          Scramble links, shrinks on scroll, auto-hides when scrolling down
        ├── SectionHUD.jsx      Right-hand rail 01–05 tracking the active section (desktop)
        ├── Hero.jsx            Bebas Neue name: letter flip-in, magnetic letters, cursor-trailing ghost outline,
        │                       velocity chromatic split, scroll-scrub letter scatter; rotating role typewriter
        ├── About.jsx           Char-reveal heading, text reveal, animated stat counters
        ├── Skills.jsx          Groups with cursor spotlight + spring pop-in tags
        ├── Marquee.jsx         Two counter-scrolling rows; speed/direction/skew follow scroll velocity
        ├── Projects.jsx        Desktop: pinned horizontal gallery (ScrollTrigger pin + scrub, progress bar,
        │                       ghost "WORK"); mobile / reduced-motion: vertical grid
        ├── ProjectCard.jsx     Procedural cover art (hue, orbs, monogram, light sweep), tilt, whole-card link
        ├── Contact.jsx         Terminal: whoami / status / help / email / copy / github / linkedin / stack / clear
        ├── Footer.jsx          Giant scrubbed name, back-to-top via Lenis
        ├── CustomCursor.jsx    Dot + ring with contextual labels (Open / GitHub / Top); off on touch
        ├── ScrollProgress.jsx  Top progress bar
        ├── three/
        │   ├── Scene.jsx       7 floating objects, 4 scroll-keyed formations, shards, stars, camera rig
        │   └── sceneState.js   Mutable store: intro, scroll, progress, velocity, burst, mouse
        └── ui/                 BorderBeam, CharReveal, TextReveal, NumberTicker, ShimmerButton, Spotlight,
                                SectionBoundary (per-section error boundary)
```

---

## How the pieces talk to each other

- **`sceneState`** (`components/three/sceneState.js`) is a plain mutable object read every frame by the 3D scene. The preloader tweens `intro` 1→0 (camera dolly-in), `App` writes `scroll` / `progress` / `mouse`, Lenis writes `velocity`, clicks set `burst`. No React re-renders at 60 fps.
- **Scroll** goes through Lenis → `ScrollTrigger.update()`, so pins and scrubs stay in sync. Lenis also sets `--vel` (−1…1) on `<html>`; CSS uses it for the content skew (`.sb-skew`) and the hero's chromatic split.
- **Colour grading:** `App.jsx` tweens `--sb-bg` per section as you scroll (hero → about → skills → projects → contact).
- **Formations:** `Scene.jsx` keys object positions at page progress `[0, 0.3, 0.62, 1]` — hero spread → rotating ring → parted to the edges for the project gallery → centre cluster at contact.
- **Error boundaries:** every section is wrapped in `SectionBoundary`, so a runtime error can only remove that one block, never the whole page.

---

## Editing content

Everything you'd normally change lives in `src/data/`:

- **Name, role, summary, email, socials, nav, canonical URL** → `site.js`
- **Projects** → `projects.js` (keep descriptions to one line; `liveUrl` may be empty)
- **Skills** → `skills.js`

These files feed both the React components and the build-time prerender, so the static HTML always matches the app.

Head tags (title, description, Open Graph, Twitter, JSON-LD Person/WebSite/ProfilePage) are in `index.html`.

---

## SEO

- Canonical / OG / JSON-LD / sitemap / robots all use **`https://www.sumitthapaliya.com.np/`**. Set `www` as the primary domain in Vercel so the apex redirects to it.
- `seoPrerender` (in `vite.config.js`) injects real H1/H2, copy, skills and project markup into `<div id="root">` at build time; React hydrates over it.
- Favicons are provided at 48/96/192 px (Google requires a multiple of 48 px) plus `/favicon.ico` and SVG.
- `robots.txt` allows everything and points to `sitemap.xml`.

---

## Accessibility & performance

- `prefers-reduced-motion`: preloader skipped, pinned gallery becomes a grid, letter scatter / skew / 3D disabled.
- Touch devices: custom cursor and magnetic effects off; hero ghost hidden; vertical project grid.
- 3D scene is lazy-loaded, skipped on very low-memory devices, and dimmed past the hero for readability.
- Heavy transforms are limited to elements with `will-change`; sections are isolated so GSAP (transform) and Framer (opacity) never fight over the same property.

---

## Contact terminal commands

```
help      list commands
whoami    short bio
status    availability
email     open mail client (mailto)
copy      copy email address
github    open GitHub profile
linkedin  open LinkedIn profile
stack     print the tech stack
clear     clear the screen
```

---

## Links

- GitHub: https://github.com/Sumit-Thapaliya
- LinkedIn: https://www.linkedin.com/in/sumit-thapaliya-8b4b84426/
- Email: sumitthapaliya63@gmail.com
