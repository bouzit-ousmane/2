'use client';

import React, { useEffect, useState } from 'react';

/**
 * A hydration-safe number formatter.
 * Ensures consistent formatting between server and client by forcing a specific locale (default en-US).
 */
export function SafeNumber({
    value,
    defaultValue = 0,
    format = 'en-US',
    minimumFractionDigits = 2
}: {
    value: number | undefined | null;
    defaultValue?: number;
    format?: string;
    minimumFractionDigits?: number;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const safeValue = value ?? defaultValue;

    // Before mounting, we can't be sure about the locale if we used 'undefined'.
    // But by forcing 'en-US', we should be safe. 
    // Still, using a mount check for extreme safety with SSR.
    const formatted = safeValue.toLocaleString(format, { minimumFractionDigits });

    if (!isMounted) {
        // Return a simple span with the formatted value to match initial SSR
        return <span className="font-mono">{formatted}</span>;
    }

    return (
        <span className="font-mono">
            {formatted}
        </span>
    );
}
