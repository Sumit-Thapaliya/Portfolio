# Sumit Thapaliya — Portfolio

A full-stack developer portfolio: React/Vite frontend with a cinematic
intro, GSAP letter-reveal hero, particle-network background, tilting
project cards, and scroll animations — plus a Node/Express backend that
emails contact-form submissions straight to your inbox.

```
portfolio/
├── frontend/   React + Vite + GSAP + Lenis + Framer Motion
└── backend/    Node + Express + Nodemailer + Zod
```

## 1. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:5173**. In dev, `/api/*` requests are proxied
to the backend at `http://localhost:4000` (see `vite.config.js`).

## 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs at **http://localhost:4000**.

### Configuring email sending (.env)

The backend needs SMTP credentials for the account that *sends* the mail
(the receiver, `CONTACT_RECEIVER_EMAIL`, is already set to
`sumitthapaliya63@gmail.com` in `.env.example`).

If you want to send via Gmail:
1. Enable **2-Step Verification** on the Google account you'll send from.
2. Create an **App Password**: https://myaccount.google.com/apppasswords
3. Put that 16-character password in `SMTP_PASS`, and the Gmail address in
   `SMTP_USER`.

You can instead use any SMTP provider (Resend, SendGrid, Mailgun, your own
mail server) — just update `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` /
`SMTP_PASS` accordingly.

## 3. What to edit before this is "yours"

- `frontend/src/data/projects.js` — replace the dummy projects (titles,
  descriptions, tech, `liveUrl` / `codeUrl` links). MedBridge's entry is
  already accurate — just add its real links when you have them.
- `frontend/src/data/skills.js` — adjust groups/skills as needed.
- `frontend/src/components/Contact.jsx` — the `SOCIALS` array has dummy
  GitHub/LinkedIn/X links — swap in your real profile URLs.
- `frontend/src/components/About.jsx` — tweak the bio copy if you want a
  different angle or to mention more projects/experience.
- `backend/.env` — your real SMTP credentials (never commit this file).

## 4. Deploying

- **Frontend**: build with `npm run build` in `frontend/` (outputs to
  `frontend/dist`), deploy to Vercel/Netlify. Update the API base URL if
  the backend isn't proxied in production (e.g. set an env var and adjust
  `frontend/src/lib/api.js`).
- **Backend**: deploy `backend/` to Render/Railway/Fly.io. Set the same
  environment variables from `.env.example` in your host's dashboard, and
  set `CLIENT_ORIGIN` to your deployed frontend's URL (for CORS).

## Tech notes

- **Intro**: `IntroLoader.jsx` — a short terminal boot sequence followed
  by a GSAP curtain-reveal, skipped automatically if the visitor has
  `prefers-reduced-motion` on.
- **Name reveal**: `Hero.jsx` splits the name into letter spans and
  animates them in with GSAP once the intro finishes.
- **Particle background**: `ParticleBackground.jsx` — a lightweight
  canvas network-graph effect (no Three.js dependency needed, keeps
  bundle size and GPU cost low). Nodes drift and react gently to the
  mouse.
- **Tilt cards**: `ProjectCard.jsx` tracks mouse position over each card
  and applies a CSS 3D tilt + radial glow that follows the cursor.
- **Scroll reveals**: Framer Motion's `whileInView` on About/Skills/
  Projects/Contact; Lenis provides the smooth-scroll feel site-wide.
- **Backend architecture**: routes → controller (thin) → service (mail
  logic), Zod validation middleware runs before the controller, and a
  rate limiter caps contact-form abuse at 5 submissions / 15 min / IP.
