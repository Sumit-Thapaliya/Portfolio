import { Suspense, lazy, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import site from "../data/site.js";
import ShimmerButton from "./ui/ShimmerButton.jsx";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

// The Three.js scene is code-split: it never blocks first paint or the HTML
// crawlers read, and is skipped entirely for reduced-motion / tiny devices.
const HeroScene = lazy(() => import("./three/HeroScene.jsx"));

const NAME = site.name;
const ROLES = site.roles;

function useCanRun3D() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 640;
    const lowMem = navigator.deviceMemory && navigator.deviceMemory < 2;
    setOk(!reduced && !small && !lowMem);
  }, []);
  return ok;
}

export default function Hero({ ready }) {
  const nameRef = useRef(null);
  const greetRef = useRef(null);
  const roleRef = useRef(null);
  const typeRef = useRef(null);
  const metaRef = useRef(null);
  const show3D = useCanRun3D();

  // Letter-by-letter name reveal, runs once `ready` (intro finished) is true
  useEffect(() => {
    if (!ready) return;

    const letters = nameRef.current.querySelectorAll(".hero__letter");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      greetRef.current,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.6 },
    )
      .set(letters, { opacity: 0, y: 28, rotateX: -25 }, "<")
      .to(
        letters,
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.028 },
        "-=0.3",
      )
      .to(
        nameRef.current,
        { backgroundPosition: "200% center", duration: 2.2, ease: "sine.inOut" },
        "-=0.2",
      )
      .fromTo(
        roleRef.current,
        { opacity: 0, y: 16, clipPath: "inset(0 100% 0 0)" },
        { opacity: 1, y: 0, clipPath: "inset(0 0% 0 0)", duration: 0.9 },
        "-=1.9",
      )
      .fromTo(
        metaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        "<0.35",
      );

    return () => tl.kill();
  }, [ready]);

  // Rotating role typewriter (decorative; the real H2 stays static for SEO)
  useEffect(() => {
    if (!ready) return;
    let index = 0;
    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    function tick() {
      const current = ROLES[index];
      const el = typeRef.current;
      if (!el) return;

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          timeoutId = setTimeout(tick, 1500);
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

    const startDelay = setTimeout(tick, 1800);
    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeoutId);
    };
  }, [ready]);

  // Letters magnify toward the cursor as it passes near the name
  useEffect(() => {
    if (!ready) return;
    const container = nameRef.current;
    if (!container) return;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!isFinePointer) return;

    const letters = Array.from(container.querySelectorAll(".hero__letter"));
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
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letter, {
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.75)",
            overwrite: "auto",
          });
        }
      }
    }

    function handleLeave() {
      gsap.to(letters, { y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }

    window.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [ready]);

  // Parallax: hero content drifts up and fades as the user scrolls past
  useEffect(() => {
    if (!ready) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const trigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      animation: gsap.to(".hero__inner", {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
      }),
    });

    return () => trigger.kill();
  }, [ready]);

  return (
    <section id="top" className="hero">
      {show3D && ready && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      <div className="sb-container hero__inner">
        <span className="sb-eyebrow">Portfolio / 2026</span>

        {/* H1 reads "Hi, I'm Sumit Thapaliya" to crawlers & screen readers */}
        <h1 className="hero__title">
          <span className="hero__greeting" ref={greetRef}>
            {site.greeting}
          </span>{" "}
          <span
            className="hero__name sb-gradient-text"
            ref={nameRef}
            aria-label={NAME}
          >
            {NAME.split(" ").map((word, w) => (
              <span className="hero__word" key={w} aria-hidden="true">
                {word.split("").map((char, i) => (
                  <span className="hero__letter" key={i}>
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>

        {/* Static, descriptive H2 (SEO) */}
        <h2 className="hero__role" ref={roleRef}>
          {site.role}
        </h2>

        {/* Decorative rotating roles */}
        <p className="hero__type" aria-hidden="true">
          <span className="hero__type-prompt">&gt;</span>
          <span className="hero__type-text" ref={typeRef} />
          <span className="hero__type-cursor" />
        </p>

        <div className="hero__meta" ref={metaRef}>
          <p className="hero__summary">{site.summary}</p>
          <p className="hero__summary hero__summary--secondary">{site.summary2}</p>

          <div className="hero__actions">
            <ShimmerButton href="#projects" className="hero__btn hero__btn--primary">
              View Projects
            </ShimmerButton>
            <ShimmerButton href="#contact" ghost className="hero__btn hero__btn--ghost">
              Get in Touch
            </ShimmerButton>
            <span className="hero__status">
              <span className="hero__status-dot" />
              {site.availability}
            </span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
