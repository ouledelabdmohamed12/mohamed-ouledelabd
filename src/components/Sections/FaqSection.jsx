import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FAQ_ITEMS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";
import { isBot } from "../../lib/isBot";

const FaqSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  // Crawlers never scroll, so `isInView` would stay false and every block
  // below would be screenshotted at `opacity: 0`. Treating a bot as "already
  // in view" renders the resting state immediately — same markup, same copy,
  // only the entrance animation is skipped.
  const visible = isBot || isInView;
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" ref={sectionRef} className="bg-[#FAFAFA] py-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={isBot ? false : "hidden"}
          animate={visible ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900"
          >
            {t("faq.title")}{" "}
            <span className="text-accent">{t("faq.titleAccent")}</span>
          </motion.h2>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={isBot ? false : "hidden"}
          animate={visible ? "visible" : "hidden"}
          variants={containeVariants}
          className="space-y-4"
        >
          {FAQ_ITEMS.map((item) => {
            const isOpen = open === item.id;
            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="rounded-[28px] bg-white shadow-[0_4px_24px_-10px_rgba(17,17,26,0.12)] transition-shadow duration-300 hover:shadow-[0_10px_34px_-12px_rgba(17,17,26,0.18)]"
              >
                <button
                  type="button"
                  id={`faq-trigger-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="group w-full flex items-center justify-between gap-6 px-6 sm:px-8 py-6 text-left cursor-pointer"
                >
                  <span className="text-[15px] md:text-[17px] font-semibold text-gray-900">
                    {t(`faq.items.${item.id}.q`)}
                  </span>

                  {/* Plus / minus toggle */}
                  <span className="relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-400 transition-colors duration-300 group-hover:bg-gray-200">
                    <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
                    <motion.span
                      initial={false}
                      animate={{ rotate: 90, scaleX: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 sm:px-8 pb-7 -mt-1 text-[15px] leading-relaxed text-gray-500">
                        {t(`faq.items.${item.id}.a`)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={isBot ? false : "hidden"}
          animate={visible ? "visible" : "hidden"}
          variants={itemVariants}
          className="text-center mt-14"
        >
          <button
            type="button"
            onClick={() => navigate("/contact")}
            className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-dark text-white px-9 py-4 text-sm font-semibold shadow-[0_12px_30px_-8px_rgba(92,51,255,0.55)] hover:shadow-[0_18px_40px_-10px_rgba(92,51,255,0.65)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {t("common.discussCta")}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
