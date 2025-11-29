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
                            className="group relative inline-flex items-center justify-center px-12 py-4 text-2xl font-bold text-white transition-all duration-300 bg-[#8a0014] hover:bg-[#b3001b] hover:scale-105 hover:shadow-[0_0_50px_rgba(180,0,30,0.8)]"
                            style={{
                                clipPath: "polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)",
                            }}
                        >
                            <span className="relative z-10 font-cairo">أدخل إذا كنت تجرؤ</span>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
