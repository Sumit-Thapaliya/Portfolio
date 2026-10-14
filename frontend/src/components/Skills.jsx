import { motion } from 'framer-motion';
import skills from '../data/skills.js';
import BorderBeam from './ui/BorderBeam.jsx';
import CharReveal from './ui/CharReveal.jsx';
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
      <div className="sb-container sb-skew">
        <motion.span
          className="sb-eyebrow"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Skills
        </motion.span>

        <h2 className="skills__heading">
          <CharReveal text="The stack I" accent="build with." />
        </h2>
        <motion.p
          className="skills__note"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          Frontend to database to deployment — plus the AI and machine-learning
          tooling I reach for when a product needs to be smarter.
        </motion.p>

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
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
              }}
            >
              <BorderBeam duration={5 + (i % 3)} />
              <span className="skills__spot" aria-hidden="true" />
              <span className="skills__group-index">0{i + 1}</span>
              <h3 className="skills__group-title">{group.group}</h3>
              <motion.ul
                className="skills__tags"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } } }}
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    className="skills__tag"
                    variants={{
                      hidden: { opacity: 0, scale: 0.5, y: 14, filter: 'blur(4px)' },
                      visible: { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 320, damping: 18 } },
                    }}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
