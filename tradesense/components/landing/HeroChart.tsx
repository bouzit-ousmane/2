"use client"

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const data = [
    { label: 'W1', value: 30 },
    { label: 'W2', value: 45 },
    { label: 'W3', value: 35 },
    { label: 'W4', value: 60 },
    { label: 'W5', value: 55 },
    { label: 'W6', value: 80 },
    { label: 'W7', value: 70 },
    { label: 'W8', value: 95 },
];

export function HeroChart() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Normalize values to fit SVG (0-100 height)
    const normalizedData = data.map((d, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - d.value,
        ...d
    }));

    // Generate Path
    const pathData = normalizedData.reduce((acc, curr, i) => {
        if (i === 0) return `M ${curr.x} ${curr.y}`;
        // Create smooth curves with cubic bezier
        const prev = normalizedData[i - 1];
        const cp1x = prev.x + (curr.x - prev.x) / 2;
        return `${acc} C ${cp1x} ${prev.y}, ${cp1x} ${curr.y}, ${curr.x} ${curr.y}`;
    }, "");

    const areaPath = `${pathData} L 100 100 L 0 100 Z`;

    return (
        <div className="w-full h-full flex flex-col pt-4" ref={containerRef}>
            <div className="relative flex-1 group">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-px bg-white/[0.05]" />
                    ))}
                </div>

                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-[0_0_25px_rgba(0,212,255,0.2)]"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#00d4ff" />
                            <stop offset="100%" stopColor="#00ff88" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        d={areaPath}
                        fill="url(#areaGradient)"
                        className="pointer-events-none"
                    />

                    {/* Main Line path */}
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d={pathData}
                        fill="none"
                        stroke="url(#chartGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Indicator markers */}
                    {normalizedData.map((d, i) => (
                        <motion.circle
                            key={i}
                            cx={d.x}
                            cy={d.y}
                            r="1"
                            fill="#0a0613"
                            stroke="#ec4899"
                            strokeWidth="0.5"
                            initial={{ scale: 0 }}
                            animate={{ scale: hoveredIndex === i ? 2.5 : 0 }}
                            className="pointer-events-none"
                        />
                    ))}

                    {/* Interactive overlay points */}
                    {normalizedData.map((d, i) => (
                        <rect
                            key={`hitbox-${i}`}
                            x={d.x - 5}
                            y={0}
                            width="10"
                            height="100"
                            fill="transparent"
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="cursor-pointer"
                        />
                    ))}
                </svg>

                {/* Tooltip */}
                {hoveredIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute pointer-events-none bg-[#0a0613]/90 border border-violet-500/30 backdrop-blur-md rounded-lg p-2 px-3 shadow-2xl z-50 text-[10px]"
                        style={{
                            left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                            top: `${100 - data[hoveredIndex].value}%`,
                            transform: 'translate(-50%, -130%)'
                        }}
                    >
                        <div className="font-bold text-violet-400">{data[hoveredIndex].label}</div>
                        <div className="text-white font-mono">Profit: +{data[hoveredIndex].value}%</div>
                    </motion.div>
                )}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between mt-2 px-1">
                {data.map((d, i) => (
                    <span key={i} className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                        {d.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
