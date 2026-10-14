import { useEffect, useState } from 'react';
import useScramble from '../hooks/useScramble.js';
import site from '../data/site.js';
import './Navbar.css';

const LINKS = site.nav;

function ScrambleLink({ href, label }) {
  const { ref, handleMouseEnter, handleMouseLeave } = useScramble();
  return (
    <a href={href} ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {label}
    </a>
  );
}

export default function Navbar({ ready = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Hide when scrolling down past the hero, reveal on any upward move
      if (y > lastY + 4 && y > window.innerHeight * 0.6) setAway(true);
      else if (y < lastY - 4) setAway(false);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${away ? 'nav--away' : ''} ${ready ? '' : 'nav--hidden'}`} aria-label="Primary">
      <div className="sb-container nav__inner">
        <a href="#top" className="nav__brand" aria-label={`${site.name} – Software Developer portfolio home`}>
          ST<span className="nav__brand-dot">.</span>
        </a>
        <ul className="nav__links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <ScrambleLink href={link.href} label={link.label} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
