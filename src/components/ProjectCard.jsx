import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { itemVariants } from "../utils/helper";

const ProjectCard = ({ project, index, isDarkMode, onOpen }) => {
  const { t } = useTranslation();

  const title = t(`projects.items.${project.key}.title`);
  const description = t(`projects.items.${project.key}.description`);
  const hasDemo = project.liveUrl && project.liveUrl !== "#";
  const hasCode = project.githuburl && project.githuburl !== "#";
  const reversed = index % 2 === 1;

  return (
    <motion.div
      variants={itemVariants}
      className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center"
    >
      {/* Image */}
      <div className={reversed ? "md:order-2" : ""}>
        <button
          type="button"
          onClick={() => onOpen(index)}
          data-cursor="view"
          className={`group block w-full rounded-2xl overflow-hidden border hover:cursor-none ${
            isDarkMode ? "border-white/10" : "border-gray-200"
          }`}
        >
          <img
            src={project.image}
            alt={title}
            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      </div>

      {/* Text */}
      <div className={reversed ? "md:order-1" : ""}>
        <div
          className={`text-[11px] uppercase tracking-[0.3em] font-semibold mb-4 ${
            isDarkMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          {project.category}
          {project.featured && (
            <span className="text-[#2B8CA6]"> · {t("projects.featured")}</span>
          )}
        </div>

        <h3 className="text-2xl md:text-3xl font-semibold mb-4 tracking-tight">{title}</h3>

        <p
          className={`text-base leading-relaxed font-light mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        <div
          className={`text-xs font-medium mb-8 ${
            isDarkMode ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {project.tags.join(" · ")}
        </div>

        <div className="flex items-center gap-8">
          {hasDemo && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold border-b pb-0.5 transition-colors ${
                isDarkMode
                  ? "border-white/20 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
                  : "border-gray-300 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
              }`}
            >
              {t("projects.demo")} <ArrowUpRight size={15} />
            </a>
          )}
          {hasCode && (
            <a
              href={project.githuburl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold border-b pb-0.5 transition-colors ${
                isDarkMode
                  ? "border-white/20 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
                  : "border-gray-300 hover:border-[#2B8CA6] hover:text-[#2B8CA6]"
              }`}
            >
              <FiGithub size={14} /> {t("projects.github")}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
