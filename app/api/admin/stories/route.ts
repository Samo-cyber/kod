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
        const story = await db.createStory({
            ...body,
            slug: body.slug || body.title_ar.toLowerCase().replace(/ /g, "-"), // Simple slug fallback
        });
        return NextResponse.json(story);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
