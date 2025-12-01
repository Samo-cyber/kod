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
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-center p-4 overflow-hidden"
                >
                    {/* Background Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)] z-0 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0 pointer-events-none mix-blend-overlay" />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="max-w-2xl w-full space-y-10 relative z-10"
                    >
                        <div className="space-y-4">
                            <h1 className="text-6xl md:text-8xl font-black text-[#8a0014] drop-shadow-[0_0_50px_rgba(138,0,20,0.6)] font-changa animate-pulse">
                                ! تحذير !
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-400 font-cairo leading-relaxed max-w-2xl mx-auto px-4">
                                المحتوى المعروض قد يسبب <span className="text-red-700 font-bold">الكوابيس</span>.
                                ينصح بارتداء سماعات الرأس لتجربة مرعبة بالكامل.
                            </p>
                        </div>

                        <button
                            onClick={handleEnter}
                            className="group relative inline-block focus:outline-none mt-8"
                        >
                            {/* Glow/Border Layer */}
                            <div
                                className="absolute inset-0 bg-red-900 transition-all duration-300 group-hover:bg-red-600 blur-[2px] opacity-70 group-hover:opacity-100 group-hover:blur-[4px]"
                                style={{
                                    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                                    transform: "scale(1.02)"
                                }}
                            />

                            {/* Main Button Layer */}
                            <div
                                className="relative px-16 py-4 bg-black transition-all duration-300 group-hover:bg-red-950/30"
                                style={{
                                    clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                                }}
                            >
                                {/* Text */}
                                <span className="relative z-10 font-cairo text-xl font-bold text-gray-300 tracking-widest group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                                    أتحمل المسؤولية
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
