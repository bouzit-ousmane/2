'use client';

import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const symbols = [
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 95046.00, change: -0.50, category: 'Crypto' },
    { symbol: 'AAPL', name: 'Apple', price: 185.00, change: 1.20, category: 'US Stocks' },
    { symbol: 'TSLA', name: 'Tesla', price: 175.50, change: -2.30, category: 'US Stocks' },
    { symbol: 'GOOGL', name: 'Google', price: 150.25, change: 0.80, category: 'US Stocks' },
    { symbol: 'MSFT', name: 'Microsoft', price: 415.75, change: 1.50, category: 'US Stocks' },
    { symbol: 'IAM', name: 'Maroc Telecom', price: 125.50, change: 0.40, category: 'Maroc' },
    { symbol: 'ATW', name: 'Attijariwafa Bank', price: 480.25, change: -0.30, category: 'Maroc' },
    { symbol: 'META', name: 'Meta', price: 485.00, change: 2.10, category: 'US Stocks' },
    { symbol: 'NVDA', name: 'NVIDIA', price: 950.00, change: 5.30, category: 'US Stocks' },
    { symbol: 'AMZN', name: 'Amazon', price: 178.50, change: 0.90, category: 'US Stocks' },
];

export function SymbolsSidebar({ onSymbolSelect }: { onSymbolSelect?: (symbol: string) => void }) {
    const [search, setSearch] = useState('');
    const [favorites, setFavorites] = useState(['BTC-USD', 'AAPL', 'IAM']);

    const filteredSymbols = symbols.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-80 border-r border-white/10 bg-gray-900/50 h-full overflow-y-auto">
            <div className="p-4 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher une action..."
                        className="pl-10 bg-gray-800 border-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2 fill-yellow-500 text-yellow-500" />
                    Favoris
                </h3>
                {symbols.filter(s => favorites.includes(s.symbol)).map((symbol) => (
                    <SymbolRow
                        key={symbol.symbol}
                        symbol={symbol}
                        isFavorite={true}
                        onSelect={() => onSymbolSelect?.(symbol.symbol)}
                    />
                ))}
            </div>

            {['Crypto', 'US Stocks', 'Maroc', 'Forex', 'Indices'].map((category) => {
                const categorySymbols = filteredSymbols.filter(s => s.category === category);
                if (categorySymbols.length === 0) return null;

                return (
                    <div key={category} className="p-4 border-t border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">{category}</h3>
                        {categorySymbols.map((symbol) => (
                            <SymbolRow
                                key={symbol.symbol}
                                symbol={symbol}
                                isFavorite={favorites.includes(symbol.symbol)}
                                onSelect={() => onSymbolSelect?.(symbol.symbol)}
                                onToggleFavorite={(e: any) => {
                                    e.stopPropagation();
                                    setFavorites(prev =>
                                        prev.includes(symbol.symbol)
                                            ? prev.filter(s => s !== symbol.symbol)
                                            : [...prev, symbol.symbol]
                                    );
                                }}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

function SymbolRow({ symbol, isFavorite, onToggleFavorite, onSelect }: any) {
    return (
        <div
            onClick={onSelect}
            className="flex items-center justify-between py-2 px-1 hover:bg-white/5 rounded-lg cursor-pointer group"
        >
            <div className="flex items-center">
                <button
                    onClick={onToggleFavorite}
                    className={`p-1 mr-2 transition-opacity ${isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <Star className={`h-3 w-3 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-500'}`} />
                </button>
                <div>
                    <div className="font-medium text-white">{symbol.symbol}</div>
                    <div className="text-xs text-gray-400">{symbol.name}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-mono text-sm text-gray-200">${symbol?.price?.toFixed(2) || '0.00'}</div>
                <div className={`text-xs ${symbol.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {symbol.change >= 0 ? '+' : ''}{symbol.change}%
                </div>
            </div>
        </div>
    );
}
