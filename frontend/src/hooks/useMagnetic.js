import { useRef } from 'react';
import gsap from 'gsap';

/**
 * Attach to any element to give it a subtle "magnetic" pull toward the
 * cursor on hover, and a snap-back on leave. Returns a ref to attach.
 */
export default function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.35,
      ease: 'power3.out',
    });
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  }

  return { ref, handleMouseMove, handleMouseLeave };
}
