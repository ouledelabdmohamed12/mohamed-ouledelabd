import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { SERVICES } from "../../utils/data";
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

        {/* Numbered list */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className={`divide-y ${isDarkMode ? "divide-white/10" : "divide-gray-200"}`}
        >
          {SERVICES.map((service, index) => (
            <motion.button
              key={service.id}
              variants={itemVariants}
              onClick={() => navigate("/contact")}
              className="group w-full flex items-center gap-6 md:gap-10 py-8 text-left"
            >
              <span
                className={`text-sm font-semibold flex-shrink-0 w-8 ${
                  isDarkMode ? "text-gray-600" : "text-gray-300"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight group-hover:text-[#2B8CA6] transition-colors">
                  {t(`services.items.${service.id}.title`)}
                </h3>
                <p className={`text-sm md:text-base font-light leading-relaxed max-w-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t(`services.items.${service.id}.description`)}
                </p>
              </div>
              <ArrowUpRight
                size={22}
                className={`flex-shrink-0 transition-all duration-300 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 ${
                  isDarkMode ? "text-[#2B8CA6]" : "text-gray-900"
                }`}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className="text-center mt-16"
        >
          <button
            onClick={() => navigate("/contact")}
            className="bg-[#2B8CA6] hover:bg-[#217485] text-white font-semibold px-9 py-4 rounded-full transition-colors"
          >
            {t("services.cta")}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
