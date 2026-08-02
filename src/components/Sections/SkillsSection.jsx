import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SKILLS_CATEGORY, STATS } from "../../utils/data";
import { containeVariants, itemVariants } from "../../utils/helper";

import {
  SiPython, SiDjango, SiDocker, SiMysql, SiMongodb,
  SiDart, SiFlutter, SiRedis, SiJavascript, SiAmazonwebservices,
  SiDigitalocean, SiNodedotjs, SiFirebase, SiPostgresql,
  SiReact, SiNextdotjs, SiTailwindcss
} from "react-icons/si";
import { TbApi } from "react-icons/tb";

const TECH_ICONS = [
  { name: "Python", icon: SiPython },
  { name: "Django", icon: SiDjango },
  { name: "Rest Api", icon: TbApi },
  { name: "Docker", icon: SiDocker },
  { name: "MySQL", icon: SiMysql },
  { name: "Mongo DB", icon: SiMongodb },
  { name: "Dart", icon: SiDart },
  { name: "Flutter", icon: SiFlutter },
  { name: "Redis", icon: SiRedis },
  { name: "Javascript", icon: SiJavascript },
  { name: "AWS", icon: SiAmazonwebservices },
  { name: "Digital Ocean", icon: SiDigitalocean },
  { name: "Node JS", icon: SiNodedotjs },
  { name: "Firebase", icon: SiFirebase },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "React", icon: SiReact },
  { name: "Next JS", icon: SiNextdotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
];

const SkillsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="skills" className="bg-slate-50 py-24 px-6">
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
            {t("skills.badge")}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
          >
            {t("skills.titleA")}{" "}
            <span className="text-indigo-600">{t("skills.titleAccent")}</span>
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-gray-500 leading-relaxed">
            {t("skills.subtitle")}
          </motion.p>
        </motion.div>

        {/* Tech grid */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-16"
        >
          {TECH_ICONS.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <tech.icon size={26} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-500 text-center">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Category cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
        >
          {SKILLS_CATEGORY.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                  <category.icon size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {t(`skills.categories.${category.id}.title`)}
                  </h3>
                  <p className="text-[15px] text-gray-500 leading-relaxed">
                    {t(`skills.categories.${category.id}.description`)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containeVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              className="rounded-2xl border border-gray-100 bg-white px-6 py-8 text-center shadow-sm"
            >
              <div className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-500">{t(`skills.stats.${stat.id}`)}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
