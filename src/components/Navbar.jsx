import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { NAV_LINKS } from "../utils/data";
import { pathForSection } from "../utils/helper";

const CONTACT_EMAIL = "ouledelabd.mohamed@gmail.com";
const CONTACT_PHONE = "+212682484400";

// Clean inline language links — active language in solid gray-900.
const LanguageSwitch = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {["en", "fr"].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          aria-pressed={current === lng}
          className={`px-2 py-1 text-xs font-medium uppercase rounded-md transition-colors ${
            current === lng
              ? "text-gray-900 font-semibold"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* --- LOGO --- */}
        <Link to="/" className="group flex items-baseline gap-0.5">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Koda Atlas
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 translate-y-[-2px]" />
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.id} to={pathForSection(item.id)} end className={linkClass}>
                {t(`nav.${item.id}`)}
              </NavLink>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200" />

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label="Email"
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Mail size={17} />
            </a>
            <a
              href={`tel:${CONTACT_PHONE}`}
              aria-label="Phone"
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Phone size={17} />
            </a>

            <LanguageSwitch />
          </div>

          <Link
            to="/contact"
            className="rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 shadow-sm transition-colors whitespace-nowrap"
          >
            {t("common.discussCta")}
          </Link>
        </div>

        {/* --- MOBILE BUTTONS --- */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitch />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden px-4 pb-4"
          >
            <div className="rounded-2xl bg-white border border-gray-100 shadow-lg p-6 space-y-6">
              <div className="space-y-4">
                {NAV_LINKS.map((item) => (
                  <NavLink
                    key={item.id}
                    to={pathForSection(item.id)}
                    end
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block w-full text-left text-sm font-medium transition-colors ${
                        isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                  >
                    {t(`nav.${item.id}`)}
                  </NavLink>
                ))}
              </div>

              <div className="w-full h-px bg-gray-100" />

              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-sm font-semibold shadow-sm transition-colors"
              >
                {t("common.discussCta")}
              </Link>

              <a
                href={`https://wa.me/${CONTACT_PHONE.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] hover:bg-[#1eb956] text-white py-3 text-sm font-semibold shadow-sm transition-colors"
              >
                <FaWhatsapp size={17} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
