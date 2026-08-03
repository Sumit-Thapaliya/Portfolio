import { motion } from 'framer-motion';
import projects from '../data/projects.js';
import ProjectCard from './ProjectCard.jsx';
import './Projects.css';

export default function Projects() {
  return (
    <section id="projects" className="projects">
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

        <motion.h2
          className="projects__heading sb-gradient-text"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.05 }}
        >
          Selected work.
        </motion.h2>
        <motion.p
          className="projects__note"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          A mix of real and in-progress builds. Links and details are
          placeholders for now.
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
