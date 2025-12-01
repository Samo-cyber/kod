"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitStoryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        authorName: "",
        email: "",
        storyContent: "",
        agreedToTerms: false,
        coverImage: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreedToTerms) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/stories/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.storyContent,
                    author: formData.authorName,
                    email: formData.email,
                    cover_image: formData.coverImage
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setIsSubmitting(false);
        }
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
                        <label className="block text-sm font-bold mb-2 text-accent">عنوان القصة</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="اختر عنواناً مرعباً..."
                        />
                    </div>

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
                        <label className="block text-sm font-bold mb-2 text-accent">صورة الغلاف (اختياري)</label>
                        <div className="relative">
                            {formData.coverImage ? (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-secondary-2">
                                    <img
                                        src={formData.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, coverImage: "" })}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <label
                                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isUploading
                                            ? "border-accent bg-secondary-1"
                                            : "border-secondary-3 hover:border-accent hover:bg-secondary-1"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {isUploading ? (
                                                <div className="text-accent">جاري الرفع...</div>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-4 text-secondary-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-secondary-3"><span className="font-semibold">اضغط للرفع</span> أو اسحب الصورة هنا</p>
                                                    <p className="text-xs text-secondary-3 opacity-70">PNG, JPG or WEBP</p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            disabled={isUploading}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;

                                                setIsUploading(true);
                                                const data = new FormData();
                                                data.append("file", file);

                                                try {
                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: data,
                                                    });
                                                    if (!res.ok) throw new Error("Upload failed");
                                                    const json = await res.json();
                                                    setFormData({ ...formData, coverImage: json.url });
                                                } catch (err: any) {
                                                    console.error(err);
                                                    alert(err.message || "فشل رفع الصورة");
                                                } finally {
                                                    setIsUploading(false);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
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
