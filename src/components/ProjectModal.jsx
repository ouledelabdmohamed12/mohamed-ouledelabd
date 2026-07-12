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
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm overflow-y-auto text-white"
          onClick={onClose}
        >
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <img src="/koda-atlas-favicon.svg" alt="" className="w-7 h-7 rounded-md" />
              <span className="font-semibold text-sm tracking-wide">
                koda<span className="text-[#2B8CA6]">.</span>atlas
              </span>
            </div>
            <div className="flex items-center gap-3">
              {hasDemo && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hidden sm:inline-flex items-center gap-1.5 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  {t("projects.openProject")} <ArrowUpRight size={15} />
                </a>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X size={26} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto px-6 pb-20" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img src={project.image} alt={title} className="w-full max-h-[65vh] object-cover" />
              </div>

              {projects.length > 1 && (
                <>
                  <button
                    onClick={() => onNavigate(-1)}
                    aria-label="Previous project"
                    className="absolute left-2 md:-left-14 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={() => onNavigate(1)}
                    aria-label="Next project"
                    className="absolute right-2 md:-right-14 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            <div className="mt-10">
              <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">{title}</h3>
              <div className="text-sm text-gray-400 mb-6">
                {t("projects.projectOf", { current: index + 1, total: projects.length })}
              </div>
              <p className="text-base md:text-lg leading-relaxed font-light text-gray-300 max-w-2xl mb-6">
                {description}
              </p>
              <div className="text-xs text-gray-500 font-medium mb-10">{project.tags.join(" · ")}</div>

              <div className="grid sm:grid-cols-3 gap-6 mb-10 max-w-3xl">
                <div className="p-5 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-[#2B8CA6] mb-2">
                    {t("projects.caseStudy.problem")}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300 font-light">{problem}</p>
                </div>
                <div className="p-5 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-[#2B8CA6] mb-2">
                    {t("projects.caseStudy.solution")}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300 font-light">{solution}</p>
                </div>
                <div className="p-5 rounded-xl border border-white/10">
                  <div className="text-[10px] uppercase tracking-widest font-semibold text-[#2B8CA6] mb-2">
                    {t("projects.caseStudy.impact")}
                  </div>
                  <p className="text-sm leading-relaxed text-gray-300 font-light">{impact}</p>
                </div>
              </div>

              {hasCode && (
                <a
                  href={project.githuburl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold border-b border-white/20 hover:border-[#2B8CA6] hover:text-[#2B8CA6] pb-0.5 transition-colors"
                >
                  <FiGithub size={14} /> {t("projects.github")}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
