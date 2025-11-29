"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitStoryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        authorName: "",
        email: "",
        storyContent: "",
        agreedToTerms: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreedToTerms) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);

        // In a real app, we would POST to /api/stories/submit here
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-primary-1 text-secondary-3 p-8 pt-24 flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-cairo font-bold text-accent mb-4">تم استلام قصتك</h1>
                <p className="text-xl mb-8">شكراً لمشاركتك كابوسك معنا. سنقوم بمراجعة القصة قريباً.</p>
                <Link href="/stories" className="bg-primary-2 text-secondary-3 px-6 py-3 rounded font-bold hover:bg-red-900 transition-colors">
                    العودة للقصص
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-1 text-secondary-3 p-8 pt-24">
            <div className="container mx-auto max-w-2xl">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-cairo font-bold text-accent">ارسل قصتك</h1>
                    <Link href="/stories" className="text-primary-2 hover:text-accent transition-colors font-bold">
                        &larr; العودة
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="bg-secondary-1 p-8 rounded-lg shadow-lg border border-secondary-2">
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2 text-accent">اسم الكاتب (أو اللقب)</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.authorName}
                            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2 text-accent">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2 text-accent">القصة كاملة</label>
                        <textarea
                            required
                            rows={10}
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3 resize-y"
                            value={formData.storyContent}
                            onChange={(e) => setFormData({ ...formData, storyContent: e.target.value })}
                            placeholder="اكتب تفاصيل الرعب هنا..."
                        />
                    </div>

                    <div className="mb-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                required
                                className="w-5 h-5 accent-primary-2"
                                checked={formData.agreedToTerms}
                                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                            />
                            <span className="text-sm opacity-80">
                                أوافق على شروط النشر وأن هذه القصة من تأليفي الشخصي وليست منقولة. أمنح "مملكة الظلام" حق نشرها وتعديلها.
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-2 text-secondary-3 py-4 rounded font-bold text-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "جاري الإرسال..." : "ارسل القصة"}
                    </button>
                </form>
            </div>
        </div>
    );
}
