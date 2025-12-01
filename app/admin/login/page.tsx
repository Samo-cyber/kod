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
                        className="group relative w-full py-4 overflow-hidden rounded-sm transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Background & Border */}
                        <div className="absolute inset-0 bg-black/60 border border-red-900/60 group-hover:bg-red-950/40 group-hover:border-red-600 transition-all duration-500 shadow-[0_0_20px_rgba(138,0,20,0.3)] group-hover:shadow-[0_0_40px_rgba(220,20,60,0.6)]" />

                        {/* Glitch/Blood Effect Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,#ff0000_0%,transparent_70%)] mix-blend-overlay transition-opacity duration-300" />

                        {/* Text */}
                        <span className="relative z-10 font-cairo text-xl font-bold text-gray-200 tracking-widest group-hover:text-red-100 group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] transition-all duration-300">
                            {loading ? "جاري الدخول..." : "دخول"}
                        </span>

                        {/* Animated Borders */}
                        <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out" />
                    </button>
                </form>
            </div>
        </div>
    );
}
