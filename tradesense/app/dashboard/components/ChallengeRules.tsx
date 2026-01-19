'use client';

import { Target, AlertTriangle, Shield } from 'lucide-react';

export function ChallengeRules() {
    const rules = {
        profitTarget: { current: 0.00, max: 10.00, color: 'bg-green-500' },
        dailyLoss: { current: 0.00, max: 5.00, color: 'bg-yellow-500' },
        totalLoss: { current: 0.00, max: 10.00, color: 'bg-red-500' },
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 shadow-lg backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-violet-500" />
                Règles du Challenge
            </h2>

            <div className="space-y-6">
                {/* Profit Target */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <Target className="h-4 w-4 text-green-500 mr-2" />
                            <span className="font-medium">Objectif de Profit</span>
                        </div>
                        <span className="text-sm text-gray-400">
                            {rules.profitTarget.current.toFixed(2)}% / {rules.profitTarget.max}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${rules.profitTarget.color} transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(100, (rules.profitTarget.current / rules.profitTarget.max) * 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5 flex justify-between">
                        <span>Progress: {((rules.profitTarget.current / rules.profitTarget.max) * 100).toFixed(1)}%</span>
                        <span>{(rules.profitTarget.max - rules.profitTarget.current).toFixed(2)}% restant</span>
                    </div>
                </div>

                {/* Daily Loss */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="font-medium">Perte Journalière Max</span>
                        </div>
                        <span className="text-sm text-gray-400">
                            {rules.dailyLoss.current.toFixed(2)}% / {rules.dailyLoss.max}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${rules.dailyLoss.color} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(234,179,8,0.3)]`}
                            style={{ width: `${Math.min(100, (rules.dailyLoss.current / rules.dailyLoss.max) * 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">
                        {rules.dailyLoss.max.toFixed(2)}% de marge disponible
                    </div>
                </div>

                {/* Total Loss */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                            <span className="font-medium">Perte Totale Max</span>
                        </div>
                        <span className="text-sm text-gray-400">
                            {rules.totalLoss.current.toFixed(2)}% / {rules.totalLoss.max}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${rules.totalLoss.color} transition-all duration-700 ease-out shadow-[0_0_10px_rgba(239,68,68,0.3)]`}
                            style={{ width: `${Math.min(100, (rules.totalLoss.current / rules.totalLoss.max) * 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">
                        {rules.totalLoss.max.toFixed(2)}% de marge disponible
                    </div>
                </div>
            </div>

            {/* Status Message */}
            <div className="mt-8 p-4 bg-violet-500/5 border border-violet-500/10 rounded-xl">
                <p className="text-sm text-violet-300 leading-relaxed">
                    💡 <strong>Conseil:</strong> Surveillez ces indicateurs après chaque position. La discipline est la clé du succès.
                </p>
            </div>
        </div>
    );
}
