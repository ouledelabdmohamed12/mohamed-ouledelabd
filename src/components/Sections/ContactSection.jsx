import { useState, useRef } from 'react';
import {
    motion,
    useInView,
    useScroll,
    useTransform
} from 'framer-motion';
import emailjs from '@emailjs/browser'; 
import { Send, AlertCircle } from 'lucide-react'; 
import { useTheme } from '../../context/ThemeContext';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../utils/data';
import { containeVariants, itemVariants } from '../../utils/helper';
import TextInput from '../Input/TextInput';
import SuccessModel from '../SuccessModel';

const ContactSection = () => {
    const { isDarkMode } = useTheme();
    
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    
    // UI States
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation Refs
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    
    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); 

        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        const templateParams = {
            name: formData.name,       
            email: formData.email,     
            message: formData.message,
            title: "Portfolio Inquiry"
        };

        emailjs
            .send(
                "service_gq5hc6f",  
                "template_bbujlih",  
                templateParams,
                "SAbE7J_X_PEmfaP8h"  
            )
            .then(
                () => {
                    setIsSubmitting(false);
                    setShowSuccess(true);
                    setFormData({ name: "", email: "", message: "" });
                    setTimeout(() => setShowSuccess(false), 3000);
                },
                (error) => {
                    setIsSubmitting(false);
                    setErrorMessage("Something went wrong. Please try again later.");
                }
            );
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className={`py-32 px-6 ${
                isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
            } relative overflow-hidden transition-colors duration-500`}
        >
            {/* Background Elements (Subtle Yellow Glow) */}
            <motion.div style={{ y }} className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className={`absolute top-20 left-1/4 w-72 h-72 rounded-full blur-[120px] opacity-[0.03] ${
                        isDarkMode ? 'bg-[#ccff00]' : 'bg-yellow-400' 
                    }`}
                />
                <div
                    className={`absolute bottom-40 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-[0.03] ${
                        isDarkMode ? 'bg-[#ccff00]' : 'bg-yellow-400'
                    }`}
                />
            </motion.div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={containeVariants}
                    className="text-center mb-24"
                >
                    <motion.div
                        variants={itemVariants}
                        className={`text-xs uppercase tracking-[0.4em] font-bold ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        } mb-6`}
                    >
                        Collaborons ensemble
                    </motion.div>
                    
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
                    >
                        Parlons de votre <span className="text-[#ccff00]">Projet</span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        Basé à <span className={isDarkMode ? 'text-white' : 'text-black'}>Marrakech</span>, 
                        je vous accompagne dans la digitalisation de votre activité partout au Maroc avec des solutions sur-mesure.
                    </motion.p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Form Area */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className={`p-10 rounded-3xl border ${
                                isDarkMode 
                                    ? 'bg-[#111418] border-white/5 backdrop-blur-sm' 
                                    : 'bg-gray-50/80 border-gray-200 backdrop-blur-sm shadow-xl'
                            }`}
                        >
                            <h3 className="text-2xl font-bold mb-8 tracking-tight">Send me a message</h3>

                            {errorMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${
                                        isDarkMode 
                                            ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                                            : 'bg-red-50 border border-red-100 text-red-600'
                                    }`}
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{errorMessage}</span>
                                </motion.div>
                            )}

                            <div className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <TextInput 
                                        isDarkMode={isDarkMode}
                                        value={formData.name}
                                        handleInpuChange={(text) => handleInputChange('name', text)}
                                        label="Your Name"
                                    />
                                    <TextInput
                                        isDarkMode={isDarkMode}
                                        label="Email Address"
                                        value={formData.email}
                                        handleInpuChange={(text) => handleInputChange('email', text)}
                                    />
                                </div>

                                <TextInput
                                    isDarkMode={isDarkMode}
                                    label="Your Message"
                                    value={formData.message}
                                    textarea
                                    handleInpuChange={(text) => handleInputChange('message', text)}
                                />

                                <motion.button
                                    disabled={isSubmitting}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="w-full bg-[#ccff00] hover:bg-[#b8e600] disabled:bg-[#ccff00]/50 text-black py-4 rounded-xl text-sm uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-[#ccff00]/10"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                                            />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} strokeWidth={3} />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Info & Social Links */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                        className="space-y-12"
                    >
                        {/* Contact Information */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-bold mb-8 tracking-tight px-2">Contact Information</h3>
                            <div className="space-y-4">
                                {CONTACT_INFO.map((info) => (
                                    <motion.div
                                        key={info.label}
                                        variants={itemVariants}
                                        whileHover={{ x: 8 }}
                                        className={`flex items-center space-x-6 p-6 rounded-2xl border transition-all duration-300 ${
                                            isDarkMode
                                                ? 'bg-[#111418] border-white/5 hover:border-[#ccff00]/20 hover:bg-[#ccff00]/5'
                                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                        }`}
                                    >    
                                        <div className={`p-4 rounded-xl ${isDarkMode ? "bg-white/5" : "bg-white shadow-sm"}`}>
                                            <info.icon size={22} className="text-[#ccff00]" />
                                        </div>
                                        <div>
                                            <div className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-1 ${
                                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                                {info.label}
                                            </div>           
                                            <div className="font-bold text-lg tracking-tight">{info.value}</div>                            
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-xl font-bold mb-8 tracking-tight px-2">Follow Me</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {SOCIAL_LINKS.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`flex items-center space-x-4 p-5 rounded-2xl border transition-all duration-300 ${
                                            isDarkMode
                                                ? "bg-[#111418] border-white/5 hover:border-[#ccff00]/20 hover:text-[#ccff00]"
                                                : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                                        }`}
                                    >
                                        <social.icon size={20} className="text-[#ccff00]" />
                                        <span className="font-bold text-sm tracking-wide">{social.name}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Disponibilité */}
                        <motion.div
                            variants={itemVariants}
                            className={`p-8 rounded-3xl border ${
                                isDarkMode
                                    ? 'bg-[#ccff00]/5 border-[#ccff00]/10'
                                    : 'bg-green-50 border-green-200'
                            }`}
                        >
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-3 h-3 bg-[#ccff00] rounded-full animate-pulse shadow-[0_0_10px_#ccff00]" />    
                                <span className={`font-bold uppercase tracking-widest text-xs ${isDarkMode ? 'text-[#ccff00]' : 'text-green-600'}`}>
                                    Disponible immédiatement
                                </span>
                            </div>
                            <p className={`text-sm font-light leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Je suis actuellement ouvert aux opportunités en <span className={isDarkMode ? 'text-white' : 'text-black font-medium'}>CDI</span> ou pour des missions en <span className={isDarkMode ? 'text-white' : 'text-black font-medium'}>Freelance</span>. Donnons vie à vos idées.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            
            <SuccessModel 
                showSuccess={showSuccess} 
                setShowSuccess={setShowSuccess} 
                isDarkMode={isDarkMode}
            />
        </section>
    );
};

export default ContactSection;