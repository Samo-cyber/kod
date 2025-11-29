import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    const envStatus = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
    };

    let dbStatus = "Not Checked";
    let writeStatus = "Not Attempted";
    let writeError = null;
    let storyCount = -1;

    try {
        await db.connect();

        // 1. Read Test
        const { meta } = await db.getStories({ limit: 1 });
        storyCount = meta.total;
        dbStatus = "Connected & Read OK";

        // 2. Write Test
        try {
            const testSlug = `debug-test-${Date.now()}`;
            const testStory = await db.createStory({
                title_ar: "Debug Test Story",
                slug: testSlug,
                excerpt_ar: "This is a test",
                body_markdown_ar: "Test content",
                body_html_ar: "<p>Test content</p>",
                cover_image: "https://example.com/image.jpg",
                status: "draft",
                reading_time_min: 1
            });
            writeStatus = `Success! Created ID: ${testStory.id}`;

            // Cleanup (optional, but good practice)
            await db.deleteStory(testStory.id);
            writeStatus += " (and deleted)";
        } catch (wError: any) {
            writeStatus = "Failed";
            writeError = wError.message || wError;
        }

    } catch (error: any) {
        dbStatus = "Connection Failed";
        writeError = error.message;
    }

    return NextResponse.json({
        environment: envStatus,
        database: {
            read_status: dbStatus,
            write_status: writeStatus,
            write_error: writeError,
            total_stories: storyCount
        },
        timestamp: new Date().toISOString()
    });
}
