import { motion } from 'framer-motion';
import site from '../data/site.js';
import projects from '../data/projects.js';
import skills from '../data/skills.js';
import TextReveal from './ui/TextReveal.jsx';
import NumberTicker from './ui/NumberTicker.jsx';
import LineReveal from './ui/LineReveal.jsx';
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
  { value: 3, suffix: '', label: 'AI / ML builds' },
  { value: 100, suffix: '%', label: 'Full-stack ownership' },
];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="sb-container">
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
            <LineReveal>I like building things that</LineReveal>
            <LineReveal delay={0.08}>
              <span className="sb-gradient-text">hold up under real use</span>
            </LineReveal>
            <LineReveal delay={0.16}>— not just in a demo.</LineReveal>
          </h2>

          <div className="about__body">
            <TextReveal
              className="about__lead"
              text={`I'm ${site.name}, a software developer and full-stack developer based in ${site.location} who enjoys the whole path from a database schema to the interface someone actually clicks on. I care about clean architecture — routes that stay thin, services that hold the logic, and data that's validated before it ever reaches a controller.`}
            />
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              My current focus is <strong>MedBridge</strong>, a healthcare
              medicine exchange platform where hospitals and clinics manage
              inventory, request stock exchanges, track expiry dates, and soon
              rely on AI-powered demand forecasting. Working on something used by
              real institutions has shaped how I think about resilience, edge
              cases, and building software people can actually trust.
            </motion.p>
            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
            >
              Beyond the web stack, I've shipped Python projects in computer
              vision and speech, and I build on LLM APIs like Google Gemini.
              As a software developer in Nepal, I'm focused on writing code
              that's maintainable, well-tested, and genuinely useful — and on
              animating the front end without it getting in the user's way.
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
