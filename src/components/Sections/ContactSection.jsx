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
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animation Refs
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    
    // Handle Input Change
    const handleInputChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
        });
        // Clear error when user starts typing again
        if (errorMessage) setErrorMessage("");
    };

    // Handle Form Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        // 1. Validation: Check if fields are empty
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);

        // 2. Prepare Data for EmailJS
        const templateParams = {
            name: formData.name,       
            email: formData.email,     
            message: formData.message,
            title: "Portfolio Inquiry"
        };

        // 3. Send Email
        emailjs
            .send(
                "service_gq5hc6f",  
                "template_bbujlih",  
                templateParams,
                "SAbE7J_X_PEmfaP8h"  
            )
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
                    setIsSubmitting(false);
                    setShowSuccess(true);
                    
                    // Reset Form
                    setFormData({ name: "", email: "", message: "" });

                    // Auto hide success message
                    setTimeout(() => setShowSuccess(false), 3000);
                },
                (error) => {
                    console.log("FAILED...", error);
                    setIsSubmitting(false);
                    setErrorMessage("Something went wrong. Please try again later.");
                }
            );
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className={`py-24 px-6 ${
                isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } relative overflow-hidden`}
        >
            {/* Background Elements */}
            <motion.div style={{ y }} className="absolute inset-0 overflow-hidden">
                <div
                    className={`absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-5 ${
                        isDarkMode ? 'bg-blue-500' : 'bg-blue-400' 
                    }`}
                />
                <div
                    className={`absolute bottom-40 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-5 ${
                        isDarkMode ? 'bg-purple-500' : 'bg-purple-400'
                    }`}
                />
            </motion.div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={containeVariants}
                    className="text-center mb-20"
                >
                    <motion.div
                        variants={itemVariants}
                        className={`text-sm uppercase tracking-widest ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-600'
                        } mb-4`}
                    >
                        Let's Connect
                    </motion.div>
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-5xl font-light mb-6"
                    >
                        Get In
                        <span className="text-blue-500 font-medium"> Touch</span>
                    </motion.h2>

                    <motion.p
                        variants={itemVariants}
                        className={`text-xl max-w-2xl mx-auto ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                    >
                        Ready to start your next project? Let's discuss how we can bring your ideas to life.
                    </motion.p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Form Area */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className={`p-8 rounded-2xl border ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
                                    : 'bg-gray-50/80 border-gray-200 backdrop-blur-sm'
                            }`}
                        >
                            <h3 className="text-2xl font-medium mb-4">Send me a message</h3>

                            {/* 🔴 Error Message Display */}
                            {errorMessage && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                        isDarkMode 
                                            ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                                            : 'bg-red-50 border border-red-100 text-red-600'
                                    }`}
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{errorMessage}</span>
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <TextInput 
                                        isDarkMode={isDarkMode}
                                        value={formData.name}
                                        handleInpuChange={(text) => 
                                            handleInputChange('name', text)
                                        }
                                        label="Your Name"
                                    />
                                    <TextInput
                                        isDarkMode={isDarkMode}
                                        label="Email Address"
                                        value={formData.email}
                                        handleInpuChange={(text) =>
                                            handleInputChange('email', text)
                                        }
                                    />
                                </div>

                                <TextInput
                                    isDarkMode={isDarkMode}
                                    label="Your Message"
                                    value={formData.message}
                                    textarea
                                    handleInpuChange={(text) =>
                                        handleInputChange('message', text)
                                    }
                                />

                                <motion.button
                                    disabled={isSubmitting}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-4 rounded-xl text-sm uppercase tracking-wider font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
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
                        className="space-y-8"
                    >
                        {/* Contact Information */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-2xl font-medium mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                {CONTACT_INFO.map((info, index) => (
                                    <motion.div
                                        key={info.label}
                                        variants={itemVariants}
                                        whileHover={{ x:4 }}
                                        className={`flex items-center space-x-4 p-4 rounded-xl ${
                                            isDarkMode
                                                ? 'bg-gray-800/30 hover:bg-gray-800/50'
                                                : 'bg-gray-50/50 hover:bg-gray-100/50'
                                        } transition-all duration-300`}
                                    >    
                                        <div
                                            className={`p-3 rounded-lg ${
                                                isDarkMode ? "bg-gray-700"  : "bg-white"  
                                            }`}
                                        >
                                            <info.icon size={20} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <div 
                                                className={`text-sm ${
                                                    isDarkMode ? 'text-gray-500' : 'text-gray-600'
                                                }`}
                                            >
                                                {info.label}
                                            </div>           
                                            <div className="font-medium">{info.value}</div>                            
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div variants={itemVariants}>
                            <h3 className="text-xl font-medium mb-6">Follow Me</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {SOCIAL_LINKS.map((Social) => (
                                    <motion.a
                                        key={Social.label}
                                        href={Social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05, y: -2}}
                                        whileTap={{ scale: 0.95}}
                                        className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 ${
                                            isDarkMode
                                                ? "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                                                : "bg-white/80 border-gray-200 hover:border-gray-300"
                                        } ${Social.bgColor} ${Social.color}`}
                                    >
                                        <Social.icon size={20} />
                                        <span className="font-medium">{Social.name}</span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Availability Status */}
                        <motion.div
                            variants={itemVariants}
                            className={`p-6 rounded-xl border ${
                                isDarkMode
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : 'bg-green-50 border-green-200'
                            }`}
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />    
                                <span className="font-medium text-green-500" >
                                    Available for work
                                </span>
                            </div>
                            <p
                                className={`text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                            >
                                I'm currently Available for freelance projects and full-time opportunities.
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