import {
    Code2,
    GraduationCap,
    Award,
    Rocket,
    Heart,
    Coffee,
    BookOpen,
    Zap,
    Database,
    Server,
    Cloud,
    Mail,
    MapPin,
    Phone,
    Briefcase,
} from "lucide-react";

import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import PROJECT_IMG_1 from "../assets/images/gestion_hotel.png";
import PROJECT_IMG_2 from "../assets/images/eyegard.png";
import PROJECT_IMG_3 from "../assets/images/gestion_stock.png";
import PROJECT_IMG_4 from "../assets/images/AI_presence.png";
import PROJECT_IMG_5 from "../assets/images/gestion_hopital.png";
import PROJECT_IMG_6 from "../assets/images/gestion_rendezVous.png";

export const SKILLS_CATEGORY = [
    {
        title: "Frontend & Mobile",
        icon: Code2,
        description: "Création d'interfaces modernes et applications mobiles performantes pour le marché marocain.",
        skills: [
            { name: "React / React Native" },
            { name: "TypeScript" },
            { name: "Tailwind CSS" },
            { name: "Expérience Utilisateur (UX)" }
        ]
    },
    {
        title: "Backend & Solutions Métiers",
        icon: Server,
        description: "Architecture robuste pour automatiser la gestion de votre entreprise (ERP, CRM, Tableaux de bord).",
        skills: [
            { name: "Spring Boot (Java)" },
            { name: "PHP / Laravel" },
            { name: "Python / IA" },
            { name: "Architecture Microservices" }
        ]
    },
    {
        title: "Bases de Données & Data",
        icon: Database,
        description: "Conception et optimisation de bases de données sécurisées pour une gestion fiable de vos actifs.",
        skills: [
            { name: "MySQL / PostgreSQL" },
            { name: "MongoDB" },
            { name: "Optimisation de requêtes" },
            { name: "Sécurité des données" }
        ]
    },
    {
        title: "DevOps & Assurance Qualité",
        icon: Cloud,
        description: "Déploiement continu et tests rigoureux pour garantir la disponibilité de vos services 24/7.",
        skills: [
            { name: "Docker / Kubernetes" },
            { name: "CI/CD (GitLab, Jenkins)" },
            { name: "Tests Automatisés (QA)" },
            { name: "Cloud (AWS / Azure)" }
        ]
    },
]

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
]

export const STATS = [
    { number: "100%", label: "Respect des Délais" },
    { number: "10+", label: "Projets Déployés" },
    { number: "24/7", label: "Support Technique" },
    { number: "0", label: "Compromis Qualité" },
]

export const PROJECTS = [
    {
        id: 1,
        title: "Platform Gestion d'hôtel",
        description: "Une application de gestion d'hôtel développée en C# avec une base de données MySQL. Elle permet la gestion des chambres, des clients, des réservations et des revenus en temps réel.",
        image: PROJECT_IMG_1,
        tags: ["C#", "MySQL", "WinForms/WPF"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-hotel",
        featured: false,
        category: "Desktop App"
    },
    {
        id: 2,
        title: "Dashboard EyeGuard",
        description: "Interface de surveillance intelligente construite avec Python. Elle affiche des flux vidéo, détecte les mouvements et génère des alertes de sécurité grâce à un tableau de bord moderne.",
        image: PROJECT_IMG_2,
        tags: ["Python", "OpenCV", "Tkinter/Django"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/EyeGuard",
        featured: false,
        category: "AI & Surveillance"
    },
    {
        id: 3,
        title: "Platform Gestion de Stock",
        description: "Un tableau de bord web en PHP pour la gestion de stock, permettant de suivre les produits, les commandes, les fournisseurs et l’état du stock en temps réel.",
        image: PROJECT_IMG_3,
        tags: ["PHP", "MySQL", "Bootstrap"],
        liveUrl: "#",
        githuburl: "https://github.com/simoelabd/Gestion-stocke",
        featured: true,
        category: "Web App"
    },
    {
        id: 4,
        title: "Face Attendance System AI",
        description: "Un système de pointage intelligent basé sur la reconnaissance faciale utilisant Django, Python et OpenCV. Il permet d’enregistrer automatiquement la présence via webcam et inclut une interface de gestion des pointages, employés ou étudiants.",
        image: PROJECT_IMG_4,
        tags: ["Python", "Django", "OpenCV", "AI"],
        liveUrl: "#",         
        githuburl: "https://github.com/simoelabd/Face-attandence-system-AI",       
        featured: false,    
        category: "AI & Surveillance"
    },
    {
        id: 5,
        title: "Système de Gestion d’Hôpital",
        description: "Une application de bureau construite avec Java et JavaFX permettant la gestion des patients, médecins, rendez-vous, dossiers médicaux et historiques de traitement dans un environnement intuitif et sécurisé.",
        image: PROJECT_IMG_5,
        tags: ["Java", "JavaFX", "MySQL"],
        liveUrl: "#",         
        githuburl: "https://github.com/simoelabd/gestion_hopital",  
        featured: false,
        category: "Desktop App" 
    },
    {
        id: 6,
        title: "Gestion des Rendez-vous Médicaux",
        description: "Une solution Fullstack de prise de rendez-vous médicaux, avec une interface web en React, une API sécurisée en Spring Boot, et une application mobile Android développée en Java/Kotlin. Elle permet aux patients de réserver, modifier ou annuler leurs rendez-vous, tandis que les médecins peuvent gérer leur planning et consulter l'historique des consultations.",
        image: PROJECT_IMG_6, 
        tags: ["React", "Spring Boot", "Java", "Kotlin", "MySQL"],
        liveUrl: "#",         
        githuburl: "#",       
        featured: true,
        category: "Full Stack"
    }
]

export const JOURNEY_STEPS = [
    {
        year: "2025",
        title: "Stagiaire en développement fullstack web",
        company: "Norsys – Groupe Afriquia, Marrakech",
        description: "Développement d’un site web dynamique pour la commercialisation de la plateforme Norsys Eval. Réalisation de l’interface client et du back-office en React, avec un backend robuste en Spring Boot. Intégration de fonctionnalités avancées telles que la gestion des utilisateurs, le suivi des abonnements, et le paiement en ligne sécurisé.",
        icon: Briefcase,
        color: "bg-orange-600",
    },
    {
        year: "2025",
        title: "Projet académique : Application web & mobile avec backend Spring Boot",
        company: "EMSI – Ecole Marocaine des Sciences de l’Ingénieur, Marrakech",
        description: "Développement d'une solution web et mobile unifiée utilisant React pour l'interface web, Java/Kotlin pour l'application mobile Android, et Spring Boot pour le backend commun. Le système assure une gestion centralisée des utilisateurs, des données et des services via une API REST sécurisée.",
        icon: Award,
        color: "bg-cyan-600",
    },
    {
        year: "2024",
        title: "Stagiaire en développement web",
        company: "Faculté des Lettres et Sciences Humaines - Marrakech",
        description: "Stage pratique en développement d'applications web full-stack avec Laravel pour le backend et React pour le frontend. Réalisation de modules fonctionnels, intégration API, et participation à l’amélioration de l’interface utilisateur.",
        icon: Briefcase,
        color: "bg-purple-500",
    },
    {
        year: "2023",
        title: "Cycle d’ingénierie Informatique et Réseaux",
        company: "EMSI – Ecole Marocaine des Sciences de l’Ingénieur, Marrakech",
        description: "Formation d’ingénieur axée sur le développement logiciel, l’administration des réseaux, l’architecture des systèmes, l’intelligence artificielle et la gestion de projets informatiques. Acquisition de compétences avancées pour concevoir, développer et sécuriser des solutions technologiques.",
        icon: GraduationCap,
        color: "bg-green-600",
    },
    {
        year: "2023",
        title: "Technicien spécialisé en infrastructure digitale option système et réseaux",
        company: "ISTA JBEL LEKHDER Marrakech",
        description: "Formation axée sur l'administration des systèmes, la gestion des réseaux informatiques, la virtualisation, la cybersécurité et le support technique. Acquisition de compétences pratiques pour déployer et maintenir des infrastructures digitales sécurisées.",
        icon: GraduationCap,
        color: "bg-blue-500",
    }
]

export const PASSIONS = [
    {
        icon: Heart,
        title: "User Experience",
        description: "Crafting intuitive interfaces that users love",
    },
    {
        icon: Coffee,
        title: "Problem Solving",
        description: "Turning complex challenges into elegant solutions",
    },
    {
        icon: BookOpen,
        title: "Continuous Learning",
        description: "Always exploring new technologies and best practices",
    },
]

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
        url: "mailto:ouledelabd.moahmed@gmail.com",
        color: "hover:text-green-400",
        bgColor: "hover:bg-green-500/10",
    },
    {
        name: "WhatsApp",
        icon: FaWhatsapp,
        link: "https://wa.me/212682484400",
        color: "hover:text-[#25D366]",
        bgColor: "hover:bg-[#25D366]/10",
    },
]

export const CONTACT_INFO = [
    {
        icon: MapPin,
        label: "Location",
        value: "Marrakech, Maroc",
    },
    {
        icon: Mail,
        label: "Email",
        value: "ouledelabd.mohamed@gmail.com",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+ (212) 682-484400",
    }
]

export const NAV_LINKS = [
    { id: "home", title: "Home" },
    { id: "skills", title: "Skills" },
    { id: "work", title: "Work" },
    { id: "about", title: "About" },
    { id: "contact", title: "Contact" },
]