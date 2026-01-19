import { TrendingUp, TrendingDown, MoreVertical, Briefcase } from 'lucide-react';

export function PositionsTable({ challenge }: { challenge?: any }) {
    const positions = challenge?.trades || [];

    return (
        <div className="bg-gray-900/50 rounded-xl p-4 border border-white/10 shadow-lg backdrop-blur-md relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Positions Ouvertes ({positions.length})</h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Live</span>
            </div>

            <div className="overflow-x-auto custom-scrollbar min-h-[100px]">
                {positions.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="pb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Symbole</th>
                                <th className="pb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                                <th className="pb-2 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">P&L</th>
                                <th className="pb-2 w-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {positions.map((pos: any, idx: number) => (
                                <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-3">
                                        <div className="font-bold text-gray-200">{pos.symbol}</div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center">
                                            {pos.side === 'BUY' ?
                                                <TrendingUp className="h-3 w-3 text-green-500 mr-1.5" /> :
                                                <TrendingDown className="h-3 w-3 text-red-500 mr-1.5" />
                                            }
                                            <span className={`text-[11px] font-black ${pos.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>{pos.side}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className={`font-bold ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {pos.pnl >= 0 ? '+' : ''}{(pos.pnl || 0).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <button className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                                            <MoreVertical className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Briefcase className="h-8 w-8 text-gray-600 mb-3" />
                        <p className="text-gray-500 text-xs font-medium">Aucune position ouverte</p>
                    </div>
                )}
            </div>

            {/* Summary */}
            {positions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">P&L Total:</span>
                        <span className={`font-bold text-lg ${positions.reduce((acc: any, p: any) => acc + (p.pnl || 0), 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {positions.reduce((acc: any, p: any) => acc + (p.pnl || 0), 0).toFixed(2)} DH
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
