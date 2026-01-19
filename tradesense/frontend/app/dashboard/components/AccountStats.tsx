import { TrendingUp, TrendingDown, DollarSign, Target, Lock } from 'lucide-react';
import Link from 'next/link';

export function AccountStats({ challenge }: { challenge?: any }) {
    const isLocked = !challenge;

    const account = {
        status: challenge?.status || 'Aucun',
        currentCapital: challenge?.current_equity || 0,
        profitLoss: challenge ? ((challenge.current_equity - challenge.start_balance) / challenge.start_balance) * 100 : 0,
        profitLossDH: challenge ? (challenge.current_equity - challenge.start_balance) : 0,
        initialCapital: challenge?.start_balance || 0,
        dailyChange: 0.00,
        totalTrades: challenge?.trades?.length || 0,
        winRate: 0,
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 h-full overflow-y-auto relative">
            {isLocked && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-gray-950/40 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8 text-violet-500" />
                    </div>
                    <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Trading Verrouillé</h3>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Choisissez un plan de financement pour commencer à trader et voir vos statistiques en temps réel.
                    </p>
                    <Link
                        href="/pricing"
                        className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/20"
                    >
                        Choisir mon Plan
                    </Link>
                </div>
            )}

            <h2 className="text-xl font-bold mb-6">Statistiques</h2>

            {/* Status Badge */}
            <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${account.status === 'active' || account.status === 'Actif' ? 'bg-green-500/20 text-green-400' :
                        account.status === 'passed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'}`}>
                    {account.status === 'active' ? 'Actif' : account.status === 'Aucun' ? 'Inactif' : account.status}
                </span>
            </div>

            {/* Capital Cards */}
            <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-400">Capital Actuel</span>
                        </div>
                    </div>
                    <div className="text-2xl font-bold">{account.currentCapital.toLocaleString()} DH</div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            {account.profitLoss >= 0 ?
                                <TrendingUp className="h-5 w-5 text-green-500 mr-2" /> :
                                <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                            }
                            <span className="text-gray-400">Profit/Perte</span>
                        </div>
                        <span className={`${account.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {account.profitLoss >= 0 ? '+' : ''}{account.profitLoss.toFixed(2)}%
                        </span>
                    </div>
                    <div className={`text-2xl font-bold ${account.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {account.profitLossDH >= 0 ? '+' : ''}{account.profitLossDH.toLocaleString()} DH
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Target className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="text-gray-400">Capital Initial</span>
                        </div>
                    </div>
                    <div className="text-2xl font-bold">{account.initialCapital.toLocaleString()} DH</div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                        <div className="text-2xl font-bold">{account.totalTrades}</div>
                        <div className="text-sm text-gray-400">Trades Totaux</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                        <div className="text-2xl font-bold">{account.winRate}%</div>
                        <div className="text-sm text-gray-400">Taux Réussite</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
