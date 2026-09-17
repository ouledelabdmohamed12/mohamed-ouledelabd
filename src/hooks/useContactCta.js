import { useNavigate } from "react-router-dom";
import { EVENTS, track } from "../lib/analytics";

/**
 * Navigation to /contact from a "discuss your project" call to action, with the
 * quote-request event attached.
 *
 * Shared by every section that offers one, so all of them report the same
 * event name and only differ by `location` — which is what tells us in Meta
 * Events Manager and GA4 which button on which page actually earns the leads.
 */
export const useContactCta = () => {
  const navigate = useNavigate();

  return (location) => {
    track(EVENTS.devisClick, {
      content_name: "discuss_project_cta",
      button_location: location,
    });
    navigate("/contact");
  };
};
