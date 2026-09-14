// Meta (Facebook) Pixel — insertion point for the ad campaigns.
//
// The pixel is loaded only when VITE_META_PIXEL_ID is set. Note the VITE_
// prefix: this is a Vite app, and Vite only exposes VITE_-prefixed variables to
// client code, so a NEXT_PUBLIC_-prefixed name would silently be undefined.
// Set it in the Vercel project's environment variables (and in .env locally).
//
// With no ID configured every helper below is a silent no-op, so local
// development and preview builds never fire events into a real ad account.

export const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || "").trim();

export const isPixelEnabled = () => Boolean(META_PIXEL_ID);

// Meta standard event names, kept in one place so the conversion events stay
// consistent between the WhatsApp button and the contact form.
export const META_EVENTS = {
  contact: "Contact",
  lead: "Lead",
};

// Injects the official Meta Pixel snippet once and fires the initial PageView.
export const initMetaPixel = () => {
  if (!isPixelEnabled() || typeof window === "undefined") return;
  if (window.fbq) return; // already initialised

  const fbq = function (...args) {
    fbq.callMethod ? fbq.callMethod.apply(fbq, args) : fbq.queue.push(args);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
};

// Fires a PageView — needed on every route change, because this is an SPA and
// the pixel script only auto-tracks the very first document load.
export const trackPageView = () => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", "PageView");
};

// Fires a Meta standard conversion event. Safe to call unconditionally: it does
// nothing until a pixel ID is configured.
export const trackEvent = (name, params = {}) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", name, params);
};
