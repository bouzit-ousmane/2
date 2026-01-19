
import { PieChart, List, DollarSign, TrendingUp } from 'lucide-react';

export function Portfolio({ challenge }: { challenge?: any }) {
    const trades = challenge?.trades || [];

    // Group trades by symbol to show current holdings
    const holdings = trades.reduce((acc: any, trade: any) => {
        const sym = trade.symbol;
        if (!acc[sym]) {
            acc[sym] = { symbol: sym, quantity: 0, total_cost: 0, current_price: trade.price };
        }

        if (trade.side === 'BUY') {
            acc[sym].quantity += trade.quantity;
            acc[sym].total_cost += (trade.quantity * trade.price);
        } else {
            acc[sym].quantity -= trade.quantity;
            // Simplified: if selling, we reduce the cost basis proportionally
            // In a real app we'd track lots, but for MVP let's just show net holdings
        }

        acc[sym].current_price = trade.price; // Use latest trade price as current price for now
        return acc;
    }, {});

    const holdingList = Object.values(holdings).filter((h: any) => h.quantity > 0);

    return (
        <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/20 rounded-lg">
                        <PieChart className="h-5 w-5 text-violet-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">MON PORTEFEUILLE</h3>
                </div>
                <div className="text-[10px] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest">
                    {holdingList.length} Actifs
                </div>
            </div>

            <div className="space-y-4">
                {holdingList.length > 0 ? (
                    holdingList.map((h: any, i: number) => {
                        const avgPrice = h.total_cost / h.quantity;
                        const value = h.quantity * h.current_price;
                        const pnl = value - h.total_cost;
                        const pnlPct = (pnl / h.total_cost) * 100;

                        return (
                            <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-black text-lg text-white group-hover:text-violet-400 transition-colors">{h.symbol}</div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{h.quantity} UNITÉS</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-white">{value.toFixed(2)} DH</div>
                                        <div className={`text-[10px] font-black uppercase ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPct.toFixed(2)}%)
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, Math.abs(pnlPct) * 5)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <List className="h-8 w-8 text-gray-600" />
                        </div>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Aucun actif en portefeuille</p>
                        <p className="text-[10px] text-gray-600 mt-2">Commencez à trader pour voir vos actifs ici.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
