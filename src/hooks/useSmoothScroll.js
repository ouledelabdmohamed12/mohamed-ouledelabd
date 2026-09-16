import { useEffect } from "react";
import Lenis from "lenis";
import { isBot } from "../lib/isBot";

/**
 * Enables premium "silky" smooth scrolling site-wide via Lenis.
 * Respects the user's reduced-motion preference (disabled if set), and is
 * skipped entirely for crawlers: Lenis hijacks the scroll position through a
 * rAF loop and a transform on the document, which is exactly what Googlebot
 * fights with when it resizes the viewport to the full page height to take its
 * screenshot. No content depends on it — it is purely scroll feel.
 * Exposes the instance on window.__lenis so anchor clicks can use lenis.scrollTo.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    if (isBot) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.__lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
};
