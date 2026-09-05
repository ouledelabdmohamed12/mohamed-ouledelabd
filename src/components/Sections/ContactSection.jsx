import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../utils/data';
import { containeVariants, itemVariants } from '../../utils/helper';
import TextInput from '../Input/TextInput';
import SuccessModel from '../SuccessModel';
import Turnstile from '../Turnstile';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactSection = () => {
    const { t } = useTranslation();

    const projectTypeOptions = [
        { value: "showcase", label: t("contact.form.projectType.options.showcase") },
        { value: "ecommerce", label: t("contact.form.projectType.options.ecommerce") },
        { value: "webapp", label: t("contact.form.projectType.options.webapp") },
        { value: "saas", label: t("contact.form.projectType.options.saas") },
        { value: "mobile", label: t("contact.form.projectType.options.mobile") },
    ];

    const budgetOptions = [
        { value: "under20k", label: t("contact.form.budget.options.under20k") },
        { value: "20to50k", label: t("contact.form.budget.options.20to50k") },
        { value: "50kplus", label: t("contact.form.budget.options.50kplus") },
        { value: "unsure", label: t("contact.form.budget.options.unsure") },
    ];

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        website: "",
        projectType: "",
        budget: "",
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
            setFormData({ name: "", email: "", phone: "", website: "", projectType: "", budget: "", message: "", company: "" });
            setTimeout(() => setShowSuccess(false), 3000);
            return;
        }

        setIsSubmitting(true);

        const projectTypeLabel = projectTypeOptions.find((opt) => opt.value === formData.projectType)?.label || "";
        const budgetLabel = budgetOptions.find((opt) => opt.value === formData.budget)?.label || "";

        const templateParams = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            projectType: projectTypeLabel,
            budget: budgetLabel,
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
                setFormData({ name: "", email: "", phone: "", website: "", projectType: "", budget: "", message: "", company: "" });
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
        <section id="contact" ref={sectionRef} className="bg-white py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={containeVariants}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <motion.span
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        {t("contact.badge")}
                    </motion.span>

                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
                    >
                        {t("contact.title")}{" "}
                        <span className="text-indigo-600">{t("contact.titleAccent")}</span>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-lg text-gray-500 leading-relaxed">
                        {t("contact.subtitleBefore")}
                        <span className="font-medium text-gray-700">{t("contact.location")}</span>
                        {t("contact.subtitleAfter")}
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* LEFT — details card */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                        className="lg:col-span-2 rounded-2xl border border-gray-100 bg-slate-50 p-8 shadow-sm"
                    >
                        <motion.div variants={itemVariants} className="space-y-1 mb-8">
                            {CONTACT_INFO.map((info) => (
                                <div key={info.id} className="flex items-center gap-4 py-3">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white text-indigo-600 shadow-sm shrink-0">
                                        <info.icon size={17} />
                                    </span>
                                    <span className="text-[15px] text-gray-700">{info.value}</span>
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                            {SOCIAL_LINKS.filter((s) => s.name === "LinkedIn" || s.name === "GitHub").map((social) => (
                                <a
                                    key={social.name}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                                >
                                    <social.icon size={15} />
                                    {social.name}
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — form card */}
                    <motion.div
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={containeVariants}
                        className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                    >
                        <motion.h3
                            variants={itemVariants}
                            className="text-xl font-semibold tracking-tight text-gray-900 mb-8"
                        >
                            {t("contact.form.title")}
                        </motion.h3>

                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
                            >
                                <AlertCircle size={18} className="text-red-500 shrink-0" />
                                <span className="text-sm font-medium text-red-600">{errorMessage}</span>
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <TextInput
                                    value={formData.name}
                                    handleInpuChange={(text) => handleInputChange('name', text)}
                                    label={t("contact.form.name")}
                                />
                                <TextInput
                                    label={t("contact.form.email")}
                                    value={formData.email}
                                    handleInpuChange={(text) => handleInputChange('email', text)}
                                />
                                <TextInput
                                    label={t("contact.form.phone")}
                                    value={formData.phone}
                                    optional
                                    handleInpuChange={(text) => handleInputChange('phone', text)}
                                />
                                <TextInput
                                    label={t("contact.form.website")}
                                    value={formData.website}
                                    optional
                                    handleInpuChange={(text) => handleInputChange('website', text)}
                                />
                                <TextInput
                                    label={t("contact.form.projectType.label")}
                                    value={formData.projectType}
                                    select
                                    options={projectTypeOptions}
                                    placeholder={t("contact.form.projectType.placeholder")}
                                    optional
                                    handleInpuChange={(text) => handleInputChange('projectType', text)}
                                />
                                <TextInput
                                    label={t("contact.form.budget.label")}
                                    value={formData.budget}
                                    select
                                    options={budgetOptions}
                                    placeholder={t("contact.form.budget.placeholder")}
                                    optional
                                    handleInpuChange={(text) => handleInputChange('budget', text)}
                                />
                            </div>

                            <TextInput
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
                                onVerify={(token) => {
                                    setCaptchaToken(token);
                                    if (errorMessage) setErrorMessage("");
                                }}
                                onExpire={() => setCaptchaToken(null)}
                            />

                            <button
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-4 text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        {t("contact.form.sending")}
                                    </>
                                ) : (
                                    <>
                                        <Send size={15} />
                                        {t("contact.form.send")}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <SuccessModel showSuccess={showSuccess} setShowSuccess={setShowSuccess} />
        </section>
    );
};

export default ContactSection;
