import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import sceneState from '../components/three/sceneState.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scrolling, driven by GSAP's ticker and kept in lock-step with
 * ScrollTrigger (pins, scrubs). Also publishes scroll velocity for the
 * velocity-reactive marquee and the 3D scene.
 */
export default function useLenis() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    const root = document.documentElement;
    let lastVel = 0;
    lenis.on('scroll', (e) => {
      sceneState.velocity = e.velocity;
      // Normalised velocity (-1..1) for CSS-driven skew / chromatic effects
      const nv = Math.max(-1, Math.min(1, e.velocity / 60));
      if (Math.abs(nv - lastVel) > 0.005) {
        root.style.setProperty('--vel', nv.toFixed(3));
        lastVel = nv;
      }
      ScrollTrigger.update();
    });

    function raf(time) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
}
