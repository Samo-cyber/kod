import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import styles from "@/components/StoryPage/StoryPage.module.scss";
import LikeButton from "@/components/LikeButton";
import CommentsSection from "@/components/CommentsSection";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getStory(slug: string) {
    await db.connect();
    return db.getStoryBySlug(slug);
}

export default async function StoryPage({ params }: PageProps) {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);
    const story = await getStory(slug);

    if (!story) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-primary-1 text-secondary-3 pb-24">
            {/* Hero / Header */}
            <header className="relative w-full h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                {story.cover_image ? (
                    <Image
                        src={story.cover_image}
                        alt={story.title_ar}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-secondary-2 flex items-center justify-center">
                        <span className="text-6xl text-accent opacity-50">No Cover Image</span>
                    </div>
                )}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 container mx-auto pb-16">
                    <Link href="/stories" className="text-secondary-3/80 hover:text-accent mb-6 inline-block w-fit">
                        &rarr; العودة للقصص
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-cairo font-black text-secondary-3 mb-4 drop-shadow-lg leading-normal">
                        {story.title_ar}
                    </h1>
                    {story.title_en && (
                        <h2 className="text-2xl md:text-3xl font-bebas text-accent opacity-80 drop-shadow-md">
                            {story.title_en}
                        </h2>
                    )}
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-30">
                <div className="bg-secondary-1 p-8 md:p-12 rounded-lg shadow-2xl border border-secondary-2">
                    <div className="flex justify-between items-center text-sm text-secondary-3/60 mb-8 font-inter border-b border-secondary-2 pb-4">
                        <div className="flex items-center gap-4">
                            <span>{new Date(story.created_at).toLocaleDateString('ar-EG')}</span>
                            <span className="w-1 h-1 bg-secondary-3/40 rounded-full"></span>
                            <span className="text-accent">{story.author_name || "KOD Admin"}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>{story.reading_time_min} دقائق قراءة</span>
                            <LikeButton storyId={story.id} />
                        </div>
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none font-cairo leading-loose"
                        dangerouslySetInnerHTML={{ __html: story.body_html_ar }}
                    />

                    {/* Comments Section */}
                    <CommentsSection storyId={story.id} />
                </div>
            </div>
        </article>
    );
}
