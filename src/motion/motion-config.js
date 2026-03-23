import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const motionDefaults = { duration: 0.8, ease: "power2.out" };
export const projectCorridorBreakpoint = 768;

export function setMotionMode() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.dataset.motionMode = reduced ? "reduced" : "full";
  return reduced;
}

export { gsap, ScrollTrigger };
