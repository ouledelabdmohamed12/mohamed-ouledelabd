import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa"; // Ajout de l'icône WhatsApp
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Séparation du nom affiché (Français) et de l'ID de la section HTML
  const menuItems = [
    { name: "Accueil", id: "home" },
    { name: "Compétences", id: "skills" },
    { name: "Réalisations", id: "work" },
    { name: "À propos", id: "about" },
    { name: "Contact", id: "contact" }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 px-6 py-5 transition-all duration-300 ${
        isDarkMode 
          ? "bg-[#0a0c10]/90 backdrop-blur-lg" 
          : "bg-white/90 backdrop-blur-lg shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* --- LOGO UPDATED --- */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => scrollToSection("home")}
        >
          {/* Nouveau logo SVG depuis le dossier public */}
          <img 
            src="/logo.svg" 
            alt="M.O Logo" 
            className={`h-10 md:h-12 w-auto transition-transform duration-500 group-hover:scale-105 ${
              !isDarkMode && "invert"
            }`}
          />
        </motion.div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center space-x-10">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -1 }}
              onClick={() => scrollToSection(item.id)}
              className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-400 hover:text-[#ccff00]"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.name}
            </motion.button>
          ))}
          
          {/* THEME TOGGLE */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleDarkMode(isDarkMode ? "light" : "dark")}
            className={`ml-4 p-2 rounded-xl transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-[#ccff00] bg-white/5"
                : "text-gray-600 hover:text-gray-900 bg-gray-100"
            }`}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
        </div>

        {/* --- MOBILE BUTTONS --- */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={() => toggleDarkMode(isDarkMode ? "light" : "dark")}
            className={`p-2 rounded-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              isDarkMode ? "bg-[#111418] border border-white/5" : "bg-white border border-gray-100 shadow-xl"
            }`}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left text-[11px] font-bold uppercase tracking-[0.2em] ${
                      isDarkMode ? "text-gray-400 hover:text-[#ccff00]" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Ligne de séparation */}
              <div className={`w-full h-px ${isDarkMode ? "bg-white/10" : "bg-gray-100"}`} />

              {/* Bouton WhatsApp optimisé pour mobile */}
              <a 
                href="https://wa.me/212682484400" 
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