import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const ProjectModal = ({ projects, index, onClose, onNavigate }) => {
  const { t } = useTranslation();
  const isOpen = index !== null && index !== undefined;
  const project = isOpen ? projects[index] : null;

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    if (window.__lenis) window.__lenis.stop();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, onNavigate]);

  if (!project) return null;

  const title = t(`projects.items.${project.key}.title`);
  const description = t(`projects.items.${project.key}.description`);
  const problem = t(`projects.items.${project.key}.problem`);
  const solution = t(`projects.items.${project.key}.solution`);
  const impact = t(`projects.items.${project.key}.impact`);
  const hasDemo = project.liveUrl && project.liveUrl !== "#";
  const hasCode = project.githuburl && project.githuburl !== "#";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-900/50 backdrop-blur-sm overflow-y-auto p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative mx-auto max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-100 bg-white/90 backdrop-blur-md px-6 py-4">
              <span className="text-sm font-medium text-gray-500">
                {t("projects.projectOf", { current: index + 1, total: projects.length })}
              </span>
              <div className="flex items-center gap-2">
                {hasDemo && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors"
                  >
                    {t("projects.openProject")} <ArrowUpRight size={15} />
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              {project.image ? (
                <img src={project.image} alt={title} className="w-full max-h-[55vh] object-cover" />
              ) : (
                // Placeholder until a real screenshot is added for this project.
                <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
                  <span className="text-3xl font-bold tracking-tight text-indigo-300">{title}</span>
                </div>
              )}

              {projects.length > 1 && (
                <>
                  <button
                    onClick={() => onNavigate(-1)}
                    aria-label="Previous project"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2.5 text-gray-700 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => onNavigate(1)}
                    aria-label="Next project"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 backdrop-blur-sm p-2.5 text-gray-700 shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                {project.category}
              </span>

              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-2 mb-4">
                {title}
              </h3>

              <p className="text-[15px] md:text-base leading-relaxed text-gray-500 mb-6">
                {description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                  { label: t("projects.caseStudy.problem"), body: problem },
                  { label: t("projects.caseStudy.solution"), body: solution },
                  { label: t("projects.caseStudy.impact"), body: impact },
                ].map((block) => (
                  <div
                    key={block.label}
                    className="rounded-xl border border-gray-100 bg-slate-50 p-5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                      {block.label}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500">{block.body}</p>
                  </div>
                ))}
              </div>

              {hasCode && (
                <a
                  href={project.githuburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 text-sm font-semibold shadow-sm transition-colors"
                >
                  <FiGithub size={14} /> {t("projects.github")}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
