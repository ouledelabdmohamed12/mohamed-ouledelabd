import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FiGithub } from "react-icons/fi";

const ProjectCard = ({ project, index, isDarkMode }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className="group relative h-full"
    >
      <div
        className={`h-full flex flex-col rounded-3xl overflow-hidden border transition-all duration-500 ${
          isDarkMode
            ? "bg-[#111418] border-white/5 hover:border-[#ccff00]/30"
            : "bg-white border-gray-100 shadow-sm"
        } backdrop-blur-sm`}
      >
        {/* Project Image Area */}
        <div className="relative overflow-hidden h-64">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {project.featured && (
              <span className="bg-[#ccff00] text-black text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg">
                Featured
              </span>
            )}
          </div>

          <div className="absolute top-4 right-4 z-20">
            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-white/10 ${
              isDarkMode ? "bg-black/60 text-gray-300" : "bg-white/80 text-gray-700"
            } backdrop-blur-md`}>
              {project.category}
            </span>
          </div>

          {/* Overlay (Desktop Only) - On le cache sur mobile via "hidden md:flex" */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="hidden md:flex absolute inset-0 bg-black/60 backdrop-blur-[2px] items-center justify-center space-x-4 z-30 transition-opacity"
          >
            <a href={project.liveUrl} target="_blank" className="bg-[#ccff00] text-black px-5 py-2.5 rounded-full flex items-center space-x-2 text-sm font-bold shadow-xl">
              <ExternalLink size={16} /> <span>Demo</span>
            </a>
            <a href={project.githuburl} target="_blank" className="border-2 border-white text-white px-5 py-2.5 rounded-full flex items-center space-x-2 text-sm font-bold">
              <FiGithub size={16} /> <span>GitHub</span>
            </a>
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-8 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-4 group-hover:text-[#ccff00] transition-colors">
            {project.title}
          </h3>
          <p className={`text-sm leading-relaxed mb-6 font-light ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {project.description}
          </p>

          {/* --- BOUTONS MOBILES (Visibles uniquement sur mobile) --- */}
          <div className="flex md:hidden gap-3 mb-8">
            <a href={project.liveUrl} target="_blank" className="flex-1 bg-[#ccff00] text-black text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <ExternalLink size={14} /> Demo
            </a>
            <a href={project.githuburl} target="_blank" className="flex-1 border border-white/10 text-white text-center py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <FiGithub size={14} /> Code
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mt-auto pt-6 flex flex-wrap gap-2 border-t border-white/5">
            {project.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider border ${
                isDarkMode ? "bg-[#ccff00]/5 border-[#ccff00]/10 text-[#ccff00]" : "bg-gray-100 border-gray-200 text-gray-700"
              }`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;