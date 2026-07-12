import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import PROFILE_IMG from "../../assets/images/Profile1.avif";

const AboutTeaserSection = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className={`py-28 px-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center"
      >
        <img
          src={PROFILE_IMG}
          alt="Mohamed Ouledelabd"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto md:mx-0 flex-shrink-0"
        />

        <div className="text-center md:text-left">
          <div className={`text-xs uppercase tracking-[0.3em] font-semibold mb-3 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
            {t("about.teaser.kicker")}
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold mb-4 tracking-tight">
            {t("about.teaser.title")}
          </h2>
          <p className={`text-base leading-relaxed font-light mb-6 max-w-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t("about.teaser.text")}
          </p>
          <button
            onClick={() => navigate("/about")}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold border-b pb-0.5 transition-colors ${
              isDarkMode
                ? "border-white/20 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
                : "border-gray-300 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
            }`}
          >
            {t("about.teaser.cta")} <ArrowUpRight size={15} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutTeaserSection;
