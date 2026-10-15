import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Use the public test key only in development. Production requires a real key.
const SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? "1x00000000000000000000AA" : "")).trim();

const Turnstile = forwardRef(({ onVerify, onExpire }, ref) => {
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
      if (!SITE_KEY || cancelled || !containerRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (token) => onVerify(token),
        "expired-callback": () => onExpire && onExpire(),
        "error-callback": () => onExpire && onExpire(),
        "timeout-callback": () => onExpire && onExpire(),
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
  }, []);

  return <div ref={containerRef} />;
});

Turnstile.displayName = "Turnstile";

export default Turnstile;
