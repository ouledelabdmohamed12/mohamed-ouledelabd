import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureUtmParams, initAnalytics, trackPageView } from "../lib/analytics";

/**
 * Wires the analytics module to the router. Renders nothing.
 *
 * Two jobs: remember the campaign parameters of the landing URL, and report a
 * page view on every route change (an SPA navigation is invisible to the
 * trackers otherwise).
 *
 * Nothing is loaded or sent until the visitor accepts tracking and an ID is
 * configured — that is decided inside src/lib/analytics.ts, not here.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();

  // Once per visit, before any internal navigation strips the query string.
  // Runs before the route effect below, so the first event already carries it.
  useEffect(() => {
    captureUtmParams();
  }, []);

  useEffect(() => {
    initAnalytics();
    trackPageView(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
};

export default Analytics;
