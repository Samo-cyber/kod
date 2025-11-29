"use client";

import { useEffect, useState, useRef } from "react";

export default function AudioManager() {
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);
    const clickSoundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio objects
        bgMusicRef.current = new Audio("/sounds/background.mp3");
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3; // Lower volume for background

        clickSoundRef.current = new Audio("/sounds/click.mp3");
        clickSoundRef.current.volume = 0.5;

        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                if (bgMusicRef.current && !isMuted) {
                    bgMusicRef.current.play().catch((e) => console.log("Audio play failed:", e));
                }
            }
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Play click sound if clicking a button, link, or interactive element
            if (target.closest("button") || target.closest("a") || target.getAttribute("role") === "button") {
                if (clickSoundRef.current && !isMuted) {
                    // Clone node to allow overlapping sounds
                    const sound = clickSoundRef.current.cloneNode() as HTMLAudioElement;
                    sound.volume = 0.5;
                    sound.play().catch(() => { });
                }
            }
        };

        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        window.addEventListener("click", handleClick);

        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("click", handleClick);
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current = null;
            }
        };
    }, [hasInteracted, isMuted]);

    useEffect(() => {
        if (bgMusicRef.current) {
            if (isMuted) {
                bgMusicRef.current.pause();
            } else if (hasInteracted) {
                bgMusicRef.current.play().catch(() => { });
            }
        }
    }, [isMuted, hasInteracted]);

    return (
        <div className="fixed bottom-4 right-4 z-[100]">
            <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-black/50 hover:bg-black/80 text-primary-2 border border-primary-2 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
                aria-label={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
