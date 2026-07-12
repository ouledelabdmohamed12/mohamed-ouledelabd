import { useState, useEffect } from "react";
import { regionFromCountry } from "../utils/pricing";

const STORAGE_KEY = "koda-region";

// Best-effort guess of region from the browser locale, used as a fallback
// when the IP lookup fails or is blocked.
const regionFromLocale = () => {
  const loc = (navigator.language || "").toUpperCase();
  if (loc.includes("-MA") || loc.startsWith("AR")) return "MA";
  if (loc.includes("-US") || loc.includes("-CA")) return "US";
  return "EU";
};

/**
 * Detects the visitor's pricing region (MA / EU / US) from their IP country,
 * with a locale-based fallback and localStorage caching. The user can override
 * the detected value via setRegion (persisted).
 */
export const useCurrency = () => {
  const [region, setRegionState] = useState("EU");

  const setRegion = (r) => {
    setRegionState(r);
    try {
      localStorage.setItem(STORAGE_KEY, r);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    // 1. Respect a stored (possibly user-chosen) region.
    let cached = null;
    try {
      cached = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (cached) {
      setRegionState(cached);
      return;
    }

    // 2. Otherwise detect from IP, falling back to locale.
    let cancelled = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        const r = regionFromCountry(data && data.country_code);
        setRegionState(r);
      })
      .catch(() => {
        if (!cancelled) setRegionState(regionFromLocale());
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return { region, setRegion };
};
