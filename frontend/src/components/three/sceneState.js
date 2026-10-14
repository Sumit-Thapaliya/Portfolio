/**
 * Tiny mutable store shared between the Preloader (which tweens it with GSAP)
 * and the Three.js scene (which reads it every frame). Avoids React re-renders
 * for 60fps values.
 */
const sceneState = {
  intro: 1, // 1 = preloader (camera far, objects dim) → 0 = site revealed
  scroll: 0, // window.scrollY / innerHeight
  progress: 0, // 0..1 through the whole page
  velocity: 0, // Lenis scroll velocity (px/frame-ish)
  burst: 0, // 1 on click → decays; kicks object spin
  mouseX: 0,
  mouseY: 0,
};

export default sceneState;
