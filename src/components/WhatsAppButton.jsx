import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { META_EVENTS, trackEvent } from "../utils/tracking";
import { WHATSAPP_URL } from "../utils/data";

// Official WhatsApp glyph, inlined so the button pulls in no extra dependency.
const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
  </svg>
);

/**
 * Floating WhatsApp call-to-action, fixed bottom-right on every page.
 *
 * z-40 keeps it above page content but below the navbar (z-50) and the project
 * / success modals (z-50 and z-[100]), so it never sits on top of a dialog.
 */
const WhatsAppButton = () => {
  const { t } = useTranslation();

  const href = `${WHATSAPP_URL}?text=${encodeURIComponent(t("whatsapp.message"))}`;

  const handleClick = () => {
    // Meta conversion event — a no-op until VITE_META_PIXEL_ID is configured.
    trackEvent(META_EVENTS.contact, {
      content_name: "whatsapp_floating_button",
      content_category: "whatsapp",
    });
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={t("whatsapp.aria")}
      title={t("whatsapp.tooltip")}
      /* Deliberately no entrance animation: this is the primary conversion
         CTA, so it must be visible from first paint rather than waiting on a
         JS-driven fade-in (which never runs while a tab is backgrounded). */
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      /* Sits clear of the iOS home indicator / Android gesture bar. */
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
      className="group fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-colors hover:bg-[#1eb956] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 md:right-6 md:h-16 md:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />

      {/* Label on pointer devices only — it would crowd a phone screen. */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-gray-900 px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 md:block">
        {t("whatsapp.tooltip")}
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
