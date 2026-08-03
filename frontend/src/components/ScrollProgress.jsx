import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './ScrollProgress.css';

/**
 * A slim gradient bar pinned to the very top of the viewport that fills
 * left-to-right as the person scrolls through the page.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      gsap.to(barRef.current, {
        scaleX: progress,
        duration: 0.15,
        ease: 'power1.out',
      });
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" ref={barRef} />
    </div>
  );
}
