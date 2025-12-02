"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface LikeButtonProps {
    storyId: string;
}

export default function LikeButton({ storyId }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/stories/${storyId}/like`)
            .then((res) => res.json())
            .then((data) => {
                setLikes(data.count);
                setHasLiked(data.hasLiked);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [storyId]);

    const handleLike = async () => {
        // Optimistic update
        const newHasLiked = !hasLiked;
        setHasLiked(newHasLiked);
        setLikes((prev) => (newHasLiked ? prev + 1 : prev - 1));

        try {
            const res = await fetch(`/api/stories/${storyId}/like`, {
                method: "POST",
            });
            const data = await res.json();
            setLikes(data.count);
            setHasLiked(data.hasLiked);
        } catch (error) {
            console.error("Error liking story:", error);
            // Revert on error
            setHasLiked(!newHasLiked);
            setLikes((prev) => (!newHasLiked ? prev + 1 : prev - 1));
        }
    };

    if (loading) return <div className="h-10 w-24 bg-secondary-2/20 animate-pulse rounded-full" />;

    return (
        <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border ${hasLiked
                    ? "bg-primary-2/20 border-primary-2 text-primary-2"
                    : "bg-secondary-1 border-secondary-2 text-secondary-3 hover:border-accent hover:text-accent"
                }`}
        >
            <motion.span
                initial={false}
                animate={{ scale: hasLiked ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                {hasLiked ? "❤️" : "🤍"}
            </motion.span>
            <span className="font-bold font-cairo">{likes}</span>
        </button>
    );
}
