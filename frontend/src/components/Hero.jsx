import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import site from "../data/site.js";
import ShimmerButton from "./ui/ShimmerButton.jsx";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const NAME = site.name;
const ROLES = site.roles;

export default function Hero({ ready }) {
  const nameRef = useRef(null);
  const greetRef = useRef(null);
  const roleRef = useRef(null);
  const typeRef = useRef(null);
  const metaRef = useRef(null);
  const ghostRef = useRef(null);

  // 1. Entrance: greeting slides in, letters flip up, role wipes, meta fades
  useEffect(() => {
    if (!ready) return;

    const letters = nameRef.current.querySelectorAll(".hero__letter");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(greetRef.current, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.6 })
      .set(letters, { opacity: 0, y: 60, rotateX: -70, filter: "blur(8px)" }, "<")
      .to(
        letters,
        { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.035 },
        "-=0.3",
      )
      .to(
        nameRef.current,
        { backgroundPosition: "200% center", duration: 2.2, ease: "sine.inOut" },
        "-=0.4",
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

  // 2. Rotating role typewriter (decorative; the real H2 stays static for SEO)
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

  // 3. Magnetic type: letters lift toward the cursor
  useEffect(() => {
    if (!ready) return;
    const container = nameRef.current;
    if (!container) return;

    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
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
            yPercent: -strength * 12,
            scale: 1 + strength * 0.18,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letter, {
            yPercent: 0,
            scale: 1,
            duration: 0.9,
            ease: "elastic.out(1, 0.75)",
            overwrite: "auto",
          });
        }
      }
    }

    function handleLeave() {
      gsap.to(letters, { yPercent: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    }

    window.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", handleLeave);
    };
  }, [ready]);

  // 3b. Ghost outline: an outlined copy of the name trails the cursor with lag
  useEffect(() => {
    if (!ready || !ghostRef.current) return;
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;
    const toX = gsap.quickTo(ghostRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const toY = gsap.quickTo(ghostRef.current, "y", { duration: 0.9, ease: "power3.out" });
    function onMove(e) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      toX(nx * -22);
      toY(ny * -16);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready]);

  // 4. Scroll exit: letters scatter on individual paths with blur, the rest of
  //    the hero drifts up and fades — scrubbed to the scrollbar.
  useEffect(() => {
    if (!ready) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const letters = nameRef.current.querySelectorAll(".hero__letter");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
      tl.to(
        letters,
        {
          x: () => gsap.utils.random(-260, 260),
          y: () => gsap.utils.random(-320, -80),
          rotation: () => gsap.utils.random(-40, 40),
          opacity: 0,
          filter: "blur(10px)",
          ease: "power2.in",
          stagger: { each: 0.02, from: "random" },
        },
        0,
      ).to(
        [greetRef.current, roleRef.current, metaRef.current, ghostRef.current, ".hero__type"],
        { yPercent: -60, opacity: 0, filter: "blur(6px)", ease: "power1.in", stagger: 0.04 },
        0,
      );
    });

    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="top" className="hero">
      <div className="sb-container hero__inner" style={{ opacity: ready ? undefined : 0 }}>
        <span className="sb-eyebrow">Portfolio / 2026</span>

        {/* H1 reads "Hi, I'm Sumit Thapaliya" to crawlers & screen readers */}
        <h1 className="hero__title">
          <span className="hero__greeting" ref={greetRef}>
            {site.greeting}
          </span>{" "}
          <span className="hero__name-wrap">
          <span className="hero__ghost" ref={ghostRef} aria-hidden="true">
            {NAME}
          </span>
          <span className="hero__name sb-gradient-text" ref={nameRef} aria-label={NAME}>
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
