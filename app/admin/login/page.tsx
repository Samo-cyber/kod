"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Attempting login...");
            const { createClient } = await import("@/utils/supabase/client");
            const supabase = createClient();

            // Allow login with username "admin" by appending domain
            const email = username.includes("@") ? username : `${username}@kod.com`;

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error);
                setError(error.message);
            } else {
                console.log("Login successful, redirecting...");
                router.refresh();
                router.push("/admin");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-1">
            <div className="w-full max-w-md p-8 bg-secondary-1 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-secondary-2">
                <h1 className="text-3xl font-bold text-center mb-8 text-accent font-cairo">تسجيل الدخول</h1>

                {error && (
                    <div className="bg-primary-2/20 border border-primary-2 text-primary-2 p-3 rounded mb-6 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-secondary-3">اسم المستخدم</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3 placeholder-secondary-3/30"
                            dir="ltr"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-secondary-3">كلمة المرور</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3 placeholder-secondary-3/30"
                            dir="ltr"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full inline-block focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                            className="relative py-4 bg-black transition-all duration-300 group-hover:bg-red-950/30"
                            style={{
                                clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)",
                            }}
                        >
                            {/* Text */}
                            <span className="relative z-10 font-cairo text-xl font-bold text-gray-300 tracking-widest group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                                {loading ? "جاري الدخول..." : "دخول"}
                            </span>

                            {/* Inner Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-transparent opacity-50" />
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
}
