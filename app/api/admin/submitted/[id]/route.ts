import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Check for Service Role Key (basic auth check)
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await db.connect();
        await db.deleteSubmittedStory(params.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Submitted Story Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
