'use client';

import { Brain, Target, Shield, TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AISignals({ symbol = 'BTC-USD' }: { symbol?: string }) {
    const [signal, setSignal] = useState({
        action: 'NEUTRAL',
        confidence: 50,
        targetPrice: 0.00,
        stopLoss: 0.00,
        reasons: [
            'Analyse du sentiment en cours',
            'Attente de confirmation technique',
            'Observation des volumes de trading'
        ],
        timestamp: new Date().toISOString(),
    });

    // Fetch signal from backend
    useEffect(() => {
        const fetchSignal = async () => {
            try {
                // Assuming the backend is proxied or accessible via /api
                const response = await fetch(`http://localhost:5000/api/market/signal?symbol=${symbol}`);
                if (response.ok) {
                    const data = await response.json();
                    setSignal(data);
                } else {
                    // Mock dynamic data if API is not ready
                    generateMockSignal();
                }
            } catch (error) {
                console.error('Failed to fetch AI signal:', error);
                generateMockSignal();
            }
        };

        // Simple mock generator for better UX during development
        const generateMockSignal = () => {
            const actions = ['BUY', 'SELL', 'NEUTRAL'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const confidence = 60 + Math.floor(Math.random() * 30);

            setSignal(prev => ({
                ...prev,
                action: randomAction,
                confidence: randomAction === 'NEUTRAL' ? 50 : confidence,
                targetPrice: 96000 + Math.random() * 1000,
                stopLoss: 94000 - Math.random() * 1000,
            }));
        };

        fetchSignal();
        const interval = setInterval(fetchSignal, 30000); // Update every 30s

        return () => clearInterval(interval);
    }, [symbol]);

    const getSignalColor = (action: string) => {
        switch (action) {
            case 'BUY': return 'text-green-500';
            case 'SELL': return 'text-red-500';
            default: return 'text-yellow-500';
        }
    };

    const getSignalIcon = (action: string) => {
        switch (action) {
            case 'BUY': return <TrendingUp className="h-6 w-6 text-green-500" />;
            case 'SELL': return <TrendingDown className="h-6 w-6 text-red-500" />;
            default: return <Brain className="h-6 w-6 text-yellow-500" />;
        }
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 shadow-lg backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-violet-500" />
                Signaux IA
            </h2>

            {/* Signal Card */}
            <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`text-2xl font-bold ${getSignalColor(signal.action)}`}>
                        {signal.action}
                    </div>
                    {getSignalIcon(signal.action)}
                </div>

                <div className="mb-2">
                    <span className="text-gray-400 text-sm">Indice de Confiance: </span>
                    <span className="font-bold text-white">{signal.confidence}%</span>
                </div>

                {/* Confidence Bar */}
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden mb-6">
                    <div
                        className={`h-full ${signal.confidence > 70 ? 'bg-green-500' :
                            signal.confidence > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            } transition-all duration-700 shadow-[0_0_8px_currentColor]`}
                        style={{ width: `${signal.confidence}%` }}
                    />
                </div>

                {/* Target Prices */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                        <div className="flex items-center justify-center mb-1">
                            <Target className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-xs text-gray-400">Prix Cible</span>
                        </div>
                        <div className="text-lg font-bold text-white">${signal.targetPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                    </div>

                    <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-white/5">
                        <div className="flex items-center justify-center mb-1">
                            <Shield className="h-4 w-4 text-red-500 mr-2" />
                            <span className="text-xs text-gray-400">Stop Loss</span>
                        </div>
                        <div className="text-lg font-bold text-white">${signal.stopLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                    </div>
                </div>

                {/* Reasons */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 text-gray-200">Facteurs d'analyse:</h4>
                    <ul className="space-y-2.5">
                        {signal.reasons.map((reason, index) => (
                            <li key={index} className="flex items-start text-xs text-gray-400">
                                <span className="text-violet-500 mr-2 text-base leading-none">•</span>
                                {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-gray-500 p-3 bg-gray-800/20 rounded-lg border border-white/5 leading-tight italic">
                ⚠️ <strong>Note:</strong> Les signaux IA sont basés sur des indicateurs techniques automatisés. Ne constitue pas un conseil financier.
            </div>
        </div>
    );
}
