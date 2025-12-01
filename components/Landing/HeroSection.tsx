"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-primary-1 flex items-center justify-center">
            {/* Logo */}
            <div className="absolute top-10 left-10 z-50">
                <Image
                    src="/logo.png"
                    alt="Kingdom of Darkness Logo"
                    width={100}
                    height={100}
                    className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
            </div>
            {/* Parallax Background Layers */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
                <Image
                    src="/background.gif"
                    alt="Background"
                    fill
                    className="object-cover opacity-30 grayscale contrast-125"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-1/50 via-transparent to-primary-1" />
            </motion.div>

            {/* Fog Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-primary-1/20 to-transparent opacity-20 animate-pulse pointer-events-none mix-blend-overlay" />

            {/* Content */}
            <motion.div
                style={{ y: y2, opacity }}
                className="relative z-20 text-center px-4 flex flex-col items-center justify-center h-full"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-12"
                >
                    <div className="relative w-[300px] h-[150px] md:w-[600px] md:h-[300px]">
                        <Image
                            src="/hero-title.png"
                            alt="مملكة الظلام"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(138,0,20,0.6)]"
                            priority
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <Link
                        href="/stories"
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
                            className="relative px-20 py-8 bg-black transition-all duration-300 group-hover:bg-red-950/30"
                            style={{
                                clipPath: "polygon(20% 0%, 80% 0%, 100% 30%, 85% 100%, 15% 100%, 0% 30%)",
                            }}
                        >
                            {/* Text */}
                            <span className="relative z-10 font-cairo text-2xl md:text-3xl font-bold text-gray-300 tracking-widest group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                                أدخل.. إن تجرأت
                            </span>

                            {/* Inner Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent opacity-50" />
                        </div>
                    </Link>
                </motion.div>
            </motion.div>

            {/* Vignette */}
            <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0E_100%)] opacity-90" />
        </section>
    );
}
