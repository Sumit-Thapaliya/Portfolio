import { useEffect, useState } from 'react';
import useScramble from '../hooks/useScramble.js';
import './Navbar.css';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

function ScrambleLink({ href, label }) {
  const { ref, handleMouseEnter, handleMouseLeave } = useScramble();
  return (
    <a href={href} ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {label}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="sb-container nav__inner">
        <a href="#top" className="nav__brand">
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
