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
                        className="group relative px-16 py-6 overflow-hidden rounded-sm transition-all duration-500 hover:scale-105"
                    >
                        {/* Background & Border */}
                        <div className="absolute inset-0 bg-black/60 border border-red-900/60 group-hover:bg-red-950/40 group-hover:border-red-600 transition-all duration-500 shadow-[0_0_20px_rgba(138,0,20,0.3)] group-hover:shadow-[0_0_40px_rgba(220,20,60,0.6)]" />

                        {/* Glitch/Blood Effect Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,#ff0000_0%,transparent_70%)] mix-blend-overlay transition-opacity duration-300" />

                        {/* Text */}
                        <span className="relative z-10 font-cairo text-2xl md:text-3xl font-bold text-gray-200 tracking-widest group-hover:text-red-100 group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                            أدخل.. إن تجرأت
                        </span>

                        {/* Animated Borders */}
                        <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out" />
                    </Link>
                </motion.div>
            </motion.div>

            {/* Vignette */}
            <div className="absolute inset-0 z-30 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0E_100%)] opacity-90" />
        </section>
    );
}
