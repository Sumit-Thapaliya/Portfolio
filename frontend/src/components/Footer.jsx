import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import site from '../data/site.js';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const bigRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !bigRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bigRef.current,
        { yPercent: 40, opacity: 0.2 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  function toTop(e) {
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <footer className="footer">
      <div className="sb-container footer__top">
        <span>
          © {new Date().getFullYear()} {site.name} · Software Developer, {site.location} · Sumit Thapaliya Portfolio
        </span>
        <a href="#top" onClick={toTop} className="footer__up" data-cursor="Top">
          Back to top ↑
        </a>
      </div>
      <div className="footer__big" ref={bigRef} aria-hidden="true">
        <span className="footer__big-text">{site.name}</span>
      </div>
    </footer>
  );
}
