import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Cloudflare's official public test key ("always passes"). Replace with your
// real site key via the VITE_TURNSTILE_SITE_KEY env var once you have one —
// see https://dash.cloudflare.com/?to=/:account/turnstile
const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA").trim();

const Turnstile = forwardRef(({ onVerify, onExpire, isDarkMode }, ref) => {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    let pollId;

    const render = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: isDarkMode ? "dark" : "light",
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire && onExpire(),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      pollId = setInterval(() => {
        if (window.turnstile) {
          clearInterval(pollId);
          render();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollId) clearInterval(pollId);
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  return <div ref={containerRef} />;
});

Turnstile.displayName = "Turnstile";

export default Turnstile;
