"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StoryEditorProps {
    initialData?: any;
    isNew?: boolean;
}

export default function StoryEditor({ initialData, isNew = false }: StoryEditorProps) {
    const router = useRouter();
    const [formData, setFormData] = useState(initialData || {
        title_ar: "",
        title_en: "",
        slug: "",
        excerpt_ar: "",
        body_markdown_ar: "",
        cover_image: "",
        status: "draft",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const url = isNew ? "/api/admin/stories" : `/api/admin/stories/${initialData.id}`;
        const method = isNew ? "POST" : "PUT";

        // Auto-generate HTML from markdown (simple replace for now, real app needs parser)
        const body_html_ar = formData.body_markdown_ar
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/\n/gim, '<br />');

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, body_html_ar }),
            });

            if (res.ok) {
                router.push("/admin");
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "حدث خطأ أثناء الحفظ");
                console.error("Submission Error:", data);
            }
        } catch (error) {
            console.error(error);
            alert("حدث خطأ في الاتصال");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-secondary-1 p-8 rounded-lg shadow-lg border border-secondary-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-bold mb-2 text-accent">العنوان (عربي)</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                        value={formData.title_ar}
                        onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                <div>
                    <label className="block text-sm font-bold mb-2 text-accent">صورة الغلاف</label>
                    <div className="relative">
                        {formData.cover_image ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden group border border-secondary-2">
                                <img
                                    src={formData.cover_image}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, cover_image: "" })}
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
                                                const res = await fetch("/api/admin/upload", {
                                                    method: "POST",
                                                    body: data,
                                                });
                                                if (!res.ok) throw new Error("Upload failed");
                                                const json = await res.json();
                                                setFormData({ ...formData, cover_image: json.url });
                                            } catch (err) {
                                                console.error(err);
                                                alert("فشل رفع الصورة");
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
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-accent">مقتطف قصير</label>
                <textarea
                    required
                    rows={3}
                    className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                    value={formData.excerpt_ar}
                    onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-accent">محتوى القصة (Markdown)</label>
                <textarea
                    required
                    rows={15}
                    className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3 font-mono"
                    value={formData.body_markdown_ar}
                    onChange={(e) => setFormData({ ...formData, body_markdown_ar: e.target.value })}
                />
            </div>

            <div className="mb-8">
                <label className="block text-sm font-bold mb-2 text-accent">الحالة</label>
                <select
                    className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                    <option value="archived">مؤرشف</option>
                </select>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded text-secondary-3 hover:bg-secondary-2 transition-colors"
                >
                    إلغاء
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary-2 text-secondary-3 px-8 py-3 rounded font-bold hover:bg-red-900 transition-colors disabled:opacity-50"
                >
                    {isSaving ? "جاري الحفظ..." : "حفظ القصة"}
                </button>
            </div>
        </form>
    );
}
