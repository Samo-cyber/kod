import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mock auth check
const isAuthenticated = (req: Request) => {
    return true;
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        await db.connect();
        const story = await db.updateStory(params.id, body);
        return NextResponse.json(story);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await db.connect();
        await db.deleteStory(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
