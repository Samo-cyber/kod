import Link from "next/link";
import StoryCard from "@/components/StoryCard/StoryCard.client";
import { db } from "@/lib/db";

// Force dynamic rendering to ensure we get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStories() {
    await db.connect();
    return db.getStories({ status: "published", limit: 1000 });
}

export default async function StoriesPage() {
    const { data: stories } = await getStories();

    return (
        <div className="min-h-screen bg-primary-1 text-secondary-3 p-4 pt-24 md:p-8">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6 md:gap-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
                        <h1 className="text-3xl md:text-4xl font-cairo font-bold text-accent flex items-center">
                            قصص الرعب
                            <span className="text-base md:text-lg text-secondary-3 opacity-50 mr-4 font-normal">({stories.length})</span>
                        </h1>
                        <Link href="/stories/submit" className="bg-secondary-2 border border-accent text-accent px-4 py-2 rounded hover:bg-accent hover:text-primary-1 transition-colors text-sm font-bold w-full md:w-auto text-center">
                            ابعت قصتك
                        </Link>
                    </div>
                    <Link href="/" className="text-primary-2 hover:text-accent transition-colors font-bold text-sm md:text-base">
                        &larr; العودة للرئيسية
                    </Link>
                </div>

                {stories.length === 0 ? (
                    <p className="text-center text-xl opacity-50">لا توجد قصص منشورة حالياً.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
