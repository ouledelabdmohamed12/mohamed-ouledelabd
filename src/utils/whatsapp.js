import { WHATSAPP_URL } from "./data";
import { getUtmString } from "../lib/analytics";

/**
 * A WhatsApp deep link whose prefilled message carries the campaign the
 * visitor arrived from, so an enquiry can be traced back to the ad that paid
 * for it — WhatsApp itself passes nothing along.
 *
 * The suffix is left out entirely for direct traffic, so an organic visitor's
 * message stays exactly the copy in the translations.
 */
export const buildWhatsAppUrl = (message) => {
  const utm = getUtmString();
  const text = utm ? `${message}\n\n[${utm}]` : message;

  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
};
