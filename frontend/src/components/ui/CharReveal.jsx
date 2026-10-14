import { motion } from 'framer-motion';

const container = {
  hidden: {},
  visible: (delay = 0) => ({
    transition: { staggerChildren: 0.022, delayChildren: delay },
  }),
};

const char = {
  hidden: { y: '110%', rotateX: -80, opacity: 0, filter: 'blur(6px)' },
  visible: {
    y: '0%',
    rotateX: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Splits a line into words → characters and reveals each character with a
 * 3D flip + blur, staggered. `accent` marks the trailing words to render in
 * the italic serif gradient.
 *
 *   <CharReveal text="The stack I" accent="build with." />
 */
export default function CharReveal({ text = '', accent = '', delay = 0, as: Tag = 'span', className = '' }) {
  const parts = [
    ...text.split(' ').filter(Boolean).map((w) => ({ w, accent: false })),
    ...accent.split(' ').filter(Boolean).map((w) => ({ w, accent: true })),
  ];

  return (
    <motion.span
      className={`char-reveal ${className}`}
      variants={container}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      style={{ perspective: 600 }}
      aria-label={[text, accent].filter(Boolean).join(' ')}
    >
      {parts.map((part, wi) => {
        const Inner = part.accent ? 'em' : 'span';
        const chars = part.w.split('');
        const n = chars.length;
        return (
          <Inner key={wi} className={`char-reveal__word ${part.accent ? 'sb-accent sb-accent--chars' : ''}`} aria-hidden="true">
            {chars.map((c, ci) => (
              <motion.span
                key={ci}
                className="char-reveal__char"
                variants={char}
                // background-clip:text breaks across transformed children, so each
                // character paints its own slice of the gradient instead.
                style={
                  part.accent
                    ? { backgroundSize: `${n * 100}% 100%`, backgroundPosition: `${n > 1 ? (ci / (n - 1)) * 100 : 0}% 0` }
                    : undefined
                }
              >
                {c}
              </motion.span>
            ))}
          </Inner>
        );
      })}
    </motion.span>
  );
}
