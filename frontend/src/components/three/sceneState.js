/**
 * Tiny mutable store shared between the Preloader (which tweens it with GSAP)
 * and the Three.js scene (which reads it every frame). Avoids React re-renders
 * for 60fps values.
 */
const sceneState = {
  intro: 1, // 1 = preloader (camera far, objects dim) → 0 = site revealed
  scroll: 0, // window.scrollY / innerHeight
  mouseX: 0,
  mouseY: 0,
};

export default sceneState;
