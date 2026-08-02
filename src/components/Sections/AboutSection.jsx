import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PASSIONS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

const AboutSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={sectionRef} className="bg-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            {t("about.badge")}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6"
          >
            {t("about.title")}{" "}
            <span className="text-indigo-600">{t("about.titleAccent")}</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4"
          >
            {t("about.mission.p1")}
          </motion.p>

          <motion.p variants={itemVariants} className="text-[15px] text-gray-500 leading-relaxed">
            {t("about.mission.p2")}
          </motion.p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {PASSIONS.map((passion) => (
            <motion.div
              key={passion.id}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6">
                <passion.icon size={22} strokeWidth={2} />
              </span>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t(`about.passions.${passion.id}.title`)}
              </h4>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                {t(`about.passions.${passion.id}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          className="rounded-2xl bg-slate-50 border border-gray-100 px-8 py-12 text-center"
        >
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-6">
            {t("about.ctaText")}
          </p>
          <button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
          >
            {t("about.ctaButton")}
            <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
