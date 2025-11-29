"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Story } from "@/lib/db";

interface FeaturedStoriesProps {
    stories: Story[];
}

export default function FeaturedStories({ stories }: FeaturedStoriesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <section ref={containerRef} className="py-32 bg-primary-1 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-16 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-cairo font-black text-accent mb-4"
                >
                    أحدث الكوابيس
                </motion.h2>
                <div className="h-1 w-32 bg-primary-2" />
            </div>

            <motion.div style={{ x }} className="flex gap-8 px-4 w-max">
                {stories.map((story, index) => (
                    <StoryCard key={story.id} story={story} index={index} />
                ))}
            </motion.div>
        </section>
    );
}

function StoryCard({ story, index }: { story: Story; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateY: 5, zIndex: 10 }}
            className="relative w-[300px] md:w-[400px] h-[500px] rounded-lg overflow-hidden cursor-pointer group perspective-1000"
        >
            <Link href={`/story/${story.slug}`} className="block w-full h-full">
                <Image
                    src={story.cover_image}
                    alt={story.title_ar}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-secondary-3 mb-2 font-cairo">{story.title_ar}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 font-changa">{story.excerpt_ar}</p>
                    <span className="inline-block mt-4 text-primary-2 font-bold text-sm tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        اقرأ الآن &larr;
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}
