import {
    Code2,
    Database,
    Server,
    Cloud,
    Lock,
    Cog,
    Mail,
    MapPin,
    Phone,
    ShoppingBag,
    Rocket,
    Globe,
    Smartphone,
} from "lucide-react";

import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";

// NOTE: burncar.jpeg is square (2048x2048) while the card renders a ~1.76:1 box
// with object-cover, so roughly the top and bottom thirds are cropped off.
import BURNCARE_IMG from "../assets/images/burncar.jpeg";

import PHARMACIE_IMG from "../assets/images/pharmacie.png";
import ARTISANAT_IMG from "../assets/images/artisana.png";
import PROJECT_IMG_HOTEL from "../assets/images/gestion_hotel.webp";
import PROJECT_IMG_EYEGUARD from "../assets/images/eyegard.webp";
import PROJECT_IMG_STOCK from "../assets/images/gestion_stock.webp";
import PROJECT_IMG_ATTENDANCE from "../assets/images/AI_presence.webp";
import PROJECT_IMG_HOSPITAL from "../assets/images/gestion_hopital.webp";
import PROJECT_IMG_APPOINTMENT from "../assets/images/gestion_rendezVous.webp";
import PROJECT_IMG_RIAD from "../assets/images/riad.png";

// ---------------------------------------------------------------------------
// Contact phone — single source of truth.
//
// Every phone format and link in the app is derived from CONTACT_PHONE_E164,
// so changing the number means changing this one line.
//
// The only copy that is NOT derived from here is the JSON-LD "telephone" field
// in index.html: that is static markup served before any JavaScript runs, so it
// cannot import this module and must be edited alongside it.
// ---------------------------------------------------------------------------

// E.164, used for tel: links.
export const CONTACT_PHONE_E164 = "+212770324267";

// Digits only, the form wa.me expects.
export const CONTACT_PHONE_DIGITS = CONTACT_PHONE_E164.replace(/\D/g, "");

// Human-readable, e.g. "+212 770-324267". Assumes the Moroccan +212 + 9 digits
// layout, which is what this business line uses.
export const CONTACT_PHONE_DISPLAY = `+${CONTACT_PHONE_DIGITS.slice(0, 3)} ${CONTACT_PHONE_DIGITS.slice(3, 6)}-${CONTACT_PHONE_DIGITS.slice(6)}`;

// Base WhatsApp deep link. Callers may append their own ?text= payload.
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_DIGITS}`;

// Dialler link. On a phone this opens the dialler; on a desktop without a
// handler it does nothing, which is the accepted trade-off for tel:.
export const CONTACT_TEL_URL = `tel:${CONTACT_PHONE_E164}`;

// ---------------------------------------------------------------------------
// Contact email — single source of truth.
//
// Changing the address is a one-line change here: the mailto: link, the footer
// social link, the contact card and the Terms/Privacy copy all derive from it.
// The legal text picks it up through the {{email}} placeholder, wired as an
// i18next default variable in src/i18n/index.js.
//
// As with the phone, the JSON-LD "email" field in index.html is static markup
// that cannot import this module and must be edited alongside this line.
// ---------------------------------------------------------------------------

export const CONTACT_EMAIL = "contact@kodaatlas.com";

// The mailbox is on Namecheap Private Email, not Google Workspace, so a Gmail
// compose URL would be the wrong destination. A mailto: is the expected
// behaviour for a domain address, and WhatsApp is the primary channel anyway.
export const CONTACT_MAILTO_URL = `mailto:${CONTACT_EMAIL}`;

// ---------------------------------------------------------------------------
// Social profiles — single source of truth for the app.
//
// As with the phone and email, the JSON-LD "sameAs" list in index.html is
// static markup that cannot import this module and must be edited alongside.
// ---------------------------------------------------------------------------

export const INSTAGRAM_URL = "https://www.instagram.com/kodaatlas1/";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61594415549192";

// NOTE: textual labels live in src/i18n/locales/*.json.
// Data below keeps only structure (icons, images, links, ids) and references
// translation keys via `id` / `key`.

export const SKILLS_CATEGORY = [
    {
        id: "frontend",
        icon: Code2,
        skills: [
            { name: "React.js" },
            { name: "React Native" },
            { name: "Flutter" },
            { name: "TypeScript / Tailwind CSS" },
        ],
    },
    {
        id: "backend",
        icon: Server,
        skills: [
            { name: "Java / Spring Boot" },
            { name: "PHP / Laravel" },
            { name: "Python / FastAPI" },
            { name: "REST APIs & Microservices" },
        ],
    },
    {
        id: "database",
        icon: Database,
        skills: [
            { name: "PostgreSQL" },
            { name: "MySQL" },
            { name: "SQLite" },
            { name: "MongoDB" },
        ],
    },
    {
        id: "devops",
        icon: Cloud,
        skills: [
            { name: "Selenium" },
            { name: "Robot Framework" },
            { name: "JUnit / SonarQube" },
            { name: "Docker / CI-CD" },
        ],
    },
];

export const STATS = [
    { id: "delivery", number: "100%" },
    { id: "projects", number: "10+" },
    { id: "support", number: "24/7" },
    { id: "quality", number: "0" },
];

export const PROJECTS = [
    {
        id: 10,
        key: "p10",
        image: PHARMACIE_IMG,
        tags: ["React.js", "Spring Boot", "PostgreSQL", "Vercel"],
        liveUrl: "https://pharmacie-kappa.vercel.app/",
        githuburl: "#",
        featured: true,
        // Rendered uppercase by the card's CSS, so it is stored in normal case
        // like every other category.
        category: "Full-Stack Web App",
    },
    {
        id: 1,
        key: "p1",
        image: BURNCARE_IMG,
        tags: ["Flutter", "Spring Boot", "Python FastAPI", "Docker Compose", "Keycloak"],
        liveUrl: "#",
        githuburl: "#",
        featured: true,
        category: "Health & AI",
    },
    {
        id: 2,
        key: "p2",
        image: ARTISANAT_IMG,
        tags: ["Next.js", "Vercel", "Lemon Squeezy", "SEO"],
        // Root URL handles its own /fr /en language routing.
        liveUrl: "https://artisanateljamai.com",
        githuburl: "#",
        featured: true,
        category: "E-commerce",
    },

    // --- Earlier work, kept after the three headline projects ---
    {
        id: 3,
        key: "p3",
        image: PROJECT_IMG_HOTEL,
        tags: ["C#", "MySQL", "WinForms"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-hotel",
        featured: false,
        category: "Desktop App",
    },
    {
        id: 4,
        key: "p4",
        image: PROJECT_IMG_EYEGUARD,
        tags: ["Python", "OpenCV", "Django"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/EyeGuard",
        featured: false,
        category: "AI & Surveillance",
    },
    {
        id: 5,
        key: "p5",
        image: PROJECT_IMG_STOCK,
        tags: ["PHP", "MySQL", "Bootstrap"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-stocke",
        featured: false,
        category: "Web App",
    },
    {
        id: 6,
        key: "p6",
        image: PROJECT_IMG_ATTENDANCE,
        tags: ["Python", "Django", "OpenCV", "AI"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Face-attandence-system-AI",
        featured: false,
        category: "AI & Surveillance",
    },
    {
        id: 7,
        key: "p7",
        image: PROJECT_IMG_HOSPITAL,
        tags: ["Java", "JavaFX", "MySQL"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/gestion_hopital",
        featured: false,
        category: "Desktop App",
    },
    {
        id: 8,
        key: "p8",
        image: PROJECT_IMG_APPOINTMENT,
        tags: ["React", "Spring Boot", "Java", "Kotlin", "MySQL"],
        liveUrl: "#",
        githuburl: "#",
        featured: false,
        category: "Full Stack",
    },
    {
        id: 9,
        key: "p9",
        image: PROJECT_IMG_RIAD,
        tags: ["React", "Tailwind CSS", "Vercel"],
        liveUrl: "https://riad-nour-website.vercel.app/",
        githuburl: "#",
        featured: false,
        category: "Hospitality / Showcase",
    },
];

// About-page cards. Text lives in i18n under `about.passions.<id>`.
export const PASSIONS = [
    { id: "reliability", icon: Server },
    { id: "security", icon: Lock },
    { id: "automation", icon: Cog },
];

export const SOCIAL_LINKS = [
    {
        name: "LinkedIn",
        icon: FiLinkedin,
        url: "https://www.linkedin.com/in/mohamed-ouledelabd/",
        color: "hover:text-blue-400",
        bgColor: "hover:bg-blue-500/10",
    },
    {
        name: "GitHub",
        icon: FiGithub,
        url: "https://github.com/ouledelabdmohamed12",
        color: "hover:text-gray-400",
        bgColor: "hover:bg-gray-800",
    },
    {
        name: "Email",
        // mailto: is handed off to an external mail app, so the footer
        // deliberately does not add target="_blank" (it would leave a ghost tab).
        icon: Mail,
        url: CONTACT_MAILTO_URL,
        color: "hover:text-green-400",
        bgColor: "hover:bg-green-500/10",
    },
    {
        name: "WhatsApp",
        icon: FaWhatsapp,
        url: WHATSAPP_URL,
        color: "hover:text-[#25D366]",
        bgColor: "hover:bg-[#25D366]/10",
    },
    {
        name: "Instagram",
        // Translated accessible name, under `footer.socialAria.<ariaKey>`.
        ariaKey: "instagram",
        icon: FaInstagram,
        url: INSTAGRAM_URL,
        color: "hover:text-[#E4405F]",
        bgColor: "hover:bg-[#E4405F]/10",
    },
    {
        name: "Facebook",
        ariaKey: "facebook",
        icon: FaFacebookF,
        url: FACEBOOK_URL,
        color: "hover:text-[#1877F2]",
        bgColor: "hover:bg-[#1877F2]/10",
    },
];

// `href` marks an entry as actionable: the contact card renders those as
// links so they can be tapped on a phone. Location has none — there is nothing
// useful to hand off to.
export const CONTACT_INFO = [
    {
        id: "location",
        icon: MapPin,
        value: "Marrakech, Maroc",
    },
    {
        id: "email",
        icon: Mail,
        value: CONTACT_EMAIL,
        href: CONTACT_MAILTO_URL,
    },
    {
        id: "phone",
        icon: Phone,
        value: CONTACT_PHONE_DISPLAY,
        href: CONTACT_TEL_URL,
    },
];

// The 5 services Koda Atlas sells. Text lives in i18n under `services.items.<id>`.
export const SERVICES = [
    { id: "showcase", icon: Globe },
    { id: "ecommerce", icon: ShoppingBag },
    { id: "webapp", icon: Code2 },
    { id: "saas", icon: Rocket },
    { id: "mobile", icon: Smartphone },
];

// Legal pages. Text lives in i18n under `legal.terms.sections.<id>` / `legal.privacy.sections.<id>`.
export const TERMS_SECTIONS = [
    { id: "acceptance" },
    { id: "services" },
    { id: "quotes" },
    { id: "timeline" },
    { id: "intellectualProperty" },
    { id: "clientResponsibilities" },
    { id: "liability" },
    { id: "termination" },
    { id: "law" },
    { id: "contact" },
];

export const PRIVACY_SECTIONS = [
    { id: "intro" },
    { id: "dataCollected" },
    { id: "dataUse" },
    { id: "dataSharing" },
    { id: "cookies" },
    { id: "retention" },
    { id: "rights" },
    { id: "security" },
    { id: "contact" },
];

// FAQ. Text lives in i18n under `faq.items.<id>`.
export const FAQ_ITEMS = [
    { id: "pages" },
    { id: "languages" },
    { id: "domain" },
    { id: "hosting" },
    { id: "mobile" },
    { id: "booking" },
    { id: "seo" },
    { id: "ranking" },
    { id: "whatsapp" },
];

export const NAV_LINKS = [
    { id: "home" },
    { id: "services" },
    { id: "work" },
    { id: "about" },
    { id: "contact" },
];
