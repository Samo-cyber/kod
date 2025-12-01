"use client";

import Image from "next/image";
import styles from "./StoryCard.module.scss";

interface StoryCardProps {
    title: string;
    excerpt: string;
    image: string;
    slug: string;
}

export default function StoryCard({ title, excerpt, image, slug }: StoryCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.crackLine} />
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        width={400}
                        height={225}
                        className={styles.image}
                    />
                ) : (
                    <div className="w-full h-full bg-secondary-2 flex items-center justify-center text-accent">
                        <span className="text-4xl">?</span>
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <h3 className="font-cairo font-bold text-xl text-secondary-3 mb-2">{title}</h3>
                <p className="font-inter text-sm text-secondary-3 opacity-70 line-clamp-3">{excerpt}</p>
            </div>
        </div>
    );
}
