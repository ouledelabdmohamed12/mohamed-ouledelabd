import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";
import ProjectCard from "../ProjectCard";
import ProjectModal from "../ProjectModal";
import { isBot } from "../../lib/isBot";

/**
 * `lead` marks the instance that owns its page's <h1>: standalone on /work its
 * title IS the page title, while on the home page the hero already holds the
 * only <h1>. Classes are identical either way — only the tag changes.
 */
const ProjectsSection = ({ limit, lead = false } = {}) => {
  const Title = motion[lead ? "h1" : "h2"];
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  // Crawlers never scroll, so `isInView` would stay false and every block
  // below would be screenshotted at `opacity: 0`. Treating a bot as "already
  // in view" renders the resting state immediately — same markup, same copy,
  // only the entrance animation is skipped.
  const visible = isBot || isInView;
  const [activeIndex, setActiveIndex] = useState(null);

  // A project counts as live once it has a real production/demo URL ("#" is the
  // placeholder used for work that isn't publicly reachable).
  const isLive = (p) => Boolean(p.liveUrl) && p.liveUrl !== "#";

  // Home (limit set) previews featured work; /work lists everything with the
  // live projects first. Array.sort is stable, so within each group the order
  // declared in data.js is preserved — and a project rises automatically as
  // soon as it gets a real liveUrl.
  const items = limit
    ? [...PROJECTS].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, limit)
    : [...PROJECTS].sort((a, b) => Number(isLive(b)) - Number(isLive(a)));

  const handleNavigate = (dir) =>
    setActiveIndex((i) => (i + dir + items.length) % items.length);

  return (
    <section id="work" ref={sectionRef} className="bg-slate-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={isBot ? false : "hidden"}
          animate={visible ? "visible" : "hidden"}
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

          <Title
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900"
          >
            {t("projects.title")}{" "}
            <span className="text-indigo-600">{t("projects.titleAccent")}</span>
          </Title>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={isBot ? false : "hidden"}
          animate={visible ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setActiveIndex}
              /* Always one level under the section title above. */
              headingTag={lead ? "h2" : "h3"}
            />
          ))}
        </motion.div>

        {limit && (
          <motion.div
            initial={isBot ? false : { opacity: 0 }}
            animate={visible ? { opacity: 1 } : { opacity: 0 }}
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
