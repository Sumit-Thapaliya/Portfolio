import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'top', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Stack' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Fixed right-hand rail: section index + label, active one tracked with an
 * IntersectionObserver. Click → Lenis smooth scroll.
 */
export default function SectionHUD({ ready }) {
  const [active, setActive] = useState('top');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function go(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { duration: 1.4, offset: id === 'top' ? 0 : -20 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className={`hud ${ready ? 'hud--ready' : ''}`} aria-label="Section navigation">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          type="button"
          className={`hud__item ${active === s.id ? 'hud__item--active' : ''}`}
          onClick={() => go(s.id)}
          aria-label={`Go to ${s.label}`}
        >
          <span className="hud__label">{s.label}</span>
          <span>0{i + 1}</span>
          <span className="hud__bar" />
        </button>
      ))}
    </nav>
  );
}
