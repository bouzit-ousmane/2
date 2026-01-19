"use client"

import React, { useState } from 'react';
import api from '@/lib/api';
// We should use Shadcn components here effectively, but for speed raw tailwind first
// assuming Button/Input are available or generic.

interface OrderPanelProps {
    symbol: string;
    challengeId: number | null;
    onTradeExecuted: () => void;
}

import { Lock } from 'lucide-react';
import Link from 'next/link';

export const OrderPanel: React.FC<OrderPanelProps> = ({ symbol, challengeId, onTradeExecuted }) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const isLocked = !challengeId;

    const handleTrade = async (side: 'buy' | 'sell') => {
        if (!challengeId) {
            alert("No active challenge found!");
            return;
        }
        // ... rest of the function ...
        setLoading(true);
        try {
            const res = await api.post('/trades', {
                challenge_id: challengeId,
                symbol: symbol,
                side: side,
                quantity: quantity
            });

            if (res.data.success) {
                alert(`Succès: ${side === 'buy' ? 'Achat' : 'Vente'} de ${quantity} ${symbol} à ${res.data.price} DH`);
                onTradeExecuted();
            }
        } catch (err: any) {
            console.error('Trade execution failed:', err);
            const errorMsg = err.response?.data?.error || err.message || "Erreur inconnue";
            alert(`Échec du trade: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-full relative overflow-hidden">
            {isLocked && (
                <div className="absolute inset-0 z-30 backdrop-blur-md bg-slate-900/60 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-14 h-14 bg-blue-600/20 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Exécution Verrouillée</h3>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed max-w-[200px] mx-auto">
                        Le passage d'ordres n'est possible qu'après l'achat d'un challenge.
                    </p>
                    <Link
                        href="/pricing"
                        className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all hover:scale-105 active:scale-95"
                    >
                        Activer mon Compte
                    </Link>
                </div>
            )}

            <h3 className="text-lg font-black mb-6 text-white uppercase tracking-tight">Terminal d'Exécution</h3>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Instrument</label>
                    <div className="text-white font-mono font-bold text-xl bg-slate-900/50 p-4 rounded-xl border border-white/5">{symbol}</div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quantité</label>
                    <input
                        type="number"
                        value={quantity}
                        min={1}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full bg-slate-900/50 border border-white/5 rounded-xl p-4 text-white text-right font-mono font-bold text-xl focus:border-violet-500 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleTrade('buy')}
                    disabled={loading || isLocked}
                    className="group relative bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[1.25rem] transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10 flex flex-col items-center justify-center gap-1"
                >
                    <span className="text-sm">ACHETER</span>
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Market</span>
                </button>
                <button
                    onClick={() => handleTrade('sell')}
                    disabled={loading || isLocked}
                    className="group relative bg-red-500 hover:bg-red-600 text-white font-black py-5 rounded-[1.25rem] transition-all disabled:opacity-50 shadow-lg shadow-red-500/10 flex flex-col items-center justify-center gap-1"
                >
                    <span className="text-sm">VENDRE</span>
                    <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">Market</span>
                </button>
            </div>
        </div>
    );
};
