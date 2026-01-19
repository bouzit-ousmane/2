"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

// Simple dictionary
const dictionary = {
    en: {
        nav_login: "Login",
        nav_start: "Get Started",
        hero_badge: "✨ The First AI-Powered Prop Firm",
        hero_title: "Trade Smarter With TradeSense",
        hero_desc: "Get funded up to $100,000. Use AI analytics to maximize profits on international markets and Casablanca Stock Exchange.",
        cta_demo: "View Demo Dashboard",
        cta_how: "How It Works",
        plans_title: "Funding Plans",
        popular: "POPULAR"
    },
    fr: {
        nav_login: "Connexion",
        nav_start: "Commencer",
        hero_badge: "✨ La Première Prop Firm Assistée par IA",
        hero_title: "Tradez Plus Intelligemment Avec TradeSense",
        hero_desc: "Obtenez jusqu'à 100 000 $ de capital financé. Utilisez nos analyses IA pour maximiser vos profits sur les marchés internationaux et la Bourse de Casablanca.",
        cta_demo: "Voir le Dashboard Demo",
        cta_how: "Comment ça marche",
        plans_title: "Nos Plans de Financement",
        popular: "POPULAIRE"
    }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [lang, setLang] = useState<'en' | 'fr'>('fr');

    const toggle = () => setLang(prev => prev === 'en' ? 'fr' : 'en');

    return (
        <LanguageContext.Provider value={{ lang, toggle, t: dictionary[lang] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export const LanguageToggle = () => {
    const { lang, toggle } = useLanguage();
    return (
        <button
            onClick={toggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold transition-all"
        >
            <Globe size={14} />
            {lang.toUpperCase()}
        </button>
    );
};
