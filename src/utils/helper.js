export const containeVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

export const itemVariants = {
    hidden: {y: 30, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

// Smoothly scroll to a section. Uses the Lenis instance when available
// (set by useSmoothScroll), otherwise falls back to native scrollIntoView.
export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(element, { offset: -80 });
    } else {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

// Route path for a nav section id (used by the router-based navigation).
export const pathForSection = (id) => (id === "home" ? "/" : `/${id}`);