import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { SOCIAL_LINKS, NAV_LINKS } from "../utils/data";

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className={`relative py-16 px-6 overflow-hidden ${
      isDarkMode ? "bg-[#0a0c10]" : "bg-white"
    } transition-colors duration-500`}>
      
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12">
          
          {/* --- GAUCHE : LOGO & INFOS --- */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Nouveau Logo Intégré (Juste l'image, plus de texte) */}
            <div className="inline-block cursor-pointer group" onClick={() => scrollToSection("home")}>
              <img 
                src="/logo.svg" 
                alt="M.O Logo" 
                className={`h-16 md:h-20 w-auto transition-transform duration-500 group-hover:scale-105 ${
                  !isDarkMode && "invert"
                }`}
              />
            </div>

            {/* Description */}
            <p className={`text-[13px] font-light leading-relaxed max-w-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Élève-Ingénieur en <span className="text-[#ccff00] font-medium">MIAGE à l'EMSI</span>. 
              Je conçois des solutions digitales sur-mesure pour accompagner la transformation numérique des entreprises au Maroc.
            </p>

            <div className="flex flex-col space-y-2">
              {/* Status avec badge pulsant */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#ccff00] rounded-full animate-pulse shadow-[0_0_8px_#ccff00]" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">
                  Disponible en Juillet 2026
                </span>
              </div>
              
              {/* Localisation étendue */}
              <p className="text-[12px] font-bold text-[#ccff00] flex items-center gap-2">
                Marrakech — Casablanca — Rabat
              </p>
            </div>
          </div>

          {/* --- CENTRE/DROITE : NAV & CONNECT --- */}
          <div className="md:col-span-7 grid grid-cols-2 gap-8 md:pl-20">
            
            {/* Navigation */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccff00]">Navigation</h4>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button 
                      onClick={() => scrollToSection(link.id)}
                      className="text-[12px] font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      {link.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ccff00]">Réseaux</h4>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map((social) => (
                  <li key={social.name}>
                    <a 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-400 hover:text-[#ccff00] transition-colors"
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

        {/* --- BAS : COPYRIGHT --- */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] uppercase tracking-[0.5em] font-black text-gray-700">
            © {currentYear} Mohamed Ouledelabd
          </p>
          <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500">
            Code & Design par M.O
          </p>
        </div>

      </div>

      {/* Lueur de fond */}
      <div className="absolute -bottom-20 right-0 w-96 h-40 bg-[#ccff00]/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
    </footer>
  );
};

export default Footer;