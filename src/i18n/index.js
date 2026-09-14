import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { CONTACT_EMAIL } from "../utils/data";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    // French by default: the site is the landing page for Facebook/Instagram
    // campaigns targeting Morocco, so a first-time visitor always lands in FR.
    fallbackLng: "fr",
    supportedLngs: ["en", "fr"],
    detection: {
      // Only a stored choice is honoured — the browser language is deliberately
      // NOT consulted, otherwise an English-configured phone would open in EN.
      // The EN/FR switch writes to this key, so a visitor's choice still sticks.
      order: ["localStorage"],
      lookupLocalStorage: "koda-lang",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
      // Makes {{email}} resolve in every string without any call site passing it,
      // so the Terms/Privacy copy stays tied to CONTACT_EMAIL in utils/data.js.
      defaultVariables: {
        email: CONTACT_EMAIL,
      },
    },
  });

// Keep <html lang> in sync with the active language, for screen readers and
// for crawlers that read the attribute.
const syncHtmlLang = (lng) => {
  document.documentElement.setAttribute("lang", lng);
};
syncHtmlLang(i18n.resolvedLanguage || "fr");
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
