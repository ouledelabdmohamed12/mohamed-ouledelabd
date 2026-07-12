import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { SOCIAL_LINKS, NAV_LINKS } from "../utils/data";
import { pathForSection } from "../utils/helper";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative py-16 px-6 overflow-hidden ${
        isDarkMode ? "bg-[#0a0c10]" : "bg-white"
      } transition-colors duration-500`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12">
          {/* --- LEFT: LOGO & INFO --- */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <img
                src="/koda-atlas.svg"
                alt="Koda Atlas"
                className="h-12 w-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="leading-none">
                <span
                  className={`block text-xl font-bold tracking-tight ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  koda<span className="text-[#2B8CA6]">.</span>
                </span>
                <span
                  className={`block text-[9px] font-semibold tracking-[0.35em] ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ATLAS
                </span>
              </div>
            </Link>

            <p
              className={`text-[13px] font-light leading-relaxed max-w-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {t("footer.description")}
            </p>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#2B8CA6] rounded-full animate-pulse shadow-[0_0_8px_#2B8CA6]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
                  {t("footer.available")}
                </span>
              </div>
              <p className="text-[12px] font-bold text-[#2B8CA6] flex items-center gap-2">
                {t("footer.locations")}
              </p>
            </div>
          </div>

          {/* --- RIGHT: NAV & SOCIAL --- */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:pl-20">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B8CA6]">
                {t("footer.navTitle")}
              </h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <Link
                      to={pathForSection(link.id)}
                      className="text-[12px] font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {t(`nav.${link.id}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B8CA6]">
                {t("footer.socialTitle")}
              </h4>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-400 hover:text-[#2B8CA6] transition-colors"
                    >
                      <social.icon size={16} />
                      <span className="text-[12px] font-medium tracking-wide">{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* --- BOTTOM: COPYRIGHT --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-gray-700">
            © {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/terms"
              className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 hover:text-[#2B8CA6] transition-colors"
            >
              {t("footer.legal.terms")}
            </Link>
            <Link
              to="/privacy"
              className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500 hover:text-[#2B8CA6] transition-colors"
            >
              {t("footer.legal.privacy")}
            </Link>
            <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500">
              {t("footer.madeBy")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
