import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import StoryEditor from "@/components/AdminUI/StoryEditor.client";

interface PageProps {
    params: {
        id: string;
    };
}

async function getStory(id: string) {
    await db.connect();
    return db.getStoryById(id);
}

export default async function EditStoryPage({ params }: PageProps) {
    const story = await getStory(params.id);

    if (!story) {
        notFound();
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent">تعديل القصة</h1>
                <Link href="/admin" className="bg-secondary-2 text-secondary-3 px-6 py-2 rounded hover:bg-secondary-3 hover:text-primary-1 transition-colors">
                    &larr; لوحة التحكم
                </Link>
            </div>
            <StoryEditor initialData={story} />
        </div>
    );
}
