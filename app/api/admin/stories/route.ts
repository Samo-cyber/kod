import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || undefined;

    try {
        await db.connect();
        const result = await db.getStories({ status, page, limit });
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await db.connect();
        // Validate body here
        // Sanitize payload: only send fields that exist in the Story table
        const payload = {
            title_ar: body.title_ar,
            title_en: body.title_en || null,
            slug: body.slug || `story-${Date.now()}`, // Ensure unique slug
            excerpt_ar: body.excerpt_ar,
            body_markdown_ar: body.body_markdown_ar,
            body_html_ar: body.body_html_ar,
            cover_image: body.cover_image,
            status: body.status || "draft",
            reading_time_min: Math.ceil(body.body_markdown_ar.split(" ").length / 200) || 1, // Auto-calc reading time
            // Explicitly exclude author_id for now to avoid relation issues
        };

        const story = await db.createStory(payload);
        return NextResponse.json(story);
    } catch (error: any) {
        console.error("Create Story Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error", details: error },
            { status: 500 }
        );
    }
}
