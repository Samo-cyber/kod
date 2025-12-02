import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

// Simple in-memory rate limit: IP -> timestamp
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    try {
        await db.connect();
        const comments = await db.getComments(id, { page, limit });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    // Rate Limiting
    const lastRequest = rateLimitMap.get(ip);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_WINDOW) {
        return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }
    rateLimitMap.set(ip, Date.now());

    try {
        const body = await request.json();
        const { content, author_name } = body;

        // Validation
        if (!content || typeof content !== "string") {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }
        if (content.length > 500) {
            return NextResponse.json({ error: "Content exceeds 500 characters" }, { status: 400 });
        }
        if (author_name && author_name.length > 50) {
            return NextResponse.json({ error: "Name exceeds 50 characters" }, { status: 400 });
        }

        await db.connect();
        const comment = await db.createComment({
            story_id: id,
            content,
            author_name: author_name || "Anonymous",
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
