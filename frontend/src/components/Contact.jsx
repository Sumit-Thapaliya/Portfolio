import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import site from '../data/site.js';
import CharReveal from './ui/CharReveal.jsx';
import ShimmerButton from './ui/ShimmerButton.jsx';
import './Contact.css';

const SOCIALS = site.socials;
const GITHUB = SOCIALS.find((s) => s.label === 'GitHub')?.href;
const LINKEDIN = SOCIALS.find((s) => s.label === 'LinkedIn')?.href;

const MAILTO = `mailto:${site.email}?subject=${encodeURIComponent(
  `Hi Sumit — let's work together`
)}&body=${encodeURIComponent(`Hi Sumit,\n\nI came across your portfolio and `)}`;

/* Lines that "boot" automatically when the terminal scrolls into view */
const BOOT = [
  { t: 'cmd', v: 'whoami' },
  { t: 'out', v: `${site.name} — software developer, ${site.location}` },
  { t: 'cmd', v: 'status' },
  { t: 'ok', v: `${site.availability.toLowerCase()} · replies within 24h` },
  { t: 'cmd', v: 'help' },
  { t: 'out', v: 'commands: email · copy · github · linkedin · stack · clear' },
];

function kathmanduTime() {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

export default function Contact() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [booted, setBooted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState(kathmanduTime());
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const termRef = useRef(null);

  // Live Kathmandu clock in the terminal title bar
  useEffect(() => {
    const id = setInterval(() => setClock(kathmanduTime()), 1000);
    return () => clearInterval(id);
  }, []);

  // Boot sequence: type the lines in one by one when the terminal is visible
  useEffect(() => {
    const el = termRef.current;
    if (!el || booted) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setBooted(true);
        let i = 0;
        const timer = setInterval(() => {
          const line = BOOT[i]; // capture now — never read `i` inside the updater
          i++;
          if (i >= BOOT.length) clearInterval(timer);
          if (line) setLines((prev) => [...prev, line]);
        }, 420);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [booted]);

  // Keep the newest line in view
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }

  function open(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const push = (...out) => setLines((prev) => [...prev, { t: 'cmd', v: raw }, ...out]);

    switch (cmd) {
      case 'help':
        push({ t: 'out', v: 'commands: email · copy · github · linkedin · stack · clear' });
        break;
      case 'email':
      case 'mail':
      case 'hire':
        push({ t: 'ok', v: `opening mail client → ${site.email}` });
        window.location.href = MAILTO;
        break;
      case 'copy':
        copyEmail().then((ok) =>
          setLines((prev) => [
            ...prev,
            ok
              ? { t: 'ok', v: `${site.email} copied to clipboard` }
              : { t: 'err', v: `clipboard blocked — email is ${site.email}` },
          ])
        );
        setLines((prev) => [...prev, { t: 'cmd', v: raw }]);
        break;
      case 'github':
      case 'gh':
        push({ t: 'ok', v: `→ ${GITHUB}` });
        open(GITHUB);
        break;
      case 'linkedin':
      case 'li':
        push({ t: 'ok', v: `→ ${LINKEDIN}` });
        open(LINKEDIN);
        break;
      case 'stack':
        push({ t: 'out', v: 'react · node.js · express · postgresql · prisma · python · gemini api' });
        break;
      case 'whoami':
        push({ t: 'out', v: `${site.name} — software developer, ${site.location}` });
        break;
      case 'status':
        push({ t: 'ok', v: `${site.availability.toLowerCase()} · replies within 24h` });
        break;
      case 'clear':
      case 'cls':
        setLines([]);
        break;
      case 'sudo hire sumit':
        push({ t: 'ok', v: 'permission granted. opening mail client…' });
        window.location.href = MAILTO;
        break;
      default:
        push({ t: 'err', v: `command not found: ${cmd} — try "help"` });
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    run(input);
    setInput('');
  }

  return (
    <section id="contact" className="contact">
      <div className="sb-container sb-skew">
        <motion.span
          className="sb-eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          Contact
        </motion.span>

        <div className="contact__grid">
          <motion.div
            className="contact__intro"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55 }}
          >
            <h2 className="contact__heading">
              <CharReveal text="Let's build" />
              <CharReveal accent="something." delay={0.15} />
            </h2>
            <p className="contact__text">
              Looking for a software developer in Nepal or a remote full-stack
              developer? Have a project, role, or idea in mind? Drop me an email
              and I'll get back to you directly — usually within a day.
            </p>

            <div className="contact__actions">
              <ShimmerButton href={MAILTO} className="contact__cta">
                Email me
              </ShimmerButton>
              <button
                type="button"
                className={`contact__copy ${copied ? 'contact__copy--done' : ''}`}
                onClick={copyEmail}
                aria-live="polite"
              >
                <span className="contact__copy-addr">{site.email}</span>
                <span className="contact__copy-label">{copied ? 'Copied ✓' : 'Copy'}</span>
              </button>
            </div>

            <ul className="contact__socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ---- Interactive terminal (no backend needed) ---- */}
          <motion.div
            className="term"
            ref={termRef}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="term__bar">
              <span className="term__dots" aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="term__title">sumit@portfolio — contact</span>
              <span className="term__clock" title="Local time in Kathmandu">
                KTM {clock}
              </span>
            </div>

            <div className="term__body" ref={bodyRef} aria-live="polite">
              {lines.filter(Boolean).map((l, i) => (
                <p key={i} className={`term__line term__line--${l.t}`}>
                  {l.t === 'cmd' ? (
                    <>
                      <span className="term__prompt">➜</span> {l.v}
                    </>
                  ) : (
                    l.v
                  )}
                </p>
              ))}

              <form className="term__input-row" onSubmit={onSubmit}>
                <label htmlFor="term-input" className="term__prompt">
                  ➜
                </label>
                <input
                  id="term-input"
                  ref={inputRef}
                  className="term__input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={booted ? 'type a command… e.g. email' : ''}
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Terminal command"
                />
              </form>
            </div>

            <div className="term__chips" aria-label="Quick commands">
              {['email', 'copy', 'github', 'linkedin', 'help'].map((c) => (
                <button key={c} type="button" className="term__chip" onClick={() => run(c)}>
                  {c}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
