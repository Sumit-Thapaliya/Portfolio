import { Suspense, lazy, useEffect, useState } from 'react';
import useLenis from './hooks/useLenis.js';
import Preloader from './components/Preloader.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Spotlight from './components/ui/Spotlight.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Marquee from './components/Marquee.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import sceneState from './components/three/sceneState.js';

// Three.js scene is code-split so it never blocks first paint / crawlers
const Scene = lazy(() => import('./components/three/Scene.jsx'));

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
      // Dim the 3D layer past the hero so body text stays readable
      document.documentElement.style.setProperty('--scene-opacity', String(1 - Math.min(v, 1) * 0.6));
    }
    if (fine) window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [mobile, setMobile] = useState(false);
  useLenis();
  useSceneInputs();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 2;
    setMobile(window.innerWidth < 760);
    setShow3D(!reduced && !lowMem);
  }, []);

  return (
    <>
      {show3D && (
        <Suspense fallback={null}>
          <Scene mobile={mobile} />
        </Suspense>
      )}
      {!introDone && <Preloader onFinish={() => setIntroDone(true)} />}
      <div className="sb-grain" />
      <div className="dot-pattern" aria-hidden="true" />
      <Spotlight />
      <ScrollProgress />
      <CustomCursor />
      <Navbar ready={introDone} />
      <main>
        <Hero ready={introDone} />
        <About />
        <Skills />
        <Marquee />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
