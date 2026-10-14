import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projects from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import CharReveal from './ui/CharReveal.jsx';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return desktop;
}

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const ghostRef = useRef(null);
  const progressRef = useRef(null);
  const desktop = useDesktop();

  // Desktop: pin the section and scroll the card track horizontally.
  useEffect(() => {
    if (!desktop) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth + 120;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Ghost word drifts the opposite way, slower
      gsap.to(ghostRef.current, {
        xPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: 1 },
      });

      // Cards: ease in (scale + opacity) as they enter from the right
      track.querySelectorAll('.pcard').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.9, opacity: 0.35, y: 24 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 95%',
              end: 'left 60%',
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [desktop]);

  return (
    <section
      id="projects"
      className={`projects ${desktop ? 'projects--pinned' : ''}`}
      ref={sectionRef}
    >
      <span className="projects__ghost" ref={ghostRef} aria-hidden="true">
        WORK
      </span>

      <div className="sb-container projects__head">
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
          <CharReveal text="Selected" accent="work." />
        </h2>
        <motion.p
          className="projects__note"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          Six builds from Sumit Thapaliya's GitHub — AI tooling, vision,
          healthcare and design software.
          {desktop && <span className="projects__hint"> Scroll to explore →</span>}
        </motion.p>
      </div>

      <div className="projects__viewport">
        <div className="projects__track" ref={trackRef}>
          {projects.map((project, i) => (
            <ProjectCard project={project} index={i} key={`${project.id}-${desktop ? 'h' : 'v'}`} horizontal={desktop} />
          ))}
          {desktop && (
            <a
              className="projects__more"
              href="https://github.com/Sumit-Thapaliya?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GitHub"
            >
              <span className="projects__more-num">31</span>
              <span className="projects__more-label">
                public repos
                <br />
                on GitHub ↗
              </span>
            </a>
          )}
        </div>
      </div>

      {desktop && (
        <div className="projects__progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      )}
    </section>
  );
}
