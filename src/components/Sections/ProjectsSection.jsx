import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";
import ProjectCard from "../ProjectCard";
import ProjectModal from "../ProjectModal";

const ProjectsSection = ({ limit } = {}) => {
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
    <section id="work" ref={sectionRef} className="bg-slate-50 py-24 px-6">
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
            {t("projects.badge")}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900"
          >
            {t("projects.title")}{" "}
            <span className="text-indigo-600">{t("projects.titleAccent")}</span>
          </motion.h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setActiveIndex}
            />
          ))}
        </motion.div>

        {limit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            className="text-center mt-14"
          >
            <button
              onClick={() => navigate("/work")}
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 text-sm font-semibold shadow-sm transition-colors"
            >
              {t("projects.seeAll")} <ArrowRight size={16} />
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
