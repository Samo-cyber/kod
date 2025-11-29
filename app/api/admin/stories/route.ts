import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mock auth check
const isAuthenticated = (req: Request) => {
    // In real app, check session/cookie
    return true;
};

export async function GET(request: Request) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
