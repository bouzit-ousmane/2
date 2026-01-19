"use client"

import React from 'react';
import { Brain, Zap, Shield, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export function Features() {
    const features = [
        {
            title: "Assistance IA en Temps Réel",
            desc: "Signaux Achat/Vente générés par IA basés sur l'analyse technique profonde.",
            icon: <Brain className="w-6 h-6 text-white" />,
            color: "from-violet-600 to-indigo-600"
        },
        {
            title: "Exécution Ultra-Rapide",
            desc: "Passez vos ordres instantanément sur les marchés mondiaux et la Bourse de Casablanca.",
            icon: <Zap className="w-6 h-6 text-white" />,
            color: "from-indigo-500 to-purple-500"
        },
        {
            title: "Sécurité & Transparence",
            desc: "Vérification automatisée des règles de challenge pour une équité totale.",
            icon: <Shield className="w-6 h-6 text-white" />,
            color: "from-purple-500 to-violet-500"
        },
        {
            title: "Analytiques Avancées",
            desc: "Tableaux de bord détaillés pour suivre votre performance quotidienne.",
            icon: <BarChart3 className="w-6 h-6 text-white" />,
            color: "from-violet-400 to-indigo-400"
        },
        {
            title: "Multi-Marchés",
            desc: "Tradez Actions, Crypto et Indices depuis une seule plateforme.",
            icon: <Globe className="w-6 h-6 text-white" />,
            color: "from-purple-600 to-violet-600"
        },
        {
            title: "Scalabilité",
            desc: "Augmentez votre capital jusqu'à 100K $ en prouvant votre rentabilité.",
            icon: <TrendingUp className="w-6 h-6 text-white" />,
            color: "from-indigo-500 to-violet-500"
        }
    ];

    return (
        <section className="py-24 container mx-auto px-4 relative">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Propulsé par la <span className="text-violet-500">Technologie</span></h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Des outils professionnels pour des traders sérieux.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-violet-500/30 hover:bg-white/10 transition-all duration-300 group"
                    >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-sm">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
