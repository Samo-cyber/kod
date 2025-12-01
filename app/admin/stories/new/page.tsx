import StoryEditor from "@/components/AdminUI/StoryEditor.client";
import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function NewStoryPage({ searchParams }: { searchParams: { from_submitted?: string } }) {
    let initialData = undefined;

    if (searchParams.from_submitted) {
        const submittedStory = await db.getSubmittedStoryById(searchParams.from_submitted);
        if (submittedStory) {
            let content = submittedStory.content;
            let coverImage = "";

            // Extract embedded cover image
            const imageMatch = content.match(/^!\[Cover Image\]\((.*?)\)\n\n/);
            if (imageMatch) {
                coverImage = imageMatch[1];
                content = content.replace(imageMatch[0], "");
            }

            initialData = {
                title_ar: submittedStory.title,
                title_en: "",
                slug: "", // Let admin decide slug
                excerpt_ar: "", // Admin needs to write excerpt
                body_markdown_ar: content,
                cover_image: coverImage, // Admin needs to add image
                status: "draft",
            };
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-accent">
                    {initialData ? "مراجعة ونشر قصة مرسلة" : "إضافة قصة جديدة"}
                </h1>
                <Link href="/admin" className="bg-secondary-2 text-secondary-3 px-6 py-2 rounded hover:bg-secondary-3 hover:text-primary-1 transition-colors">
                    &larr; لوحة التحكم
                </Link>
            </div>
            <StoryEditor isNew initialData={initialData} />
        </div>
    );
}
