'use client';

import { CreditCard, Bitcoin, Lock, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const planSlug = searchParams.get('plan') || 'starter';

    const [paymentMethod, setPaymentMethod] = useState<'cmi' | 'crypto'>('cmi');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const plans = {
        starter: { name: 'Starter', price: 200, balance: '5,000$' },
        pro: { name: 'Pro', price: 500, balance: '10,000$' },
        elite: { name: 'Elite', price: 1000, balance: '25,000$' }
    };

    const plan = plans[planSlug as keyof typeof plans] || plans.starter;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push(`/login?redirect=/checkout?plan=${planSlug}`);
        }
    }, [router, planSlug]);

    const handlePayment = async () => {
        setLoading(true);

        // Simulate API call to create subscription/challenge
        try {
            // Small delay for realism
            await new Promise(resolve => setTimeout(resolve, 2000));

            const token = localStorage.getItem('token');
            if (token) {
                // Correct API path: /api/checkout/mock
                await api.post('/checkout/mock', {
                    plan_slug: planSlug,
                    payment_method: paymentMethod.toUpperCase()
                });
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Payment simulation failed:', error);
            // Fallback success for demo if API is down
            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h2 className="text-4xl font-black mb-4">PAIEMENT RÉUSSI !</h2>
                    <p className="text-gray-400 text-lg">Préparation de votre terminal de trading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white py-12 relative overflow-hidden">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[100] bg-gray-950/80 backdrop-blur-md flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Lock className="h-8 w-8 text-violet-500 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-black mt-8 tracking-widest uppercase">Traitement Sécurisé</h2>
                    <p className="text-gray-500 font-bold text-xs mt-2 uppercase tracking-[0.3em]">Communication avec la passerelle bancaire...</p>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="group flex items-center text-gray-500 hover:text-white transition-colors mb-8 font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Retour aux plans
                    </button>

                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">FINALISER <span className="text-blue-500">L'ACHAT</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Plan {plan.name} — Terminal TradeSense Pro</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Forms */}
                    <div className="space-y-8">
                        {/* Payment Method */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                            <h2 className="text-xl font-black mb-8 uppercase tracking-tight flex items-center gap-3">
                                <CreditCard className="h-5 w-5 text-blue-500" />
                                Méthode de paiement
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                <button
                                    onClick={() => setPaymentMethod('cmi')}
                                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${paymentMethod === 'cmi'
                                        ? 'border-violet-500 bg-violet-500/5'
                                        : 'border-white/5 bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <CreditCard className={`h-8 w-8 ${paymentMethod === 'cmi' ? 'text-violet-400' : 'text-gray-600'}`} />
                                    <span className="text-xs font-black uppercase tracking-widest">CMI / Visa</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod('crypto')}
                                    className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${paymentMethod === 'crypto'
                                        ? 'border-violet-500 bg-violet-500/5'
                                        : 'border-white/5 bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <Bitcoin className={`h-8 w-8 ${paymentMethod === 'crypto' ? 'text-amber-500' : 'text-gray-600'}`} />
                                    <span className="text-xs font-black uppercase tracking-widest">Crypto</span>
                                </button>
                            </div>

                            {/* Payment Details Container */}
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {paymentMethod === 'cmi' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Titulaire de la carte</label>
                                            <input
                                                type="text"
                                                placeholder="NOM PRÉNOM"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors font-mono"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Numéro de carte</label>
                                            <input
                                                type="text"
                                                placeholder="•••• •••• •••• ••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors font-mono"
                                                maxLength={19}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Expiration</label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">CVC</label>
                                            <input
                                                type="text"
                                                placeholder="•••"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors font-mono"
                                                maxLength={3}
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Adresse de facturation</label>
                                            <input
                                                type="text"
                                                placeholder="VOTRE ADRESSE"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors font-mono"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 bg-amber-500/5 rounded-3xl border border-amber-500/10">
                                        <Bitcoin className="h-10 w-10 text-amber-500 mx-auto mb-6" />
                                        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                            Envoyez l'équivalent de <strong>{plan.price} DH</strong> en stablecoin (USDT/USDC) à l'adresse sécurisée ci-dessous :
                                        </p>
                                        <div className="bg-black/40 p-4 rounded-xl font-mono text-xs break-all border border-white/5 text-amber-200 select-all cursor-pointer hover:bg-black/60 transition-colors">
                                            TBLx942d35Cc6634C0532925a3b844Bc9e0a3F0dC0a3
                                        </div>
                                        <p className="mt-4 text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">Réseau : ERC-20 / Polygon</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 px-4">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                                <Lock className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-white">Sécurité SSL 256-bits</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Vos données bancaires sont cryptées et jamais stockées.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/10 rounded-[2.5rem] p-10 backdrop-blur-3xl sticky top-32">
                            <h2 className="text-xl font-black mb-8 uppercase tracking-tight">Résumé de la commande</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Plan sélectionné</span>
                                    <span className="font-black text-violet-400 uppercase">{plan.name}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Capital de trading</span>
                                    <span className="font-mono font-bold text-white">{plan.balance}</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Challenge</span>
                                    <span className="text-xs font-bold text-white uppercase tracking-widest">30 Jours</span>
                                </div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accès IA</span>
                                    <span className="text-[10px] font-black bg-green-500/20 text-green-500 px-3 py-1 rounded-full uppercase">Inclus</span>
                                </div>

                                <div className="h-px bg-white/10 my-8" />

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total à régler</p>
                                        <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                                        <span className="text-gray-500 font-bold uppercase text-xs ml-2">DH</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">TTC</div>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-3"></div>
                                        Validation...
                                    </span>
                                ) : (
                                    `ACTIVER MON COMPTE`
                                )}
                            </button>

                            <div className="mt-8 flex items-center justify-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-gray-500" />
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Approuvé par TradeSense Risk Management</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
