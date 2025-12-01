import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const result = await db.uploadMedia(file);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
