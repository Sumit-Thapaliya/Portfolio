import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendContactMessage } from '../lib/api.js';
import site from '../data/site.js';
import LineReveal from './ui/LineReveal.jsx';
import './Contact.css';

const SOCIALS = site.socials;

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(STATUS.SENDING);
    setErrorMsg('');

    try {
      await sendContactMessage(form);
      setStatus(STATUS.SUCCESS);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus(STATUS.ERROR);
      setErrorMsg(
        err?.response?.data?.message ||
          'Something went wrong sending your message. Please try again.'
      );
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="sb-container">
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
              <LineReveal>Let's build</LineReveal>
              <LineReveal delay={0.08}>
                <span className="sb-gradient-text">something.</span>
              </LineReveal>
            </h2>
            <p className="contact__text">
              Looking for a software developer in Nepal or a remote full-stack
              developer? Have a project, role, or idea in mind? Send a message
              and I'll get back to you directly — usually within a day.
            </p>
            <a className="contact__email" href={`mailto:${site.email}`}>
              {site.email}
            </a>

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

          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="contact__field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            <div className="contact__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
              />
            </div>

            <button
              type="submit"
              className="contact__submit shimmer-btn"
              disabled={status === STATUS.SENDING}
            >
              {status === STATUS.SENDING ? 'Sending…' : 'Send Message'}
            </button>

            {status === STATUS.SUCCESS && (
              <p className="contact__status contact__status--success">
                Message sent — thanks! I'll reply soon.
              </p>
            )}
            {status === STATUS.ERROR && (
              <p className="contact__status contact__status--error">
                {errorMsg}
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
