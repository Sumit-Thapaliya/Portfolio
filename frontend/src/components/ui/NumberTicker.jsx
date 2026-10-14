import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import './ui.css';

/** Counts up from 0 to `value` when scrolled into view. */
export default function NumberTicker({ value, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 120 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString() + suffix;
    });
  }, [spring, suffix]);

  return (
    <div className="stat">
      <span className="stat__value" ref={ref}>
        0{suffix}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  );
}
