import {
    Code2,
    Heart,
    Coffee,
    BookOpen,
    Database,
    Server,
    Cloud,
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

import PROJECT_IMG_1 from "../assets/images/gestion_hotel.webp";
import PROJECT_IMG_2 from "../assets/images/eyegard.webp";
import PROJECT_IMG_3 from "../assets/images/gestion_stock.webp";
import PROJECT_IMG_4 from "../assets/images/AI_presence.webp";
import PROJECT_IMG_5 from "../assets/images/gestion_hopital.webp";
import PROJECT_IMG_6 from "../assets/images/gestion_rendezVous.webp";
import PROJECT_IMG_7 from "../assets/images/artisana.png";
import PROJECT_IMG_8 from "../assets/images/riad.png";

// NOTE: textual labels live in src/i18n/locales/*.json.
// Data below keeps only structure (icons, images, links, ids) and references
// translation keys via `id` / `key`.

export const SKILLS_CATEGORY = [
    {
        id: "frontend",
        icon: Code2,
        skills: [
            { name: "React / React Native" },
            { name: "TypeScript" },
            { name: "Tailwind CSS" },
            { name: "UX / UI" },
        ],
    },
    {
        id: "backend",
        icon: Server,
        skills: [
            { name: "Spring Boot (Java)" },
            { name: "PHP / Laravel" },
            { name: "Python / IA" },
            { name: "Microservices" },
        ],
    },
    {
        id: "database",
        icon: Database,
        skills: [
            { name: "MySQL / PostgreSQL" },
            { name: "MongoDB" },
            { name: "Query Optimization" },
            { name: "Data Security" },
        ],
    },
    {
        id: "devops",
        icon: Cloud,
        skills: [
            { name: "Docker / Kubernetes" },
            { name: "CI/CD (GitLab, Jenkins)" },
            { name: "Automated Testing (QA)" },
            { name: "Cloud (AWS / Azure)" },
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
        id: 1,
        key: "p1",
        image: PROJECT_IMG_1,
        tags: ["C#", "MySQL", "WinForms"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-hotel",
        featured: false,
        category: "Desktop App",
    },
    {
        id: 2,
        key: "p2",
        image: PROJECT_IMG_2,
        tags: ["Python", "OpenCV", "Django"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/EyeGuard",
        featured: false,
        category: "AI & Surveillance",
    },
    {
        id: 3,
        key: "p3",
        image: PROJECT_IMG_3,
        tags: ["PHP", "MySQL", "Bootstrap"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-stocke",
        featured: true,
        category: "Web App",
    },
    {
        id: 4,
        key: "p4",
        image: PROJECT_IMG_4,
        tags: ["Python", "Django", "OpenCV", "AI"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Face-attandence-system-AI",
        featured: false,
        category: "AI & Surveillance",
    },
    {
        id: 5,
        key: "p5",
        image: PROJECT_IMG_5,
        tags: ["Java", "JavaFX", "MySQL"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/gestion_hopital",
        featured: false,
        category: "Desktop App",
    },
    {
        id: 6,
        key: "p6",
        image: PROJECT_IMG_6,
        tags: ["React", "Spring Boot", "Java", "Kotlin", "MySQL"],
        liveUrl: "#",
        githuburl: "#",
        featured: true,
        category: "Full Stack",
    },
    {
        id: 7,
        key: "p7",
        image: PROJECT_IMG_7,
        tags: ["Next.js", "Vercel", "PayPal"],
        // Root URL handles its own /fr /en language routing.
        liveUrl: "https://artisanateljamai.com",
        githuburl: "#",
        featured: true,
        category: "E-commerce",
    },
    {
        id: 8,
        key: "p8",
        image: PROJECT_IMG_8,
        tags: ["React", "Tailwind CSS", "Vercel"],
        liveUrl: "https://riad-nour-website.vercel.app/",
        githuburl: "#",
        featured: true,
        category: "Hospitality / Showcase",
    },
];

export const PASSIONS = [
    { id: "ux", icon: Heart },
    { id: "problem", icon: Coffee },
    { id: "learning", icon: BookOpen },
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
        icon: Mail,
        url: "mailto:ouledelabd.mohamed@gmail.com",
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
