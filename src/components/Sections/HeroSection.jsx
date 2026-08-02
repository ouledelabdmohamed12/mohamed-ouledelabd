import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { containeVariants, itemVariants } from "../../utils/helper";

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white px-6 pt-32 pb-24"
    >
      {/* Soft ambient gradient glow behind the headline.
          Sits at z-0 (not -z-10) so the section's white background
          can't paint over it. */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[900px] max-w-[140vw] h-[520px] rounded-full bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 blur-3xl opacity-60 z-0 pointer-events-none"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containeVariants}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        {/* Badge pill */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          <span className="text-sm font-medium text-gray-600">{t("hero.badge")}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6"
        >
          {t("hero.title1")}{" "}
          <span className="text-indigo-600">{t("hero.titleAccent")}</span>{" "}
          {t("hero.title2")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-500 leading-relaxed max-w-2xl mb-10"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate("/contact")}
            className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
          >
            {t("hero.ctaContact")}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <button
            onClick={() => navigate("/work")}
            className="rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 text-sm font-semibold shadow-sm transition-colors"
          >
            {t("hero.ctaProjects")}
          </button>
        </motion.div>

        {/* Scroll cue */}
        <motion.button
          variants={itemVariants}
          onClick={() => navigate("/services")}
          className="mt-16 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {t("hero.scroll")}
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
