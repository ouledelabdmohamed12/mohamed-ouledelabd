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
import { FaWhatsapp } from "react-icons/fa";

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
        // Gmail's web compose window rather than a mailto: — a mailto only works
        // when the visitor has a desktop mail client registered for it.
        // The footer applies target="_blank" automatically to http(s) URLs.
        icon: Mail,
        url: "https://mail.google.com/mail/u/0/?fs=1&to=ouledelabd.mohamed@gmail.com&tf=cm",
        color: "hover:text-green-400",
        bgColor: "hover:bg-green-500/10",
    },
    {
        name: "WhatsApp",
        icon: FaWhatsapp,
        url: "https://wa.me/212682484400",
        color: "hover:text-[#25D366]",
        bgColor: "hover:bg-[#25D366]/10",
    },
];

export const CONTACT_INFO = [
    {
        id: "location",
        icon: MapPin,
        value: "Marrakech, Maroc",
    },
    {
        id: "email",
        icon: Mail,
        value: "ouledelabd.mohamed@gmail.com",
    },
    {
        id: "phone",
        icon: Phone,
        value: "+212 682-484400",
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
    { id: "cost" },
    { id: "start" },
    { id: "time" },
    { id: "revisions" },
    { id: "chatbot" },
    { id: "support" },
];

export const NAV_LINKS = [
    { id: "home" },
    { id: "services" },
    { id: "work" },
    { id: "about" },
    { id: "contact" },
];
