"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";

export default function ImmersiveFooter() {
    return (
        <footer className="relative bg-black text-secondary-3 py-20 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fog.png')] opacity-10 animate-pulse pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div>
                        <h3 className="text-2xl font-bold font-cairo mb-6 text-primary-2">مملكة الظلام</h3>
                        <p className="text-gray-400 font-changa leading-loose">
                            منصة الرعب الأولى في العالم العربي. قصص حقيقية، خيالية، وكوابيس لا تنتهي.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-cairo mb-6">روابط سريعة</h3>
                        <ul className="space-y-4 font-changa">
                            <li><Link href="/stories" className="hover:text-primary-2 transition-colors">القصص</Link></li>
                            <li><Link href="/about" className="hover:text-primary-2 transition-colors">عن الموقع</Link></li>
                            <li><Link href="/submit" className="hover:text-primary-2 transition-colors">أرسل قصتك</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold font-cairo mb-6">تواصل معنا</h3>
                        <div className="flex gap-6">
                            <SocialIcon icon={<Twitter size={24} />} href="#" />
                            <SocialIcon icon={<Instagram size={24} />} href="#" />
                            <SocialIcon icon={<Github size={24} />} href="#" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 font-changa">
                    <p>&copy; {new Date().getFullYear()} مملكة الظلام. جميع الحقوق محفوظة... في الجحيم.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.2, color: "#8A0014" }}
            className="bg-secondary-2 p-3 rounded-full text-white transition-colors"
        >
            {icon}
        </motion.a>
    );
}
