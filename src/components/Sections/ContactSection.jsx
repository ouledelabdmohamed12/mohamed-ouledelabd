import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT_INFO } from '../../utils/data';
import { containeVariants, itemVariants } from '../../utils/helper';
import TextInput from '../Input/TextInput';
import SuccessModel from '../SuccessModel';
import Turnstile from '../Turnstile';
import { EVENTS, getUtmString, track } from '../../lib/analytics';
import { isBot } from '../../lib/isBot';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * `lead` marks the instance that owns its page's <h1>: standalone on /contact
 * its title IS the page title, while on the home page the hero already holds
 * the only <h1>. Classes are identical either way — only the tag changes.
 */
const ContactSection = ({ lead = false } = {}) => {
    const Title = motion[lead ? 'h1' : 'h2'];
    const FormTitle = motion[lead ? 'h2' : 'h3'];
    const { t, i18n } = useTranslation();

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
        kd_ref_field: "", // honeypot — see the field markup below for why this name
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const turnstileRef = useRef(null);

    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
    // Crawlers never scroll, so `isInView` would stay false and every block
    // below would be screenshotted at `opacity: 0`. Treating a bot as "already
    // in view" renders the resting state immediately — same markup, same copy,
    // only the entrance animation is skipped.
    const visible = isBot || isInView;

    const handleInputChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
        if (errorMessage) setErrorMessage("");
    };

    const handleSubmit = async (e) => {
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

        // The honeypot is deliberately NOT short-circuited here. Deciding it
        // client-side returned before any network call, so a false positive — a
        // real visitor whose browser autofilled the field — was dropped with no
        // record anywhere. Every submission now reaches /api/contact, which
        // makes the same call and logs it.
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
            // Which language the visitor filled the form in, so the reply goes
            // back in the same one.
            language: i18n.resolvedLanguage || "fr",
            // Campaign the visit came from, empty for direct traffic. This is
            // what ties an enquiry to the ad that paid for it.
            utm: getUtmString(),
            kd_ref_field: formData.kd_ref_field,
            title: "Koda Atlas Inquiry"
        };

        // Empty optional fields are turned into readable text server-side, in
        // api/contact.js, so the same guard also covers anything else that
        // posts to that endpoint.

        // Whether the message was actually delivered. Decided before any UI is
        // touched, so nothing below can turn a failure into a success.
        let delivered = false;

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(templateParams),
            });

            // A 2xx alone is not proof of delivery: any intermediary (CDN,
            // proxy, a catch-all rewrite) can answer 200 without the request
            // ever reaching /api/contact. Only the endpoint's own
            // { success: true } contract counts as sent.
            let payload = null;
            try {
                payload = await res.json();
            } catch {
                payload = null; // non-JSON body — treat as a failed send
            }

            delivered = res.ok && payload?.success === true;
        } catch {
            delivered = false; // network error, request blocked, offline
        }

        setIsSubmitting(false);

        if (!delivered) {
            setErrorMessage(t("contact.form.errorGeneric"));
            return;
        }

        // Past this point the message really was sent, so none of these may
        // throw their way into the failure branch.
        try {
            // Conversion event. No-op until a tracker is configured and the
            // visitor has accepted it.
            track(EVENTS.lead, {
                content_name: "contact_form",
                content_category: formData.projectType || "unspecified",
                budget: formData.budget || "unspecified",
            });
        } catch {
            // Tracking must never affect what the visitor is told.
        }

        setShowSuccess(true);
        setFormData({ name: "", email: "", phone: "", website: "", projectType: "", budget: "", message: "", kd_ref_field: "" });
        setCaptchaToken(null);

        try {
            // The widget can be in an error state (e.g. an unauthorized
            // hostname), in which case reset() throws.
            turnstileRef.current?.reset();
        } catch {
            // Nothing to do: the message is already sent.
        }

        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <section id="contact" ref={sectionRef} className="bg-white py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={isBot ? false : 'hidden'}
                    animate={visible ? 'visible' : 'hidden'}
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

                    <Title
                        variants={itemVariants}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4"
                    >
                        {t("contact.title")}{" "}
                        <span className="text-indigo-600">{t("contact.titleAccent")}</span>
                    </Title>

                    <motion.p variants={itemVariants} className="text-lg text-gray-500 leading-relaxed">
                        {t("contact.subtitleBefore")}
                        <span className="font-medium text-gray-700">{t("contact.location")}</span>
                        {t("contact.subtitleAfter")}
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* LEFT — details card */}
                    <motion.div
                        initial={isBot ? false : 'hidden'}
                        animate={visible ? 'visible' : 'hidden'}
                        variants={containeVariants}
                        className="lg:col-span-2 rounded-2xl border border-gray-100 bg-slate-50 p-8 shadow-sm"
                    >
                        <motion.div variants={itemVariants} className="space-y-1">
                            {CONTACT_INFO.map((info) => (
                                <div key={info.id} className="flex items-center gap-4 py-3">
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white text-indigo-600 shadow-sm shrink-0">
                                        <info.icon size={17} />
                                    </span>
                                    {info.href ? (
                                        /* `before:-inset-2` grows the touch target from the
                                           text's own ~23px to ~39px without changing layout —
                                           the same trick the navbar icons use. */
                                        <a
                                            href={info.href}
                                            onClick={() =>
                                                track(EVENTS.contact, {
                                                    content_name: `${info.id}_contact_card`,
                                                    content_category: info.id,
                                                    button_location: "contact_card",
                                                })
                                            }
                                            className="relative text-[15px] text-gray-700 hover:text-indigo-600 transition-colors break-all before:absolute before:-inset-2 before:content-['']"
                                        >
                                            {info.value}
                                        </a>
                                    ) : (
                                        <span className="text-[15px] text-gray-700">{info.value}</span>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* RIGHT — form card */}
                    <motion.div
                        initial={isBot ? false : 'hidden'}
                        animate={visible ? 'visible' : 'hidden'}
                        variants={containeVariants}
                        className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
                    >
                        {/* One level under the section title, so the outline
                            never skips on either route. */}
                        <FormTitle
                            variants={itemVariants}
                            className="text-xl font-semibold tracking-tight text-gray-900 mb-8"
                        >
                            {t("contact.form.title")}
                        </FormTitle>

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

                            {/* Honeypot — hidden from real visitors, bots tend to fill every field.
                                The name, id and label text are deliberately arbitrary. Chrome, Brave
                                and password managers autofill by matching those against known field
                                types, so the previous name="company" with a "Company" label was
                                exactly what they target: a real visitor got silently flagged as a bot
                                and lost their message. Nothing here may resemble a real field name. */}
                            <div className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden" aria-hidden="true">
                                <label htmlFor="kd_ref_field">Leave this field empty</label>
                                <input
                                    type="text"
                                    id="kd_ref_field"
                                    name="kd_ref_field"
                                    tabIndex={-1}
                                    /* An unrecognised token rather than "off", which Chrome ignores
                                       on fields its heuristics think it recognises. */
                                    autoComplete="kd-nope"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck={false}
                                    value={formData.kd_ref_field}
                                    onChange={(e) => handleInputChange('kd_ref_field', e.target.value)}
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
