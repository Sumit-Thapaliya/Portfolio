import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ui.css';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span className="text-reveal__word" style={{ opacity, y }}>
      {children}
    </motion.span>
  );
}

/**
 * Words light up one by one as the user scrolls the element through the
 * viewport (Magic UI "Text Reveal" behaviour, scroll-linked not time-based).
 */
export default function TextReveal({ text, as: Tag = 'p', className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.45'],
  });
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={`text-reveal ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </Tag>
  );
}
