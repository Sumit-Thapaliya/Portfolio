import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import sceneState from './three/sceneState.js';
import site from '../data/site.js';
import './Preloader.css';

const WORDS = ['Software', 'Design', 'Motion', 'Craft'];

/**
 * Cinematic preloader: a counter climbs to 100 while the 3D objects float,
 * dimmed, behind a dark veil. On completion the counter blows up, the veil
 * splits open vertically and the camera dollies in (via sceneState.intro).
 * Shown once per session; skipped entirely for prefers-reduced-motion.
 */
export default function Preloader({ onFinish }) {
  const rootRef = useRef(null);
  const numRef = useRef(null);
  const barRef = useRef(null);
  const wordRef = useRef(null);
  const [skip] = useState(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem('intro-seen') === '1';
      sessionStorage.setItem('intro-seen', '1');
    } catch {
      /* no storage */
    }
    return reduced || seen;
  });

  useEffect(() => {
    if (skip) {
      sceneState.intro = 0;
      onFinish();
      return;
    }

    document.body.style.overflow = 'hidden';
    const counter = { v: 0 };
    const root = rootRef.current;
    const cols = root.querySelectorAll('.pre__col');
    const brand = root.querySelectorAll('.pre__brand span');
    const meta = root.querySelector('.pre__meta');

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        onFinish();
      },
    });

    // 1. Brand letters + meta slide in
    tl.fromTo(brand, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'power4.out' })
      .fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.4')

      // 2. Counter 0 → 100 with "network-like" stalls
      .to(counter, {
        v: 100,
        duration: 2.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(counter.v);
          if (numRef.current) numRef.current.textContent = String(v).padStart(3, '0');
          if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      }, '-=0.6')

      // 3. Rotating words while loading
      .add(() => {}, 0);

    // Word rotation runs alongside the counter
    WORDS.forEach((w, i) => {
      tl.call(
        () => {
          if (!wordRef.current) return;
          gsap.fromTo(
            wordRef.current,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
          );
          wordRef.current.textContent = w;
        },
        null,
        0.9 + i * 0.6
      );
    });

    // 4. Reveal: counter blows up, panels split, camera dollies in
    tl.to(numRef.current, { scale: 1.6, opacity: 0, duration: 0.6, ease: 'power3.in' }, '>-0.1')
      .fromTo(root.querySelector('.pre__flash'), { opacity: 0 }, { opacity: 0.9, duration: 0.12, ease: 'power1.in' }, '<0.35')
      .to(root.querySelector('.pre__flash'), { opacity: 0, duration: 0.7, ease: 'power2.out' })
      .to([brand, meta, barRef.current?.parentElement, wordRef.current?.parentElement], { opacity: 0, duration: 0.3 }, '<')
      .to(sceneState, { intro: 0, duration: 1.8, ease: 'power3.inOut' }, '<0.1')
      // Slice curtain: columns peel upward from the centre outwards
      .to(
        cols,
        {
          yPercent: -101,
          scaleY: 1.15,
          transformOrigin: '50% 0%',
          duration: 1.15,
          ease: 'expo.inOut',
          stagger: { each: 0.06, from: 'center' },
        },
        '<0.05'
      )
      .to(root, { autoAlpha: 0, duration: 0.2 }, '-=0.25');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  if (skip) return null;

  return (
    <div className="pre" ref={rootRef} aria-hidden="true">
      <div className="pre__flash" />
      <div className="pre__cols">
        {Array.from({ length: 7 }).map((_, i) => (
          <div className="pre__col" key={i} />
        ))}
      </div>

      <div className="pre__content">
        <div className="pre__brand">
          {site.name.split('').map((c, i) => (
            <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
          ))}
        </div>
        <p className="pre__meta">Portfolio · {site.location}</p>

        <div className="pre__word-wrap">
          <span className="pre__word" ref={wordRef} />
        </div>
      </div>

      <div className="pre__counter">
        <span className="pre__num" ref={numRef}>
          000
        </span>
        <span className="pre__pct">%</span>
      </div>

      <div className="pre__bar">
        <span className="pre__bar-fill" ref={barRef} />
      </div>
    </div>
  );
}
