"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOverlay() {
    const [isVisible, setIsVisible] = useState(true);

    const handleEnter = () => {
        setIsVisible(false);
        // The click itself will trigger the AudioManager's listener on the window
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl w-full space-y-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-[#8a0014] drop-shadow-[0_0_30px_rgba(138,0,20,0.8)] font-cairo">
                            تحذير
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-cairo leading-relaxed">
                            هذا الموقع يحتوي على أصوات ومؤثرات مرعبة.
                            <br />
                            ينصح بارتداء سماعات الرأس لتجربة كاملة.
                        </p>

                        <button
                            onClick={handleEnter}
                            className="group relative inline-block focus:outline-none"
                        >
                            {/* Glow/Border Layer */}
                            <div
                                className="absolute inset-0 bg-red-900 transition-all duration-300 group-hover:bg-red-600 blur-[2px] opacity-70 group-hover:opacity-100 group-hover:blur-[4px]"
                                style={{
                                    clipPath: "polygon(20% 0%, 80% 0%, 100% 30%, 85% 100%, 15% 100%, 0% 30%)",
                                    transform: "scale(1.02)"
                                }}
                            />

                            {/* Main Button Layer */}
                            <div
                                className="relative px-16 py-6 bg-black transition-all duration-300 group-hover:bg-red-950/30"
                                style={{
                                    clipPath: "polygon(20% 0%, 80% 0%, 100% 30%, 85% 100%, 15% 100%, 0% 30%)",
                                }}
                            >
                                {/* Text */}
                                <span className="relative z-10 font-cairo text-2xl font-bold text-gray-300 tracking-widest group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                                    أدخل إذا كنت تجرؤ
                                </span>

                                {/* Inner Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent opacity-50" />
                            </div>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
