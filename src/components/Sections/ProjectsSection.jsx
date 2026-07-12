import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { PROJECTS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";
import ProjectCard from "../ProjectCard";
import ProjectModal from "../ProjectModal";

const ProjectsSection = ({ limit } = {}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(null);

  const items = limit
    ? [...PROJECTS].sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1)).slice(0, limit)
    : PROJECTS;

  const handleNavigate = (dir) =>
    setActiveIndex((i) => (i + dir + items.length) % items.length);

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`py-28 px-6 transition-colors duration-500 ${
        isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">
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
            {t("projects.badge")}
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight"
          >
            {t("projects.title")} <span className="text-[#2B8CA6]">{t("projects.titleAccent")}</span>
          </motion.h2>
        </motion.div>

        {/* Alternating project blocks */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="space-y-24 md:space-y-32"
        >
          {items.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isDarkMode={isDarkMode}
              onOpen={setActiveIndex}
            />
          ))}
        </motion.div>

        {limit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="text-center mt-20"
          >
            <button
              onClick={() => navigate("/work")}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold border-b pb-0.5 transition-colors ${
                isDarkMode
                  ? "border-white/20 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
                  : "border-gray-300 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
              }`}
            >
              {t("projects.seeAll")} <ArrowUpRight size={15} />
            </button>
          </motion.div>
        )}
      </div>

      <ProjectModal
        projects={items}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={handleNavigate}
      />
    </section>
  );
};

export default ProjectsSection;
