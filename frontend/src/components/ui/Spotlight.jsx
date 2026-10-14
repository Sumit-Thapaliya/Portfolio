import { useEffect, useRef } from 'react';
import './ui.css';

/** Soft teal light that follows the cursor. Static on touch devices. */
export default function Spotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) return;
    let raf = 0;
    function onMove(e) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--spot-x', `${e.clientX}px`);
        ref.current?.style.setProperty('--spot-y', `${e.clientY}px`);
      });
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="spotlight" ref={ref} aria-hidden="true" />;
}
