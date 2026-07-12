import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../utils/data';
import { containeVariants, itemVariants } from '../../utils/helper';
import TextInput from '../Input/TextInput';
import SuccessModel from '../SuccessModel';
import Turnstile from '../Turnstile';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactSection = () => {
    const { isDarkMode } = useTheme();
    const { t } = useTranslation();

    const projectTypeOptions = [
        { value: "ecommerce", label: t("contact.form.projectType.options.ecommerce") },
        { value: "webapp", label: t("contact.form.projectType.options.webapp") },
        { value: "dashboard", label: t("contact.form.projectType.options.dashboard") },
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        projectType: "",
        message: "",
        company: "", // honeypot — left empty by real users, hidden from view
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const turnstileRef = useRef(null);

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage(t("contact.form.error"));
            return;
        }

        if (!EMAIL_REGEX.test(formData.email)) {
            setErrorMessage(t("contact.form.emailError"));
            return;
        }

        if (!captchaToken) {
            setErrorMessage(t("contact.form.captchaError"));
            return;
        }

        // Honeypot: real visitors never see or fill this field. If it's
        // filled, silently pretend success instead of tipping off the bot.
        if (formData.company) {
            setShowSuccess(true);
            setFormData({ name: "", email: "", phone: "", website: "", projectType: "", message: "", company: "" });
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }

        setIsSubmitting(true);

        const templateParams = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            projectType: formData.projectType,
            message: formData.message,
            company: formData.company,
            title: "Koda Atlas Inquiry"
        };

        fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(templateParams),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Request failed");
                setIsSubmitting(false);
                setShowSuccess(true);
                setFormData({ name: "", email: "", phone: "", website: "", projectType: "", message: "", company: "" });
                setCaptchaToken(null);
                turnstileRef.current?.reset();
                setTimeout(() => setShowSuccess(false), 3000);
            })
            .catch(() => {
                setIsSubmitting(false);
                setErrorMessage(t("contact.form.errorGeneric"));
            });
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className={`py-28 px-6 transition-colors duration-500 ${
                isDarkMode ? "bg-[#0a0c10] text-white" : "bg-white text-gray-900"
            }`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left: intro + contact info */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className={`text-xs uppercase tracking-[0.4em] font-semibold mb-6 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}
                        >
                            {t("contact.badge")}
                        </motion.div>

                        <motion.h2
                            variants={itemVariants}
                            className="text-4xl md:text-6xl font-semibold mb-8 tracking-tight leading-[1.1]"
                        >
                            {t("contact.title")} <span className="text-[#2B8CA6]">{t("contact.titleAccent")}</span>
                        </motion.h2>

                        <motion.p
                            variants={itemVariants}
                            className={`text-lg leading-relaxed font-light mb-10 max-w-md ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        >
                            {t("contact.subtitleBefore")}
                            <span className={isDarkMode ? 'text-white' : 'text-black'}>{t("contact.location")}</span>
                            {t("contact.subtitleAfter")}
                        </motion.p>

                        <motion.div variants={itemVariants} className="space-y-4 mb-10">
                            {CONTACT_INFO.map((info) => (
                                <div key={info.id} className="flex items-center gap-4">
                                    <info.icon size={18} className="text-[#2B8CA6] flex-shrink-0" />
                                    <span className="font-medium">{info.value}</span>
                                </div>
                            ))}
                            {SOCIAL_LINKS.filter((s) => s.name === "LinkedIn" || s.name === "GitHub").map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-4 transition-colors ${
                                        isDarkMode ? "text-gray-300 hover:text-[#2B8CA6]" : "text-gray-700 hover:text-[#2B8CA6]"
                                    }`}
                                >
                                    <social.icon size={18} className="text-[#2B8CA6] flex-shrink-0" />
                                    <span className="font-medium">{social.name}</span>
                                </a>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#2B8CA6] rounded-full animate-pulse" />
                            <span className={`text-xs uppercase tracking-widest font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {t("contact.availability.badge")}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Right: form */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                    >
                        <motion.h3 variants={itemVariants} className="text-2xl font-semibold mb-8 tracking-tight">
                            {t("contact.form.title")}
                        </motion.h3>

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

                        <motion.div variants={itemVariants} className="space-y-8">
                            <TextInput
                                isDarkMode={isDarkMode}
                                value={formData.name}
                                handleInpuChange={(text) => handleInputChange('name', text)}
                                label={t("contact.form.name")}
                            />
                            <TextInput
                                isDarkMode={isDarkMode}
                                label={t("contact.form.email")}
                                value={formData.email}
                                handleInpuChange={(text) => handleInputChange('email', text)}
                            />
                            <TextInput
                                isDarkMode={isDarkMode}
                                label={t("contact.form.phone")}
                                value={formData.phone}
                                optional
                                handleInpuChange={(text) => handleInputChange('phone', text)}
                            />
                            <TextInput
                                isDarkMode={isDarkMode}
                                label={t("contact.form.website")}
                                value={formData.website}
                                optional
                                handleInpuChange={(text) => handleInputChange('website', text)}
                            />
                            <TextInput
                                isDarkMode={isDarkMode}
                                label={t("contact.form.projectType.label")}
                                value={formData.projectType}
                                select
                                options={projectTypeOptions}
                                placeholder={t("contact.form.projectType.placeholder")}
                                optional
                                handleInpuChange={(text) => handleInputChange('projectType', text)}
                            />
                            <TextInput
                                isDarkMode={isDarkMode}
                                label={t("contact.form.message")}
                                value={formData.message}
                                textarea
                                handleInpuChange={(text) => handleInputChange('message', text)}
                            />

                            {/* Honeypot — hidden from real visitors, bots tend to fill every field */}
                            <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                                <label htmlFor="company">Company</label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={formData.company}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                />
                            </div>

                            <Turnstile
                                ref={turnstileRef}
                                isDarkMode={isDarkMode}
                                onVerify={(token) => {
                                    setCaptchaToken(token);
                                    if (errorMessage) setErrorMessage("");
                                }}
                                onExpire={() => setCaptchaToken(null)}
                            />

                            <motion.button
                                disabled={isSubmitting}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmit}
                                className="w-full bg-[#2B8CA6] hover:bg-[#217485] disabled:bg-[#2B8CA6]/50 text-white py-4 rounded-full text-sm uppercase tracking-[0.2em] font-semibold transition-colors flex items-center justify-center space-x-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>{t("contact.form.sending")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} strokeWidth={2.5} />
                                        <span>{t("contact.form.send")}</span>
                                    </>
                                )}
                            </motion.button>
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
