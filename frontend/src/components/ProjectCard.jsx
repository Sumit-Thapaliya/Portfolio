import { useRef } from 'react';
import { motion } from 'framer-motion';
import useScramble from '../hooks/useScramble.js';
import BorderBeam from './ui/BorderBeam.jsx';
import './ProjectCard.css';

const MAX_TILT = 8; // degrees

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const titleScramble = useScramble();

  function handleMouseMove(e) {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width - 0.5) * 2; // -1 to 1
    const percentY = (y / rect.height - 0.5) * 2;

    card.style.setProperty('--rx', `${-percentY * MAX_TILT}deg`);
    card.style.setProperty('--ry', `${percentX * MAX_TILT}deg`);
    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    titleScramble.handleMouseLeave();
  }

  const hasCode = project.codeUrl && project.codeUrl !== '#';
  const hasLive = project.liveUrl && project.liveUrl !== '#';

  return (
    <motion.article
      className="pcard"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={titleScramble.handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60, rotateZ: index % 2 === 0 ? -2 : 2, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <BorderBeam duration={5 + (index % 3)} />
      <div className="pcard__glow" />
      <div className="pcard__inner">
        <div className="pcard__top">
          <span className="pcard__index">
            {String(index + 1).padStart(2, '0')}
            {project.year && <span className="pcard__status">{project.year}</span>}
          </span>
          <div className="pcard__links">
            {hasLive && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                Live ↗
              </a>
            )}
            {hasCode ? (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
              >
                Code ↗
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="pcard__title" ref={titleScramble.ref}>
            {project.title}
          </h3>
          {project.tagline && <p className="pcard__tagline">{project.tagline}</p>}
          <p className="pcard__desc">{project.description}</p>
        </div>

        <ul className="pcard__tech" aria-label="Technologies used">
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}
