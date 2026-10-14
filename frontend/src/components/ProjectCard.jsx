import { useRef } from 'react';
import { motion } from 'framer-motion';
import useScramble from '../hooks/useScramble.js';
import BorderBeam from './ui/BorderBeam.jsx';
import './ProjectCard.css';

const MAX_TILT = 8; // degrees
const HUES = [168, 32, 205, 285, 140, 12]; // per-card cover tint

export default function ProjectCard({ project, index, horizontal = false }) {
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
      data-cursor={hasLive || hasCode ? 'Open' : undefined}
      onClick={() => {
        const url = project.liveUrl || project.codeUrl;
        if (url) window.open(url, '_blank', 'noopener,noreferrer');
      }}
      onMouseMove={horizontal ? undefined : handleMouseMove}
      onMouseEnter={titleScramble.handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Horizontal gallery: GSAP owns `transform`, so framer only fades.
      initial={horizontal ? { opacity: 0 } : { opacity: 0, y: 60, rotateZ: index % 2 === 0 ? -2 : 2, filter: 'blur(6px)' }}
      animate={horizontal ? { opacity: 1 } : undefined}
      whileInView={horizontal ? undefined : { opacity: 1, y: 0, rotateZ: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={horizontal ? { transform: 'none' } : undefined}
    >
      <BorderBeam duration={5 + (index % 3)} />
      <div className="pcard__glow" />
      <div className="pcard__cover" style={{ '--hue': HUES[index % HUES.length] }} aria-hidden="true">
        <span className="pcard__cover-orb" />
        <span className="pcard__cover-orb pcard__cover-orb--b" />
        <span className="pcard__cover-grid" />
        <span className="pcard__cover-mono">{project.title.slice(0, 2)}</span>
        <span className="pcard__cover-shine" />
        <span className="pcard__cover-tag">{project.tagline}</span>
      </div>
      <div className="pcard__inner">
        <div className="pcard__top">
          <span className="pcard__index">
            {String(index + 1).padStart(2, '0')}
            {project.year && <span className="pcard__status">{project.year}</span>}
          </span>
          <div className="pcard__links">
            {hasLive && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                Live ↗
              </a>
            )}
            {hasCode ? (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source code on GitHub`}
                onClick={(e) => e.stopPropagation()}
              >
                Code ↗
              </a>
            ) : null}
          </div>
        </div>

        <span className="pcard__bignum" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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
