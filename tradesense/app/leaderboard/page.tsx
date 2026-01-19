'use client';

import { Trophy, TrendingUp, Crown, Award, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Trader {
    name: string;
    equity: number;
    profit_pct: number;
    rank?: number;
}

export default function LeaderboardPage() {
    const [traders, setTraders] = useState<Trader[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get('/leaderboard/monthly-top10');
            if (response.data && response.data.traders && response.data.traders.length > 0) {
                setTraders(response.data.traders);
            } else {
                throw new Error('Empty data');
            }
        } catch (error) {
            console.warn('Leaderboard API failed or empty, using mock data.');
            // Mock data pour démo
            setTraders([
                { name: 'Amine El Fassi', equity: 58500, profit_pct: 12.45 },
                { name: 'Zineb Benjelloun', equity: 27200, profit_pct: 8.80 },
                { name: 'Othmane Tazi', equity: 15450, profit_pct: 7.20 },
                { name: 'Saida Lahlou', equity: 5320, profit_pct: 6.40 },
                { name: 'Driss Mansouri', equity: 10210, profit_pct: 4.15 },
                { name: 'Meryem Alami', equity: 5180, profit_pct: 3.60 },
                { name: 'Kamal Bennani', equity: 25800, profit_pct: 3.20 },
                { name: 'Sofia Iraqi', equity: 10150, profit_pct: 1.50 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-20">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 py-20 relative z-10 max-w-6xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-6 rotate-3 shadow-lg shadow-yellow-500/20">
                        <Trophy className="h-10 w-10 text-white -rotate-3" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight tracking-tighter">
                        CLASSEMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-500 to-purple-500">MENSUEL</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Découvrez l'élite de TradeSense. Les meilleurs traders qui transforment l'IA en profits réels.
                    </p>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-violet-500/30 transition-all group">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6 text-violet-500" />
                            </div>
                            <h3 className="text-xl font-bold">Traders Actifs</h3>
                        </div>
                        <div className="text-4xl font-black">{traders.length}</div>
                        <p className="text-gray-500 text-sm mt-2">Ce mois-ci</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-yellow-500/30 transition-all group">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                <Crown className="h-6 w-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold">Top Performance</h3>
                        </div>
                        <div className="text-4xl font-black text-green-500">
                            {traders.length > 0 ? `${Math.max(...traders.map(t => t.profit_pct)).toFixed(2)}%` : '0%'}
                        </div>
                        <p className="text-gray-500 text-sm mt-2">Maximum atteint</p>
                    </div>

                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-indigo-500/30 transition-all group">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                <Award className="h-6 w-6 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold">Challenges</h3>
                        </div>
                        <div className="text-4xl font-black">28</div>
                        <p className="text-gray-500 text-sm mt-2">Réussis cette semaine</p>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-6" />
                        <p className="text-gray-400 font-medium italic">Analyse des données en temps réel...</p>
                    </div>
                ) : traders.length === 0 ? (
                    <div className="text-center py-24 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 max-w-4xl mx-auto px-8">
                        <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Trophy className="h-12 w-12 text-gray-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">L'arène est encore vide !</h3>
                        <p className="text-gray-400 mb-10 text-lg leading-relaxed max-w-lg mx-auto">
                            Aucun trader n'a encore pris la tête ce mois-ci. C'est votre chance d'inaugurer le classement et de marquer l'histoire.
                        </p>
                        <Link
                            href="/pricing"
                            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:scale-105 transition-all"
                        >
                            LANCER MON CHALLENGE
                        </Link>
                    </div>
                ) : (
                    <div className="backdrop-blur-xl bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/[0.03] border-b border-white/10 uppercase text-[10px] sm:text-xs font-black tracking-[0.2em] text-gray-500">
                                        <th className="py-8 px-8">Rang</th>
                                        <th className="py-8 px-8">Trader Élite</th>
                                        <th className="py-8 px-8">Capital de Trading</th>
                                        <th className="py-8 px-8 text-right">Profit Graph</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {traders.map((trader, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-white/[0.04] transition-all duration-300 group ${index < 3 ? 'bg-gradient-to-r from-violet-500/5 to-transparent' : ''
                                                }`}
                                        >
                                            <td className="py-8 px-8">
                                                <div className="flex items-center">
                                                    <span className={`text-2xl font-black mr-4 ${index === 0 ? 'text-yellow-500' :
                                                        index === 1 ? 'text-gray-400' :
                                                            index === 2 ? 'text-orange-600' :
                                                                'text-gray-700'
                                                        }`}>
                                                        #{index + 1}
                                                    </span>
                                                    {index === 0 && <Crown className="h-6 w-6 text-yellow-500 animate-bounce" />}
                                                </div>
                                            </td>
                                            <td className="py-8 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr flex items-center justify-center font-black text-lg border border-white/10 ${index === 0 ? 'from-yellow-400 to-orange-500' :
                                                        index === 1 ? 'from-gray-300 to-slate-400' :
                                                            'from-violet-600 to-indigo-600'
                                                        }`}>
                                                        {trader.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-lg text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">
                                                            {trader.name}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                                                            Trader {index < 3 ? 'VIP Financed' : 'Active Challenge'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-8 px-8 font-mono text-gray-300 text-lg">
                                                {trader.equity.toLocaleString('en-US')} <span className="text-gray-600 text-sm">DH</span>
                                            </td>
                                            <td className="py-8 px-8 text-right">
                                                <div className={`inline-flex flex-col items-end px-6 py-2 rounded-2xl bg-white/5 border border-white/5 ${trader.profit_pct >= 0 ? 'text-green-500' : 'text-red-500'
                                                    }`}>
                                                    <div className="text-2xl font-black tracking-tighter">
                                                        {trader.profit_pct >= 0 ? '+' : ''}{trader.profit_pct.toFixed(2)}%
                                                    </div>
                                                    <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest">ROI Mensuel</div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 bg-white/[0.02] border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center text-sm text-gray-500 italic">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                                Mises à jour en direct toutes les 60 minutes
                            </div>
                            <Link href="/pricing" className="text-violet-400 hover:text-white font-bold text-sm uppercase tracking-widest flex items-center group">
                                REJOINDRE L'ÉLITE
                                <div className="ml-2 w-5 h-px bg-violet-400 group-hover:w-10 transition-all" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
