import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    try {
        await db.connect();
        const result = await db.getStories({ status: "published", page, limit });
        return NextResponse.json(result);
    } catch (error) {
        console.error("Failed to fetch stories:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
