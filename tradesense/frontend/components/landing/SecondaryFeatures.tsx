"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    Newspaper,
    LineChart,
    Bell,
    Users,
    MessageSquare,
    Share2,
    GraduationCap,
    BookOpen,
    ShieldCheck,
    Video,
    Trophy,
    Lightbulb
} from 'lucide-react';

export function SecondaryFeatures() {
    const sections = [
        {
            title: "Hub d'Actualités en Direct",
            description: "Restez informé avec :",
            items: [
                { icon: <Newspaper className="w-4 h-4" />, text: "Actualités financières en temps réel" },
                { icon: <LineChart className="w-4 h-4" />, text: "Résumés de marché créés par l'IA" },
                { icon: <Bell className="w-4 h-4" />, text: "Alertes d'événements économiques" }
            ],
            footer: "Gardez toujours une longueur d'avance.",
            icon: <Newspaper className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Zone Communautaire",
            description: "Un espace social dédié aux traders où vous pouvez :",
            items: [
                { icon: <Users className="w-4 h-4" />, text: "Discuter avec des amis & Rencontrer de nouveaux traders" },
                { icon: <Share2 className="w-4 h-4" />, text: "Partager des stratégies & Rejoindre des groupes thématiques" },
                { icon: <MessageSquare className="w-4 h-4" />, text: "Apprendre des experts" }
            ],
            footer: "Cela construit un réseau solide autour de votre croissance.",
            icon: <Users className="w-8 h-8 text-blue-500" />
        },
        {
            title: "Centre d'Apprentissage MasterClass",
            description: "TradeSense AI inclut une académie complète avec des cours de haute qualité :",
            items: [
                { icon: <BookOpen className="w-4 h-4" />, text: "Leçons de trading du débutant à l'avancé" },
                { icon: <ShieldCheck className="w-4 h-4" />, text: "Analyse technique & fondamentale" },
                { icon: <TrendingUp className="w-4 h-4" />, text: "Ateliers de gestion des risques" },
                { icon: <Video className="w-4 h-4" />, text: "Webinaires en direct avec des experts & Parcours d'apprentissage assistés par IA" },
                { icon: <Trophy className="w-4 h-4" />, text: "Défis pratiques et quiz" }
            ],
            footer: "Que vous partiez de zéro ou que vous maîtrisiez des stratégies avancées, le centre MasterClass vous aide à grandir avec confiance.",
            icon: <GraduationCap className="w-8 h-8 text-blue-500" />
        }
    ];

    return (
        <section className="py-24 container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="group relative backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-[2.5rem] p-10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden"
                    >
                        {/* Glowing Background Effect */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-all duration-700" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-6 p-4 bg-blue-500/10 rounded-2xl w-fit border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                {section.icon}
                            </div>

                            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
                                {section.title}
                            </h3>

                            <p className="text-gray-400 font-medium mb-6 text-sm">
                                {section.description}
                            </p>

                            <ul className="space-y-4 mb-8 flex-1">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 group/item">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 group-hover/item:bg-blue-500/20 group-hover/item:text-blue-200 transition-all">
                                            {item.icon}
                                        </div>
                                        <span className="text-gray-300 text-sm font-semibold transition-colors group-hover/item:text-white">
                                            {item.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-6 border-t border-white/5">
                                <p className="text-xs font-bold text-blue-400/80 uppercase tracking-[0.15em] leading-relaxed">
                                    {section.footer}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
