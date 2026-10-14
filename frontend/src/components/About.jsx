import { motion } from 'framer-motion';
import site from '../data/site.js';
import projects from '../data/projects.js';
import skills from '../data/skills.js';
import TextReveal from './ui/TextReveal.jsx';
import NumberTicker from './ui/NumberTicker.jsx';
import CharReveal from './ui/CharReveal.jsx';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const totalSkills = skills.reduce((n, g) => n + g.items.length, 0);

const STATS = [
  { value: projects.length, suffix: '+', label: 'Projects built' },
  { value: totalSkills, suffix: '+', label: 'Technologies' },
  { value: 31, suffix: '', label: 'Public repos' },
  { value: 4, suffix: '', label: 'AI / ML products' },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="sb-container sb-skew">
        <motion.span
          className="sb-eyebrow"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          About
        </motion.span>

        <div className="about__grid">
          <h2 className="about__heading">
            <CharReveal text="I build things that" />
            <CharReveal text="hold up under" accent="real use" delay={0.15} />
            <CharReveal text="— not just in a demo." delay={0.3} />
          </h2>

          <div className="about__body">
            <TextReveal
              className="about__lead"
              text={`I'm ${site.name}, a software developer in ${site.location}. I enjoy the whole path from a database schema to the interface someone actually clicks — and I care that it holds up in production.`}
            />
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              Recent work spans AI developer tools, on-device computer vision,
              healthcare software and browser-based design tools — mostly
              React, Node.js, Python and whatever model fits the problem.
            </motion.p>
          </div>
        </div>

        <motion.div
          className="about__stats"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {STATS.map((s) => (
            <NumberTicker key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
