'use client';

import React, { useState, useEffect } from 'react';
import { SymbolsSidebar } from './components/SymbolsSidebar';
import TradingChart from './components/TradingChart';
import { OrderPanel } from './components/OrderPanel';
import { RightSidebar } from './components/RightSidebar';
import { LayoutDashboard, Bell, Settings } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
    const { user } = useAuth();
    const [selectedSymbol, setSelectedSymbol] = useState('BTC-USD');
    const [activeChallenge, setActiveChallenge] = useState<any>(null);

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const fetchChallenge = async () => {
            try {
                const response = await api.get('/challenges/active');
                if (response.data && response.data.challenge) {
                    setActiveChallenge(response.data.challenge);
                }
            } catch (error: any) {
                if (error.response?.status === 401) {
                    window.location.href = '/login';
                } else if (error.response?.status === 404) {
                    setActiveChallenge(null);
                }
                console.error('Failed to fetch active challenge:', error);
            }
        };

        fetchChallenge();
    }, []);

    const handleTradeExecuted = () => {
        // Refresh logic - fetch challenge again to update balances
        const fetchChallenge = async () => {
            try {
                const response = await api.get('/challenges/active');
                if (response.data && response.data.challenge) {
                    setActiveChallenge(response.data.challenge);
                }
            } catch (e) { }
        };
        fetchChallenge();
    };

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
            {/* 1. Left Sidebar - Symbol Explorer (TradingView Style) */}
            <SymbolsSidebar onSymbolSelect={setSelectedSymbol} />

            {/* 2. Main Content Area - Primary Focus on Chart */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header className="h-14 border-b border-white/5 bg-gray-950/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-violet-600/20 rounded-lg">
                                <LayoutDashboard className="w-5 h-5 text-violet-500" />
                            </span>
                            <h1 className="text-xl font-bold tracking-tight">{selectedSymbol}</h1>
                        </div>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded border border-green-500/20">
                            Actif
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <div className="text-lg font-mono font-bold text-white leading-none">
                                {(activeChallenge?.current_equity || 0).toLocaleString('en-US')} DH
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capital Actuel</div>
                        </div>
                        <div className="h-8 w-px bg-white/5 mx-2" />
                        <div className="flex items-center gap-3">
                            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-white/20 flex items-center justify-center font-bold text-xs">
                                {user ? (user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()) : 'JD'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Chart Area - Center Stage */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
                    <div className="flex-1 bg-gray-900/30 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <TradingChart symbol={selectedSymbol} />
                    </div>

                    {/* Order Panel - Below the Chart */}
                    <div className="h-80 shrink-0">
                        <OrderPanel
                            symbol={selectedSymbol}
                            challengeId={activeChallenge?.id || null}
                            onTradeExecuted={handleTradeExecuted}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Right Sidebar - Insights & Position Tracking */}
            <RightSidebar symbol={selectedSymbol} challenge={activeChallenge} />

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
}
