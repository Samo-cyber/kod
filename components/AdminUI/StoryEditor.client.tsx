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
            < form onSubmit = { handleSubmit } className = "bg-secondary-1 p-8 rounded-lg shadow-lg border border-secondary-2" >
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
                    <div>
                        <label className="block text-sm font-bold mb-2 text-accent">العنوان (إنجليزي - اختياري)</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.title_en || ""}
                            onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                            dir="ltr"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-accent">الرابط (Slug)</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-accent">صورة الغلاف (رابط)</label>
                        <input
                            type="text"
                            required
                            className="w-full p-3 bg-secondary-2 border border-secondary-2 rounded focus:border-accent focus:outline-none text-secondary-3"
                            value={formData.cover_image}
                            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                            dir="ltr"
                        />
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
            </form >
        );
}
