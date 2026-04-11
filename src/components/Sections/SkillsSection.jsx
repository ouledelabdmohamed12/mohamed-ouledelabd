import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { SKILLS_CATEGORY, STATS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

// Import des icônes technologiques
import { 
  SiPython, SiDjango, SiDocker, SiMysql, SiMongodb, 
  SiDart, SiFlutter, SiRedis, SiJavascript, SiAmazonwebservices,
  SiDigitalocean, SiNodedotjs, SiFirebase, SiPostgresql, 
  SiReact, SiNextdotjs, SiTailwindcss 
} from "react-icons/si";
import { TbApi } from "react-icons/tb";

// Configuration de la grille d'icônes
const TECH_ICONS = [
  { name: "Python", icon: SiPython, color: "#3776AB" },
  { name: "Django", icon: SiDjango, color: "#092E20" },
  { name: "Rest Api", icon: TbApi, color: "#0052CC" },
  { name: "Docker", icon: SiDocker, color: "#2496ED" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1" },
  { name: "Mongo DB", icon: SiMongodb, color: "#47A248" },
  { name: "Dart", icon: SiDart, color: "#0175C2" },
  { name: "Flutter", icon: SiFlutter, color: "#02569B" },
  { name: "Redis", icon: SiRedis, color: "#DC382D" },
  { name: "Javascript", icon: SiJavascript, color: "#F7DF1E" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
  { name: "Digital Ocean", icon: SiDigitalocean, color: "#0080FF" },
  { name: "Node JS", icon: SiNodedotjs, color: "#339933" },
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
  { name: "React", icon: SiReact, color: "#61DAFB" },
  { name: "Next JS", icon: SiNextdotjs, color: "#ffffff" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
];

const SkillsSection = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`py-24 px-6 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
      } relative overflow-hidden`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mb-24"
        >
          <motion.div 
            variants={itemVariants} 
            className={`text-xs uppercase tracking-[0.4em] font-bold ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
            } mb-6`}
          >
            Technical Expertise
          </motion.div>
          <motion.h2 
            variants={itemVariants} 
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight"
          >
            Skills &
            <span className="text-[#ccff00]"> Technologies</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`text-lg md:text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } max-w-2xl mx-auto font-light leading-relaxed`}
          >
            A comprehensive toolkit for building modern, scalable web applications from concept to deployment.
          </motion.p>
        </motion.div>

        {/* Grille d'icônes interactive */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-3 md:grid-cols-6 gap-y-16 gap-x-8 mb-32"
        >
          {TECH_ICONS.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="mb-4 relative">
                <div 
                  className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ backgroundColor: tech.color }}
                />
                <tech.icon 
                  size={42} 
                  className="relative z-10 transition-all duration-500 filter grayscale group-hover:grayscale-0"
                  style={{ color: isDarkMode ? (tech.name === "Next JS" ? "white" : tech.color) : tech.color }}
                />
              </div>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                isDarkMode ? "text-gray-500 group-hover:text-white" : "text-gray-400"
              } transition-colors`}>
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills Grid - Cartes avec Badges optimisés */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {SKILLS_CATEGORY.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className={`p-10 rounded-3xl border ${
                isDarkMode ? "bg-[#111418] border-white/5" : "bg-white border-gray-100 shadow-xl"
              }`}
            >
              <div className="flex items-start mb-8">
                <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-white/5" : "bg-gray-100"} mr-6`}>
                  <category.icon size={28} className="text-[#ccff00]" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 tracking-tight">{category.title}</h3>
                  <p className={`text-base ${isDarkMode ? "text-gray-400" : "text-gray-600"} font-light`}>
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Badges avec opacité 5% pour un look Premium */}
              <div className="flex flex-wrap gap-3 mt-8">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-300 ${
                      isDarkMode 
                        ? "bg-[#ccff00]/5 border-[#ccff00]/10 text-[#ccff00] hover:bg-[#ccff00]/10 hover:border-[#ccff00]/30" 
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section épurée */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto"
        >
          {STATS.map((stat) => (
            <motion.div 
              key={stat.label} 
              variants={itemVariants} 
              className="text-center flex flex-col items-center justify-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-[#ccff00] mb-2 tracking-tighter">
                {stat.number}
              </div>
              <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;