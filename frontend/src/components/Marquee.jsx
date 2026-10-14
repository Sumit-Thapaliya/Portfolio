import { useEffect, useRef } from 'react';
import sceneState from './three/sceneState.js';
import './Marquee.css';

const ROW_A = ['Software Developer', 'React', 'Node.js', 'Python', 'AI Products', 'Open to Work'];
const ROW_B = ['Sumit Thapaliya', 'Kathmandu · Nepal', 'Full Stack', 'Design-minded', "Let's Build"];

/**
 * Two counter-scrolling rows whose speed, direction and skew follow the
 * user's scroll velocity (Lenis) — the classic "awwwards" marquee.
 */
function Row({ items, dir = 1, outline = false }) {
  const trackRef = useRef(null);
  const x = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf;
    let last = performance.now();
    let skew = 0;

    function tick(now) {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      const v = sceneState.velocity || 0;
      const speed = (0.6 + Math.min(Math.abs(v) * 0.08, 6)) * dt;
      const direction = v < -0.5 ? -dir : dir; // reverse when scrolling up
      x.current -= speed * direction;

      const half = el.scrollWidth / 2;
      if (x.current <= -half) x.current += half;
      if (x.current > 0) x.current -= half;

      skew += (Math.max(-12, Math.min(12, v * 0.25)) - skew) * 0.08;
      el.style.transform = `translate3d(${x.current}px,0,0) skewX(${skew}deg)`;
      raf = requestAnimationFrame(tick);
    }

    if (!reduced) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const content = [...items, ...items];
  return (
    <div className={`marquee__row ${outline ? 'marquee__row--outline' : ''}`}>
      <div className="marquee__track" ref={trackRef}>
        {content.map((t, i) => (
          <span className="marquee__item" key={i}>
            {t}
            <i className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <Row items={ROW_A} dir={1} />
      <Row items={ROW_B} dir={-1} outline />
    </div>
  );
}
