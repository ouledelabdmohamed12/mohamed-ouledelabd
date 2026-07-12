import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { SERVICE_PITCH_POINTS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const ServicesSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`py-28 px-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
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
            {t("services.badge")}
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold mb-8 tracking-tight"
          >
            {t("services.title")} <span className="text-[#2B8CA6]">{t("services.titleAccent")}</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`text-lg max-w-xl mx-auto font-light leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("services.subtitle")}
          </motion.p>
        </motion.div>

        {/* Value-proposition pitch */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className={`rounded-3xl border p-8 md:p-12 mb-20 ${
            isDarkMode ? "border-white/10 bg-white/[0.02]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <motion.h3
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold tracking-tight mb-4"
          >
            {t("services.pitch.title")}
          </motion.h3>
          <motion.p
            variants={itemVariants}
            className={`text-base md:text-lg font-light leading-relaxed max-w-2xl mb-10 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("services.pitch.description")}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            {SERVICE_PITCH_POINTS.map((point) => (
              <motion.div key={point.id} variants={itemVariants} className="flex gap-4">
                <point.icon size={22} className="text-[#2B8CA6] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm mb-1">
                    {t(`services.pitch.points.${point.id}.title`)}
                  </div>
                  <div className={`text-sm font-light leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {t(`services.pitch.points.${point.id}.description`)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <button
              onClick={() => navigate("/contact")}
              className="bg-[#2B8CA6] hover:bg-[#217485] text-white font-semibold px-9 py-4 rounded-full transition-colors"
            >
              {t("common.discussCta")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
