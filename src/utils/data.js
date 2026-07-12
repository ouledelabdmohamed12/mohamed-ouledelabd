import {
    Code2,
    GraduationCap,
    Award,
    Heart,
    Coffee,
    BookOpen,
    Database,
    Server,
    Cloud,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    LayoutDashboard,
    ShoppingBag,
    Rocket,
    TrendingUp,
    Crown,
} from "lucide-react";

import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import PROJECT_IMG_1 from "../assets/images/gestion_hotel.png";
import PROJECT_IMG_2 from "../assets/images/eyegard.png";
import PROJECT_IMG_3 from "../assets/images/gestion_stock.png";
import PROJECT_IMG_4 from "../assets/images/AI_presence.png";
import PROJECT_IMG_5 from "../assets/images/gestion_hopital.png";
import PROJECT_IMG_6 from "../assets/images/gestion_rendezVous.png";

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

export const TECH_STACK = [
    "JavaScript",
    "HTML5",
    "CSS3",
    "Java",
    "Vite",
    "Swift",
    "Flutter",
    "Kotlin",
    "Figma",
    "Notion",
    "Laravel",
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
];

export const JOURNEY_STEPS = [
    {
        key: "j1",
        year: "2026",
        company: "Norsys Afrique, Marrakech",
        icon: Briefcase,
        color: "bg-orange-600",
    },
    {
        key: "j2",
        year: "2025",
        company: "Norsys Afrique, Marrakech",
        icon: Award,
        color: "bg-cyan-600",
    },
    {
        key: "j3",
        year: "2024",
        company: "Faculté des Lettres et Sciences Humaines — Marrakech",
        icon: Briefcase,
        color: "bg-purple-500",
    },
    {
        key: "j4",
        year: "2023 – 2026",
        company: "EMSI – École Marocaine des Sciences de l'Ingénieur, Marrakech",
        icon: GraduationCap,
        color: "bg-green-600",
    },
    {
        key: "j5",
        year: "2021 – 2023",
        company: "OFPPT (ISTA), Marrakech",
        icon: GraduationCap,
        color: "bg-blue-500",
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

// Value-proposition highlights shown in the Services section pitch.
// Text lives in i18n under `services.pitch.points.<id>`.
export const SERVICE_PITCH_POINTS = [
    { id: "shopify", icon: ShoppingBag },
    { id: "fullstack", icon: Code2 },
    { id: "dashboard", icon: LayoutDashboard },
];

// Pricing tiers (static comparison, no calculator). Text lives in i18n under
// `pricing.tiers.<id>`.
export const PRICING_TIERS = [
    { id: "essentiel", icon: Rocket },
    { id: "pro", icon: TrendingUp, popular: true },
    { id: "elite", icon: Crown },
];

// Project process steps. Text lives in i18n under `pricing.process.steps.<id>`.
export const PROCESS_STEPS = [
    { id: "discovery" },
    { id: "content" },
    { id: "design" },
    { id: "development" },
    { id: "launch" },
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
    { id: "pricing" },
    { id: "about" },
    { id: "contact" },
];
