/**
 * True when the page is being rendered by a crawler or an automated browser
 * (Googlebot, Bingbot, Lighthouse, headless Chrome...).
 *
 * Why it exists: crawlers never scroll and never wait for JS-driven entrance
 * animations. Every element whose resting state is `opacity: 0` — waiting on a
 * `whileInView` / `useInView` trigger — therefore stays invisible in Google's
 * "Live Test" screenshot, which is what made ~25 of the home page's 32 text
 * blocks render blank in Search Console.
 *
 * Used ONLY to skip the *entrance* animation, never to change what is rendered:
 * bots and humans receive byte-for-byte the same markup and the same copy, so
 * this is not cloaking. Interaction animations (mobile menu, modals, dropdowns,
 * error messages) are deliberately left alone — they must stay hidden on load.
 *
 * Evaluated once at module load: the user agent cannot change mid-session, and
 * a constant keeps the value stable across renders (no hydration flicker).
 */
export const isBot =
  typeof navigator !== "undefined" &&
  /bot|crawler|spider|googlebot|bingbot|lighthouse|headless/i.test(
    navigator.userAgent
  );
