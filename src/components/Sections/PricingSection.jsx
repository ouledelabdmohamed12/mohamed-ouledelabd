import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { PRICING_TIERS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const PricingSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className={`py-20 px-6 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className={`text-xs uppercase tracking-[0.4em] font-semibold mb-6 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {t("pricing.badge")}
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold mb-8 tracking-tight"
          >
            {t("pricing.title")} <span className="text-[#2B8CA6]">{t("pricing.titleAccent")}</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className={`text-lg max-w-2xl mx-auto font-light leading-relaxed ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {t("pricing.subtitle")}
          </motion.p>
        </motion.div>

        {/* Tiers */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {PRICING_TIERS.map((tier) => (
            <motion.div
              key={tier.id}
              variants={itemVariants}
              className={`relative flex flex-col p-8 rounded-2xl border ${
                tier.popular
                  ? "border-[#2B8CA6] md:-translate-y-3 shadow-xl shadow-[#2B8CA6]/10"
                  : isDarkMode
                  ? "border-white/10"
                  : "border-gray-200"
              } ${isDarkMode ? "bg-white/[0.02]" : "bg-white"}`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2B8CA6] text-white text-[10px] uppercase tracking-widest font-semibold px-4 py-1 rounded-full">
                  {t("pricing.popular")}
                </span>
              )}

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  isDarkMode ? "bg-[#2B8CA6]/10" : "bg-[#2B8CA6]/10"
                }`}
              >
                <tier.icon size={22} className="text-[#2B8CA6]" />
              </div>

              <h3 className="text-2xl font-semibold tracking-tight mb-2">
                {t(`pricing.tiers.${tier.id}.name`)}
              </h3>
              <div className="text-xs uppercase tracking-widest font-semibold text-[#2B8CA6] mb-8">
                {t(`pricing.tiers.${tier.id}.usage`)}
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {t(`pricing.tiers.${tier.id}.features`, { returnObjects: true }).map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check size={16} className="text-[#2B8CA6] flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-light">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/contact")}
                className={`w-full py-3.5 rounded-full text-sm font-semibold transition-colors ${
                  tier.popular
                    ? "bg-[#2B8CA6] hover:bg-[#217485] text-white"
                    : isDarkMode
                    ? "bg-white/5 hover:bg-white/10 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
              >
                {t("common.discussCta")}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className={`text-center text-xs font-light mt-10 max-w-xl mx-auto ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          {t("pricing.disclaimer")}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
