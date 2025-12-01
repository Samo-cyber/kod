import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
        return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 });
    }

    try {
        await db.connect();

        // Try fetching by slug directly
        const bySlug = await db.getStoryBySlug(slug);

        // Try fetching by encoded slug just in case
        const encodedSlug = encodeURIComponent(slug);
        const byEncodedSlug = await db.getStoryBySlug(encodedSlug);

        // Get all stories to see if it exists in the list
        const allStories = await db.getStories({ limit: 100 });
        const inList = allStories.data.find(s => s.slug === slug);

        return NextResponse.json({
            requested_slug: slug,
            by_slug_result: bySlug,
            by_encoded_slug_result: byEncodedSlug,
            found_in_list: inList,
            match: bySlug?.id === inList?.id
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
