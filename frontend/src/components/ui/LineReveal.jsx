import { motion } from 'framer-motion';
import './ui.css';

const wrapper = { hidden: {}, visible: {} };
const inner = {
  hidden: { y: '110%', rotate: 2 },
  visible: (delay = 0) => ({
    y: '0%',
    rotate: 0,
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * Masked slide-up reveal for headings (the classic "cinematic" title entrance).
 * The *wrapper* is observed (the clipped inner span would never intersect),
 * and the variant propagates down to the inner line.
 */
export default function LineReveal({ children, delay = 0, className = '' }) {
  return (
    <motion.span
      className={`line-reveal ${className}`}
      variants={wrapper}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span className="line-reveal__inner" variants={inner} custom={delay}>
        {children}
      </motion.span>
    </motion.span>
  );
}
