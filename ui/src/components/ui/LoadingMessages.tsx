"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import _ from "lodash";

export default function LoadingMessages({ messages, className }: { messages: string[], className?: string }) {
    const [index, setIndex] = useState(0);
    const shuffledMessages = useMemo(() => _.shuffle(messages), [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={className && className}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="shimmer-text font-semibold"
                >
                    {shuffledMessages[index]}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
