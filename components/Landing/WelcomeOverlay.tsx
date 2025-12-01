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
                            className="group relative px-12 py-4 overflow-hidden rounded-sm transition-all duration-500 hover:scale-105"
                        >
                            {/* Background & Border */}
                            <div className="absolute inset-0 bg-black/60 border border-red-900/60 group-hover:bg-red-950/40 group-hover:border-red-600 transition-all duration-500 shadow-[0_0_20px_rgba(138,0,20,0.3)] group-hover:shadow-[0_0_40px_rgba(220,20,60,0.6)]" />

                            {/* Glitch/Blood Effect Overlay */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,#ff0000_0%,transparent_70%)] mix-blend-overlay transition-opacity duration-300" />

                            {/* Text */}
                            <span className="relative z-10 font-cairo text-2xl font-bold text-gray-200 tracking-widest group-hover:text-red-100 group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                                أدخل إذا كنت تجرؤ
                            </span>

                            {/* Animated Borders */}
                            <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                            <span className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out" />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
