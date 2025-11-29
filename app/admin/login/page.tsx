"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email: username, // Assuming username is email for Supabase
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.push("/admin");
            router.refresh();
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
                        className="w-full py-3 bg-primary-2 hover:bg-red-900 text-white font-bold rounded transition-colors"
                    >
                        دخول
                    </button>
                </form>
            </div>
        </div>
    );
}
