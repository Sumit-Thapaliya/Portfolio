import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="sb-container footer__inner">
        <span>© {new Date().getFullYear()} Sumit Thapaliya</span>
        <span className="footer__note">Built with React, GSAP & Node.js</span>
      </div>
    </footer>
  );
}
