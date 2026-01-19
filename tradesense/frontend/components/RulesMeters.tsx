"use client"

import React from 'react';

interface RulesMetersProps {
    status: string;
    targets: {
        daily_loss_pct: number;
        total_loss_pct: number;
        profit_target_pct: number;
    } | undefined;
    startBalance: number;
    currentEquity: number;
    dayStartEquity?: number; // Optional if we had it
}

export const RulesMeters: React.FC<RulesMetersProps> = ({ status, targets, startBalance, currentEquity }) => {
    // Basic calcs if targets logic is: "Did we cross the line?"
    // We need to know current drawdown.
    // For MVP Dashboard, we only have startBalance and currentEquity easily available
    // unless we pass more data. Let's approximate Total Drawdown and Profit.

    // Total PnL
    const totalPnL = currentEquity - startBalance;
    const totalPnLPct = (totalPnL / startBalance) * 100;

    // Total Loss Meter (Max 10%)
    // If PnL is negative, we show progress towards -10%. 
    // e.g. -5% means 50% filled towards failure.
    const totalLossProgress = totalPnLPct < 0 ? Math.min(100, (Math.abs(totalPnLPct) / 10) * 100) : 0;

    // Profit Target Meter (Goal 10%)
    const profitProgress = totalPnLPct > 0 ? Math.min(100, (totalPnLPct / 10) * 100) : 0;

    // Daily Loss is harder without day_start_equity. 
    // We will assume 0 for now or duplicate total for visual if data missing.
    // Ideally backend sends this.

    return (
        <div className="space-y-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase">Règles & Objectifs</h3>

            {/* Total Loss */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span>Perte Totale</span>
                    <span className={`${totalLossProgress > 80 ? 'text-red-500 font-bold' : 'text-slate-300'}`}>
                        {Math.abs(totalPnLPct).toFixed(2)}% / 10%
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${totalLossProgress > 80 ? 'bg-red-500' : 'bg-red-400'}`}
                        style={{ width: `${totalLossProgress}%` }}
                    />
                </div>
            </div>

            {/* Profit Target */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span>Objectif Profit</span>
                    <span className="text-emerald-400 font-bold">
                        {totalPnLPct > 0 ? totalPnLPct.toFixed(2) : '0.00'}% / 10%
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${profitProgress}%` }}
                    />
                </div>
            </div>

            <div className="text-[10px] text-slate-500">
                *Daily Loss info requires history endpoint (Not in MVP UI)
            </div>
        </div>
    );
};
