import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { PROCESS_STEPS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const ProcessSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className={`pt-28 pb-16 px-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className="text-3xl md:text-4xl font-semibold mb-16 tracking-tight text-center"
        >
          {t("pricing.process.title")}
        </motion.h2>

        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="space-y-10"
        >
          {PROCESS_STEPS.map((step, index) => (
            <motion.div key={step.id} variants={itemVariants} className="flex items-start gap-6 md:gap-10">
              <span className={`text-3xl md:text-4xl font-semibold flex-shrink-0 w-14 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold mb-1 tracking-tight">
                  {t(`pricing.process.steps.${step.id}.title`)}
                </h3>
                <p className={`text-sm md:text-base font-light leading-relaxed ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t(`pricing.process.steps.${step.id}.description`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
