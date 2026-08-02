import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AboutTeaserSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="bg-white py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto rounded-2xl border border-gray-100 bg-slate-50 px-8 py-14 text-center shadow-sm"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          {t("about.teaser.kicker")}
        </span>

        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
          {t("about.teaser.title")}
        </h2>

        <p className="text-[15px] md:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
          {t("about.teaser.text")}
        </p>

        <button
          onClick={() => navigate("/about")}
          className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-7 py-3.5 text-sm font-semibold shadow-sm transition-colors"
        >
          {t("about.teaser.cta")}
          <ArrowRight size={15} />
        </button>
      </motion.div>
    </section>
  );
};

export default AboutTeaserSection;
