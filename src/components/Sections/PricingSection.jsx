import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Minus, Plus, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../hooks/useCurrency";
import { PRICING, ADDON_ORDER, formatPrice } from "../../utils/pricing";
import { containeVariants, itemVariants } from "../../utils/helper";

const INCLUDED = ["design", "responsive", "animations", "home", "legal"];
const MAX_PAGES = 10;

const PricingSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { region } = useCurrency();
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [pages, setPages] = useState(1);
  const [addons, setAddons] = useState({});

  const tier = PRICING[region] || PRICING.EU;
  const toggle = (id) => setAddons((prev) => ({ ...prev, [id]: !prev[id] }));

  const total =
    tier.base +
    (pages - 1) * tier.perPage +
    ADDON_ORDER.reduce((sum, id) => (addons[id] ? sum + tier.addons[id] : sum), 0);

  const cardBg = isDarkMode
    ? "bg-transparent border-white/10"
    : "bg-white border-gray-200";

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
          className="text-center mb-14"
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

        {/* Auto-detected currency, shown for context (no manual switch) */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className="text-center mb-12"
        >
          <span className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            {t("pricing.regionLabel")}{" "}
            <span className="text-[#2B8CA6]">
              {t(`pricing.regions.${region}`)} · {PRICING[region].label}
            </span>
          </span>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* BASE */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            className={`p-8 rounded-2xl border ${cardBg}`}
          >
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-2xl font-semibold tracking-tight">{t("pricing.baseTitle")}</h3>
              <div className="text-[#2B8CA6] font-semibold">
                <span className="text-xs uppercase tracking-widest mr-1">{t("pricing.fromLabel")}</span>
                {formatPrice(region, tier.base)}
              </div>
            </div>
            <p className={`text-sm font-light mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("pricing.baseSubtitle")}
            </p>

            <div className="space-y-4">
              {INCLUDED.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <Check size={16} className="text-[#2B8CA6] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">{t(`pricing.included.${f}.title`)}</div>
                    <div className={`text-xs font-light ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                      {t(`pricing.included.${f}.desc`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pages stepper */}
            <div className={`mt-8 pt-6 border-t ${isDarkMode ? "border-white/5" : "border-gray-100"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{t("pricing.pagesLabel")}</div>
                  <div className={`text-xs font-light ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                    {t("pricing.pagesHint")}
                  </div>
                </div>
                <div className={`flex items-center gap-3 rounded-xl p-1 ${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
                  <button
                    onClick={() => setPages((p) => Math.max(1, p - 1))}
                    aria-label="minus"
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-white"}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center font-bold tabular-nums">{pages}</span>
                  <button
                    onClick={() => setPages((p) => Math.min(MAX_PAGES, p + 1))}
                    aria-label="plus"
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-white/10" : "hover:bg-white"}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ADD-ONS */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={itemVariants}
            className={`p-8 rounded-2xl border ${cardBg}`}
          >
            <h3 className="text-2xl font-semibold tracking-tight mb-6">{t("pricing.addonsTitle")}</h3>
            <div className="space-y-3">
              {ADDON_ORDER.map((id) => {
                const active = !!addons[id];
                return (
                  <button
                    key={id}
                    onClick={() => toggle(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                      active
                        ? "border-[#2B8CA6] bg-[#2B8CA6]/10"
                        : isDarkMode
                        ? "border-white/10 hover:border-white/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors ${
                        active ? "bg-[#2B8CA6] border-[#2B8CA6]" : isDarkMode ? "border-gray-600" : "border-gray-300"
                      }`}
                    >
                      {active && <Check size={13} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{t(`pricing.addons.${id}.title`)}</div>
                      <div className={`text-xs font-light ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                        {t(`pricing.addons.${id}.desc`)}
                      </div>
                    </div>
                    <div className={`text-sm font-bold whitespace-nowrap ${active ? "text-[#2B8CA6]" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      + {formatPrice(region, tier.addons[id])}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* TOTAL BAR */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className={`mt-6 p-8 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode ? "border-white/10" : "border-gray-200 bg-white"
          }`}
        >
          <div className="text-center md:text-left">
            <div className={`text-[10px] uppercase tracking-[0.3em] font-semibold mb-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              {t("pricing.totalLabel")}
            </div>
            <div className="text-4xl md:text-5xl font-semibold tracking-tight">
              <span className="text-lg align-top mr-2 font-semibold text-[#2B8CA6]">{t("pricing.fromLabel")}</span>
              {formatPrice(region, total)}
            </div>
          </div>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/contact")}
            className="bg-[#2B8CA6] hover:bg-[#217485] text-white px-9 py-4 rounded-full text-sm uppercase tracking-[0.2em] font-semibold transition-colors flex items-center gap-3"
          >
            {t("pricing.cta")}
            <ArrowRight size={18} strokeWidth={3} />
          </motion.button>
        </motion.div>

        <motion.p
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className={`text-center text-xs font-light mt-6 max-w-xl mx-auto ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          {t("pricing.disclaimer")}
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
