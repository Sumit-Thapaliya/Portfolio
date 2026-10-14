import { Suspense, lazy, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useLenis from './hooks/useLenis.js';
import Preloader from './components/Preloader.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SectionHUD from './components/SectionHUD.jsx';
import Spotlight from './components/ui/Spotlight.jsx';
import SectionBoundary from './components/ui/SectionBoundary.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Marquee from './components/Marquee.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import sceneState from './components/three/sceneState.js';

gsap.registerPlugin(ScrollTrigger);

// Three.js scene is code-split so it never blocks first paint / crawlers
const Scene = lazy(() => import('./components/three/Scene.jsx'));

// Colour grade per section: the page background drifts as you travel
const GRADE = [
  { sel: '#top', bg: '#0a0e14' },
  { sel: '#about', bg: '#0a1114' },
  { sel: '#skills', bg: '#0b0f17' },
  { sel: '#projects', bg: '#07090d' },
  { sel: '#contact', bg: '#110f0e' },
];

function useSceneInputs() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function onMove(e) {
      sceneState.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    function onScroll() {
      const v = window.scrollY / window.innerHeight;
      sceneState.scroll = v;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sceneState.progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      // Dim the 3D layer past the hero so body text stays readable
      document.documentElement.style.setProperty('--scene-opacity', String(1 - Math.min(v, 1) * 0.6));
    }
    // Click anywhere: ripple on the page + a kick to the 3D objects
    function onDown(e) {
      if (e.button !== 0) return;
      sceneState.burst = 1;
      const r = document.createElement('span');
      r.className = 'sb-ripple';
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      r.addEventListener('animationend', () => r.remove(), { once: true });
    }
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);
}

function useColorGrade(ready) {
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      GRADE.forEach(({ sel, bg }) => {
        const grade = () => gsap.to(document.documentElement, { '--sb-bg': bg, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
        ScrollTrigger.create({ trigger: sel, start: 'top 55%', end: 'bottom 55%', onEnter: grade, onEnterBack: grade });
      });
    });
    return () => ctx.revert();
  }, [ready]);
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [mobile, setMobile] = useState(false);
  useLenis();
  useSceneInputs();
  useColorGrade(introDone);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 2;
    setMobile(window.innerWidth < 760);
    setShow3D(!reduced && !lowMem);
  }, []);

  return (
    <>
      {show3D && (
        <SectionBoundary name="scene">
          <Suspense fallback={null}>
            <Scene mobile={mobile} />
          </Suspense>
        </SectionBoundary>
      )}
      {!introDone && (
        <SectionBoundary name="preloader" fallback={<IntroFallback onFinish={() => setIntroDone(true)} />}>
          <Preloader onFinish={() => setIntroDone(true)} />
        </SectionBoundary>
      )}
      <div className="sb-grain" />
      <div className="sb-vignette" aria-hidden="true" />
      <div className="dot-pattern" aria-hidden="true" />
      <Spotlight />
      <ScrollProgress />
      <CustomCursor />
      <SectionHUD ready={introDone} />
      <Navbar ready={introDone} />
      <main>
        <SectionBoundary name="hero">
          <Hero ready={introDone} />
        </SectionBoundary>
        <SectionBoundary name="about">
          <About />
        </SectionBoundary>
        <SectionBoundary name="skills">
          <Skills />
        </SectionBoundary>
        <SectionBoundary name="marquee">
          <Marquee />
        </SectionBoundary>
        <SectionBoundary name="projects">
          <Projects />
        </SectionBoundary>
        <SectionBoundary name="contact">
          <Contact />
        </SectionBoundary>
      </main>
      <SectionBoundary name="footer">
        <Footer />
      </SectionBoundary>
    </>
  );
}

// If the preloader itself ever fails, reveal the site immediately.
function IntroFallback({ onFinish }) {
  useEffect(() => {
    sceneState.intro = 0;
    document.body.style.overflow = '';
    onFinish();
  }, [onFinish]);
  return null;
}
