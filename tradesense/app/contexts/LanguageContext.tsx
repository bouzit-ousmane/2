'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    fr: {
        'home': 'Accueil',
        'pricing': 'Tarifs',
        'trading': 'Trading',
        'leaderboard': 'Classement',
        'login': 'Connexion',
        'logout': 'Déconnexion',
        'start': 'Commencer',
        'joining': 'Nous Rejoindre',
        'quitter': 'Quitter',
        'dirham': 'Dirham (MAD)',
        'active_challenge': 'Challenge Actif',
        'capital_actual': 'Capital Actuel',
        'hero_badge': 'Le Futur du Prop Trading est Arabo-Maghrébin',
        'hero_desc': 'Rejoignez l\'élite des traders avec TradeSense AI. Accédez à un capital allant jusqu\'à 1,000,000 DH et tradez avec des outils d\'intelligence artificielle de pointe.',
        'plans_title': 'Choisissez Votre Challenge'
    },
    en: {
        'home': 'Home',
        'pricing': 'Pricing',
        'trading': 'Trading',
        'leaderboard': 'Leaderboard',
        'login': 'Login',
        'logout': 'Logout',
        'start': 'Get Started',
        'joining': 'Join Us',
        'quitter': 'Exit',
        'dirham': 'Dirham (MAD)',
        'active_challenge': 'Active Challenge',
        'capital_actual': 'Current Capital',
        'hero_badge': 'The Future of Prop Trading is Arabo-Maghrebian',
        'hero_desc': 'Join the elite of traders with TradeSense AI. Access capital up to 1,000,000 MAD and trade with state-of-the-art AI tools.',
        'plans_title': 'Choose Your Challenge'
    },
    ar: {
        'home': 'الرئيسية',
        'pricing': 'الأسعار',
        'trading': 'التداول',
        'leaderboard': 'المتصدرين',
        'login': 'تسجيل الدخول',
        'logout': 'تسجيل الخروج',
        'start': 'ابدأ الآن',
        'joining': 'انضم إلينا',
        'quitter': 'خروج',
        'dirham': 'درهم (MAD)',
        'active_challenge': 'تحدي نشط',
        'capital_actual': 'رأس المال الحالي',
        'hero_badge': 'مستقبل تداول البروب هو مغاربي عربي',
        'hero_desc': 'انضم إلى نخبة المتداولين مع TradeSense AI. احصل على رأس مال يصل إلى 1,000,000 درهم وتاجر بأحدث أدوات الذكاء الاصطناعي.',
        'plans_title': 'اختر تحديك'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('fr');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && ['fr', 'en', 'ar'].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[language]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
