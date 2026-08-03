import { useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';

/**
 * Attach to a text element to make it "scramble" into random characters
 * before resolving back to the original text on hover — a glitch-style
 * effect for nav links, card titles, etc.
 */
export default function useScramble() {
  const ref = useRef(null);
  const frameRef = useRef(null);
  const originalRef = useRef('');

  function handleMouseEnter() {
    const el = ref.current;
    if (!el) return;
    if (!originalRef.current) originalRef.current = el.textContent;
    const original = originalRef.current;

    let iteration = 0;
    clearInterval(frameRef.current);

    frameRef.current = setInterval(() => {
      el.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return original[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      if (iteration >= original.length) {
        clearInterval(frameRef.current);
        el.textContent = original;
      }
      iteration += 1 / 2;
    }, 28);
  }

  function handleMouseLeave() {
    clearInterval(frameRef.current);
    if (ref.current && originalRef.current) {
      ref.current.textContent = originalRef.current;
    }
  }

  return { ref, handleMouseEnter, handleMouseLeave };
}
