import { motion } from 'framer-motion';
import skills from '../data/skills.js';
import './Skills.css';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="sb-container">
        <motion.span
          className="sb-eyebrow"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Skills
        </motion.span>

        <motion.h2
          className="skills__heading sb-gradient-text"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          The stack I build with.
        </motion.h2>

        <div className="skills__grid">
          {skills.map((group, i) => (
            <motion.div
              className="skills__group"
              key={group.group}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="skills__group-title">{group.group}</h3>
              <ul className="skills__tags">
                {group.items.map((item) => (
                  <li key={item} className="skills__tag">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
