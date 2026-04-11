import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { PROJECTS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";
import ProjectCard from "../ProjectCard";

const ProjectsSection = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollRef = useRef(null); 
  const carouselRef = useRef(null); 
  const [width, setWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobileAndWidth = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (carouselRef.current && scrollRef.current) {
        // On calcule la différence entre la largeur totale du contenu 
        // et la largeur visible de la fenêtre
        const scrollWidth = carouselRef.current.scrollWidth;
        const offsetWidth = scrollRef.current.offsetWidth;
        
        // On ajoute un petit buffer (100px) pour ne pas coller au bord à la fin
        setWidth(scrollWidth - offsetWidth + 100);
      }
    };

    // On attend un court instant (100ms) pour que le rendu initial et les images 
    // soient pris en compte dans le calcul du scrollWidth
    const timer = setTimeout(checkMobileAndWidth, 100);

    window.addEventListener("resize", checkMobileAndWidth);
    return () => {
      window.removeEventListener("resize", checkMobileAndWidth);
      clearTimeout(timer);
    };
  }, [isMobile, PROJECTS]); // Recalculer si les projets changent

  return (
    <section
      id="work"
      className={`py-24 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-[0.03] ${isDarkMode ? "bg-[#ccff00]" : "bg-yellow-400"}`} />
      </div>

      <div className="max-w-[100vw] relative z-10">
        
        {/* --- HEADER --- */}
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mb-16 px-6"
        >
          <motion.div 
            variants={itemVariants} 
            className={`text-xs uppercase tracking-[0.4em] font-bold mb-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            Études de Cas
          </motion.div>
          <motion.h2 
            variants={itemVariants} 
            className="text-4xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            Mes <span className="text-[#ccff00]">Réalisations</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants} 
            className={`text-base md:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto font-light leading-relaxed`}
          >
            {isMobile 
              ? "Découvrez mes projets ci-dessous." 
              : "Cliquez et faites glisser pour explorer les projets."}
          </motion.p>
        </motion.div>

        {/* --- ZONE DE DRAG --- */}
        <div 
          ref={scrollRef} 
          className={`relative ${isMobile ? "px-6" : "overflow-hidden px-20 cursor-grab active:cursor-grabbing"}`}
        >
          <motion.div
            ref={carouselRef}
            // Active le drag uniquement sur Desktop
            drag={isMobile ? false : "x"}
            dragConstraints={{ right: 0, left: -width }}
            dragElastic={0.15}
            // Empêche le drag de bloquer le scroll vertical sur les navigateurs tactiles
            dragMomentum={true}
            className={`${
              isMobile 
              ? "flex flex-col gap-12" 
              : "flex gap-10 w-max py-10" // w-max est indispensable pour que le carousel ne se réduise pas
            }`}
          >
            {PROJECTS.map((project, index) => (
              <motion.div 
                key={project.id} 
                // Empêche la sélection de texte ou d'images pendant le drag sur desktop
                className={`${
                  isMobile 
                  ? "w-full" 
                  : "w-[85vw] md:w-[500px] xl:w-[600px] flex-shrink-0 select-none pointer-events-none md:pointer-events-auto"
                }`}
              >
                <ProjectCard 
                  project={project} 
                  index={index} 
                  isDarkMode={isDarkMode} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;