import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import LineReveal from './ui/LineReveal.jsx';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const bigRef = useRef(null);

  // Oversized ghost word that slides horizontally with scroll — a cinematic
  // backdrop that makes the section feel like a title card.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !bigRef.current) return;

    const tween = gsap.fromTo(
      bigRef.current,
      { xPercent: 10 },
      {
        xPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="projects" className="projects">
      <span className="projects__ghost" ref={bigRef} aria-hidden="true">
        WORK
      </span>

      <div className="sb-container">
        <motion.span
          className="sb-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Projects
        </motion.span>

        <h2 className="projects__heading">
          <LineReveal>
            Selected <span className="sb-gradient-text">work.</span>
          </LineReveal>
        </h2>
        <motion.p
          className="projects__note"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          A look inside Sumit Thapaliya's portfolio: healthcare software, AI
          tools and computer-vision experiments — built end to end, from data
          model to deployed UI.
        </motion.p>

        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard project={project} index={i} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
