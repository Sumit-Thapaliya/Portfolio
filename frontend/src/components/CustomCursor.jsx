import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

/**
 * A small dot + a trailing ring that eases toward the pointer. The ring
 * grows and the dot fades whenever the pointer is over something
 * interactive (links, buttons, cards). Disabled automatically on touch /
 * coarse-pointer devices via CSS (see index.css: `cursor: none` only
 * applies under hover+fine media query) and here via a JS guard.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: ringPos.x, y: ringPos.y };

    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    function handleMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.12, ease: 'power2.out' });
    }

    function raf() {
      ringPos.x += (mouse.x - ringPos.x) * 0.15;
      ringPos.y += (mouse.y - ringPos.y) * 0.15;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      requestAnimationFrame(raf);
    }

    function handleOver(e) {
      if (e.target.closest('a, button, .pcard, input, textarea')) {
        ring.classList.add('cursor__ring--active');
        dot.classList.add('cursor__dot--active');
      }
    }

    function handleOut(e) {
      if (e.target.closest('a, button, .pcard, input, textarea')) {
        ring.classList.remove('cursor__ring--active');
        dot.classList.remove('cursor__dot--active');
      }
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);
    const rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor__ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
