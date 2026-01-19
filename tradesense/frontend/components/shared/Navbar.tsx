"use client"

import Link from 'next/link';
import { Home, TrendingUp, Trophy, DollarSign, User, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActiveLink } from './ActiveLink';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export function Navbar() {
    const { user, logout } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-white/10 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 backdrop-blur shadow-lg shadow-violet-500/10' : 'bg-gray-950/50 backdrop-blur-xl'}`}>
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-violet-500/20">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            TradeSense AI
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <ActiveLink href="/" className="nav-link px-4">
                            {t('home')}
                        </ActiveLink>
                        <ActiveLink href="/pricing" className="nav-link px-4">
                            {t('pricing')}
                        </ActiveLink>
                        <ActiveLink href="/dashboard" className="nav-link px-4">
                            {t('trading')}
                        </ActiveLink>
                        <ActiveLink href="/leaderboard" className="nav-link px-4">
                            {t('leaderboard')}
                        </ActiveLink>
                    </nav>

                    {/* Right side - User & Language */}
                    <div className="flex items-center gap-6">
                        {/* Language Selector */}
                        <div className="hidden lg:flex items-center gap-2 group cursor-pointer">
                            <Globe className="h-4 w-4 text-gray-400 group-hover:text-violet-400 transition-colors" />
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                className="bg-transparent text-xs font-bold border-none focus:outline-none text-gray-300 cursor-pointer hover:text-white transition-colors"
                            >
                                <option value="fr">FR</option>
                                <option value="en">EN</option>
                                <option value="ar">AR</option>
                            </select>
                        </div>

                        {/* User Menu */}
                        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <p className="text-sm font-black text-white leading-none capitalize" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                                            {user.name || user.email.split('@')[0]}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 italic">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="h-8 w-px bg-white/5 mx-1 hidden sm:block" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={logout}
                                        className="h-9 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span className="hidden md:inline">{t('quitter')}</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Button asChild variant="ghost" size="sm" className="hidden md:flex text-gray-400 hover:text-white font-bold text-sm">
                                        <Link href="/login">{t('login')}</Link>
                                    </Button>
                                    <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black px-6 rounded-xl shadow-lg shadow-violet-500/20 transition-all hover:scale-105 active:scale-95">
                                        <Link href="/register">
                                            {t('joining')}
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-around py-4 border-t border-white/5 mt-2 bg-gray-900/50 backdrop-blur rounded-2xl mb-2 px-2">
                    <ActiveLink href="/" className="flex flex-col items-center gap-1 group">
                        <Home className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400">Home</span>
                    </ActiveLink>
                    <ActiveLink href="/dashboard" className="flex flex-col items-center gap-1 group">
                        <TrendingUp className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400">Trade</span>
                    </ActiveLink>
                    <ActiveLink href="/leaderboard" className="flex flex-col items-center gap-1 group">
                        <Trophy className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400">Élite</span>
                    </ActiveLink>
                    <ActiveLink href="/login" className="flex flex-col items-center gap-1 group">
                        <User className="h-5 w-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400">Profil</span>
                    </ActiveLink>
                </div>
            </div>
        </header>
    );
}
