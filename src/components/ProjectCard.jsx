import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { itemVariants } from "../utils/helper";

const ProjectCard = ({ project, index, onOpen }) => {
  const { t } = useTranslation();

  const title = t(`projects.items.${project.key}.title`);
  const description = t(`projects.items.${project.key}.description`);
  const hasDemo = project.liveUrl && project.liveUrl !== "#";
  const hasCode = project.githuburl && project.githuburl !== "#";

  return (
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="view"
        className="relative block w-full overflow-hidden hover:cursor-none"
      >
        {project.image ? (
          <img
            src={project.image}
            alt={title}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Placeholder until a real screenshot is added for this project.
          <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
            <span className="text-2xl font-bold tracking-tight text-indigo-300">{title}</span>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm">
            {t("projects.featured")}
          </span>
        )}
      </button>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-3">
          {project.category}
        </span>

        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>

        <p className="text-[15px] text-gray-500 leading-relaxed mb-5 flex-1">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {(hasDemo || hasCode) && (
        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-gray-100">
          {hasDemo && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {t("projects.demo")} <ArrowUpRight size={15} />
            </a>
          )}
          {hasCode && (
            <a
              href={project.githuburl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <FiGithub size={14} /> {t("projects.github")}
            </a>
          )}
        </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
