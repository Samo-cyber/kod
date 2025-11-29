import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    const envStatus = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
        SUPABASE_URL: process.env.SUPABASE_URL ? "Set" : "Missing",
        SUPABASE_KEY: process.env.SUPABASE_KEY ? "Set" : "Missing",
    };

    let dbStatus = "Not Checked";
    let dbError = null;
    let storyCount = -1;

    try {
        await db.connect();
        dbStatus = "Connected";

        // Try to fetch one story to verify table access
        const { meta } = await db.getStories({ limit: 1 });
        storyCount = meta.total;
        dbStatus = "Connected & Verified (Table exists)";
    } catch (error: any) {
        dbStatus = "Connection Failed";
        dbError = error.message;
    }

    return NextResponse.json({
        environment: envStatus,
        database: {
            status: dbStatus,
            error: dbError,
            storyCount
        },
        timestamp: new Date().toISOString()
    });
}
