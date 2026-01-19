'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradingChartProps {
    symbol: string;
}

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export default function TradingChart({ symbol }: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    // Générer des données mock pour le chart
    const generateMockData = (): CandleData[] => {
        const data: CandleData[] = [];
        let price = symbol.includes('BTC') ? 95000 : symbol.includes('AAPL') ? 185 : 125;

        for (let i = 0; i < 50; i++) {
            const d = new Date(Date.now() - (50 - i) * 24 * 60 * 60 * 1000);
            const time = d.toISOString().split('T')[0];
            const open = price;
            const close = price + (Math.random() - 0.5) * price * 0.02;
            const high = Math.max(open, close) + Math.random() * price * 0.01;
            const low = Math.min(open, close) - Math.random() * price * 0.01;

            data.push({
                time,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
            });

            price = close;
        }

        return data;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        setIsLoading(true);

        // Nettoyer le chart existant PROPERLY
        if (chartRef.current) {
            try {
                chartRef.current.remove();
            } catch (e) {
                // Ignore si déjà disposed
                console.log('Chart already disposed during cleanup');
            }
            chartRef.current = null;
            seriesRef.current = null;
        }

        // Créer un nouveau chart
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 500,
            layout: {
                background: { type: ColorType.Solid, color: '#0a0613' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: '#1a0f2e' },
                horzLines: { color: '#1a0f2e' },
            },
            rightPriceScale: {
                borderColor: '#1a0f2e',
            },
            timeScale: {
                borderColor: '#1a0f2e',
                timeVisible: true,
                secondsVisible: false,
            },
            crosshair: {
                mode: 1,
            },
        });

        // Ajouter la série candlestick
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        // Configurer les données
        const chartData = generateMockData();
        candlestickSeries.setData(chartData);

        // Stocker les références
        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // Gérer le resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                try {
                    chartRef.current.applyOptions({
                        width: chartContainerRef.current.clientWidth,
                    });
                } catch (e) {
                    console.log('Error resizing chart:', e);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        setIsLoading(false);

        // Cleanup function - CRITIQUE!
        return () => {
            window.removeEventListener('resize', handleResize);

            if (chartRef.current) {
                try {
                    chartRef.current.remove();
                } catch (e) {
                    // Ignore les erreurs de disposal
                    console.log('Chart disposal error (normal):', e);
                }
                chartRef.current = null;
            }

            seriesRef.current = null;
        };
    }, [symbol]); // Re-créer le chart quand le symbole change

    return (
        <div className="h-full flex flex-col">
            {/* Chart Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold">{symbol}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Chandeliers Japonais</span>
                        <span>•</span>
                        <span>15m</span>
                        <span>•</span>
                        <span>Temps Réel</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm">1H</button>
                    <button className="px-3 py-1 bg-violet-600 rounded-lg text-sm">4H</button>
                    <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm">1D</button>
                    <button className="px-3 py-1 bg-gray-800 rounded-lg text-sm">1W</button>
                </div>
            </div>

            {/* Chart Container */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                    </div>
                )}
                <div
                    ref={chartContainerRef}
                    className="h-full w-full rounded-xl overflow-hidden"
                />
            </div>

            {/* Chart Footer */}
            <div className="mt-4 text-sm text-gray-400">
                <div className="flex justify-between">
                    <span>O: <span className="text-white">95,000.00</span></span>
                    <span>H: <span className="text-white">95,500.00</span></span>
                    <span>L: <span className="text-white">94,800.00</span></span>
                    <span>C: <span className="text-white">95,046.00</span></span>
                    <span>Volume: <span className="text-white">1.2M</span></span>
                </div>
            </div>
        </div>
    );
}
