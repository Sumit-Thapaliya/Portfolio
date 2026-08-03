import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './IntroLoader.css';

const BOOT_LINES = [
  '$ initializing portfolio…',
  '$ loading components… OK',
  '$ connecting to sumit_thapaliya.dev',
  '$ build complete ✓',
];

/**
 * A short, one-time cinematic intro: a terminal boots up a couple of lines,
 * then the screen splits like curtains opening onto the hero underneath.
 * Respects prefers-reduced-motion by skipping straight to the content.
 */
export default function IntroLoader({ onFinish }) {
  const rootRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      onFinish();
      return;
    }

    let cancelled = false;

    async function bootSequence() {
      for (let i = 0; i < BOOT_LINES.length; i++) {
        await new Promise((r) => setTimeout(r, 260));
        if (cancelled) return;
        setLines((prev) => [...prev, BOOT_LINES[i]]);
      }

      await new Promise((r) => setTimeout(r, 380));
      if (cancelled) return;

      const tl = gsap.timeline({
        onComplete: onFinish,
      });

      tl.to(rootRef.current.querySelector('.intro__terminal'), {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power2.in',
      })
        .to(
          topRef.current,
          { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
          '+=0.05'
        )
        .to(
          bottomRef.current,
          { yPercent: 100, duration: 0.9, ease: 'expo.inOut' },
          '<'
        );
    }

    bootSequence();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="intro" ref={rootRef} aria-hidden="true">
      <div className="intro__panel intro__panel--top" ref={topRef} />
      <div className="intro__panel intro__panel--bottom" ref={bottomRef} />
      <div className="intro__terminal">
        {lines.map((line, i) => (
          <p key={i} className="intro__line">
            {line}
          </p>
        ))}
        <span className="intro__cursor" />
      </div>
    </div>
  );
}
