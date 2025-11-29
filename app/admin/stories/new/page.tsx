import StoryEditor from "@/components/AdminUI/StoryEditor.client";
import Link from "next/link";

export default function NewStoryPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent">إضافة قصة جديدة</h1>
                <Link href="/admin" className="bg-secondary-2 text-secondary-3 px-6 py-2 rounded hover:bg-secondary-3 hover:text-primary-1 transition-colors">
                    &larr; لوحة التحكم
                </Link>
            </div>
            <StoryEditor isNew />
        </div>
    );
}
