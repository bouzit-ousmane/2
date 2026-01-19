'use client';

import { Check, Star, Shield, Zap, Award } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const plans = [
    {
        slug: 'starter',
        name: 'Starter',
        price: 200,
        priceCurrency: 'DH',
        balance: '5,000$',
        features: [
            'Capital: 5,000$',
            'Profit target: +10%',
            'Max loss: -10%',
            'Basic AI signals',
            'Email support',
            '30 days challenge'
        ],
        popular: false,
        color: 'from-gray-600 to-gray-700',
        icon: <Zap className="h-6 w-6 text-gray-400" />
    },
    {
        slug: 'pro',
        name: 'Pro',
        price: 500,
        priceCurrency: 'DH',
        balance: '10,000$',
        features: [
            'Capital: 10,000$',
            'Profit target: +10%',
            'Max loss: -10%',
            'Advanced AI signals',
            '24/7 support',
            'MasterClass access',
            '60 days challenge'
        ],
        popular: true,
        color: 'from-violet-600 to-purple-600',
        icon: <Star className="h-6 w-6 text-yellow-500" />
    },
    {
        slug: 'elite',
        name: 'Elite',
        price: 1000,
        priceCurrency: 'DH',
        balance: '25,000$',
        features: [
            'Capital: 25,000$',
            'Profit target: +10%',
            'Max loss: -10%',
            'Personalized AI',
            '1-on-1 coaching',
            '80% profit share',
            '90 days challenge'
        ],
        popular: false,
        color: 'from-amber-600 to-orange-600',
        icon: <Award className="h-6 w-6 text-orange-500" />
    }
];

export default function PricingPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSelectPlan = async (planSlug: string) => {
        setSelectedPlan(planSlug);
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login with direct path to checkout after
                router.push(`/login?redirect=/checkout?plan=${planSlug}`);
                return;
            }

            // Correct API path: /api/checkout/mock
            try {
                const response = await api.post('/checkout/mock', {
                    plan_slug: planSlug,
                    payment_method: "CMI"
                });

                if (response.data) {
                    router.push('/dashboard');
                    return;
                }
            } catch (innerErr) {
                console.warn('Fast-track failed, going to checkout');
                router.push(`/checkout?plan=${planSlug}`);
            }
        } catch (error) {
            console.error('Error in selection:', error);
            router.push(`/checkout?plan=${planSlug}`);
        } finally {
            setSelectedPlan(null);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white py-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-violet-600/5 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">
                        CHOISISSEZ VOTRE <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500">PLAN</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Démarrez votre parcours de trading avec le capital virtuel adapté à votre niveau. Propulsé par l'IA la plus avancée du marché.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-center">
                    {plans.map((plan) => (
                        <div
                            key={plan.slug}
                            className={`relative rounded-[2.5rem] p-10 border transition-all duration-500 group ${plan.popular
                                ? 'border-violet-500 bg-gray-900/40 backdrop-blur-xl scale-105 shadow-2xl shadow-violet-500/10 z-20'
                                : 'border-white/5 bg-gray-900/20 backdrop-blur-md hover:border-white/20'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center shadow-lg">
                                    <Star className="h-3 w-3 mr-2 fill-white" />
                                    RECOMMANDÉ
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-3 bg-white/5 rounded-2xl">
                                        {plan.icon}
                                    </div>
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                        {plan.slug} tier
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black mb-2 tracking-tight group-hover:text-violet-400 transition-colors uppercase">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black">{plan.price}</span>
                                    <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">{plan.priceCurrency}/challenge</span>
                                </div>
                                <div className="inline-flex items-center px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                                    <Zap className="h-4 w-4 text-violet-400 mr-2" />
                                    <span className="font-black text-violet-400 uppercase text-xs">Capital: {plan.balance}</span>
                                </div>
                            </div>

                            {/* Features List */}
                            <div className="space-y-5 mb-12">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <div className="p-1 bg-green-500/10 rounded-full mr-4 mt-0.5">
                                            <Check className="h-3.5 w-3.5 text-green-500" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => handleSelectPlan(plan.slug)}
                                disabled={loading && selectedPlan === plan.slug}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all ${plan.popular
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:scale-[1.02] active:scale-95'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
                                    }`}
                            >
                                {loading && selectedPlan === plan.slug ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3"></div>
                                        Traitement...
                                    </span>
                                ) : (
                                    'Obtenir mes fonds'
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                <Shield className="h-3 w-3" />
                                Activé Instantanément
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ & Trust */}
                <div className="mt-32 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-black mb-8 tracking-tight">VOS QUESTIONS <span className="text-violet-500">FRÉQUENTES</span></h2>
                            <div className="space-y-6">
                                {[
                                    { q: "Que se passe-t-il si j'échoue?", a: "Transparence totale : vous pouvez racheter un nouveau challenge à prix réduit à tout moment." },
                                    { q: "Puis-je upgrade mon plan?", a: "Absolument. Vous pouvez augmenter votre capital géré à tout moment depuis votre dashboard." },
                                    { q: "Les profits sont-ils réels?", a: "Une fois le challenge réussi, vous tradez sur des fonds réels et gardez jusqu'à 80% des profits." }
                                ].map((faq, idx) => (
                                    <div key={idx} className="group border-l-2 border-white/5 hover:border-violet-500 pl-6 transition-all">
                                        <h3 className="font-black text-sm uppercase tracking-wider mb-2">{faq.q}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-[2.5rem] p-10 border border-white/5 flex flex-col justify-center items-center text-center">
                            <div className="w-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center mb-8">
                                <Shield className="h-10 w-10 text-violet-500" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">SÉCURITÉ GARANTIE</h3>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                Chaque transaction est sécurisée par le protocole SSL 256 bits. Nous ne stockons jamais vos données bancaires.
                            </p>
                            <div className="flex gap-4">
                                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/5 text-[8px] font-bold text-gray-500">VISA</div>
                                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/5 text-[8px] font-bold text-gray-500">CMI</div>
                                <div className="h-8 w-12 bg-white/5 rounded flex items-center justify-center border border-white/5 text-[8px] font-bold text-gray-500">USDT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
