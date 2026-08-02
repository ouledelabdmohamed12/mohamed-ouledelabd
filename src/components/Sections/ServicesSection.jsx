import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SERVICES } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const ServicesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={sectionRef} className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            {t("services.badge")}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
          >
            {t("services.title")}{" "}
            <span className="text-indigo-600">{t("services.titleAccent")}</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-gray-500 leading-relaxed">
            {t("services.subtitle")}
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service) => (
            <motion.button
              key={service.id}
              variants={itemVariants}
              onClick={() => navigate("/contact")}
              className="group text-left rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <service.icon size={22} strokeWidth={2} />
              </span>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t(`services.items.${service.id}.title`)}
              </h3>

              <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
                {t(`services.items.${service.id}.description`)}
              </p>

              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
                {t("common.discussCta")}
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
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
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
          >
            {t("common.discussCta")}
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
