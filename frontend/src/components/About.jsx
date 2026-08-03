import { motion } from 'framer-motion';
import './About.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
          <motion.h2
            className="about__heading sb-gradient-text"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            I like building things that hold up under real use — not just in
            a demo.
          </motion.h2>

          <motion.div
            className="about__body"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <p>
              I'm Sumit Thapaliya, a full-stack developer who enjoys the
              whole path from a database schema to the interface someone
              actually clicks on. I care about clean architecture — routes
              that stay thin, services that hold the logic, and data that's
              validated before it ever reaches a controller.
            </p>
            <p>
              My current focus is <strong>MedBridge</strong>, a healthcare
              medicine exchange platform where hospitals and clinics manage
              inventory, request stock exchanges, track expiry dates, and
              soon rely on AI-powered demand forecasting. Working on
              something used by real institutions has shaped how I think
              about resilience, edge cases, and building software people can
              actually trust.
            </p>
            <p>
              Outside of the stack I already know well, I'm always picking up
              the next piece of the puzzle — right now that's sharpening how
              I design APIs and how I animate the front end without it
              getting in the user's way.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
