import { useState } from 'react';
import useLenis from './hooks/useLenis.js';
import IntroLoader from './components/IntroLoader.jsx';
import ParticleBackground from './components/ParticleBackground.jsx';
import CustomCursor from './components/CustomCursor.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Marquee from './components/Marquee.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  useLenis();

  return (
    <>
      {!introDone && <IntroLoader onFinish={() => setIntroDone(true)} />}
      <div className="sb-grain" />
      <ScrollProgress />
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      <Hero ready={introDone} />
      <About />
      <Skills />
      <Marquee />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}