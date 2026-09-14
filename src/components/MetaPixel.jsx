import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, isPixelEnabled, trackPageView } from "../utils/tracking";

/**
 * Mounts the Meta Pixel for the ad campaigns. Renders nothing.
 *
 * Does nothing at all unless VITE_META_PIXEL_ID is set, so no third-party
 * script is loaded in development or in a preview build.
 */
const MetaPixel = () => {
  const { pathname } = useLocation();
  const initialised = useRef(false);

  useEffect(() => {
    if (!isPixelEnabled()) return;

    // The snippet fires its own PageView on init; only subsequent route
    // changes need a manual one, otherwise the landing page counts twice.
    if (!initialised.current) {
      initMetaPixel();
      initialised.current = true;
      return;
    }
    trackPageView();
  }, [pathname]);

  return null;
};

export default MetaPixel;
