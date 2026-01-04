"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
    text: string;
    speed?: number; // ms per char
    onComplete?: () => void;
    className?: string;
}

export function Typewriter({ text, speed = 20, onComplete, className }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let index = 0;
        setDisplayedText(""); // Reset on text change

        if (!text) return;

        const interval = setInterval(() => {
            index++;
            setDisplayedText((prev) => text.slice(0, index));

            if (index >= text.length) {
                clearInterval(interval);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={className}
        >
            {displayedText}
            <span className="animate-pulse inline-block w-1.5 h-4 ml-1 bg-indigo-500 align-middle"></span>
        </motion.div>
    );
}
