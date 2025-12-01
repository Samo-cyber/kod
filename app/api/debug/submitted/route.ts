import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await db.connect();
        const stories = await db.getSubmittedStories();
        const latest = stories[0];

        return NextResponse.json({
            count: stories.length,
            latest: latest ? {
                id: latest.id,
                title: latest.title,
                content_preview: latest.content.substring(0, 200),
                has_image_markdown: latest.content.includes("![Cover Image]"),
                raw_content_start: latest.content.substring(0, 100)
            } : null
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
