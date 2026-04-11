import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { JOURNEY_STEPS, PASSIONS } from "../../utils/data";
import SIGNATURE from "../../assets/images/signature.svg";
import { containeVariants, itemVariants } from "../../utils/helper";

const AboutSection = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const timelinRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const timelineInView = useInView(timelinRef, {
    once: true,
    margin: "-50px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const stepVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-32 px-6 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      } relative overflow-hidden transition-colors duration-500`}
    >
      {/* Background Elements (Lueurs jaunes très subtiles) */}
      <motion.div style={{ y }} className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-40 right-1/3 w-80 h-80 rounded-full blur-[120px] opacity-[0.03] ${
            isDarkMode ? "bg-[#ccff00]" : "bg-yellow-400"
          }`}
        />
        <div
          className={`absolute bottom-20 left-1/3 w-96 h-96 rounded-full blur-[120px] opacity-[0.03] ${
            isDarkMode ? "bg-[#ccff00]" : "bg-yellow-400"
          }`}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
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
            Découvrez mon parcours
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
          >
            À Propos de <span className="text-[#ccff00]">Moi</span>
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Personal Story */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containeVariants}
            className="space-y-12"
          >
            <motion.div
              variants={itemVariants}
              className={`p-10 rounded-3xl border ${
                isDarkMode
                  ? "bg-[#111418] border-white/5 backdrop-blur-sm"
                  : "bg-gray-50/80 border-gray-200 backdrop-blur-sm"
              }`}
            >
              <h3 className="text-3xl font-bold mb-8 tracking-tight text-[#ccff00]">Ma Mission</h3>
              <p
                className={`text-lg leading-relaxed mb-6 font-light ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Élève-Ingénieur en **5ème année MIAGE à l'EMSI Marrakech**, je conçois des solutions digitales qui transforment les idées en réalités technologiques concrètes et performantes.
              </p>

              <p
                className={`text-base leading-relaxed font-light ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Basé à Marrakech et mobile sur tout le Maroc (Axe Casablanca - Rabat), je m'investis dans la création d'architectures robustes (Spring Boot) et d'interfaces intuitives (React) pour répondre aux enjeux de la transformation digitale locale.
              </p>
            </motion.div>

            {/* Ce que j'aime bâtir */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h3 className="text-2xl font-bold tracking-tight px-2">Ce que j'aime bâtir</h3>
              <div className="grid gap-4">
                {PASSIONS.map((passion) => (
                  <motion.div
                    key={passion.title}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    className={`flex items-center space-x-6 p-6 rounded-2xl border transition-all duration-300 ${
                      isDarkMode
                        ? "bg-[#111418] border-white/5 hover:border-[#ccff00]/20 hover:bg-[#ccff00]/5"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-xl flex-shrink-0 ${
                        isDarkMode ? "bg-white/5" : "bg-white shadow-sm"
                      }`}
                    >
                      <passion.icon size={24} className="text-[#ccff00]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{passion.title}</h4>
                      <p
                        className={`text-sm font-light ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {passion.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Digital Signature */}
            <motion.div variants={itemVariants} className="text-center pt-8">
              <div
                className={`text-[10px] uppercase tracking-[0.2em] font-bold ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                } mb-6`}
              >
                Conçu avec passion par
              </div>

              <div className="flex justify-center">
                <img src={SIGNATURE} alt="Mohamed Ouledelabd" className={`w-48 ${isDarkMode ? "invert brightness-200 opacity-80" : ""}`} />
              </div>
            </motion.div>
          </motion.div>

          {/* Developer Journey Timeline */}
          <motion.div
            ref={timelinRef}
            initial="hidden"
            animate={timelineInView ? "visible" : "hidden"}
            variants={timelineVariants}
            className="relative lg:pl-8"
          >
            <h3 className="text-3xl font-bold mb-12 text-center lg:text-left tracking-tight text-[#ccff00]">
              Mon Parcours
            </h3>

            {/* Timeline Line */}
            <div
              className={`absolute left-8 lg:left-16 top-24 bottom-12 w-px ${
                isDarkMode ? "bg-white/10" : "bg-gray-200"
              }`}
            />

            <div className="space-y-10">
              {JOURNEY_STEPS.map((step) => (
                <motion.div
                  key={step.year}
                  variants={stepVariants}
                  whileHover={{ x: 8 }}
                  className="relative flex items-start space-x-8 group"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-4 ${
                      isDarkMode ? "bg-[#0a0c10] border-[#111418]" : "bg-white border-gray-50"
                    } flex items-center justify-center group-hover:border-[#ccff00] transition-all duration-500`}
                  >
                    <step.icon size={22} className={isDarkMode ? "text-[#ccff00]" : "text-gray-900"} />
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-grow p-8 rounded-3xl border transition-all duration-500 ${
                      isDarkMode
                        ? "bg-[#111418] border-white/5 group-hover:border-[#ccff00]/20"
                        : "bg-white border-gray-100 shadow-sm"
                    } backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold tracking-tight">{step.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                          isDarkMode
                            ? "bg-[#ccff00]/5 border-[#ccff00]/20 text-[#ccff00]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {step.year}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-bold uppercase tracking-wider mb-4 ${
                        isDarkMode ? "text-gray-500" : "text-blue-600"
                      }`}
                    >
                      {step.company}
                    </div>
                    <p
                      className={`text-sm leading-relaxed font-light ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mt-32"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center space-y-8">
            <p className={`text-xl font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Prêt à concrétiser vos idées technologiques ?
            </p>

            <motion.button
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#ccff00] hover:bg-[#b8e600] text-black px-12 py-4 rounded-xl text-sm uppercase tracking-[0.2em] font-bold shadow-xl transition-all duration-300"
            >
              Collaborons ensemble
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;