/**
 * Single source of truth for identity / SEO copy.
 * Used by React components AND by the build-time prerender plugin in
 * vite.config.js, so the static HTML crawlers see always matches the app.
 */
const site = {
  url: 'https://sumitthapaliya.com.np/',
  name: 'Sumit Thapaliya',
  firstName: 'Sumit',
  greeting: "Hi, I'm",
  // H2 under the H1 — descriptive, keyword-rich, human.
  role: 'Software Developer & Full Stack Developer from Nepal — crafting React, Node.js & AI-powered web applications',
  roles: [
    'Software Developer',
    'Full Stack Developer',
    'React & Node.js Engineer',
    'Based in Nepal',
    'Building MedBridge',
  ],
  location: 'Kathmandu, Nepal',
  email: 'sumitthapaliya63@gmail.com',
  summary:
    "I'm Sumit Thapaliya, a software developer from Kathmandu, Nepal who builds modern web applications end to end — from PostgreSQL schemas and Express APIs to responsive, animated React interfaces. This portfolio spans healthcare software (MedBridge), AI tools built on Gemini, and computer-vision projects in Python.",
  summary2:
    'I care about clean architecture, performance, and software that holds up under real use. Currently open to full-time software developer roles, internships and freelance projects in Nepal or remote.',
  availability: 'Open to work',
  socials: [
    { label: 'GitHub', href: 'https://github.com/Sumit-Thapaliya' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sumit-thapaliya-8b4b84426/' },
    { label: 'Email', href: 'mailto:sumitthapaliya63@gmail.com' },
    // Add your real X / Twitter profile here when ready, e.g.
    // { label: 'Twitter / X', href: 'https://x.com/<handle>' },
  ],
  nav: [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ],
};

export default site;
