import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { containeVariants, itemVariants } from "../../utils/helper";

const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen transition-all duration-500 overflow-hidden ${
      isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
    }`}>
      <motion.section
        id="home"
        style={{ y: heroY }}
        className="min-h-screen flex items-center justify-center relative px-6 pt-20"
      >
        {/* BACKGROUND AMBIANCE (Gradients bleus supprimés) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Les lueurs bleues et mauves ont été enlevées ici pour un fond noir pur */}
          
          {/* Petites particules lumineuses (discrètes, en jaune pour rappeler les boutons) */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.3, 1] }}
              transition={{ duration: Math.random() * 4 + 3, repeat: Infinity }}
              className={`absolute w-1 h-1 ${isDarkMode ? "bg-[#ccff00]/30" : "bg-[#ccff00]/10"} rounded-full`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto w-full z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* GAUCHE : TES TEXTES AVEC LE MOT 'EXPERIENCES' EN JAUNE ET LES BOUTONS JAUNES SANS FLÈCHE */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containeVariants}
            className="text-left"
          >
            <motion.div
              variants={itemVariants}
              className={`text-sm uppercase tracking-[0.3em] font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } mb-6`}
            >
              Création de Sites Web & Applications
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
            >
              Building digital <br />
              <span className="text-[#ccff00]">experiences</span> <br />
              that matter
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`text-lg md:text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-lg leading-relaxed font-light`}
            >
              Je conçois et développe des applications web et mobiles sur-mesure. Transformez vos idées en solutions numériques performantes, intuitives et scalables, conçues pour marquer les esprits.
            </motion.p>

            {/* LES BOUTONS JAUNES ÉPURÉS (Bloc Jaune Unique) */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6 items-center">
              
              {/* Bouton Principal - Bloc Jaune Unique */}
              <button 
                onClick={() => scrollToSection("work")}
                className="bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-yellow-500/5"
              >
                Découvrir mes Projets
              </button>

              {/* Bouton Secondaire - Outline discret */}
              <button 
                onClick={() => scrollToSection("contact")}
                className={`px-8 py-4 rounded-xl border font-medium transition-all ${
                  isDarkMode 
                  ? "border-gray-800 hover:bg-gray-800/50 text-gray-300" 
                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                Me Contacter
              </button>
            </motion.div>
          </motion.div>

          {/* DROITE : LA FENÊTRE DE CODE (Style original conservé) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Fenêtre de Code principale */}
            <div className={`rounded-2xl border ${isDarkMode ? "bg-[#0d1117]/80 border-gray-800" : "bg-white border-gray-200"} shadow-2xl p-8 relative z-20 backdrop-blur-sm`}>
              <div className="flex gap-2 mb-8">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <pre className="text-sm font-mono leading-relaxed overflow-hidden">
                <code className="text-blue-400">async function</code> <code className="text-yellow-300">fetchData</code>( ) <span className="text-gray-300">{`{`}</span><br />
                &nbsp;&nbsp;<code className="text-blue-400">const</code> <code className="text-gray-400">url</code> = <code className="text-emerald-400">'https://api.votreapp.com/v1/projects'</code>;<br />
                &nbsp;&nbsp;<code className="text-blue-400">const</code> <code className="text-gray-400">options</code> = <span className="text-gray-300">{`{`}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-400">method:</span> <code className="text-emerald-400">'GET'</code>,<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-400">headers:</span> <span className="text-gray-300">{`{`}</span> <span className="text-emerald-400">'Content-Type'</span>: <span className="text-emerald-400">'application/json'</span> <span className="text-gray-300">{`}`}</span>,<br />
                &nbsp;&nbsp;<span className="text-gray-300">{`}`}</span>;<br /><br />
                &nbsp;&nbsp;<code className="text-purple-400">try</code> <span className="text-gray-300">{`{`}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-blue-400">const</code> <code className="text-gray-400">response</code> = <code className="text-purple-400">await</code> <code className="text-yellow-300">fetch</code>(url, options);<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-blue-400">const</code> <code className="text-gray-400">data</code> = <code className="text-purple-400">await</code> <code className="text-gray-400">response</code>.<code className="text-yellow-300">json</code>( );<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-blue-400">return</code> data;<br />
                &nbsp;&nbsp;<span className="text-gray-300">{`}`}</span> <code className="text-purple-400">catch</code> <span className="text-gray-300">{`(error)`}</span> <span className="text-gray-300">{`{`}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<code className="text-yellow-300">console</code>.<code className="text-yellow-300">error</code>(<span className="text-emerald-400">'Fetch error:'</span>, error);<br />
                &nbsp;&nbsp;<span className="text-gray-300">{`}`}</span><br />
                <span className="text-gray-300">{`}`}</span>
              </pre>
            </div>

            {/* Popup d'autocomplétion flottante */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute -bottom-6 -left-10 z-30 p-5 rounded-xl border ${isDarkMode ? "bg-[#161b22] border-gray-700" : "bg-gray-100 border-gray-300"} shadow-2xl w-64 backdrop-blur-md`}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-mono text-blue-400 bg-blue-500/10 p-2 rounded-md border border-blue-500/20">
                    <div className="w-2 h-2 rounded bg-blue-500" /> React_NextJS
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 px-2 opacity-50">
                    <div className="w-2 h-2 rounded bg-gray-600" /> Spring_Boot
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-gray-500 px-2 opacity-50">
                    <div className="w-2 h-2 rounded bg-gray-600" /> Tailwind_CSS
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection("skills")}
        >
          <ArrowDown size={24} className={isDarkMode ? "text-gray-500" : "text-gray-400"} />
        </motion.div>
      </motion.section>
    </div>
  );
};

export default HeroSection;