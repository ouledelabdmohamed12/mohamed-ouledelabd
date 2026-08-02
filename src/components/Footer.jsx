import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SOCIAL_LINKS, NAV_LINKS } from "../utils/data";
import { pathForSection } from "../utils/helper";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-flex items-baseline gap-0.5">
              <span className="text-xl font-bold tracking-tight text-gray-900">Koda Atlas</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 translate-y-[-2px]" />
            </Link>

            <p className="text-[15px] leading-relaxed text-gray-500 max-w-sm">
              {t("footer.description")}
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
                </span>
                <span className="text-sm font-medium text-gray-600">{t("footer.available")}</span>
              </div>
              <p className="text-sm text-gray-400">{t("footer.locations")}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-5">{t("footer.navTitle")}</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <Link
                    to={pathForSection(link.id)}
                    className="text-[15px] text-gray-500 hover:text-indigo-600 transition-colors"
                  >
                    {t(`nav.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-5">{t("footer.socialTitle")}</h4>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/terms" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              {t("footer.legal.terms")}
            </Link>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              {t("footer.legal.privacy")}
            </Link>
            <p className="text-sm text-gray-400">{t("footer.madeBy")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
