import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { JOURNEY_STEPS, PASSIONS } from "../../utils/data";

import SIGNATURE from "../../assets/images/signature.svg";
import { containeVariants, itemVariants } from "../../utils/helper";

const AboutSection = () => {
  const { isDarkMode } = useTheme();
  const sectionRef = useRef(null);
  const timelinRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px"});
  const timelineInView = useInView(timelinRef, {
    once: true,
    margin: "-50px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0,1], [50,-50]);

  const timelineVariants = {
    hidden : {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const stepVariants = {
    hidden : {x: -50, opacity: 0},
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`py-24 px-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } relative overflow-hidden`}
    >
      {/* Background Element */}
      <motion.div style={ y } className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-40 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-5 ${
            isDarkMode ? "bg-blue-500" : "bg-blue-400"
          }`}
        />
        <div
          className={`absolute bottom-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-5 ${
            isDarkMode ? "bg-purple-500" : "bg-purple-400"
          }`}
        />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containeVariants}
            className="text-center mb-20"
          >
            <motion.div
              variants={itemVariants}
              className={`text-sm uppercase tracking-widest ${
                isDarkMode ? "text-gray-500" : "text-gray-600"
              } mb-4`}
            >
              Get to know Me
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl mb:text-5xl font-light mb-6"
            >
              About
              <span className="text-blue-500 font-medium"> Me</span>
            </motion.h2>


          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Personal Story */}
            <motion.div
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={containeVariants}
              className="space-y-8"
            >
              <motion.div
              variants={itemVariants}
              className={`p-8 rounded-2xl border ${
                isDarkMode 
                  ? "bg-gray-800/50 border-gray-700 backdrop-blur-sm" 
                  : "bg-gary-50/80 border-gray-200 backdrop-blur-sm"
              }`}
              >
                <h3 className="text-2xl font-medium mb-6">My Mission</h3>
                <p
                  className={`text-lg leading-relaxed mb-6 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  I believe technology should be a bridge that connects peaple and 
                  solves real-world problems. My passion lies is crafting digital
                  experiences that are not just functional, but delightful and
                  accessible to everyone.
                </p>

                <p
                  className={`text-base leading-relaxed ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  When I'm not coding, you'll find me exploring new framework,
                  contribution to open source, or mentoring aspiring developers. I 
                  love the constant evolution of web technologies and the endless
                  possibilities they bring to create meaningful digital experiences.
                </p>
              </motion.div>

              {/* What I Love Building */}
              <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-xl font-medium mb-6">What I Love Building</h3>
                  <div className="grid gap-4">
                    {PASSIONS.map((passion, index) => (
                      <motion.div
                        key={passion.title}
                        variants={itemVariants}
                        whileHover={{ x:4 }}
                        className={`flex items-center space-x-4 p-4 rounded-xl ${
                          isDarkMode
                            ? "bg-gray-800/30 hover:bg-gray-800/50"
                            : "bg-gray-50/50 hover:bg-gray-100/50"
                        } transition-all duration-300`}
                      >
                        <div 
                          className={`p-3 rounded-lg ${
                          isDarkMode ? "bg-gray-700" : "bg-white"
                        }`}
                        > 
                          <passion.icon size={20} className="text-blue-500" /> 
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{passion.title}</h4>
                          <p 
                            className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {passion.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
              </motion.div>
              
              {/* Digital Signature */}
              <motion.div variants={itemVariants} className="text-center py-8">
                <div 
                  className={`text-sm ${
                    isDarkMode ? "text-gray-500" : "text-gray-600"
                  } mb-4`}
                >
                  Crafted with passion by
                </div>
                
                <div className="flex justify-center">
                  <img src={SIGNATURE} alt="Mohamed" className="w-45" />
                </div>
                <div className="text-lg font-medium text-blue-500 mt-2">
                  Mohamed Ouledelabd
                </div>
              </motion.div>
            </motion.div>

            {/* Developer Journey Timeline */}

          </div>
      </div>
    </section>
  )
}

export default AboutSection