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
                <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-center md:justify-between md:mb-12">
                    {/* Header Top Row: Title & Mobile Back Link */}
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <h1 className="text-3xl md:text-4xl font-cairo font-bold text-accent flex items-center gap-3">
                            قصص الرعب
                            <span className="text-lg font-normal text-secondary-3 opacity-60">({stories.length})</span>
                        </h1>

                        {/* Mobile Back Link */}
                        <Link href="/" className="md:hidden text-sm font-bold text-primary-2 transition-colors hover:text-accent flex items-center gap-1">
                            الرئيسية &larr;
                        </Link>
                    </div>

                    {/* Header Actions: Submit Button & Desktop Back Link */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <Link
                            href="/stories/submit"
                            className="w-full md:w-auto bg-secondary-2 border border-accent text-accent px-8 py-3 rounded-lg hover:bg-accent hover:text-primary-1 transition-all text-center font-bold shadow-lg hover:shadow-accent/20"
                        >
                            ابعت قصتك
                        </Link>

                        {/* Desktop Back Link */}
                        <Link href="/" className="hidden md:block text-primary-2 hover:text-accent transition-colors font-bold mr-4">
                            &larr; العودة للرئيسية
                        </Link>
                    </div>
                </div>

                {stories.length === 0 ? (
                    <p className="text-center text-xl opacity-50">لا توجد قصص منشورة حالياً.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stories.map((story: any) => (
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
