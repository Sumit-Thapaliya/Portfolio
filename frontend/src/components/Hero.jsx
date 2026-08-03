import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMagnetic from '../hooks/useMagnetic.js';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const NAME = 'Sumit Thapaliya';
const ROLES = ['Full Stack Developer', 'React & Node.js', 'Building MedBridge'];

export default function Hero({ ready }) {
  const nameRef = useRef(null);
  const subRef = useRef(null);
  const metaRef = useRef(null);
  const roleRef = useRef(null);
  const primaryBtn = useMagnetic(0.3);
  const ghostBtn = useMagnetic(0.3);

  // Letter-by-letter name reveal, runs once `ready` (intro finished) is true
  useEffect(() => {
    if (!ready) return;

    const letters = nameRef.current.querySelectorAll('.hero__letter');

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.set(letters, { opacity: 0, y: 28, rotateX: -25 })
      .to(letters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.028,
      })
      .to(
        nameRef.current,
        { backgroundPosition: '200% center', duration: 2.2, ease: 'sine.inOut' },
        '-=0.2'
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      )
      .fromTo(
        metaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.35'
      );
  }, [ready]);

  // Rotating role typewriter
  useEffect(() => {
    if (!ready) return;
    let index = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    function tick() {
      const current = ROLES[index];
      const el = roleRef.current;
      if (!el) return;

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          index = (index + 1) % ROLES.length;
        }
      }
      timeoutId = setTimeout(tick, deleting ? 35 : 55);
    }

    const startDelay = setTimeout(tick, 1600);
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [ready]);

  // Letters magnify and tilt toward the cursor as it passes near the name —
  // a small "magnetic type" effect that makes the hero feel alive.
  useEffect(() => {
    if (!ready) return;
    const container = nameRef.current;
    if (!container) return;

    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;

    const letters = Array.from(container.querySelectorAll('.hero__letter'));
    const RADIUS = 140;

    function handleMove(e) {
      for (const letter of letters) {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (dist < RADIUS) {
          const strength = 1 - dist / RADIUS;
          gsap.to(letter, {
            y: -strength * 10,
            scale: 1 + strength * 0.2,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        } else {
          gsap.to(letter, {
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'elastic.out(1, 0.75)',
            overwrite: 'auto',
          });
        }
      }
    }

    function handleLeave() {
      gsap.to(letters, {
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    }

    window.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, [ready]);

  // Parallax: as the person scrolls past the hero, the content drifts up
  // and fades faster than the scroll itself, giving a sense of depth.
  useEffect(() => {
    if (!ready) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      animation: gsap.to(metaRef.current.closest('.hero__inner'), {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
      }),
    });

    return () => trigger.kill();
  }, [ready]);

  return (
    <section id="top" className="hero">
      <div className="sb-container hero__inner">
        <span className="sb-eyebrow">Portfolio / 2026</span>

        <h1 className="hero__name sb-gradient-text" ref={nameRef} aria-label={NAME}>
          {NAME.split('').map((char, i) => (
            <span className="hero__letter" key={i}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <p className="hero__role" ref={subRef}>
          <span className="hero__role-text" ref={roleRef} />
          <span className="hero__role-cursor" />
        </p>

        <div className="hero__meta" ref={metaRef}>
          <p className="hero__summary">
            I design and build full-stack web applications end to end — from
            database schema to the pixels people touch. Currently building{' '}
            <strong>MedBridge</strong>, a medicine exchange platform helping
            hospitals and clinics manage inventory, trade stock, and track
            expiry in real time.
          </p>
          <div className="hero__actions">
            <a
              href="#projects"
              className="hero__btn hero__btn--primary"
              ref={primaryBtn.ref}
              onMouseMove={primaryBtn.handleMouseMove}
              onMouseLeave={primaryBtn.handleMouseLeave}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="hero__btn hero__btn--ghost"
              ref={ghostBtn.ref}
              onMouseMove={ghostBtn.handleMouseMove}
              onMouseLeave={ghostBtn.handleMouseLeave}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
