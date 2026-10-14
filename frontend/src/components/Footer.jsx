import site from '../data/site.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="sb-container footer__inner">
        <span>
          © {new Date().getFullYear()} {site.name} · Software Developer, {site.location} · Sumit Thapaliya Portfolio
        </span>
        <span className="footer__note">Built with React, Three.js, GSAP & Node.js</span>
      </div>
    </footer>
  );
}
