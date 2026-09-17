import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { readConsent, setConsent } from "../lib/analytics";
import { isBot } from "../lib/isBot";

/**
 * Consent notice for the measurement scripts. Nothing is loaded before the
 * visitor accepts, and the answer is remembered, so this is shown once.
 *
 * Sits above the floating WhatsApp button on a phone (the button is bottom
 * right, z-40) and next to it on a desktop, so neither ever covers the other.
 */
const ConsentBanner = () => {
  const { t } = useTranslation();

  // Read once on mount: a stored answer means the banner never mounts visibly,
  // so there is no flash of it on a returning visit. Crawlers never see it.
  const [isVisible, setIsVisible] = useState(() => !isBot && readConsent() === null);

  const answer = (choice) => {
    setConsent(choice);
    setIsVisible(false);
  };

  // Deliberately no AnimatePresence / exit animation. An exit that is left
  // half-finished (a throttled tab, a reduced-motion setting) keeps the card in
  // the DOM at opacity 0, where it is invisible but still swallows every click
  // over its own footprint. Answering removes it outright instead.
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-label={t("consent.aria")}
      /* The offset is a class rather than an inline style so the md: variant
         can override it — an inline `bottom` would win over any breakpoint.
         On a phone the card spans the full width, so it sits above the
         floating WhatsApp button and clear of the iOS home indicator; from
         md up it moves to the bottom-left corner, where the button is not. */
      className="fixed left-4 right-4 bottom-[calc(6.5rem+env(safe-area-inset-bottom,0px))] z-50 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg md:bottom-6 md:left-6 md:right-auto md:max-w-sm"
    >
      <p className="text-[15px] leading-relaxed text-gray-600">
        {t("consent.text")}{" "}
        <Link
          to="/privacy"
          className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:decoration-indigo-400 transition-colors"
        >
          {t("consent.learnMore")}
        </Link>
      </p>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => answer("granted")}
          className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 shadow-sm transition-colors"
        >
          {t("consent.accept")}
        </button>
        <button
          type="button"
          onClick={() => answer("denied")}
          className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          {t("consent.decline")}
        </button>
      </div>
    </motion.div>
  );
};

export default ConsentBanner;
