import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { FAQ_ITEMS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const FaqSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`py-28 px-6 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-3xl mx-auto relative z-10">
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
            {t("faq.badge")}
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            {t("faq.title")} <span className="text-[#2B8CA6]">{t("faq.titleAccent")}</span>
          </motion.h2>
        </motion.div>

        {/* List */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className={`divide-y ${isDarkMode ? "divide-white/10" : "divide-gray-200"}`}
        >
          {FAQ_ITEMS.map((item) => {
            const isOpen = open === item.id;
            return (
              <motion.div key={item.id} variants={itemVariants}>
                <button
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-semibold text-base md:text-lg tracking-tight">
                    {t(`faq.items.${item.id}.q`)}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-[#2B8CA6]"
                  >
                    <Plus size={20} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p
                        className={`pb-6 text-sm md:text-base leading-relaxed font-light max-w-xl ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t(`faq.items.${item.id}.a`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
