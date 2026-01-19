'use client';

import { AccountStats } from './AccountStats';
import { ChallengeRules } from './ChallengeRules';
import { AISignals } from './AISignals';
import { PositionsTable } from './PositionsTable';
import { Portfolio } from './Portfolio';

export function RightSidebar({ symbol, challenge }: { symbol?: string, challenge?: any }) {
    return (
        <div className="w-[400px] border-l border-white/10 bg-gray-900/50 h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
                <AccountStats challenge={challenge} />
                <Portfolio challenge={challenge} />
                <ChallengeRules />
                <AISignals symbol={symbol} />

                {/* Positions Ouvertes déplacée ICI */}
                <div className="mt-8">
                    <PositionsTable challenge={challenge} />
                </div>
            </div>
        </div>
    );
}
