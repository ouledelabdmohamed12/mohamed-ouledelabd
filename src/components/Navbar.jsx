import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X, Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { NAV_LINKS } from "../utils/data";
import { pathForSection } from "../utils/helper";

const CONTACT_EMAIL = "ouledelabd.mohamed@gmail.com";
const CONTACT_PHONE = "+212682484400";

const LanguageSwitch = ({ isDarkMode, className = "" }) => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language;

  const base =
    "px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-colors";
  const activeCls = "bg-[#2B8CA6] text-white";
  const idleCls = isDarkMode
    ? "text-gray-400 hover:text-[#2B8CA6]"
    : "text-gray-500 hover:text-gray-900";

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {["en", "fr"].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={`${base} ${current === lng ? activeCls : idleCls}`}
          aria-pressed={current === lng}
        >
          {lng}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
      isActive
        ? "text-[#2B8CA6]"
        : isDarkMode
        ? "text-gray-400 hover:text-[#2B8CA6]"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0a0c10]/90 backdrop-blur-lg border-b border-white/5"
          : "bg-white/90 backdrop-blur-lg shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* --- LOGO KODA ATLAS --- */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/koda-atlas.svg"
            alt="Koda Atlas"
            className="h-9 md:h-10 w-auto"
          />
          <div className="leading-none">
            <span
              className={`block text-lg md:text-xl font-bold tracking-tight ${
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

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.id} to={pathForSection(item.id)} end className={linkClass}>
              {t(`nav.${item.id}`)}
            </NavLink>
          ))}

          <div className={`h-5 w-px ${isDarkMode ? "bg-white/10" : "bg-gray-200"}`} />

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label="Email"
            className={`transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-[#2B8CA6]" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Mail size={17} />
          </a>
          <a
            href={`tel:${CONTACT_PHONE}`}
            aria-label="Phone"
            className={`transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-[#2B8CA6]" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Phone size={17} />
          </a>

          <LanguageSwitch isDarkMode={isDarkMode} />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleDarkMode(isDarkMode ? "light" : "dark")}
            aria-label="Toggle theme"
            className={`p-2 rounded-xl transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-[#2B8CA6] bg-white/5"
                : "text-gray-600 hover:text-gray-900 bg-gray-100"
            }`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </div>

        {/* --- MOBILE BUTTONS --- */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitch isDarkMode={isDarkMode} />
          <button
            onClick={() => toggleDarkMode(isDarkMode ? "light" : "dark")}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
            className={`p-2 rounded-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
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
            className={`md:hidden overflow-hidden mt-4 rounded-2xl ${
              isDarkMode
                ? "bg-[#111418] border border-white/5"
                : "bg-white border border-gray-100 shadow-xl"
            }`}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {NAV_LINKS.map((item) => (
                  <NavLink
                    key={item.id}
                    to={pathForSection(item.id)}
                    end
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block w-full text-left text-[11px] font-bold uppercase tracking-[0.2em] ${
                        isActive
                          ? "text-[#2B8CA6]"
                          : isDarkMode
                          ? "text-gray-400 hover:text-[#2B8CA6]"
                          : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                  >
                    {t(`nav.${item.id}`)}
                  </NavLink>
                ))}
              </div>

              <div className={`w-full h-px ${isDarkMode ? "bg-white/10" : "bg-gray-100"}`} />

              <a
                href={`https://wa.me/${CONTACT_PHONE.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#1eb956] transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <FaWhatsapp size={18} />
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
