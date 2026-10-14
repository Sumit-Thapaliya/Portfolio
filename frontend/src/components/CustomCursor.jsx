import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

/**
 * Dot + trailing ring. Elements can opt into a labelled state with
 * `data-cursor="Open"` (ring grows and shows the word). Links/buttons get the
 * default "active" grow. Disabled on coarse pointers.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    const ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: ringPos.x, y: ringPos.y };

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    function handleMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.to(dot, { x: mouse.x, y: mouse.y, duration: 0.1, ease: 'power2.out' });
    }

    let rafId;
    function raf() {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      rafId = requestAnimationFrame(raf);
    }

    function handleOver(e) {
      const labelled = e.target.closest('[data-cursor]');
      if (labelled) {
        label.textContent = labelled.getAttribute('data-cursor');
        ring.classList.add('cursor__ring--label');
        dot.classList.add('cursor__dot--hide');
        return;
      }
      if (e.target.closest('a, button, input, textarea, .skills__group')) {
        ring.classList.add('cursor__ring--active');
        dot.classList.add('cursor__dot--active');
      }
    }

    function handleOut(e) {
      if (e.target.closest('[data-cursor]')) {
        ring.classList.remove('cursor__ring--label');
        dot.classList.remove('cursor__dot--hide');
      }
      if (e.target.closest('a, button, input, textarea, .skills__group')) {
        ring.classList.remove('cursor__ring--active');
        dot.classList.remove('cursor__dot--active');
      }
    }

    function handleDown() {
      ring.classList.add('cursor__ring--down');
    }
    function handleUp() {
      ring.classList.remove('cursor__ring--down');
    }

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div className="cursor__ring" ref={ringRef} aria-hidden="true">
        <span className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor__dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
