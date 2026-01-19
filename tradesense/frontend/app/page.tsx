"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Brain, Trophy, Users, Zap, Search, Layout, Menu, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Features } from '@/components/landing/Features';
import { SecondaryFeatures } from '@/components/landing/SecondaryFeatures';
import { HeroChart } from '@/components/landing/HeroChart';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const toggleHowItWorks = () => {
    setShowHowItWorks(!showHowItWorks);
    if (!showHowItWorks) {
      setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 container mx-auto px-4">
        {/* Floating Animated Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-60 -left-20 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-bold mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-ping" />
            {t('hero_badge')}
          </motion.div>

          {/* Gradient Text & Glow Effects */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8"
          >
            {language === 'fr' ? 'Tradez Plus Intelligemment avec ' : 'Trade Smarter with '}
            <span className="bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              TradeSense AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero_desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
          >
            <Link href="/pricing" className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
              Commencer le challenge
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={toggleHowItWorks}
              className="px-10 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-white"
            >
              Comment ça marche
            </button>
          </motion.div>

          {/* How It Works Section (Toggleable) */}
          {showHowItWorks && (
            <motion.div
              ref={howItWorksRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 mb-24 max-w-4xl mx-auto text-left"
            >
              <div className="bg-gradient-to-b from-blue-600/10 to-transparent border border-blue-500/20 rounded-[40px] p-8 md:p-16 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Brain className="w-64 h-64 text-blue-500" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Comment Ça Marche</h2>
                <p className="text-blue-400 font-bold mb-12 text-lg">3 étapes simples pour devenir un trader financé</p>

                <div className="grid md:grid-cols-3 gap-12 relative z-10">
                  <div className="space-y-4">
                    <div className="text-6xl font-black text-blue-500 opacity-20">01</div>
                    <h3 className="text-xl font-bold">Inscription & Paiement</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Choisissez votre plan <strong>(Starter, Pro ou Elite)</strong> et créez votre compte en quelques minutes
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-6xl font-black text-blue-500 opacity-20">02</div>
                    <h3 className="text-xl font-bold">Relevez le Challenge</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Tradez avec un capital simulé et atteignez <strong>+10% de profit</strong> sans dépasser les limites de perte
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-6xl font-black text-blue-500 opacity-20">03</div>
                    <h3 className="text-xl font-bold">Obtenez votre Financement</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Une fois le challenge réussi, recevez un compte financé et gardez jusqu'à <strong>80% des profits</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                  <button onClick={() => setShowHowItWorks(false)} className="text-gray-500 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                    Fermer la section <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}


        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-violet-500 mb-2 transition-transform group-hover:scale-110 duration-300">
                <CountUp end={1500} duration={2.5} suffix="+" />
              </div>
              <p className="text-gray-400 font-medium">Traders Actifs</p>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-indigo-500 mb-2 transition-transform group-hover:scale-110 duration-300">
                <CountUp end={5} duration={2} suffix="M+" />
              </div>
              <p className="text-gray-400 font-medium">Volume de Trade (DH)</p>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-purple-500 mb-2 transition-transform group-hover:scale-110 duration-300">
                <CountUp end={95} duration={2.5} suffix="%" />
              </div>
              <p className="text-gray-400 font-medium">Satisfaction Client</p>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-violet-600 mb-2 transition-transform group-hover:scale-110 duration-300">
                <CountUp end={80} duration={2.5} suffix="%" />
              </div>
              <p className="text-gray-400 font-medium">Partage de Profit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Secondary Features (News, Community, MasterClass) */}
      <SecondaryFeatures />

      {/* Testimonials Carousel */}
      <section className="py-24 bg-gray-950 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Ce que disent nos <span className="text-violet-500">Traders</span>
          </h2>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white/[0.02] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('plans_title')}</h2>
            <p className="text-gray-400">Choisissez le capital qui correspond à vos ambitions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Starter"
              price="200 DH"
              capital="5,000 $"
              slug="starter"
              features={["Objectif: 10%", "Perte Max: 10%", "Levier: 1:30"]}
              btnText="Choisir Starter"
            />
            <PricingCard
              name="Pro"
              price="500 DH"
              capital="10,000 $"
              slug="pro"
              popular
              features={["Objectif: 10%", "Perte Max: 10%", "Signaux IA Avancés", "Partage 80/20"]}
              btnText="Choisir Pro"
            />
            <PricingCard
              name="Elite"
              price="1,000 DH"
              capital="25,000 $"
              slug="elite"
              features={["Objectif: 10%", "Perte Max: 10%", "Coaching 1-on-1", "Accès Masterclass"]}
              btnText="Choisir Elite"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    { name: "Ahmed R.", role: "Trader Pro", content: "TradeSense a changé ma vision du trading. L'IA m'aide énormément sur la Bourse de Casablanca." },
    { name: "Youssef M.", role: "Day Trader", content: "Le processus de financement est clair et rapide. Déjà mon deuxième compte Elite !" },
    { name: "Sara K.", role: "Swing Trader", content: "Les outils d'analyse sont incroyables. Je recommande à tous les traders marocains." }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 md:p-12 mb-8">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((t, idx) => (
            <div key={idx} className="min-w-full text-center px-4">
              <p className="text-xl md:text-2xl italic text-gray-300 mb-8">"{t.content}"</p>
              <h4 className="font-bold text-violet-400">{t.name}</h4>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-violet-500' : 'w-2 bg-gray-700'}`}
          />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ name, price, capital, features, btnText, slug, popular = false }: any) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x - rect.width / 2) / rect.width) * 15;
    const rotateX = ((y - rect.height / 2) / rect.height) * -15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetTransform = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTransform}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group p-8 rounded-3xl transition-all duration-300 border backdrop-blur-xl ${popular
        ? 'bg-violet-600/10 border-violet-400/50 shadow-2xl shadow-violet-500/10 scale-105 z-10'
        : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black px-4 py-1.5 rounded-full ring-4 ring-gray-950">
          RECOMMANDÉ
        </div>
      )}

      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="text-4xl font-black mb-1">{price}</div>
      <p className="text-violet-400 font-bold text-lg mb-6">Capital {capital}</p>

      <ul className="space-y-4 mb-8">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
            <Zap className="w-4 h-4 text-violet-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/checkout?plan=${slug}`}
        className={`block w-full text-center py-4 rounded-xl font-bold transition-all ${popular
          ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20'
          : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
      >
        {btnText}
      </Link>
    </motion.div>
  );
}
