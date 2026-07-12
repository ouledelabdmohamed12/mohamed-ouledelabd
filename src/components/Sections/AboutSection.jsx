import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { JOURNEY_STEPS, PASSIONS } from "../../utils/data";
import SIGNATURE from "../../assets/images/signature.svg";
import { containeVariants, itemVariants } from "../../utils/helper";

const AboutSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-28 px-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mb-20"
        >
          <motion.div
            variants={itemVariants}
            className={`text-xs uppercase tracking-[0.4em] font-semibold mb-6 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {t("about.badge")}
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight"
          >
            {t("about.title")} <span className="text-[#2B8CA6]">{t("about.titleAccent")}</span>
          </motion.h2>
        </motion.div>

        {/* Mission — plain text block, no card */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <motion.p
            variants={itemVariants}
            className={`text-xl md:text-2xl leading-relaxed font-light mb-6 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            {t("about.mission.p1")}
          </motion.p>
          <motion.p
            variants={itemVariants}
            className={`text-base leading-relaxed font-light ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("about.mission.p2")}
          </motion.p>
        </motion.div>

        {/* What I love to build — plain rows, no cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className={`max-w-2xl mx-auto mb-24 divide-y ${isDarkMode ? "divide-white/10" : "divide-gray-200"}`}
        >
          <h3 className={`text-xs uppercase tracking-[0.3em] font-semibold text-center pb-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            {t("about.build.title")}
          </h3>
          {PASSIONS.map((passion) => (
            <motion.div key={passion.id} variants={itemVariants} className="flex items-center gap-6 py-6">
              <passion.icon size={22} className="text-[#2B8CA6] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-base mb-0.5">{t(`about.passions.${passion.id}.title`)}</h4>
                <p className={`text-sm font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t(`about.passions.${passion.id}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Journey — thin left-border timeline, no boxed cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="max-w-3xl mx-auto mb-24"
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold mb-12 text-center tracking-tight"
          >
            {t("about.journeyTitle")}
          </motion.h3>

          <div className={`space-y-10 border-l ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
            {JOURNEY_STEPS.map((step) => (
              <motion.div key={step.key} variants={itemVariants} className="relative pl-8">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#2B8CA6]" />
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {step.year}
                  </span>
                  <span className={isDarkMode ? "text-gray-700" : "text-gray-300"}>·</span>
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                    {step.company}
                  </span>
                </div>
                <h4 className="text-lg font-semibold tracking-tight mb-2">
                  {t(`about.journey.${step.key}.title`)}
                </h4>
                <p className={`text-sm leading-relaxed font-light max-w-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t(`about.journey.${step.key}.description`)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Signature */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className="text-center mb-20"
        >
          <div className={`text-[10px] uppercase tracking-[0.2em] font-semibold mb-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            {t("about.signature")}
          </div>
          <div className="flex justify-center">
            <img src={SIGNATURE} alt="Mohamed Ouledelabd" className={`w-40 ${isDarkMode ? "invert brightness-200 opacity-80" : ""}`} />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
            <p className={`text-lg font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("about.ctaText")}
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-[#2B8CA6] hover:bg-[#217485] text-white px-9 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-semibold transition-colors"
            >
              {t("about.ctaButton")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
