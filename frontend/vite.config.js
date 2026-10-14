import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import site from './src/data/site.js';
import projects from './src/data/projects.js';
import skills from './src/data/skills.js';

/* ------------------------------------------------------------------ */
/*  SEO prerender                                                      */
/*  Generates the page's real content as static HTML (from the same    */
/*  data the React app uses) and injects it into <div id="root">.       */
/*  Crawlers / link-unfurlers that don't run JS still see an H1, H2,    */
/*  copy, skills and projects. React replaces it on mount.              */
/* ------------------------------------------------------------------ */
const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function buildPrerenderHtml() {
  const nav = site.nav
    .map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`)
    .join('');

  const skillGroups = skills
    .map(
      (g) => `
        <div class="skills__group">
          <h3 class="skills__group-title">${esc(g.group)}</h3>
          <ul class="skills__tags">${g.items
            .map((i) => `<li class="skills__tag">${esc(i)}</li>`)
            .join('')}</ul>
        </div>`
    )
    .join('');

  const projectCards = projects
    .map(
      (p, i) => `
        <article class="pcard">
          <div class="pcard__inner">
            <div class="pcard__top"><span class="pcard__index">${String(i + 1).padStart(2, '0')}</span>
            ${p.codeUrl ? `<div class="pcard__links"><a href="${esc(p.codeUrl)}" rel="noopener">Code</a></div>` : ''}</div>
            <h3 class="pcard__title">${esc(p.title)}</h3>
            <p class="pcard__desc">${esc(p.description)}</p>
            <ul class="pcard__tech">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          </div>
        </article>`
    )
    .join('');

  const socials = site.socials
    .map(
      (s) =>
        `<li><a href="${esc(s.href)}" ${s.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(s.label)}</a></li>`
    )
    .join('');

  return `
    <nav class="nav" aria-label="Primary"><div class="sb-container nav__inner">
      <a href="#top" class="nav__brand">ST<span class="nav__brand-dot">.</span></a>
      <ul class="nav__links">${nav}</ul>
    </div></nav>
    <main>
      <section id="top" class="hero"><div class="sb-container hero__inner">
        <span class="sb-eyebrow">Portfolio / 2026</span>
        <h1 class="hero__title"><span class="hero__greeting">${esc(site.greeting)}</span> <span class="hero__name sb-gradient-text">${esc(site.name)}</span></h1>
        <h2 class="hero__role">${esc(site.role)}</h2>
        <div class="hero__meta">
          <p class="hero__summary">${esc(site.summary)}</p>
          <p class="hero__summary">${esc(site.summary2)}</p>
          <div class="hero__actions"><a href="#projects" class="hero__btn hero__btn--primary">View Projects</a><a href="#contact" class="hero__btn hero__btn--ghost">Get in Touch</a></div>
        </div>
      </div></section>
      <section id="about" class="about"><div class="sb-container">
        <span class="sb-eyebrow">About</span>
        <div class="about__grid">
          <h2 class="about__heading">About Sumit Thapaliya — I like building things that hold up under real use — not just in a demo.</h2>
          <div class="about__body">
            <p>I'm ${esc(site.name)}, a software developer and full-stack developer based in ${esc(site.location)} who enjoys the whole path from a database schema to the interface someone actually clicks on. I care about clean architecture — routes that stay thin, services that hold the logic, and data that's validated before it ever reaches a controller.</p>
            <p>My current focus is <strong>MedBridge</strong>, a healthcare medicine exchange platform where hospitals and clinics manage inventory, request stock exchanges, track expiry dates, and soon rely on AI-powered demand forecasting.</p>
          </div>
        </div>
      </div></section>
      <section id="skills" class="skills"><div class="sb-container">
        <span class="sb-eyebrow">Skills</span>
        <h2 class="skills__heading">The stack I build with.</h2>
        <div class="skills__grid">${skillGroups}</div>
      </div></section>
      <section id="projects" class="projects"><div class="sb-container">
        <span class="sb-eyebrow">Projects</span>
        <h2 class="projects__heading">Selected work from Sumit Thapaliya's portfolio.</h2>
        <div class="projects__grid">${projectCards}</div>
      </div></section>
      <section id="contact" class="contact"><div class="sb-container">
        <span class="sb-eyebrow">Contact</span>
        <h2 class="contact__heading">Contact Sumit Thapaliya — let's build something.</h2>
        <p class="contact__text">Have a project, role, or idea in mind? Email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or use the form on this page.</p>
        <ul class="contact__socials">${socials}</ul>
      </div></section>
    </main>
    <footer class="footer"><div class="sb-container footer__inner"><span>© ${new Date().getFullYear()} ${esc(site.name)} · Software Developer, Nepal · Sumit Thapaliya Portfolio</span></div></footer>`;
}

function seoPrerender() {
  return {
    name: 'seo-prerender',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<!--SEO_PRERENDER-->', buildPrerenderHtml());
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), seoPrerender()],
  build: {
    rollupOptions: {
      output: {
        // Keep the 3D scene in its own chunk so the main bundle (and LCP) stays small
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          motion: ['framer-motion', 'gsap'],
        },
      },
    },
  },
  preview: {
    // allow any host so `vite preview` works behind tunnels / sandboxes
    allowedHosts: true,
  },
  server: {
    port: 5173,
    allowedHosts: true,
    proxy: {
      // Forwards /api calls to the Express backend during development
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
