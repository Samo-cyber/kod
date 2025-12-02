import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    try {
        await db.connect();
        const count = await db.getLikesCount(id);
        const hasLiked = await db.hasLiked(id, ip);

        return NextResponse.json({ count, hasLiked });
    } catch (error) {
        console.error("Error fetching likes:", error);
        return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ip = request.headers.get("x-forwarded-for") || "unknown";

    try {
        await db.connect();
        const hasLiked = await db.hasLiked(id, ip);

        if (hasLiked) {
            await db.removeLike(id, ip);
        } else {
            await db.addLike(id, ip);
        }

        const count = await db.getLikesCount(id);
        return NextResponse.json({ count, hasLiked: !hasLiked });
    } catch (error) {
        console.error("Error toggling like:", error);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
