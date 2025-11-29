import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import styles from "@/components/StoryPage/StoryPage.module.scss";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        slug: string;
    };
}

async function getStory(slug: string) {
    await db.connect();
    return db.getStoryBySlug(slug);
}

export default async function StoryPage({ params }: PageProps) {
    const story = await getStory(params.slug);

    if (!story) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-primary-1 text-secondary-3 pb-24">
            {/* Hero / Header */}
            <header className="relative w-full h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <Image
                    src={story.cover_image}
                    alt={story.title_ar}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 container mx-auto pb-16">
                    <Link href="/stories" className="text-secondary-3/80 hover:text-accent mb-6 inline-block w-fit">
                        &larr; العودة للقصص
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-cairo font-black text-secondary-3 mb-4 drop-shadow-lg">
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
                        <span>{new Date(story.created_at).toLocaleDateString('ar-EG')}</span>
                        <span>{story.reading_time_min} دقائق قراءة</span>
                    </div>

                    <div
                        className="prose prose-invert prose-lg max-w-none font-cairo leading-loose"
                        dangerouslySetInnerHTML={{ __html: story.body_html_ar }}
                    />
                </div>
            </div>
        </article>
    );
}
