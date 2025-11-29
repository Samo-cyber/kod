import Link from "next/link";
import StoryCard from "@/components/StoryCard/StoryCard.client";
import { db } from "@/lib/db";

// Force dynamic rendering to ensure we get fresh data
export const dynamic = 'force-dynamic';

async function getStories() {
    await db.connect();
    return db.getStories({ status: "published", limit: 50 });
}

export default async function StoriesPage() {
    const { data: stories } = await getStories();

    return (
        <div className="min-h-screen bg-primary-1 text-secondary-3 p-8 pt-24">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                        <h1 className="text-4xl font-cairo font-bold text-accent">قصص الرعب</h1>
                        <Link href="/stories/submit" className="bg-secondary-2 border border-accent text-accent px-4 py-2 rounded hover:bg-accent hover:text-primary-1 transition-colors text-sm font-bold">
                            ابعت قصتك
                        </Link>
                    </div>
                    <Link href="/" className="text-primary-2 hover:text-accent transition-colors font-bold">
                        &larr; العودة للرئيسية
                    </Link>
                </div>

                {stories.length === 0 ? (
                    <p className="text-center text-xl opacity-50">لا توجد قصص منشورة حالياً.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stories.map((story) => (
                            <Link key={story.id} href={`/story/${story.slug}`}>
                                <StoryCard
                                    title={story.title_ar}
                                    excerpt={story.excerpt_ar}
                                    image={story.cover_image}
                                    slug={story.slug}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
