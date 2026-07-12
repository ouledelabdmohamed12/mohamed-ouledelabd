import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { containeVariants, itemVariants } from "../../utils/helper";

const HeroSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className={`min-h-screen flex flex-col items-center justify-center relative px-6 pt-32 pb-24 text-center overflow-hidden transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Soft ambient glow behind the headline, like the reference hero */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full blur-[160px] pointer-events-none ${
          isDarkMode ? "bg-[#2B8CA6]/10" : "bg-[#2B8CA6]/[0.06]"
        }`}
      />

      {/* Giant faint Koda Atlas mark watermark, matching the real logo exactly */}
      <svg
        viewBox="0 0 230 175"
        fill="none"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1000px] lg:w-[1200px] h-auto pointer-events-none select-none"
        style={{ opacity: isDarkMode ? 0.05 : 0.02 }}
      >
        <defs>
          <mask id="hero-koda-valley">
            <rect x="0" y="0" width="230" height="175" fill="white" />
            <path
              d="M55 150 L95 95 L118 120 L152 70"
              fill="none"
              stroke="black"
              strokeWidth="9"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </mask>
        </defs>
        {/* Outer mountain contour */}
        <path
          d="M10 150 L150 30 L215 150 Z"
          stroke={isDarkMode ? "#ffffff" : "#0a0c10"}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Front peak, with the code-valley cut out */}
        <path
          d="M45 150 L100 20 L158 150 Z"
          fill={isDarkMode ? "#ffffff" : "#0a0c10"}
          mask="url(#hero-koda-valley)"
        />
        {/* Snow cap */}
        <path
          d="M100 20 L116 58 L84 58 Z"
          fill={isDarkMode ? "#ffffff" : "#0a0c10"}
        />
      </svg>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containeVariants}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className={`text-xs md:text-sm uppercase tracking-[0.4em] font-semibold mb-8 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {t("hero.badge")}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-semibold mb-8 leading-[1.05] tracking-tight"
        >
          {t("hero.title1")} <span className="text-[#2B8CA6]">{t("hero.titleAccent")}</span>{" "}
          {t("hero.title2")}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className={`text-lg md:text-xl mx-auto max-w-xl leading-relaxed font-light mb-12 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate("/contact")}
            className="bg-[#2B8CA6] hover:bg-[#217485] text-white font-semibold px-9 py-4 rounded-full transition-colors"
          >
            {t("hero.ctaContact")}
          </button>
          <button
            onClick={() => navigate("/work")}
            className={`px-9 py-4 rounded-full border font-medium transition-colors ${
              isDarkMode
                ? "border-white/15 hover:bg-white/5 text-gray-200"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {t("hero.ctaProjects")}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator, text-first like the reference */}
      <motion.button
        onClick={() => navigate("/services")}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] font-medium ${
          isDarkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"
        } transition-colors`}
      >
        {t("hero.scroll")}
      </motion.button>
    </section>
  );
};

export default HeroSection;
